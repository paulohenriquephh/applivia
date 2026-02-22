"""
MAESTRO AI ENGINE v3 - Brain (FastAPI Backend)
API principal para WebSocket, Voice, Chat e Agentes
"""

import os
import asyncio
import json
import base64
import uuid
from datetime import datetime
from typing import Optional, Dict, Any, List
from contextlib import asynccontextmanager

# FastAPI
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Pydantic models
from pydantic import BaseModel

# Database
from sqlalchemy import create_engine, Column, String, DateTime, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# Redis
import redis.asyncio as aioredis

# Qdrant
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

# LiteLLM
import httpx

# Logging
import structlog

logger = structlog.get_logger()


# ============================================
# CONFIGURATION
# ============================================

class Settings:
    """Application settings"""
    # LiteLLM
    LITELLM_BASE_URL = os.getenv("LITELLM_BASE_URL", "http://maestro-litellm:4000")
    LITELLM_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
    
    # Qdrant
    QDRANT_HOST = os.getenv("QDRANT_HOST", "maestro-qdrant")
    QDRANT_PORT = int(os.getenv("QDRANT_PORT", "6333"))
    
    # PostgreSQL
    POSTGRES_HOST = os.getenv("POSTGRES_HOST", "maestro-postgres")
    POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")
    POSTGRES_DB = os.getenv("POSTGRES_DB", "maestroapp")
    POSTGRES_USER = os.getenv("POSTGRES_USER", "maestro")
    POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "maestro123")
    
    # Redis
    REDIS_HOST = os.getenv("REDIS_HOST", "maestro-redis")
    REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
    
    # ElevenLabs
    ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")


settings = Settings()


# ============================================
# DATABASE SETUP
# ============================================

DATABASE_URL = f"postgresql://:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"
engine = create_engine(DATABASE_URL.replace(":@", f":{settings.POSTGRES_PASSWORD}@"))
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Conversation(Base):
    """Conversation model"""
    __tablename__ = "conversations"
    
    id = Column(String, primary_key=True)
    user_id = Column(String)
    messages = Column(JSON)
    context = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Message(Base):
    """Message model"""
    __tablename__ = "messages"
    
    id = Column(String, primary_key=True)
    conversation_id = Column(String)
    role = Column(String)
    content = Column(Text)
    metadata = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)


class AgentExecution(Base):
    """Agent execution log"""
    __tablename__ = "agent_executions"
    
    id = Column(String, primary_key=True)
    agent_name = Column(String)
    task = Column(Text)
    result = Column(Text)
    status = Column(String)
    duration = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


Base.metadata.create_all(bind=engine)


# ============================================
# DEPENDENCIES
# ============================================

