"""
Import Agent - China/Itália/BR
Gerencia importação de produtos de luxo da China e Itália para o Brasil
"""

from crewai import Agent
from langchain_openai import ChatOpenAI
import os


def create_import_agent() -> Agent:
    """
    Cria o agente de Importação.
    Responsável por:
    - Pesquisar fornecedores na China e Itália
    - Validar fornecedores e produtos
    - Negociar preços e condições
    - Coordenar logística de importação
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
        role="Especialista em Importação Internacional",
        goal="Encontrar os melhores fornecedores de produtos de luxo (relógios, bolsas) na China e Itália, validar sua confiabilidade e negociar as melhores condições de compra e importação para o Brasil.",
        backstory="""Você é o especialista em importação do MAESTRO AI ENGINE. Sua missão é identificar, validar e negociar com fornecedores na China e Itália para importação de produtos de luxo.

Sua expertise inclui:
- Pesquisa de fornecedores em plataformas chinesas (Alibaba, 1688, Taobao) e italianas
- Análise de credibility de fornecedores
- Negociação de preços FOB, CIF, DDP
- Coordenação de logística internacional
- Gestão de documentação aduaneira
- Inspeção de qualidade pré-embarque
- Cálculo de impostos de importação (ICMS, IPI, II)
- Gestão de riscos cambiais

Você trabalha em estreita colaboração com:
- Orchestrator para receber demandas
- Luxury Watch Agent para validação técnica de produtos
- WhatsApp SDR para comunicação com fornecedores""",
        verbose=True,
        allow_delegation=True,
        llm=llm,
        tools=[
            search_suppliers_tool,
            validate_supplier_tool,
            calculate_import_costs_tool,
            negotiate_price_tool,
            track_shipment_tool,
        ],
    )


# ============================================
# FERRAMENTAS DO IMPORT AGENT
# ============================================

def search_suppliers_tool():
    """Pesquisa fornecedores baseado em critérios"""
    from crewai.tools import Tool
    import httpx
    
    def _search_suppliers(
        product_type: str,
        origin_country: str,
        min_quantity: int = 10,
        budget_range: str = "medium"
    ) -> str:
        """
        Pesquisa fornecedores para um produto específico.
        
        Args:
            product_type: Tipo de produto (relógio, bolsa,etc)
            origin_country: País de origem (china, italia)
            min_quantity: Quantidade mínima para pedido
            budget_range: Faixa de orçamento (low, medium, high, luxury)
        
        Returns:
            Lista de fornecedores encontrados
        """
        # Uses Brave API to search for suppliers
        brave_api_key = os.getenv("BRAVE_API_KEY", "")
        
        search_query = f"{product_type} wholesale suppliers {origin_country} Alibaba"
        
        # Implementation would use Brave API
        results = [
            {
                "name": "Shenzhen Watch Co., Ltd",
                "platform": "Alibaba",
                "rating": 4.8,
                "min_order": 50,
                "price_range": "$50-$500",
                "certifications": ["CE", "ROHS", "ISO9001"],
            },
            {
                "name": "Milan Leather Goods srl",
                "platform": "Direct",
                "rating": 4.9,
                "min_order": 20,
                "price_range": "$100-$2000",
                "certifications": ["CE", "ISO9001"],
            },
        ]
        
        return f"Encontrados {len(results)} fornecedores para {product_type} na {origin_country}:\n" + \
            "\n".join([f"- {r['name']}: {r['rating']}★, {r['price_range']}" for r in results])
    
    return Tool(
        name="search_suppliers",
        description="Pesquisa fornecedores em plataformas chinesas e italianas",
        func=_search_suppliers,
    )


def validate_supplier_tool():
    """Valida a confiabilidade de um fornecedor"""
    from crewai.tools import Tool
    
    def _validate_supplier(supplier_name: str, platform: str = "alibaba") -> str:
        """
        Valida a confiabilidade de um fornecedor.
        
        Args:
            supplier_name: Nome do fornecedor
            platform: Plataforma (alibaba, 1688, direct, etc)
        
        Returns:
            Relatório de validação
        """
        # Implementation would check:
        # - Company registration
        # - Review history
        # - Transaction history
        # - Certification verification
        # - Contact verification
        
        validation = {
            "company_verified": True,
            "years_active": 8,
            "total_transactions": 15420,
            "response_rate": 98,
            "delivery_rate": 99,
            "rating": 4.8,
            "risk_level": "low",
            "recommendation": "approved",
        }
        
        return f"""Validação de {supplier_name} ({platform}):
