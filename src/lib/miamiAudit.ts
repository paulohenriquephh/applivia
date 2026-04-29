export type SourceCard = {
  title: string;
  kind: string;
  evidence: string;
  implication: string;
  url: string;
};

export type Criterion = {
  key: string;
  label: string;
  weight: number;
  whyItMatters: string;
  scores: {
    A: number;
    B: number;
    C: number;
  };
};

export type OptionCard = {
  key: "A" | "B" | "C";
  name: string;
  shortLabel: string;
  thesis: string;
  force: string;
  weakness: string;
  whereItMisleads: string;
  whoItLooksGoodForButIsNot: string;
  lethalWhen: string;
  trapWhen: string;
  unknownUnknowns: [string, string];
};

export const sources: SourceCard[] = [
  {
    title: "GMCVB 2025 annual meeting",
    kind: "Demanda primária",
    evidence:
      "Miami-Dade recebeu 28,2 milhões de visitantes entre julho de 2024 e junho de 2025, com US$ 21,3 bilhões em gasto do visitante.",
    implication:
      "Demanda existe e é grande; isso valida o mercado, mas não prova captura por uma locadora nova off-airport.",
    url: "https://www.miamiandbeaches.com/press-and-media/miami-press-releases/annual-meeting-2025-spotlights-achievements-and-2026-outlook",
  },
  {
    title: "Toyota RAV4 Hybrid 2025",
    kind: "Capex primário",
    evidence: "MSRP inicial oficial de US$ 32.850 por unidade.",
    implication:
      "Dois carros em caixa exigem capex base de US$ 65.700 antes de placa, preparação, telemática, seguro e working capital.",
    url: "https://toyota.com/rav4hybrid/2025",
  },
  {
    title: "Hertz Q1 2024 earnings release",
    kind: "Benchmark auditado",
    evidence:
      "Americas RAC com utilization de 77%, RPD de US$ 56,92 e depreciation per unit per month de US$ 649 em contexto de forte demanda.",
    implication:
      "Mesmo operador gigante e otimizado pode ter economics pressionada; narrativa de payback ultrarrápido precisa superar benchmark de forma consistente.",
    url: "https://www.sec.gov/Archives/edgar/data/1657853/000165785324000060/q12024earningsrelease.htm",
  },
  {
    title: "Hertz FY2025 earnings release",
    kind: "Benchmark auditado",
    evidence:
      "Utilization média de 81% em 2025, DPU de US$ 300 e DOE na faixa baixa dos US$ 30; a própria Hertz destaca foco em off-airport e mobility.",
    implication:
      "81% de utilization é excelente benchmark real; mesmo assim a operação não transforma 2 carros cash em payback total de 2,5 meses.",
    url: "https://www.sec.gov/Archives/edgar/data/1657853/000165785326000010/q42025earningsrelease.htm",
  },
  {
    title: "Florida DOR business tax registration",
    kind: "Compliance primário",
    evidence:
      "É obrigatório registrar antes de começar a cobrar/remeter Sales and Use Tax e Rental Car Surcharge.",
    implication:
      "Abertura em 24 horas sem trilha fiscal organizada é risco operacional e de passivo, não velocidade inteligente.",
    url: "https://floridarevenue.com/dor/taxes/registration.html",
  },
  {
    title: "Florida DOR surcharge brochure",
    kind: "Tributação primária",
    evidence:
      "Rental Car Surcharge é de US$ 2 por dia, separada na fatura, e ainda sofre sales tax e surtax aplicável.",
    implication:
      "Taxa cobrada do cliente não é margem; confundir receita bruta com receita econômica infla tese de payback.",
    url: "https://qas.floridarevenue.com/Forms_library/current/brochure/gt800037.pdf",
  },
  {
    title: "Florida commercial rent repeal",
    kind: "Tributação primária",
    evidence:
      "O sales tax estadual sobre aluguel comercial foi revogado a partir de 1/out/2025.",
    implication:
      "Existe vantagem real em ocupar imóvel comercial, mas isso não zera impostos sobre locação de veículos nem substitui unit economics.",
    url: "https://floridarevenue.com/taxes/tips/Documents/TIP_25A01-04.pdf",
  },
  {
    title: "Florida Statutes Chapter 220",
    kind: "Tributação primária",
    evidence:
      "A lei é explícita: não tributa natural persons residentes; já entidades corporativas podem ser tributadas.",
    implication:
      "“Flórida 0% income tax” é verdadeiro para pessoa física residente, mas não deve ser tratado como passe livre tributário universal.",
    url: "https://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&URL=0200-0299%2F0220%2F0220.html",
  },
  {
    title: "MIA permit procedures",
    kind: "Barreira operacional primária",
    evidence:
      "Operar com acesso ao aeroporto exige permit, US$ 2.000 de desembolso inicial, 7% de gross revenues, cobertura de seguro e processo que pode levar até 3 semanas.",
    implication:
      "A tese off-airport é mais rápida, mas aeroporto não é um botão opcional sem custo; se quiser essa demanda, há pedágio regulatório real.",
    url: "https://www.miami-airport.com/business_permits.asp",
  },
  {
    title: "Miami-Dade local business tax receipt",
    kind: "Licenciamento local",
    evidence:
      "Negócios em Miami-Dade precisam de Local Business Tax Receipt; em município, normalmente há recibo do condado e da cidade.",
    implication:
      "Operação local exige trilha básica de licenciamento e endereço operacional válido; improviso aumenta fricção.",
    url: "https://www.miamidade.gov/global/news-item.page?Mduid_news=news1602017472715893",
  },
  {
    title: "Open MyFlorida Business guide",
    kind: "Guia oficial",
    evidence:
      "O guia estadual classifica car rental em rental and leasing services e não aponta licença estadual específica de negócio como requisito padrão.",
    implication:
      "Isso enfraquece a crença de que dealer license é pré-requisito universal para começar; pode virar exigência apenas em outros modelos, não na locação simples.",
    url: "https://openmyfloridabusiness.gov/business/532/rental-and-leasing-services/?print=",
  },
];