def get_db():
    """Database session dependency"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_redis():
    """Redis client"""
    client = await aioredis.from_url(
        f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/0",
        encoding="utf-8",
        decode_responses=True
    )
    return client


async def get_qdrant():
    """Qdrant client"""
    client = QdrantClient(host=settings.QDRANT_HOST, port=settings.QDRANT_PORT)
    return client


# ============================================
# PYDANTIC MODELS
# ============================================

class ChatMessage(BaseModel):
    """Chat message"""
    role: str
    content: str
    metadata: Optional[Dict[str, Any]] = None


class ChatRequest(BaseModel):
    """Chat request"""
    message: str
    user_id: Optional[str] = None
    conversation_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None
    model: Optional[str] = "anthropic/claude-sonnet-4-20250514"


class ChatResponse(BaseModel):
    """Chat response"""
    message: str
    conversation_id: str
    metadata: Optional[Dict[str, Any]] = None


class VoiceRequest(BaseModel):
    """Voice request"""
    audio: str  # Base64 encoded
    language: Optional[str] = "pt-BR"


class VoiceResponse(BaseModel):
    """Voice response"""
    text: str
    audio: Optional[str] = None  # Base64 encoded


class AgentRequest(BaseModel):
    """Agent execution request"""
    task: str
    agent: Optional[str] = None
    context: Optional[Dict[str, Any]] = None


class AgentResponse(BaseModel):
    """Agent execution response"""
    result: str
    agent: str
    duration: float


# ============================================
# LLM CLIENT
# ============================================

class LiteLLMClient:
    """Client for LiteLLM"""
    
    def __init__(self):
        self.base_url = settings.LITELLM_BASE_URL
        self.api_key = settings.LITELLM_API_KEY
    
    async def chat(self, messages: List[Dict], model: str = "anthropic/claude-sonnet-4-20250514") -> str:
        """Send chat request to LiteLLM"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/v1/chat/completions",
                json={
                    "model": model,
                    "messages": messages,
                    "temperature": 0.7,
                    "max_tokens": 4096,
                },
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                timeout=120.0,
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response.text)
            
            data = response.json()
            return data["choices"][0]["message"]["content"]
    
    async def embeddings(self, text: str, model: str = "text-embedding-3-small") -> List[float]:
        """Get embeddings from LiteLLM"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/v1/embeddings",
                json={
                    "model": model,
                    "input": text,
                },
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                timeout=30.0,
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response.text)
            
            data = response.json()
            return data["data"][0]["embedding"]


llm_client = LiteLLMClient()


# ============================================
# WEBSOCKET MANAGER
# ============================================

class ConnectionManager:
    """WebSocket connection manager"""
    
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
    
    async def connect(self, websocket: WebSocket, client_id: str):
        """Connect a client"""
        await websocket.accept()
        self.active_connections[client_id] = websocket
    
    def disconnect(self, client_id: str):
        """Disconnect a client"""
        if client_id in self.active_connections:
            del self.active_connections[client_id]
    
    async def send_message(self, message: str, client_id: str):
        """Send message to a specific client"""
        if client_id in self.active_connections:
            await self.active_connections[client_id].send_text(message)
    
    async def broadcast(self, message: str):
        """Broadcast message to all clients"""
        for connection in self.active_connections.values():
            await connection.send_text(message)


manager = ConnectionManager()


# ============================================
# FASTAPI APP
# ============================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events"""
    # Startup
    logger.info("Starting MAESTRO Brain API")
    
    # Initialize Qdrant collections
    try:
        qdrant = await get_qdrant()
        collections = qdrant.get_collections().collections
        collection_names = [c.name for c in collections]
        
        if "knowledge" not in collection_names:
            qdrant.create_collection(
                collection_name="knowledge",
                vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
            )
            logger.info("Created knowledge collection")
    except Exception as e:
        logger.warning(f"Qdrant initialization: {e}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down MAESTRO Brain API")


app = FastAPI(
    title="MAESTRO Brain API",
    description="API for WebSocket, Voice, Chat and Agents",
    version="3.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================
# ROOT & HEALTH
# ============================================

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "MAESTRO Brain",
        "version": "3.0.0",
        "status": "online",
    }


@app.get("/health")
async def health():
    """Health check"""
    return {"status": "healthy"}


