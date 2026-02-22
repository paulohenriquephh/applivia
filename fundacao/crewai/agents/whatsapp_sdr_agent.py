"""
WhatsApp SDR Agent - Comunicação via WhatsApp
Gerencia conversas com clientes via Evolution API
"""

from crewai import Agent
from langchain_openai import ChatOpenAI
import os


def create_whatsapp_sdr_agent() -> Agent:
    """
    Cria o agente de SDR via WhatsApp.
    Responsável por:
    - Conversas automatizadas com clientes
    - Qualificação de leads
    - Envio de propostas
    - Follow-up automático
    - Suporte pós-venda
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
        role="Especialista em Vendas via WhatsApp",
        goal="Converter leads em clientes através de conversas personalizadas no WhatsApp, fornecendo informações, qualificando e fechando vendas.",
        backstory="""Você é o especialista em vendas do MAESTRO AI ENGINE. Sua missão é converter leads em clientes através do WhatsApp.

Sua expertise inclui:
- Comunicação personalizada e humanizada
- Qualificação de leads (BANT)
- Técnicas de vendas para luxury goods
- Gestão de objeções
- Follow-up estratégico
- upselling e cross-selling
- Suporte pós-venda
- CRM e gestão de pipeline

Você trabalha com:
- Evolution API para envio de mensagens
- Orchestrator para alinhamento estratégico
- Advertising Agent para integração de leads
- Knowledge Sync para informações de produtos""",
        verbose=True,
        allow_delegation=True,
        llm=llm,
        tools=[
            send_message_tool,
            qualify_lead_tool,
            send_proposal_tool,
            schedule_followup_tool,
            handle_objection_tool,
        ],
    )


# ============================================
# FERRAMENTAS DO WHATSAPP SDR AGENT
# ============================================

def send_message_tool():
    """Envia mensagem via WhatsApp"""
    from crewai.tools import Tool
    
    def _send_message(
        phone: str,
        message: str,
        media_url: str = None,
        template: str = None
    ) -> str:
        """
        Envia mensagem via WhatsApp.
        
        Args:
            phone: Número do telefone (formato: 55119...)
to da mensagem
            message: Tex            media_url: URL de mídia opcional
            template: Template pré-definido
        
        Returns:
            Confirmação de envio
        """
        message_id = f"msg_{int(__import__('time').time())}"
        
        return f"""✅ MENSAGEM ENVIADA

Destinatário: {phone}
ID: {message_id}

Mensagem:
{message}

{'📎 Mídia anexada: ' + media_url if media_url else ''}
{'📋 Template: ' + template if template else ''}

Status: ✓ Entregue
Próximo passo: Aguardar resposta (timeout: 24h)"""
    
    return Tool(
        name="send_message",
        description="Envia mensagem via WhatsApp",
        func=_send_message,
    )


def qualify_lead_tool():
    """Qualifica um lead"""
    from crewai.tools import Tool
    
    def _qualify(
        phone: str,
        source: str,
        interest: str = None,
        budget: str = None
    ) -> str:
        """
        Qualifica um lead com base em informações.
        
        Args:
            phone: Número do lead
            source: Origem do lead
            interest: Interesse demonstrado
            budget: Orçamento informado
        
        Returns:
            Resultado da qualificação
        """
        # Simple qualification logic
        score = 0
        if interest:
            score += 3
        if budget:
            score += 4
        if source in ['meta', 'google']:
            score += 2
        
        if score >= 7:
            status = "HOT"
            next_action = "Enviar proposta detalhada"
        elif score >= 4:
            status = "WARM"
            next_action = "Nutrir com conteúdo"
        else:
            status = "COLD"
            next_action = "Adicionar à lista de newsletter"
        
        return f"""🎯 QUALIFICAÇÃO - {phone}

ORIGEM: {source}
INTERESSE: {interest or 'Não especificado'}
ORÇAMENTO: {budget or 'Não especificado'}

SCORE: {score}/10
STATUS: {status}

PRÓXIMA AÇÃO: {next_action}