export const criteria: Criterion[] = [
  {
    key: "unit",
    label: "Unit economics real depois de custo variável",
    weight: 18,
    whyItMatters:
      "Decide se a empresa está vendendo caixa ou queimando capital escondido em depreciação, damage e delivery.",
    scores: { A: 5, B: 2, C: 8 },
  },
  {
    key: "insurance",
    label: "Seguro e volatilidade de claims",
    weight: 16,
    whyItMatters:
      "Em locadora pequena, uma única perda severa pode destruir meses de margem e travar o scale-up.",
    scores: { A: 7, B: 3, C: 7 },
  },
  {
    key: "demand",
    label: "Captação de demanda sem depender do aeroporto",
    weight: 14,
    whyItMatters:
      "Mercado grande não significa share disponível; a pergunta é se uma operação nova consegue converter demanda em dias alugados.",
    scores: { A: 5, B: 8, C: 7 },
  },
  {
    key: "compliance",
    label: "Fricção regulatória e fiscal",
    weight: 10,
    whyItMatters:
      "Erros aqui comem caixa silenciosamente e podem matar a operação sem aparecer no topo do funil.",
    scores: { A: 8, B: 3, C: 8 },
  },
  {
    key: "ops",
    label: "Carga operacional e dependência do operador local",
    weight: 10,
    whyItMatters:
      "Com 2 carros, founder effort e admin quality têm mais impacto que marketing bonito ou automação teórica.",
    scores: { A: 4, B: 3, C: 6 },
  },
  {
    key: "capital",
    label: "Eficiência de capital e honestidade do payback",
    weight: 10,
    whyItMatters:
      "Capital mal definido gera a alucinação mais cara: confundir giro de caixa com retorno econômico do ativo.",
    scores: { A: 7, B: 2, C: 8 },
  },
  {
    key: "scale",
    label: "Escalabilidade depois da prova",
    weight: 8,
    whyItMatters:
      "Scale importa, mas só depois de provar ADR, utilization, claims e processo de reposição.",
    scores: { A: 3, B: 10, C: 7 },
  },
  {
    key: "channels",
    label: "Resiliência de canais e tese 'sem plataforma'",
    weight: 6,
    whyItMatters:
      "Sem plataforma não significa sem dependência; significa trocar dependência de marketplace por dependência de ads, SEO e parceiros.",
    scores: { A: 4, B: 8, C: 7 },
  },
  {
    key: "equity",
    label: "Equity e opcionalidade de revenda",
    weight: 4,
    whyItMatters:
      "O carro pode ser ativo estratégico ou âncora; isso depende de residual e liquidez de saída.",
    scores: { A: 6, B: 7, C: 6 },
  },
  {
    key: "optionality",
    label: "Opcionalidade estratégica e pivotabilidade",
    weight: 4,
    whyItMatters:
      "Quanto menor o custo de mudar rota, menor o preço de descobrir que a tese inicial estava errada.",
    scores: { A: 4, B: 8, C: 8 },
  },
];