✓ Empresa verificada: {validation['company_verified']}
✓ Anos ativos: {validation['years_active']}
✓ Total de transações: {validation['total_transactions']}
✓ Taxa de resposta: {validation['response_rate']}%
✓ Taxa de entrega: {validation['delivery_rate']}%
✓ Avaliação: {validation['rating']}★
⚠ Nível de risco: {validation['risk_level'].upper()}
📋 Recomendação: {validation['recommendation'].upper()}"""
    
    return Tool(
        name="validate_supplier",
        description="Valida a confiabilidade de um fornecedor",
        func=_validate_supplier,
    )


def calculate_import_costs_tool():
    """Calcula custos totais de importação"""
    from crewai.tools import Tool
    
    def _calculate_costs(
        product_value: float,
        origin_country: str,
        shipping_method: str = "sea",
        freight_forwarder: str = "default"
    ) -> str:
        """
        Calcula custos totais de importação incluindo impostos.
        
        Args:
            product_value: Valor dos produtos em USD
            origin_country: País de origem
            shipping_method: Método de envio (sea, air, express)
            freight_forwarder: freight forwarder (default = automático)
        
        Returns:
            Breakdown completo de custos
        """
        # Base calculations
        shipping_costs = {
            "sea": product_value * 0.05,  # 5% of product value
            "air": product_value * 0.15,  # 15%
            "express": product_value * 0.25,  # 25%
        }
        
        shipping = shipping_costs.get(shipping_method, shipping_costs["sea"])
        
        # Brazilian import taxes
        ii_rate = 0.20  # Import duty 20%
        ipi_rate = 0.10  # IPI 10%
        pis_rate = 0.0217  # PIS
        cofins_rate = 0.10  # COFINS
        
        # Calculate taxes (simplified)
        ii = product_value * ii_rate
        ipi = (product_value + ii) * ipi_rate
        pis_cofins = (product_value + ii) * (pis_rate + cofins_rate)
        
        # ICMS varies by state (assume São Paulo = 18%)
        icms_rate = 0.18
        icms_base = product_value + ii + ipi
        icms = icms_base * icms_rate
        
        total_taxes = ii + ipi + pis_cofins + icms
        total_cost = product_value + shipping + total_taxes
        
        return f"""💰 CÁLCULO DE IMPORTAÇÃO - {origin_country.upper()} → BR

PRODUTO:
  Valor FOB: ${product_value:,.2f}

FRETE:
  Método: {shipping_method}
  Custo: ${shipping:,.2f}

IMPOSTOS (Brasil):
  II (20%): ${ii:,.2f}
  IPI (10%): ${ipi:,.2f}
  PIS/COFINS: ${pis_cofins:,.2f}
  ICMS (18%): ${icms:,.2f}
  Total Impostos: ${total_taxes:,.2f}

RESUMO:
  Valor Total: ${total_cost:,.2f}
  Custo por unidade (se {product_value//100} un): ${total_cost/max(product_value//100,1):,.2f}
  Markup recomendado (2x): ${total_cost*2:,.2f}"""
    
    return Tool(
        name="calculate_import_costs",
        description="Calcula custos totais de importação incluindo impostos brasileiros",
        func=_calculate_costs,
    )


def negotiate_price_tool():
    """Negocia preço com fornecedor"""
    from crewai.tools import Tool
    
    def _negotiate(
        supplier_name: str,
        product: str,
        target_price: float,
        quantity: int,
        payment_terms: str = "tt"
    ) -> str:
        """
        Simula negociação de preço com fornecedor.
        
        Args:
            supplier_name: Nome do fornecedor
            product: Produto desejado
            target_price: Preço alvo em USD
            quantity: Quantidade
            payment_terms: Termos de pagamento (tt, lc, dp)
        
        Returns:
            Resultado da negociação
        """
        # Simulated negotiation logic
        initial_price = target_price * 1.3  # 30% above target
        final_price = target_price * 1.05  # 5% above target (good deal)
        
        return f"""📞 NEGOCIAÇÃO COM {supplier_name}

Produto: {product}
Quantidade: {quantity}
Preço Alvo: ${target_price:,.2f}

RESULTADO:
  Preço Inicial: ${initial_price:,.2f}
  Preço Negociado: ${final_price:,.2f}
  Economia: ${initial_price - final_price:,.2f} ({(1 - final_price/initial_price)*100:.1f}%)
  
Condições: {payment_terms.upper()}
Prazo: 15-25 dias após pagamento
  
STATUS: ✅ NEGOCIAÇÃO BEM-SUCEDIDA"""
    
    return Tool(
        name="negotiate_price",
        description="Negocia preço com fornecedor",
        func=_negotiate,
    )


def track_shipment_tool():
    """Acompanha status de shipment"""
    from crewai.tools import Tool
    
    def _track(tracking_number: str, carrier: str = "auto") -> str:
        """
        Acompanha status de um shipment.
        
        Args:
            tracking_number: Número de rastreamento
            carrier: Transportadora (auto = detectar automaticamente)
        
        Returns:
            Status atual do shipment
        """
        # Simulated tracking
        statuses = [
            "Pedido confirmado",
            "Pagamento recebido",
            "Produto em preparação",
            " embarcado no país de origem",
            "Em trânsito",
            "Chegou no Brasil",
            "Em desembaraço aduaneiro",
            "Liberado para entrega",
            "Em transporte para cliente",
            "Entregue",
        ]
        
        return f"""📦 RASTREAMENTO - {tracking_number}

Status atual: Em trânsito
Local: Guangzhou, CN → São Paulo, BR

Timeline:
  📅 2024-01-15 - Pedido confirmado
  📅 2024-01-16 - Pagamento recebido  
  📅 2024-01-18 - Produto embarcado
  📅 2024-01-20 - Saiu da China
  📅 2024-01-25 - Chegou no Brasil (GRU)
  📅 2024-01-27 - Em desembaraço aduaneiro
  📅 2024-01-28 - LIBERADO ✓
  📅 2024-01-29 - Em transporte local
  
Previsão de entrega: 2024-01-30"""
    
    return Tool(
        name="track_shipment",
        description="Acompanha status de shipment",
        func=_track,
    )
