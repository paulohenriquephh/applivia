"""
MAESTRO AI ENGINE v3 - CrewAI Main
Ponto de entrada para o sistema de multi-agent
"""

import os
import asyncio
from datetime import datetime
from typing import Optional, Dict, Any

# CrewAI imports
from crewai import Crew, Process
from langchain_openai import ChatOpenAI

# Import agents
from agents.orchestrator import create_orchestrator_agent
from agents.import_agent import create_import_agent
from agents.advertising_agent import create_advertising_agent
from agents.luxury_watch_agent import create_luxury_watch_agent
from agents.whatsapp_sdr_agent import create_whatsapp_sdr_agent
from agents.tiktok_growth_agent import create_tiktok_growth_agent
from agents.knowledge_sync_agent import create_knowledge_sync_agent


class MaestroCrewAI:
    """
    Sistema principal de CrewAI para o MAESTRO AI ENGINE v3.
    Coordena 7 agentes especializados para automação completa.
    """
    
    def __init__(self):
        # Get LiteLLM configuration
        self.litellm_base_url = os.getenv("LITELLM_BASE_URL", "http://maestro-litellm:4000")
        self.litellm_api_key = os.getenv("ANTHROPIC_API_KEY", "")
        
        # Initialize agents
        self.orchestrator = create_orchestrator_agent()
        self.import_agent = create_import_agent()
        self.advertising_agent = create_advertising_agent()
        self.luxury_watch_agent = create_luxury_watch_agent()
        self.whatsapp_sdr_agent = create_whatsapp_sdr_agent()
        self.tiktok_growth_agent = create_tiktok_growth_agent()
        self.knowledge_sync_agent = create_knowledge_sync_agent()
        
        # Create crew
        self.crew = Crew(
            agents=[
                self.orchestrator,
                self.import_agent,
                self.advertising_agent,
                self.luxury_watch_agent,
                self.whatsapp_sdr_agent,
                self.tiktok_growth_agent,
                self.knowledge_sync_agent,
            ],
            process=Process.hierarchical,
            manager_agent=self.orchestrator,
            verbose=True,
            memory=True,
            embedder={
                "provider": "openai",
                "model": "text-embedding-3-small",
                "api_key": self.litellm_api_key or "dummy",
            },
        )
    
    async def execute_task(
        self,
        task: str,
        context: Optional[Dict[str, Any]] = None,
        agent: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Executa uma tarefa usando os agentes.
        
        Args:
            task: Descrição da tarefa
            context: Contexto adicional
            agent: Agente específico (opcional)
        
        Returns:
            Resultado da execução
        """
        start_time = datetime.now()
        
        try:
            # Route to specific agent or let orchestrator decide
            if agent:
                result = await self._route_to_agent(agent, task, context)
            else:
                result = await self._orchestrate(task, context)
            
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()
            
            return {
                "success": True,
                "result": result,
                "duration": duration,
                "timestamp": start_time.isoformat(),
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "timestamp": start_time.isoformat(),
            }
    
    async def _orchestrate(self, task: str, context: Optional[Dict[str, Any]]) -> str:
        """Deixa o orchestrator decidir qual agente usar"""
        # This would use the crew to execute
        return f"Tarefa recebida: {task}. Orchestrator determinará o melhor agente."
    
    async def _route_to_agent(self, agent: str, task: str, context: Optional[Dict[str, Any]]) -> str:
        """Roteia para um agente específico"""
        agent_map = {
            "import": self.import_agent,
            "advertising": self.advertising_agent,
            "luxury_watch": self.luxury_watch_agent,
            "whatsapp_sdr": self.whatsapp_sdr_agent,
            "tiktok_growth": self.tiktok_growth_agent,
            "knowledge_sync": self.knowledge_sync_agent,
        }
        
        selected_agent = agent_map.get(agent.lower())
        if not selected_agent:
            return f"Agente não encontrado: {agent}"
        
        return f"Tarefa roteada para {agent}: {task}"
    
    def get_agent_status(self) -> Dict[str, str]:
        """Retorna status de todos os agentes"""
        return {
            "orchestrator": "ready",
            "import_agent": "ready",
            "advertising_agent": "ready",
            "luxury_watch_agent": "ready",
            "whatsapp_sdr_agent": "ready",
            "tiktok_growth_agent": "ready",
            "knowledge_sync_agent": "ready",
        }


# FastAPI endpoints
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="MAESTRO CrewAI API", version="3.0.0")

# Global instance
maestro_crew = None


class TaskRequest(BaseModel):
    task: str
    context: Optional[Dict[str, Any]] = None
    agent: Optional[str] = None


class TaskResponse(BaseModel):
    success: bool
    result: Optional[str] = None
    error: Optional[str] = None
    duration: Optional[float] = None
    timestamp: Optional[str] = None


@app.on_event("startup")
async def startup_event():
    """Initialize CrewAI on startup"""
    global maestro_crew
    maestro_crew = MaestroCrewAI()


@app.get("/")
async def root():
    """Health check"""
    return {
        "status": "online",
        "service": "MAESTRO CrewAI",
        "version": "3.0.0",
        "agents": list(maestro_crew.get_agent_status().keys()) if maestro_crew else [],
    }


@app.get("/agents/status")
async def agents_status():
    """Get status of all agents"""
    if not maestro_crew:
        raise HTTPException(status_code=503, detail="CrewAI not initialized")
    return maestro_crew.get_agent_status()


@app.post("/execute", response_model=TaskResponse)
async def execute_task(request: TaskRequest):
    """Execute a task using CrewAI"""
    if not maestro_crew:
        raise HTTPException(status_code=503, detail="CrewAI not initialized")
    
    try:
        result = await maestro_crew.execute_task(
            task=request.task,
            context=request.context,
            agent=request.agent
        )
        return TaskResponse(**result)
    except Exception as e:
        return TaskResponse(
            success=False,
            error=str(e)
        )


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy", "service": "crewai"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
