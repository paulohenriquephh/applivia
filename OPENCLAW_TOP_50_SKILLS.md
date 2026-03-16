# OpenClaw — Top 50 Skills (Out-of-the-Box)

> Habilidades que o OpenClaw (Maestro AI Engine v3) precisa ter **assim que instalado** no computador, ordenadas por prioridade e agrupadas por categoria.

---

## CORE / INFRAESTRUTURA (Skills 1–10)

| # | Skill | Como funciona |
|---|-------|---------------|
| **1** | **Auto-Instalação & Setup** | Ao rodar `docker compose up`, todos os 15+ serviços sobem automaticamente (Brain, CrewAI, Qdrant, Postgres, Redis, LiteLLM, n8n, Evolution, Grafana, Prometheus, Portainer). Zero configuração manual — basta ter Docker e as API keys. |
| **2** | **Chat em Tempo Real (WebSocket)** | Conexão WebSocket bidirecional via `/ws/{client_id}` com suporte a mensagens de chat, voice e ping/pong. O usuário conversa com o MAESTRO em tempo real desde o primeiro acesso. |
| **3** | **Roteamento Inteligente de Agentes** | O Orchestrator/COO analisa cada mensagem e roteia automaticamente para o agente correto (Import, Advertising, Luxury Watch, WhatsApp SDR, TikTok Growth, Knowledge Sync) via keyword matching + LLM decision. |
| **4** | **Memória Conversacional Persistente** | Cada conversa é salva em PostgreSQL com histórico completo. O sistema lembra das últimas 10 mensagens de contexto por sessão e mantém histórico infinito no banco. |
| **5** | **Base de Conhecimento Vetorial (RAG)** | Qdrant armazena embeddings de toda a base de conhecimento. Busca semântica via `/api/knowledge/search` retorna os documentos mais relevantes para enriquecer as respostas (Retrieval Augmented Generation). |
| **6** | **LLM Proxy Multi-Modelo** | LiteLLM faz proxy para Anthropic Claude, OpenRouter e outros. Troca de modelo em tempo real sem alterar código. Fallback automático se um provider cair. |
| **7** | **Monitoramento em Tempo Real** | Grafana + Prometheus coletam métricas de todos os serviços. Dashboards prontos mostram latência, uso de CPU/RAM, requests por segundo e status dos agentes. |
| **8** | **API REST Completa** | FastAPI com endpoints documentados (Swagger UI) para chat, voice, agents, knowledge e metrics. Qualquer frontend ou sistema externo integra via HTTP. |
| **9** | **Logging Estruturado** | `structlog` produz logs JSON parseáveis. Cada execução de agente é registrada na tabela `agent_executions` com task, result, status e duration. |
| **10** | **Health Checks Automáticos** | Endpoints `/health` em cada serviço. Docker healthchecks reiniciam containers que caem. O sistema se auto-recupera. |

---

## IMPORTAÇÃO & SUPPLY CHAIN (Skills 11–18)

| # | Skill | Como funciona |
|---|-------|---------------|
| **11** | **Busca de Fornecedores (China/Itália)** | Import Agent pesquisa em Alibaba, 1688, Taobao e fornecedores italianos. Retorna lista ranqueada com preço, MOQ, lead time e rating do seller. |
| **12** | **Validação de Fornecedores** | Verifica credibilidade: Gold Supplier, Trade Assurance, anos de operação, reviews, certificações. Gera score de confiabilidade 0–100. |
| **13** | **Negociação Automática de Preços** | Calcula preço-alvo com base em margem desejada e negocia via mensagens geradas por IA. Suporta termos FOB, CIF e DDP. |
| **14** | **Cálculo de Custos de Importação** | Calcula automaticamente impostos brasileiros (II, IPI, ICMS, PIS, COFINS), frete internacional, seguro e taxa de câmbio. Retorna custo landed total. |
| **15** | **Gestão de Documentação Aduaneira** | Gera e organiza documentos: Invoice, Packing List, B/L, Certificado de Origem. Checa compliance com regulamentações da Receita Federal. |
| **16** | **Rastreamento de Pedidos** | Monitora status de pedidos: produção → embarque → trânsito → desembaraço → entrega. Notificações automáticas em cada mudança de status. |
| **17** | **Análise de Câmbio & Timing** | Monitora USD/BRL, EUR/BRL e CNY/BRL. Sugere melhor momento para compra baseado em tendências e volatilidade. |
| **18** | **Comparativo de Fornecedores** | Gera tabela comparativa side-by-side de múltiplos fornecedores com todos os critérios (preço, qualidade, prazo, confiabilidade, capacidade). |

---

## PUBLICIDADE & MARKETING DIGITAL (Skills 19–27)