export const options: OptionCard[] = [
  {
    key: "A",
    name: "A — Conservador ridículo",
    shortLabel: "A",
    thesis: "Começar pequeno, manter 2 carros e crescer só quando a prova operacional já estiver confortável.",
    force:
      "Minimiza risco de claims, simplifica compliance e compra tempo para aprender o mercado local.",
    weakness:
      "Aprende devagar, cria dependência desproporcional do admin e pode perder janela de demanda para concorrentes mais rápidos.",
    whereItMisleads:
      "Parece prudente, mas pode ser prudência passiva: baixa agressividade comercial pode mascarar tese ruim por tempo demais.",
    whoItLooksGoodForButIsNot:
      "Parece ideal para quem quer paz, mas não serve para quem precisa descobrir rápido se Miami realmente paga o spread da operação.",
    lethalWhen:
      "Vira arma letal quando seguro e claims ainda são caixas-pretas e o objetivo é preservar capital enquanto se mede ADR real.",
    trapWhen:
      "Vira armadilha quando a operação entra em modo artesanal permanente e nunca constrói engine de aquisição própria.",
    unknownUnknowns: [
      "Mudança súbita de mix de demanda por eventos ou sazonalidade pode fazer um microteste parecer estrutural quando não é.",
      "Admin local pode performar bem com 2 carros e colapsar no primeiro salto para 5-6 veículos.",
    ],
  },
  {
    key: "B",
    name: "B — Blitzscale nuclear",
    shortLabel: "B",
    thesis:
      "Usar 2 carros como cabeça de ponte e forçar expansão para 50+ em meses com parcerias, automação e reinvestimento total.",
    force:
      "Maximiza upside se o canal direto, o screening e o seguro estiverem excepcionalmente bem calibrados desde o começo.",
    weakness:
      "Aposta pesado antes de provar economics; acelera justamente as partes mais opacas da operação: claims, pricing, recondicionamento e fraude.",
    whereItMisleads:
      "Engana porque confunde TAM gigante com capacidade real de captura por uma operação nova sem brand, sem data própria e sem histórico de risco.",
    whoItLooksGoodForButIsNot:
      "Parece perfeito para perfis obcecados por scale, mas é ruim para qualquer operador que ainda não fechou quotes, playbook local e sourcing de demanda.",
    lethalWhen:
      "Vira arma letal apenas depois de uma prova curta e forte: ADR sustentado, utilization alta, claims baixos e reposição de frota já operacionalizados.",
    trapWhen:
      "Vira armadilha quando marketing, parcerias e financiamento começam a crescer mais rápido do que o controle de dano.",
    unknownUnknowns: [
      "Mudança de underwriting do broker ou da seguradora no meio do ramp pode quebrar economics da frota já comprada.",
      "Uma sequência de reviews ruins ou atrasos de entrega no início pode contaminar brand e CAC antes de existir reputação suficiente para resistir.",
    ],
  },
  {
    key: "C",
    name: "C — Beachhead agressivo disciplinado",
    shortLabel: "C",
    thesis:
      "Entrar com 2 carros, vender direto e por parceiros, mas só escalar após 21 dias de prova dura em seguro, claims, utilization e ADR.",
    force:
      "Preserva o upside da tese agressiva sem fingir que dados inexistentes já foram validados.",
    weakness:
      "Exige disciplina rara: segurar a mão quando a empolgação pede scale antes da hora.",
    whereItMisleads:
      "Pode parecer menos ambicioso do que é, quando na prática é o caminho mais curto para um blitzscale que não implode.",
    whoItLooksGoodForButIsNot:
      "Não é para operador sem apetite comercial; exige execução forte em parcerias, WhatsApp, inbound e pricing desde o dia 1.",
    lethalWhen:
      "Vira arma letal quando a prova de 21 dias bate quatro gates ao mesmo tempo: seguros fechados, utilization alta, ADR saudável e claims controlados.",
    trapWhen:
      "Vira armadilha se o operador usa a palavra 'teste' para adiar indefinidamente a expansão depois de dados já positivos.",
    unknownUnknowns: [
      "Dependência escondida de um ou dois parceiros grandes pode parecer canal próprio até a primeira renegociação de comissão.",
      "RAV4 Hybrid pode ter excelente saída no começo e depois sofrer com excesso de oferta relativa no micromercado local.",
    ],
  },
];

