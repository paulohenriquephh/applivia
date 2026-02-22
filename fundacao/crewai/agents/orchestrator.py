"""
Orchestrator/COO Agent
Coordena todos os outros agentes e gerencia o fluxo de trabalho
"""

from crewai import Agent
from langchain_openai import ChatOpenAI
from .tools import (
    create_task_tool,
    get_agent_status_tool,
    list_active_agents_tool,
    route_request_tool,
)
import os


def create_orchestrator_agent() -> Agent:
    """
    Cria o agente Orchestrator/COO que coordena todos os outros agentes.
    Responsável por:
    - Analisar solicitações e rotear para agentes específicos
    - Coordenar workflows entre agentes
    - Monitorar status de todas as operações
    - Tomar decisões de alto nível
    """
    
    litellm_base_url = os.getenv("LITELLM_BASE_URL", "http://maestro-litellm:4000")
    litellm_api_key = os.getenv("ANTHROPIC_API_KEY", "")
    
    llm = ChatOpenAI(
        model="anthropic/claude-sonnet-4-20250514",
        base_url=f"{litellm_base_url}/v1",
        api_key=literm_api_key or "dummy",
        timeout=120,
    )

    return Agent(
        role="Chief Operating Officer (COO)",
        goal="Coordenar todos os agentes para executar as operações de negócio de forma eficiente, garantindo que todas as tarefas sejam completadas com qualidade e dentro dos prazos.",
        backstory="""Você é o COO do MAESTRO AI ENGINE, um sistema de IA avançado desenvolvido para automatizar completamente as operações de uma empresa de importação/exportação de luxo (relógios, bolsas) entre China, Itália e Brasil.

Sua experiência inclui:
- Gestão operacional de empresas de luxo
- Coordenação de equipes de vendas e marketing
- Análise de mercado internacional
- Otimização de processos de importação
- Gestão de relacionamentos com clientes VIP

Você trabalha com 6 agentes especializados:
1. Import Agent - Procura e valida fornecedores na China e Itália
2. Advertising Agent - Gerencia campanhas no Meta, Google e TikTok
3. Luxury Watch Agent - Análise técnica de relógios de luxo
4. WhatsApp SDR - Comunicação com clientes via WhatsApp
5. TikTok Growth - Crescimento orgânico no TikTok
6. Knowledge Sync - Sincronização de conhecimento e crons

Quando uma solicitação chega, você:
1. Analisa a natureza da solicitação
2. Determina qual(is) agente(s) deve(m) atuar
3. Cria e distribui tarefas
4. Coordena o fluxo entre agentes
5. Reporta o resultado final""",
        verbose=True,
        allow_delegation=True,
        llm=llm,
        tools=[
            create_task_tool,
            get_agent_status_tool,
            list_active_agents_tool,
            route_request_tool,
        ],
    )


# ============================================
# FERRAMENTAS DO ORCHESTRATOR
# ============================================

def create_task_tool():
    """Cria uma nova tarefa para um agente específico"""
    from crewai.tools import Tool
    
    def _create_task(agent_name: str, task_description: str, priority: str = "normal") -> str:
        """
        Cria uma nova tarefa para um agente.
        
        Args:
            agent_name: Nome do agente que deve executar a tarefa
            task_description: Descrição detalhada da tarefa
            priority: Prioridade (low, normal, high, urgent)
        
        Returns:
            ID da tarefa criada
        """
        # Implementation would create task in database/queue
        task_id = f"task_{agent_name}_{priority}_{int(__import__('time').time())}"
        return f"Tarefa criada: {task_id} para {agent_name}"
    
    return Tool(
        name="create_task",
        description="Cria uma nova tarefa para um agente específico",
        func=_create_task,
    )


def get_agent_status_tool():
    """Retorna o status atual de um agente"""
    from crewai.tools import Tool
    
    def _get_status(agent_name: str) -> str:
        """
        Retorna o status de um agente específico.
        
        Args:
            agent_name: Nome do agente
        
        Returns:
            Status atual (idle, working, error, etc.)
        """
        return f"Status de {agent_name}: idle"
    
    return Tool(
        name="get_agent_status",
        description="Retorna o status de um agente específico",
        func=_get_status,
    )


def list_active_agents_tool():
    """Lista todos os agentes ativos"""
    from crewai.tools import Tool
    
    def _list_agents() -> str:
        """
        Lista todos os agentes disponíveis e seus status.
        
        Returns:
            Lista de agentes com status
        """
        agents = [
            "orchestrator",
            "import",
            "advertising",
            "luxury_watch",
            "whatsapp_sdr",
            "tiktok_growth",
            "knowledge_sync",
        ]
        return "\n".join([f"- {a}: idle" for a in agents])
    
    return Tool(
        name="list_active_agents",
        description="Lista todos os agentes disponíveis",
        func=_list_agents,
    )


def route_request_tool():
    """Roteia uma solicitação para o agente correto"""
    from crewai.tools import Tool
    
    def _route(request_type: str, request_content: str) -> str:
        """
        Analisa e roteia uma solicitação para o agente apropriado.
        
        Args:
            request_type: Tipo de solicitação (import, advertising, sales, etc.)
            request_content: Conteúdo da solicitação
        
        Returns:
            Agente roteado
        """
        routes = {
            "import": "import_agent",
            "fornecedor": "import_agent",
            "china": "import_agent",
            "italia": "import_agent",
            "publicidade": "advertising_agent",
            "meta": "advertising_agent",
            "google": "advertising_agent",
            "tiktok": "advertising_agent",
            "campanha": "advertising_agent",
            "relogio": "luxury_watch_agent",
            "luxo": "luxury_watch_agent",
            "whatsapp": "whatsapp_sdr_agent",
            "vendas": "whatsapp_sdr_agent",
            "cliente": "whatsapp_sdr_agent",
            "tiktok_growth": "tiktok_growth_agent",
            "crescimento": "tiktok_growth_agent",
            "conhecimento": "knowledge_sync_agent",
            "sync": "knowledge_sync_agent",
            "cron": "knowledge_sync_agent",
        }
        
        request_lower = (request_type + " " + request_content).lower()
        
        for key, agent in routes.items():
            if key in request_lower:
                return f"Solicitação roteada para: {agent}"
        
        return "Solicitação roteada para: orchestrator (análise manual necessária)"
    
    return Tool(
        name="route_request",
        description="Roteia uma solicitação para o agente correto",
        func=_route,
    )