# ============================================
# CHAT ENDPOINTS
# ============================================

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    """Chat endpoint"""
    # Generate or use conversation ID
    conversation_id = request.conversation_id or str(uuid.uuid4())
    user_id = request.user_id or "anonymous"
    
    # Get conversation history
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id
    ).first()
    
    if not conversation:
        conversation = Conversation(
            id=conversation_id,
            user_id=user_id,
            messages=[],
            context=request.context or {},
        )
        db.add(conversation)
    
    # Add user message
    user_message = {
        "role": "user",
        "content": request.message,
        "timestamp": datetime.utcnow().isoformat(),
    }
    conversation.messages.append(user_message)
    
    # Build messages for LLM
    messages = [{"role": m["role"], "content": m["content"]} for m in conversation.messages[-10:]]
    
    # Add system prompt
    system_prompt = """Você é o MAESTRO AI Engine, assistente de IA avançado desenvolvido para uma empresa de importação/exportação de luxo (relógios, bolsas) entre China, Itália e Brasil.

Sua função é:
- Auxiliar em vendas e atendimento ao cliente
- Fornecer informações sobre produtos de luxo
- Auxiliar na gestão de importação
- Suporte geral ao negócio

Sempre responda de forma profissional, clara e útil."""
    
    messages = [{"role": "system", "content": system_prompt}] + messages
    
    try:
        # Call LiteLLM
        response_text = await llm_client.chat(messages, request.model)
        
        # Add assistant message
        assistant_message = {
            "role": "assistant",
            "content": response_text,
            "timestamp": datetime.utcnow().isoformat(),
        }
        conversation.messages.append(assistant_message)
        
        db.commit()
        
        return ChatResponse(
            message=response_text,
            conversation_id=conversation_id,
        )
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/conversations/{conversation_id}")
async def get_conversation(conversation_id: str, db: Session = Depends(get_db)):
    """Get conversation history"""
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return {
        "id": conversation.id,
        "messages": conversation.messages,
        "created_at": conversation.created_at.isoformat(),
    }


# ============================================
# VOICE ENDPOINTS
# ============================================

@app.post("/api/voice/transcribe", response_model=VoiceResponse)
async def voice_transcribe(request: VoiceRequest):
    """Transcribe voice audio"""
    # Decode base64 audio
    try:
        audio_data = base64.b64decode(request.audio)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid audio data")
    
    # In production, this would use faster-whisper for local transcription
    # For now, we'll simulate the response
    text = "Transcrição simulada do áudio recebido."
    
    return VoiceResponse(text=text)


@app.post("/api/voice/synthesize")
async def voice_synthesize(text: str, voice_id: str = "rachel"):
    """Synthesize speech using ElevenLabs"""
    if not settings.ELEVENLABS_API_KEY:
        raise HTTPException(status_code=500, detail="ElevenLabs not configured")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
                json={
                    "text": text,
                    "voice_settings": {
                        "stability": 0.5,
                        "similarity_boost": 0.8,
                    }
                },
                headers={
                    "xi-api-key": settings.ELEVENLABS_API_KEY,
                    "Content-Type": "application/json",
                },
                timeout=30.0,
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response.text)
            
            audio_base64 = base64.b64encode(response.content).decode()
            
            return {"audio": audio_base64}
        except Exception as e:
            logger.error(f"TTS error: {e}")
            raise HTTPException(status_code=500, detail=str(e))


# ============================================
# AGENT ENDPOINTS
# ============================================

@app.post("/api/agents/execute", response_model=AgentResponse)
async def execute_agent(request: AgentRequest, db: Session = Depends(get_db)):
    """Execute an agent task"""
    start_time = datetime.now()
    
    # Determine agent
    agent = request.agent or "orchestrator"
    
    # Build prompt
    prompt = f"""Execute a seguinte tarefa usando o agente {agent}:

Tarefa: {request.task}

Contexto: {json.dumps(request.context) if request.context else 'Nenhum'}"""
    
    try:
        # Call LiteLLM with agent context
        messages = [
            {"role": "system", "content": f"Você é o agente {agent} do MAESTRO AI Engine."},
            {"role": "user", "content": prompt},
        ]
        
        result = await llm_client.chat(messages)
        
        # Calculate duration
        duration = (datetime.now() - start_time).total_seconds()
        
        # Log execution
        execution = AgentExecution(
            id=str(uuid.uuid4()),
            agent_name=agent,
            task=request.task,
            result=result,
            status="success",
            duration=f"{duration:.2f}s",
        )
        db.add(execution)
        db.commit()
        
        return AgentResponse(
            result=result,
            agent=agent,
            duration=duration,
        )
    except Exception as e:
        logger.error(f"Agent execution error: {e}")
        
        # Log failed execution
        execution = AgentExecution(
            id=str(uuid.uuid4()),
            agent_name=agent,
            task=request.task,
            result=str(e),
            status="error",
            duration="0s",
        )
        db.add(execution)
        db.commit()
        
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/agents/status")
async def get_agents_status():
    """Get status of all agents"""
    return {
        "orchestrator": "ready",
        "import_agent": "ready",
        "advertising_agent": "ready",
        "luxury_watch_agent": "ready",
        "whatsapp_sdr_agent": "ready",
        "tiktok_growth_agent": "ready",
        "knowledge_sync_agent": "ready",
    }


