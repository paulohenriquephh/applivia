"""APScheduler-based recurring crew task scheduler."""

import os
import signal
import sys
import time

import httpx
import redis
import structlog
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger

logger = structlog.get_logger()

CREWAI_API_URL = os.getenv("CREWAI_API_URL", "http://crewai-api:8001")
REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/1")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")


def send_telegram(message: str) -> None:
    """Send alert to Telegram."""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        return
    try:
        httpx.post(
            f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage",
            json={"chat_id": TELEGRAM_CHAT_ID, "text": message},
            timeout=10,
        )
    except Exception as exc:
        logger.error("telegram_send_failed", error=str(exc))


def kickoff_crew(crew: str, task: str = "default", inputs: dict = None) -> None:
    """Call the CrewAI API to start a crew task."""
    payload = {
        "crew": crew,
        "task": task,
        "inputs": inputs or {},
        "priority": 5,
    }
    try:
        resp = httpx.post(f"{CREWAI_API_URL}/kickoff", json=payload, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        logger.info("crew_kicked_off", crew=crew, task_id=data.get("task_id"))
    except Exception as exc:
        logger.error("crew_kickoff_failed", crew=crew, error=str(exc))
        send_telegram(f"[SCHEDULER ERROR] Failed to kickoff {crew}: {exc}")


def morning_scan() -> None:
    """Morning market scan — runs at 7:00 AM UTC daily."""
    logger.info("running_morning_scan")
    kickoff_crew("market_research", "daily_scan", {"industry": "technology", "focus": "daily news and opportunities"})


def lead_generation() -> None:
    """Lead generation — runs at 9:00 AM UTC on weekdays."""
    logger.info("running_lead_generation")
    kickoff_crew("outreach", "find_prospects", {"industry": "SaaS", "num_prospects": 10, "region": "US"})


def content_creation() -> None:
    """Content creation — runs at 10:00 AM UTC on Mon/Wed/Fri."""
    logger.info("running_content_creation")
    kickoff_crew("content", "create_post", {"topic": "AI automation insights", "content_type": "blog_post"})


def social_posting() -> None:
    """Social media posting — runs at 11:00 AM and 4:00 PM UTC daily."""
    logger.info("running_social_posting")
    kickoff_crew("social_media", "schedule_posts", {"platforms": ["twitter", "linkedin"]})


def competitor_watch() -> None:
    """Competitor monitoring — runs at 2:00 PM UTC daily."""
    logger.info("running_competitor_watch")
    kickoff_crew("market_research", "competitor_analysis", {"focus": "competitor moves"})


def revenue_check() -> None:
    """Revenue monitoring — runs every 6 hours."""
    logger.info("running_revenue_check")
    kickoff_crew("finance", "revenue_snapshot", {"period": "today"})


def client_health() -> None:
    """Client health check — runs at 3:00 PM UTC on weekdays."""
    logger.info("running_client_health")
    kickoff_crew("support", "health_check", {"check_type": "proactive"})


def budget_audit() -> None:
    """Budget audit — runs at 6:00 PM UTC daily."""
    logger.info("running_budget_audit")
    try:
        resp = httpx.get(f"{CREWAI_API_URL}/budget/check", timeout=15)
        resp.raise_for_status()
        data = resp.json()
        if data.get("alert_level") in ("warning", "critical"):
            send_telegram(
                f"[BUDGET {data['alert_level'].upper()}] "
                f"Monthly: ${data['monthly_spend']:.2f} / ${data['monthly_cap']:.2f}"
            )
    except Exception as exc:
        logger.error("budget_audit_failed", error=str(exc))


def ceo_briefing() -> None:
    """CEO daily briefing — runs at 8:00 AM UTC daily."""
    logger.info("running_ceo_briefing")
    try:
        resp = httpx.post(
            f"{CREWAI_API_URL.replace(':8001', ':8002')}/ask",
            json={
                "question": (
                    "Generate a daily CEO briefing covering: "
                    "1. Yesterday's key metrics and achievements, "
                    "2. Today's priorities and scheduled tasks, "
                    "3. Budget status, "
                    "4. Any alerts or issues requiring attention. "
                    "Be concise and actionable."
                ),
                "task_type": "strategy",
            },
            timeout=60,
        )
        resp.raise_for_status()
        briefing = resp.json().get("text", "Briefing generation failed")
        send_telegram(f"[CEO DAILY BRIEFING]\n\n{briefing[:3500]}")
    except Exception as exc:
        logger.error("ceo_briefing_failed", error=str(exc))
        send_telegram(f"[SCHEDULER ERROR] CEO briefing failed: {exc}")


def health_check() -> None:
    """System health check — runs every 30 minutes."""
    services = {
        "crewai": f"{CREWAI_API_URL}/health",
        "coceo": f"{CREWAI_API_URL.replace(':8001', ':8002')}/health",
    }
    for name, url in services.items():
        try:
            resp = httpx.get(url, timeout=10)
            if resp.status_code != 200:
                send_telegram(f"[HEALTH WARNING] {name} returned status {resp.status_code}")
        except Exception as exc:
            send_telegram(f"[HEALTH CRITICAL] {name} unreachable: {exc}")
            logger.error("health_check_failed", service=name, error=str(exc))


def main() -> None:
    """Initialize and run the scheduler."""
    logger.info("scheduler_starting")

    scheduler = BlockingScheduler()

    # Daily jobs
    scheduler.add_job(morning_scan, CronTrigger(hour=7, minute=0), id="morning_scan", replace_existing=True)
    scheduler.add_job(ceo_briefing, CronTrigger(hour=8, minute=0), id="ceo_briefing", replace_existing=True)
    scheduler.add_job(lead_generation, CronTrigger(hour=9, minute=0, day_of_week="mon-fri"), id="lead_gen", replace_existing=True)
    scheduler.add_job(content_creation, CronTrigger(hour=10, minute=0, day_of_week="mon,wed,fri"), id="content", replace_existing=True)
    scheduler.add_job(social_posting, CronTrigger(hour=11, minute=0), id="social_am", replace_existing=True)
    scheduler.add_job(social_posting, CronTrigger(hour=16, minute=0), id="social_pm", replace_existing=True)
    scheduler.add_job(competitor_watch, CronTrigger(hour=14, minute=0), id="competitor", replace_existing=True)
    scheduler.add_job(client_health, CronTrigger(hour=15, minute=0, day_of_week="mon-fri"), id="client_health", replace_existing=True)
    scheduler.add_job(budget_audit, CronTrigger(hour=18, minute=0), id="budget_audit", replace_existing=True)

    # Recurring jobs
    scheduler.add_job(revenue_check, IntervalTrigger(hours=6), id="revenue_check", replace_existing=True)
    scheduler.add_job(health_check, IntervalTrigger(minutes=30), id="health_check", replace_existing=True)

    def shutdown(signum, frame):
        logger.info("scheduler_shutting_down")
        scheduler.shutdown(wait=False)
        sys.exit(0)

    signal.signal(signal.SIGTERM, shutdown)
    signal.signal(signal.SIGINT, shutdown)

    logger.info("scheduler_started", jobs=len(scheduler.get_jobs()))
    send_telegram("[SCHEDULER] CrewAI Scheduler started successfully.")
    scheduler.start()


if __name__ == "__main__":
    main()