export const mapTruths = [
  "Verdade: o mercado é grande e a cidade suporta tese off-airport; isso não está em discussão.",
  "Verdade: a revogação do imposto estadual sobre aluguel comercial melhora overhead de base física a partir de outubro de 2025.",
  "Verdade: a Flórida não tributa natural persons residentes, mas essa frase é frequentemente usada de modo exagerado para vender margem que não existe.",
  "Falso consenso: '0% tax' nao significa zero carga tributária operacional; aluguel de carro continua com sales tax, discretionary surtax aplicável e rental car surcharge.",
  "Falso consenso: 'sem plataforma' nao significa independência; significa trocar dependência de Turo por dependência de ads, SEO, CRM, reputação, parceiros e atendimento.",
  "Ponto aberto decisivo: quotes reais de seguro com apetite para uma frota pequena operando Miami tourist traffic.",
  "Ponto aberto decisivo: taxa de conversão de canais diretos e parceiros sem permissao aeroportuária.",
  "Ponto aberto decisivo: capacidade do operador local em manter padrão de entrega, limpeza, cobrança e damage control sem virar gargalo.",
];

export const contradictions = [
  "Se a tese depende de aeroporto, o plano de 7 dias fica menos crível por causa de permit, seguro e fee de 7% sobre gross revenues.",
  "Se a tese depende de zero dívida, o salto para 50 carros em 6 meses fica muito mais difícil; reinvestimento puro a partir de 2 carros não fecha sozinho na maioria dos cenários honestos.",
  "Se o payback é de 2,5 meses sobre o capital total dos carros cash, a matemática exige geração de caixa por carro/dia incompatível com benchmarks auditados e até com cenários muito agressivos.",
  "Se o nicho brasileiro é o edge, o produto real não é apenas carro: é conveniência, confiança em português, entrega e resolução rápida de problema.",
];

export const actionChecklist = [
  "Fechar 3 quotes de seguro completos e comparar cobertura, deductible, exclusões e exigências de telemática.",
  "Operar 21 dias com 2 carros antes de qualquer scale-up acima de 4 carros.",
  "Definir ADR realizado, não tabela: diária líquida após descontos, upsells, delivery e cancelamentos.",
  "Separar métricas de receita do cliente e receita da empresa; tax e surcharge cobrados não entram como margem.",
  "Rodar canal mix mínimo com site próprio, WhatsApp, parceiros de hospedagem e um canal de liquidez residual para evitar carro parado.",
];

export const verdict = {
  title: "Veredito forense",
  short:
    "A tese de abrir locadora tradicional em Miami é plausível; a tese de blitzscale imediato com payback total de 2,5 meses, não.",
  recommendation:
    "A melhor decisão hoje é C: beachhead agressivo disciplinado. Entre rápido, mas só trate B como direito adquirido depois de prova operacional curta e brutal.",
  killerSentence:
    "B antes da prova não é ambição; é alavancar ignorância.",
};

export function weightedScore(optionKey: "A" | "B" | "C") {
  const total = criteria.reduce((acc, criterion) => {
    return acc + criterion.weight * criterion.scores[optionKey];
  }, 0);

  return total / 10;
}
