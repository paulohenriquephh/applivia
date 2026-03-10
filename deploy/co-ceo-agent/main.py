"""CO-CEO Super-Agent — FastAPI service with 10 premium models and full capabilities."""

import time
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Any, Optional

from config import settings
from llm_router import COCEORouter
from capabilities.strategy_engine import StrategyEngine
from capabilities.financial_analyzer import FinancialAnalyzer
from capabilities.crew_creator import CrewCreator
from capabilities.workflow_creator import WorkflowCreator
from capabilities.image_generator import ImageGenerator
from capabilities.code_generator import CodeGenerator
from capabilities.copy_writer import CopyWriter
from capabilities.decision_engine import DecisionEngine
from memory.long_term import LongTermMemory

logger = structlog.get_logger()

START_TIME = time.time()
router: COCEORouter
memory: LongTermMemory


@asynccontextmanager
async def lifespan(app: FastAPI):
    global router, memory
    router = COCEORouter()
    memory = LongTermMemory(settings.qdrant_host, settings.qdrant_port, settings.qdrant_collection)
    logger.info("coceo_agent_started", port=settings.coceo_api_port)
    yield
    logger.info("coceo_agent_shutdown")


app = FastAPI(title="CO-CEO Super-Agent — Singularity V6", version="6.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


class AskRequest(BaseModel):
    question: str
    task_type: str = "general"
    model_override: Optional[str] = None
    context: str = ""


class DecideRequest(BaseModel):
    situation: str
    options: list[str] = Field(default_factory=list)
    constraints: str = ""
    urgency: str = "medium"


class CreateCrewRequest(BaseModel):
    crew_name: str
    description: str
    agents: list[dict[str, str]]


class CreateWorkflowRequest(BaseModel):
    name: str
    description: str
    trigger_type: str = "webhook"
    nodes: list[dict[str, Any]] = Field(default_factory=list)


class ImageRequest(BaseModel):
    prompt: str
    size: str = "1024x1024"
    quality: str = "standard"


class AnalyzeRequest(BaseModel):
    topic: str
    depth: str = "thorough"
    data: str = ""


class CodeRequest(BaseModel):
    description: str
    language: str = "python"
    framework: str = ""


class CopyRequest(BaseModel):
    brief: str
    copy_type: str = "email"
    tone: str = "professional"
    audience: str = "business owners"


@app.post("/ask")
async def ask(req: AskRequest):
    prompt = req.question
    if req.context:
        prompt = f"Context: {req.context}\n\nQuestion: {req.question}"
    result = await router.call(prompt, task_type=req.task_type,
                                model_override=req.model_override)
    await memory.store(req.question, result["text"], {"task_type": req.task_type})
    return result


@app.post("/decide")
async def decide(req: DecideRequest):
    engine = DecisionEngine(router)
    result = await engine.make_decision(req.situation, req.options, req.constraints, req.urgency)
    await memory.store(f"Decision: {req.situation}", str(result), {"type": "decision"})
    return result


@app.post("/create-crew")
async def create_crew(req: CreateCrewRequest):
    creator = CrewCreator(router)
    result = await creator.create(req.crew_name, req.description, req.agents)
    return result


@app.post("/create-workflow")
async def create_workflow(req: CreateWorkflowRequest):
    creator = WorkflowCreator(settings.n8n_api_url, settings.n8n_api_key, router)
    result = await creator.create(req.name, req.description, req.trigger_type, req.nodes)
    return result


@app.post("/generate-image")
async def generate_image(req: ImageRequest):
    generator = ImageGenerator(settings.openai_api_key)
    result = await generator.generate(req.prompt, req.size, req.quality)
    return result


@app.post("/analyze")
async def analyze(req: AnalyzeRequest):
    engine = StrategyEngine(router)
    result = await engine.analyze(req.topic, req.depth, req.data)
    await memory.store(f"Analysis: {req.topic}", str(result), {"type": "analysis"})
    return result


@app.post("/generate-code")
async def generate_code(req: CodeRequest):
    generator = CodeGenerator(router)
    result = await generator.generate(req.description, req.language, req.framework)
    return result


@app.post("/write-copy")
async def write_copy(req: CopyRequest):
    writer = CopyWriter(router)
    result = await writer.write(req.brief, req.copy_type, req.tone, req.audience)
    return result


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "uptime_seconds": round(time.time() - START_TIME, 2),
        "models_available": len([m for m in router.list_models() if m["available"]]),
        "total_models": len(router.list_models()),
    }


@app.get("/models")
async def list_models():
    return router.list_models()


@app.get("/budget")
async def get_budget():
    return {"message": "Budget tracked at CrewAI API level", "endpoint": "http://crewai-api:8001/budget/check"}
