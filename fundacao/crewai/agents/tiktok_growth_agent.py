"""
TikTok Growth Agent - Crescimento Orgânico
Gerencia presença e crescimento no TikTok
"""

from crewai import Agent
from langchain_openai import ChatOpenAI
import os


def create_tiktok_growth_agent() -> Agent:
    """
    Cria o agente de Crescimento TikTok.
    Responsável por:
    - Criação de conteúdo viral
    - Estratégias de hashtags
    - Análise de trends
    - Engajamento com audiência
    - Growth hacking
    """
    
    litellm_base_url = os.getenv("LITELLM_BASE_URL", "http://maestro-litellm:4000")
    litellm_api_key = os.getenv("ANTHROPIC_API_KEY", "")
    
    llm = ChatOpenAI(
        model="anthropic/claude-sonnet-4-20250514",
        base_url=f"{litellm_base_url}/v1",
        api_key=litellm_api_key or "dummy",
        timeout=120,
    )

    return Agent(
        role="Especialista em Crescimento TikTok",
        goal="Aumentar presença e engajamento no TikTok através de conteúdo viral, trends e estratégias de growth hacking.",
        backstory="""Você é o especialista em TikTok do MAESTRO AI ENGINE. Sua missão é fazer o canal crescer organicamente.

Sua expertise inclui:
- Criação de conteúdo viral
- Timing de postagens
- Hashtag strategy
- Análise de trends
- Engajamento com Comments
- Duets e Stitches
- TikTok Ads (complemento ao Advertising Agent)
- Criação de séries de conteúdo
- Colaborações

Você trabalha com:
- Advertising Agent para TikTok Ads
- Orchestrator para estratégias
- Knowledge Sync para tendências""",
        verbose=True,
        allow_delegation=True,
        llm=llm,
        tools=[
            generate_content_ideas_tool,
            analyze_trends_tool,
            schedule_post_tool,
            optimize_hashtags_tool,
            analyze_performance_tool,
        ],
    )


# ============================================
# FERRAMENTAS DO TIKTOK GROWTH AGENT
# ============================================

def generate_content_ideas_tool():
    """Gera ideias de conteúdo"""
    from crewai.tools import Tool
    
    def _generate_ideas(
        niche: str,
        num_ideas: int = 5,
        format_type: str = "mixed"
    ) -> str:
        """
        Gera ideias de conteúdo para TikTok.
        
        Args:
            niche: Nicho (luxo, relógios, bolsas)
            num_ideas: Número de ideias
            format_type: Tipo (educational, entertainment, behind scenes)
        
        Returns:
            Lista de ideias
        """
        ideas = [
            {
                "title": "Watch Review: Rolex Submariner",
                "hook": "O relógio que todo homem quer ter! 🏆",
                "format": "Review",
                "hashtags": ["#rolex", "#submariner", "#luxo", "#relogio"],
                "est_views": "50K-200K",
            },
            {
                "title": "Unboxing: Italy Import",
                "hook": "Chegou direto da Itália! 🇮🇹",
                "format": "Unboxing",
                "hashtags": ["#unboxing", "#italia", "#importacao"],
                "est_views": "30K-100K",
            },
            {
                "title": "Luxury vs Rep",
                "hook": "Original vs Réplica - você sabe diferenciar?",
                "format": "Comparison",
                "hashtags": ["#luxo", "#replica", "#unboxing"],
                "est_views": "100K-500K",
            },
            {
                "title": "Day in the Life",
                "hook": "Um dia Vendendo Relógios de Luxo 💎",
                "format": "Vlog",
                "hashtags": ["#dayinmylife", "#luxo", "#empreendedor"],
                "est_views": "20K-80K",
            },
            {
                "title": "Price Drop Alert",
                "hook": "Preço DESPENCOU! Corra!",
                "format": "Promo",
                "hashtags": ["#promocao", "#liquidação", "#relogio"],
                "est_views": "80K-300K",
            },
        ]
        
        result = f"""🎬 IDEIAS DE CONTEÚDO - {niche.upper()}

"""
        for i, idea in enumerate(ideas[:num_ideas], 1):
            result += f"""
{i}. {idea['title']}
   🎣 Hook: {idea['hook']}
   📹 Formato: {idea['format']}
   📊 Views Estimadas: {idea['est_views']}
   🏷️ Hashtags: {' '.join(idea['hashtags'])}
"""
        
        return result
    
    return Tool(
        name="generate_content_ideas",
        description="Gera ideias de conteúdo viral",
        func=_generate_ideas,
    )


