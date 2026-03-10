"""Telegram bot for Singularity V6 — commands, alerts, and remote control."""

import os
import logging

import httpx
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes, MessageHandler, filters

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")
CREWAI_URL = os.getenv("CREWAI_API_URL", "http://crewai-api:8001")
COCEO_URL = os.getenv("COCEO_API_URL", "http://co-ceo-agent:8002")
N8N_URL = os.getenv("N8N_API_URL", "http://n8n-editor:5678")


def authorized(func):
    """Decorator to restrict commands to authorized chat only."""
    async def wrapper(update: Update, context: ContextTypes.DEFAULT_TYPE):
        if str(update.effective_chat.id) != CHAT_ID:
            await update.message.reply_text("Unauthorized.")
            return
        return await func(update, context)
    return wrapper


@authorized
async def cmd_start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle /start command."""
    await update.message.reply_text(
        "Singularity V6 Bot\n\n"
        "Commands:\n"
        "/health — Check all services\n"
        "/budget — Budget status\n"
        "/crews — List available crews\n"
        "/kickoff <crew> — Run a crew task\n"
        "/ask <question> — Ask CO-CEO\n"
        "/briefing — Daily CEO briefing\n"
        "/status <task_id> — Check task status\n"
        "/models — Available LLM models\n"
    )


@authorized
async def cmd_health(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Check health of all services."""
    services = {
        "CrewAI": f"{CREWAI_URL}/health",
        "CO-CEO": f"{COCEO_URL}/health",
    }
    lines = ["*Service Health*\n"]
    async with httpx.AsyncClient() as client:
        for name, url in services.items():
            try:
                resp = await client.get(url, timeout=10)
                if resp.status_code == 200:
                    lines.append(f"  {name}: UP")
                else:
                    lines.append(f"  {name}: DEGRADED ({resp.status_code})")
            except Exception as exc:
                lines.append(f"  {name}: DOWN ({exc})")
    await update.message.reply_text("\n".join(lines), parse_mode="Markdown")


@authorized
async def cmd_budget(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Get budget status."""
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{CREWAI_URL}/budget/check", timeout=15)
            data = resp.json()
        msg = (
            f"*Budget Status*\n\n"
            f"Monthly spend: ${data['monthly_spend']:.2f}\n"
            f"Monthly cap: ${data['monthly_cap']:.2f}\n"
            f"Remaining: ${data['monthly_remaining']:.2f}\n"
            f"Alert level: {data['alert_level']}\n"
        )
        await update.message.reply_text(msg, parse_mode="Markdown")
    except Exception as exc:
        await update.message.reply_text(f"Budget check failed: {exc}")


@authorized
async def cmd_crews(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """List available crews."""
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{CREWAI_URL}/crews", timeout=15)
            crews = resp.json()
        lines = ["*Available Crews*\n"]
        for crew in crews:
            agents = ", ".join(crew["agents"])
            lines.append(f"  *{crew['name']}*: {agents}")
        await update.message.reply_text("\n".join(lines), parse_mode="Markdown")
    except Exception as exc:
        await update.message.reply_text(f"Failed to list crews: {exc}")


@authorized
async def cmd_kickoff(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Kickoff a crew task: /kickoff <crew_name>."""
    if not context.args:
        await update.message.reply_text("Usage: /kickoff <crew_name>")
        return
    crew_name = context.args[0]
    inputs_text = " ".join(context.args[1:]) if len(context.args) > 1 else ""
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{CREWAI_URL}/kickoff",
                json={"crew": crew_name, "task": "default", "inputs": {"query": inputs_text}},
                timeout=30,
            )
            data = resp.json()
        await update.message.reply_text(
            f"Task queued\n"
            f"ID: `{data['task_id']}`\n"
            f"Crew: {data['crew']}\n"
            f"Status: {data['status']}",
            parse_mode="Markdown",
        )
    except Exception as exc:
        await update.message.reply_text(f"Kickoff failed: {exc}")


@authorized
async def cmd_ask(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Ask the CO-CEO: /ask <question>."""
    if not context.args:
        await update.message.reply_text("Usage: /ask <your question>")
        return
    question = " ".join(context.args)
    await update.message.reply_text("Thinking...")
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{COCEO_URL}/ask",
                json={"question": question, "task_type": "general"},
                timeout=60,
            )
            data = resp.json()
        answer = data.get("text", "No response")[:3500]
        model = data.get("model", "unknown")
        cost = data.get("cost", 0)
        await update.message.reply_text(
            f"*CO-CEO Response* (via {model}, ${cost:.4f}):\n\n{answer}",
            parse_mode="Markdown",
        )
    except Exception as exc:
        await update.message.reply_text(f"CO-CEO request failed: {exc}")


@authorized
async def cmd_briefing(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Request a CEO briefing."""
    await update.message.reply_text("Generating CEO briefing...")
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{COCEO_URL}/ask",
                json={
                    "question": (
                        "Generate a concise daily CEO briefing: "
                        "1. System status, 2. Budget overview, "
                        "3. Key metrics, 4. Today's priorities. "
                        "Be brief and actionable."
                    ),
                    "task_type": "strategy",
                },
                timeout=90,
            )
            data = resp.json()
        briefing = data.get("text", "Briefing generation failed")[:3500]
        await update.message.reply_text(f"*CEO Briefing*\n\n{briefing}", parse_mode="Markdown")
    except Exception as exc:
        await update.message.reply_text(f"Briefing failed: {exc}")


@authorized
async def cmd_status(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Check task status: /status <task_id>."""
    if not context.args:
        await update.message.reply_text("Usage: /status <task_id>")
        return
    task_id = context.args[0]
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{CREWAI_URL}/status/{task_id}", timeout=15)
            data = resp.json()
        await update.message.reply_text(
            f"Task: `{data['task_id']}`\n"
            f"Crew: {data['crew']}\n"
            f"Status: {data['status']}\n"
            f"Cost: ${data.get('cost_usd', 0):.4f}\n"
            f"Model: {data.get('model_used', 'N/A')}",
            parse_mode="Markdown",
        )
    except Exception as exc:
        await update.message.reply_text(f"Status check failed: {exc}")


@authorized
async def cmd_models(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """List available LLM models."""
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{COCEO_URL}/models", timeout=15)
            models = resp.json()
        lines = ["*Available Models*\n"]
        for m in models:
            status = "available" if m["available"] else "no key"
            lines.append(f"  {m['name']} ({m['provider']}): {status}")
        await update.message.reply_text("\n".join(lines), parse_mode="Markdown")
    except Exception as exc:
        await update.message.reply_text(f"Failed to list models: {exc}")


def main() -> None:
    """Run the Telegram bot."""
    if not BOT_TOKEN:
        logger.error("TELEGRAM_BOT_TOKEN not set. Exiting.")
        return

    app = Application.builder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", cmd_start))
    app.add_handler(CommandHandler("help", cmd_start))
    app.add_handler(CommandHandler("health", cmd_health))
    app.add_handler(CommandHandler("budget", cmd_budget))
    app.add_handler(CommandHandler("crews", cmd_crews))
    app.add_handler(CommandHandler("kickoff", cmd_kickoff))
    app.add_handler(CommandHandler("ask", cmd_ask))
    app.add_handler(CommandHandler("briefing", cmd_briefing))
    app.add_handler(CommandHandler("status", cmd_status))
    app.add_handler(CommandHandler("models", cmd_models))

    logger.info("Telegram bot starting...")
    app.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