| # | Skill | Como funciona |
|---|-------|---------------|
| **19** | **Criação de Campanhas Meta Ads** | Advertising Agent cria campanhas completas no Facebook/Instagram: define público, budget, criativo, copy e CTA. Suporta Conversão, Tráfego, Alcance. |
| **20** | **Gestão de Google Ads** | Cria e otimiza campanhas Search, Display, Shopping e YouTube. Pesquisa keywords, define lances e gera anúncios responsivos. |
| **21** | **Campanhas TikTok Ads** | Cria anúncios nativos para TikTok com scripts de vídeo, targeting por interesse e otimização de conversão. |
| **22** | **A/B Testing Automático** | Cria variações de criativos, copies e públicos. Monitora métricas e automaticamente escala o vencedor e pausa o perdedor. |
| **23** | **Otimização de ROI/ROAS** | Analisa performance por campanha, adset e ad. Redistribui budget para maximizar retorno. Alerta quando CPA ultrapassa threshold. |
| **24** | **Pixel & Conversão Tracking** | Configura e monitora Meta Pixel, Google Tag, TikTok Pixel. Rastreia eventos de funil: view → click → lead → purchase. |
| **25** | **Geração de Criativos (Copy)** | Gera headlines, descrições, CTAs e scripts de vídeo otimizados para cada plataforma. Tom de luxo calibrado para o público-alvo. |
| **26** | **Relatório de Performance** | Gera relatórios diários/semanais com métricas-chave: impressões, CTR, CPC, CPM, CPA, ROAS, conversões. Gráficos e insights automáticos. |
| **27** | **Audience Lookalike & Retargeting** | Cria públicos lookalike a partir de clientes existentes. Configura retargeting por etapa do funil (visitou site, abandonou carrinho, comprou). |

---

## VENDAS & ATENDIMENTO (Skills 28–35)

| # | Skill | Como funciona |
|---|-------|---------------|
| **28** | **Qualificação de Leads (BANT)** | WhatsApp SDR Agent qualifica leads automaticamente: Budget, Authority, Need, Timeline. Classifica em Hot/Warm/Cold com score 0–100. |
| **29** | **Mensagens Personalizadas WhatsApp** | Envia mensagens via Evolution API com personalização: nome, produto de interesse, histórico. Tom profissional de concierge de luxo. |
| **30** | **Follow-up Automático** | Sequência de follow-ups programados: D+1 (lembrete), D+3 (oferta), D+7 (urgência), D+14 (reengajamento). Cada mensagem adaptada ao contexto. |
| **31** | **Tratamento de Objeções** | Banco de respostas para objeções comuns: preço alto, prazo de entrega, autenticidade, garantia. Respostas geradas por IA com argumentos persuasivos. |
| **32** | **Upsell & Cross-Sell** | Identifica oportunidades: quem comprou relógio → sugere pulseira extra. Quem buscou Rolex Submariner → sugere Omega Seamaster como alternativa. |
| **33** | **Pipeline CRM** | Gerencia leads em estágios: Novo → Qualificado → Proposta → Negociação → Fechado/Ganho ou Perdido. Métricas de conversão por estágio. |
| **34** | **Atendimento Multicanal** | Responde via WhatsApp, chat web (WebSocket), e potencialmente Instagram DM. Contexto unificado independente do canal. |
| **35** | **Catálogo Inteligente** | Envia catálogos personalizados baseados no perfil do lead: faixa de preço, marca preferida, estilo. Fotos, specs e preço formatados para WhatsApp. |

---

## EXPERTISE EM LUXO (Skills 36–41)

| # | Skill | Como funciona |
|---|-------|---------------|
| **36** | **Autenticação de Relógios** | Luxury Watch Agent analisa fotos e especificações para verificar autenticidade. Checa: movimento, acabamento, peso, gravação, serial number, documentação. |
| **37** | **Análise Técnica de Movimentos** | Identifica e descreve movimentos (Calibre 3135 Rolex, Cal. 324 Patek Philippe, etc.). Conhece specs: frequência, reserva de marcha, complicações. |
| **38** | **Precificação de Mercado** | Consulta preços de mercado secundário (Chrono24, WatchCharts). Informa preço retail vs. market, tendência de valorização/desvalorização. |
| **39** | **Detecção de Falsificações** | Identifica red flags de réplicas: fontes incorretas, lume fraco, peso errado, datewheel desalinhada, engravings superficiais. Gera relatório de risco. |
| **40** | **Consultoria de Investimento** | Analisa quais modelos estão valorizando (ex: Rolex GMT Pepsi, Patek Nautilus). Sugere compras com potencial de retorno baseado em dados históricos. |
| **41** | **Inteligência Competitiva** | Monitora concorrentes: preços, estoque, campanhas, novos lançamentos. Alerta quando concorrente baixa preço ou lança promoção. |