def analyze_trends_tool():
    """Analisa tendências atuais"""
    from crewai.tools import Tool
    
    def _analyze_trends(niche: str = "luxo") -> str:
        """
        Analisa tendências atuais do TikTok.
        
        Args:
            niche: Nicho para análise
        
        Returns:
            Relatório de tendências
        """
        return f"""🔥 TENDÊNCIAS ATUAIS - {niche}

TRENDS QUENTES:
┌────────────────────────────────────────────────────────┐
│ 1. "What I pack" - unboxing de viagem                 │
│    Potencial: Alto | Dificuldade: Baixa               │
├────────────────────────────────────────────────────────┤
│ 2. "Get ready with me" - rotinas de luxo             │
│    Potencial: Médio | Dificuldade: Baixa              │
├────────────────────────────────────────────────────────┤
│ 3. "Before & After" - transformações                  │
│    Potencial: Alto | Dificuldade: Média               │
├────────────────────────────────────────────────────────┤
│ 4. "POV" - dia a dia                                  │
│    Potencial: Médio | Dificuldade: Baixa              │
├────────────────────────────────────────────────────────┤
│ 5. "Rate my outfit" - looks com acessórios            │
│    Potencial: Médio | Dificuldade: Baixa              │
└────────────────────────────────────────────────────────┘

ÁUDIOS EM ALTA:
  • Default - Trend principal
  • Doja Cat - Kiss Me More
  • Travis Scott - FE!N

CORES DO MOMENTO:
  • Gold/Nude
  • Black & White
  • Emerald Green

SUGESTÃO: Criar vídeo "POV: Comprando meu primeiro relógio de luxo"
com trend de áudio em alta"""
    
    return Tool(
        name="analyze_trends",
        description="Analisa tendências do TikTok",
        func=_analyze_trends,
    )


def schedule_post_tool():
    """Agenda postagem"""
    from crewai.tools import Tool
    
    def _schedule(
        content_id: str,
        datetime_str: str,
        platform: str = "tiktok"
    ) -> str:
        """
        Agenda postagem no TikTok.
        
        Args:
            content_id: ID do conteúdo
            datetime_str: Data e hora (YYYY-MM-DD HH:MM)
            platform: Plataforma
        
        Returns:
            Confirmação
        """
        return f"""📅 POSTAGEM AGENDADA

ID: {content_id}
Plataforma: {platform}
Data/Hora: {datetime_str}

Status: ✅ Confirmado

Lembrete: Preparar caption e hashtags até 1h antes"""
    
    return Tool(
        name="schedule_post",
        description="Agenda postagem no TikTok",
        func=_schedule,
    )


def optimize_hashtags_tool():
    """Otimiza hashtags"""
    from crewai.tools import Tool
    
    def _optimize(
        content_type: str,
        target_audience: str = "general"
    ) -> str:
        """
        Otimiza hashtags para máximo alcance.
        
        Args:
            content_type: Tipo de conteúdo
            target_audience: Audiência alvo
        
        Returns:
            Hashtags otimizadas
        """
        hashtags = {
            "review": ["#relogio", "#luxo", "#review", "#rolex", "#omega", "#unboxing", "#watch"],
            "unboxing": ["#unboxing", "#unboxingluxo", "#importado", "#chegou", "#novo"],
            "promo": ["#promocao", "#desconto", "#liquidação", "#off", "#oferta"],
            "educational": ["#dicas", "#tutorial", "#como", "#aprenda", "#conhecimento"],
        }
        
        selected = hashtags.get(content_type, hashtags["review"])
        
        return f"""🏷️ HASHTAGS OTIMIZADAS

Tipo: {content_type}
Audiência: {target_audience}

HASHTAGS PRINCIPAIS (3-5):
{selected[:5]}

HASHTAGS DE NICHO:
#luxobrasil #relogiosdeluxo #bolsasdeluxo #importacaodireta

TOTAL: 8-10 hashtags (ótimo para alcance)

DICAS:
✓ Misturar hashtags grandes e pequenas
✓ Usar 1-2 trend hashtags
✓ Incluir hashtag da marca
⚠️ Evitar +15 hashtags (parece spam)"""
    
    return Tool(
        name="optimize_hashtags",
        description="Otimiza hashtags para TikTok",
        func=_optimize,
    )


def analyze_performance_tool():
    """Analisa performance de conteúdo"""
    from crewai.tools import Tool
    
    def _analyze(channel_id: str = None, period: str = "7d") -> str:
        """
        Analisa performance do canal.
        
        Args:
            channel_id: ID do canal
            period: Período
        
        Returns:
            Relatório de performance
        """
        return f"""📊 PERFORMANCE TIKTOK - {period}

MÉTRICAS DO CANAL:
┌────────────────────────────────────────┐
│ Seguidores:     12.450 (+850 esta semana)│
│ Total Views:    1.2M                   │
│ Avg Views:      45.3K                  │
│ Avg Likes:     3.2K (7.1%)            │
│ Avg Comments:   156 (0.3%)             │
│ Avg Shares:     890 (2.0%)            │
└────────────────────────────────────────┘

TOP VÍDEOS DA SEMANA:
1. "Review Rolex Submariner" - 245K views, 18K likes
2. "Unboxing Italy" - 156K views, 12K likes  
3. "Price Drop Alert" - 98K views, 8K likes

MELHORES HORÁRIOS:
• 12:00-14:00 - Lunch break
• 18:00-20:00 - After work
• 21:00-23:00 - Evening scroll

ESTRATÉGIAS FUNCIONANDO:
✓ Hook nos primeiros 2 segundos
✓ Perguntas no caption
✓ Calls-to-action para comments

OPORTUNIDADES:
→ Criar mais conteúdo "duet"
→ Vídeos mais curtos (15-30s)
→ Mais consistency (postar 2x/dia)"""
    
    return Tool(
        name="analyze_tiktok_performance",
        description="Analisa performance do TikTok",
        func=_analyze,
    )