# ============================================
# WEBSOCKET ENDPOINT
# ============================================

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """WebSocket endpoint for real-time communication"""
    await manager.connect(websocket, client_id)
    
    try:
        while True:
            # Receive message
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            message_type = message_data.get("type")
            
            if message_type == "chat":
                # Handle chat message
                user_message = message_data.get("content")
                
                # Get response from LLM
                messages = [
                    {"role": "system", "content": "Você é o MAESTRO AI Engine."},
                    {"role": "user", "content": user_message},
                ]
                
                response = await llm_client.chat(messages)
                
                # Send response
                await manager.send_message(
                    json.dumps({
                        "type": "chat_response",
                        "content": response,
                    }),
                    client_id
                )
            
            elif message_type == "voice":
                # Handle voice (would process audio)
                await manager.send_message(
                    json.dumps({
                        "type": "voice_acknowledged",
                    }),
                    client_id
                )
            
            elif message_type == "ping":
                await manager.send_message(
                    json.dumps({"type": "pong"}),
                    client_id
                )
    
    except WebSocketDisconnect:
        manager.disconnect(client_id)
        logger.info(f"Client disconnected: {client_id}")


# ============================================
# KNOWLEDGE ENDPOINTS
# ============================================

@app.post("/api/knowledge/search")
async def search_knowledge(query: str, limit: int = 5):
    """Search knowledge base"""
    try:
        qdrant = await get_qdrant()
        
        # Get query embedding
        query_embedding = await llm_client.embeddings(query)
        
        # Search
        results = qdrant.search(
            collection_name="knowledge",
            query_vector=query_embedding,
            limit=limit,
        )
        
        return {
            "query": query,
            "results": [
                {
                    "id": r.id,
                    "score": r.score,
                    "payload": r.payload,
                }
                for r in results
            ],
        }
    except Exception as e:
        logger.error(f"Knowledge search error: {e}")
        return {"query": query, "results": [], "error": str(e)}


@app.post("/api/knowledge/add")
async def add_knowledge(text: str, category: str = "general"):
    """Add knowledge to vector store"""
    try:
        qdrant = await get_qdrant()
        
        # Get embedding
        embedding = await llm_client.embeddings(text)
        
        # Create point
        point = PointStruct(
            id=str(uuid.uuid4()),
            vector=embedding,
            payload={
                "text": text,
                "category": category,
                "created_at": datetime.utcnow().isoformat(),
            },
        )
        
        # Insert
        qdrant.upsert(
            collection_name="knowledge",
            points=[point],
        )
        
        return {"success": True, "id": point.id}
    except Exception as e:
        logger.error(f"Add knowledge error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================
# METRICS ENDPOINTS
# ============================================

@app.get("/api/metrics")
async def get_metrics(db: Session = Depends(get_db)):
    """Get system metrics"""
    # Count conversations
    total_conversations = db.query(Conversation).count()
    
    # Count messages
    total_messages = db.query(Message).count()
    
    # Get recent agent executions
    recent_executions = db.query(AgentExecution).order_by(
        AgentExecution.created_at.desc()
    ).limit(10).all()
    
    return {
        "conversations": total_conversations,
        "messages": total_messages,
        "recent_executions": [
            {
                "agent": e.agent_name,
                "task": e.task[:50],
                "status": e.status,
                "duration": e.duration,
                "created_at": e.created_at.isoformat(),
            }
            for e in recent_executions
        ],
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