---

## CRESCIMENTO ORGÂNICO & SOCIAL (Skills 42–47)

| # | Skill | Como funciona |
|---|-------|---------------|
| **42** | **Geração de Conteúdo TikTok** | TikTok Growth Agent gera ideias de vídeos virais: unboxing, comparativos, "dia na vida", reviews, storytelling de luxo. Inclui roteiro e hashtags. |
| **43** | **Análise de Tendências & Hashtags** | Monitora hashtags trending no nicho de luxo. Identifica sons virais, formatos populares e timing ideal para postar. |
| **44** | **Otimização de Posting Schedule** | Analisa quando o público-alvo está mais ativo. Define calendário de postagem otimizado por dia e horário para máximo engajamento. |
| **45** | **Gestão de Engajamento** | Sugere respostas para comentários, identifica potenciais clientes nos comments, e propõe estratégias de duet/stitch com influencers. |
| **46** | **Coordenação Orgânico + Pago** | Sincroniza conteúdo orgânico do TikTok Growth com campanhas pagas do Advertising Agent. Viraliza organicamente → amplifica com budget. |
| **47** | **Métricas de Crescimento Social** | Rastreia followers, views, engagement rate, share rate, save rate. Identifica quais tipos de conteúdo performam melhor e porquê. |

---

## DADOS & AUTOMAÇÃO (Skills 48–50)

| # | Skill | Como funciona |
|---|-------|---------------|
| **48** | **Sync Automático de Dados** | Knowledge Sync Agent roda crons a cada 3 horas: atualiza preços de fornecedores, câmbio, preços de mercado, tendências. Tudo indexado no Qdrant para RAG. |
| **49** | **Automação de Workflows (n8n)** | Workflows visuais no n8n conectam eventos a ações: novo lead no WhatsApp → qualifica → cria no CRM → notifica vendedor. Webhooks para integrações externas. |
| **50** | **Backup & Recovery** | Backup automático de PostgreSQL e Qdrant. Recovery point a cada 6 horas. Dados de conversas, execuções de agentes e base de conhecimento protegidos. |

---

## Resumo Visual

```
┌──────────────────────────────────────────────────────────┐
│                    OPENCLAW / MAESTRO                     │
│                   Top 50 Skills Map                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │   CORE (10) │  │ IMPORT (8)  │  │ MARKETING (9)   │  │
│  │ Infra/Setup │  │ Supply Chain│  │ Ads & Creative   │  │
│  │ Chat/WS     │  │ Fornecedores│  │ Meta/Google/TT   │  │
│  │ RAG/Vector  │  │ Impostos    │  │ ROI/A-B Testing  │  │
│  │ Monitoring  │  │ Câmbio      │  │ Pixel/Tracking   │  │
│  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘  │
│         │                │                   │           │
│         └────────┬───────┴───────────┬───────┘           │
│                  │   ORCHESTRATOR    │                    │
│                  │      (COO)        │                    │
│                  └───────┬───────────┘                    │
│         ┌────────┬───────┴───────┬───────┐               │
│         │        │               │       │               │
│  ┌──────┴──────┐ │ ┌─────────┐ ┌┴──────────────┐        │
│  │ VENDAS (8)  │ │ │LUXO (6) │ │ SOCIAL (6)    │        │
│  │ WhatsApp    │ │ │Relógios  │ │ TikTok Growth │        │
│  │ CRM/Lead    │ │ │Autent.   │ │ Conteúdo      │        │
│  │ Follow-up   │ │ │Pricing   │ │ Tendências    │        │
│  └─────────────┘ │ └─────────┘ └───────────────┘        │
│                  │                                        │
│           ┌──────┴──────┐                                │
│           │ DADOS (3)   │                                │
│           │ Sync/Cron   │                                │
│           │ n8n/Backup  │                                │
│           └─────────────┘                                │
│                                                          │
│  Total: 50 Skills across 7 Categories                    │
└──────────────────────────────────────────────────────────┘
```

---

## Prioridade de Implementação

1. **Fase 1 — Fundação (Skills 1–10):** Infraestrutura, chat, RAG, monitoring
2. **Fase 2 — Revenue (Skills 28–35):** Vendas, WhatsApp, CRM, leads
3. **Fase 3 — Supply (Skills 11–18):** Importação, fornecedores, impostos
4. **Fase 4 — Growth (Skills 19–27):** Publicidade paga, criativos, ROI
5. **Fase 5 — Expertise (Skills 36–41):** Autenticação, precificação, investimento
6. **Fase 6 — Scale (Skills 42–50):** TikTok orgânico, automações, backup