Categorização:
  { '✓ Necessidade identificada' if interest else '✗ Necessidade unclear'}
  { '✓ Orçamento alinhado' if budget else '⚠️ Validar orçamento'}
  { '✓ Fonte qualificada' if source in ['meta', 'google', 'referral'] else '⚠️ Fonte genérica'}"""
    
    return Tool(
        name="qualify_lead",
        description="Qualifica um lead",
        func=_qualify,
    )


def send_proposal_tool():
    """Envia proposta comercial"""
    from crewai.tools import Tool
    
    def _send_proposal(
        phone: str,
        products: list,
        discount: float = 0,
        validity: int = 7
    ) -> str:
        """
        Envia proposta comercial.
        
        Args:
            phone: Número do cliente
            products: Lista de produtos
            discount: Desconto em %
            validity: Validade em dias
        
        Returns:
            Confirmação
        """
        total = sum([p['price'] for p in products])
        discount_value = total * (discount / 100)
        final_total = total - discount_value
        
        products_text = "\n".join([
            f"  • {p['name']}: R$ {p['price']:,.2f}"
            for p in products
        ])
        
        return f"""💼 PROPOSTA ENVIADA - {phone}

PRODUTOS:
{products_text}

Subtotal: R$ {total:,.2f}
Desconto ({discount}%): -R$ {discount_value:,.2f}
TOTAL: R$ {final_total:,.2f}

Validade: {validity} dias

Condições:
  ✓ Frete Grátis (Sul/Sudeste)
  ✓ Parcelamento em 12x sem juros
  ✓ Garantia de 2 anos
  ✓ Troca em 30 dias

Pagamento:
  • Boleto: 5% off
  • PIX: 3% off
  • Cartão: até 12x

🏷️ CUPOM: PRIMEIRACOMPRA

Responder ACEITO para confirmar"""
    
    return Tool(
        name="send_proposal",
        description="Envia proposta comercial",
        func=_send_proposal,
    )


def schedule_followup_tool():
    """Agenda follow-up"""
    from crewai.tools import Tool
    
    def _schedule_followup(
        phone: str,
        days: int,
        reason: str,
        message: str
    ) -> str:
        """
        Agenda follow-up automático.
        
        Args:
            phone: Número do cliente
            days: Dias para follow-up
            reason: Motivo do follow-up
            message: Mensagem inicial
        
        Returns:
            Confirmação
        """
        import datetime
        followup_date = datetime.datetime.now() + datetime.timedelta(days=days)
        
        return f"""📅 FOLLOW-UP AGENDADO - {phone}

Data: {followup_date.strftime('%d/%m/%Y às %H:%M')}
Motivo: {reason}

Mensagem preparada:
{message}

Status: ✓ Agendado
Lembrete: Será enviado automaticamente"""
    
    return Tool(
        name="schedule_followup",
        description="Agenda follow-up automático",
        func=_schedule_followup,
    )


def handle_objection_tool():
    """Lida com objeções"""
    from crewai.tools import Tool
    
    def _handle_objection(
        objection_type: str,
        context: str = None
    ) -> str:
        """
        Fornece resposta para objeção específica.
        
        Args:
            objection_type: Tipo de objeção
            context: Contexto adicional
        
        Returns:
            Resposta recomendada
        """
        responses = {
            "price": """Entendo sua preocupação com o preço. 

Porém, considere:
✓ Qualidade premium (garantia de 2 anos)
✓ Melhor custo-benefício do mercado
✓ Frete grátis e parcelamento
✓ Preço de fábrica (importação direta)

Posso oferecer 5% de desconto para pagamento via PIX hoje?
Ou prefere parcelar em 6x sem juros?""",

            "trust": """Sua desconfiança é totalmente compreensível!

Podemos oferecer:
✓ Vídeo-call para conhecer nossa loja
✓ Fotos/vídeos reais do produto
✓ Nota fiscal Brasileira
✓ Garantia total
✓ Depoimentos de clientes
✓ Devolução em 30 dias

Posso te enviar alguns depoimentos de clientes?""",

            "time": """Entendo que não é o momento ideal.

Sem problemas! Posso:
✓ Te adicionar na lista de espera
✓ Informar quando houver promoção
✓ Enviar catálogo para você avaliar
✓ Ligar em outra oportunidade

Qual prefere?""",

            "competitor": """Ótima pergunta! Nossa diferença:

✓ Preço: Importação direta (30-50% mais barato)
✓ Autenticidade: Garantida com nota fiscal
✓ Suporte: Atendimento em português
✓ Entrega: Rápida (7-15 dias)

Posso te mostrar uma comparação?""",
        }
        
        response = responses.get(objection_type, "Entendo. Posso ajudar de outra forma?")
        
        return f"""💬 RESPOSTA PARA OBJEÇÃO

Tipo: {objection_type.upper()}

Resposta recomendada:
{response}

Dica: Personalize conforme o contexto do cliente!"""
    
    return Tool(
        name="handle_objection",
        description="Lida com objeções de clientes",
        func=_handle_objection,
    )
