// Gerador de contrato admin 20% KPIs – locadora Miami nuclear

export interface ContratoParams {
  nomeAdmin: string;
  cpfAdmin: string;
  enderecoAdmin: string;
  nomeLocadora: string;
  cnpjLocadora: string;
  enderecoLocadora: string;
  dataInicio: string;
  adminPercent: number;
  bonusOccupancy: number; // % extra se occupancy > 90%
  bondValor: number;
  prazoContrato: number; // meses
}

export const DEFAULT_CONTRATO: ContratoParams = {
  nomeAdmin: 'Gabriel [Sobrenome]',
  cpfAdmin: 'XXX.XXX.XXX-XX',
  enderecoAdmin: '[Endereço completo]',
  nomeLocadora: '[Nome da LLC]',
  cnpjLocadora: '[EIN da LLC]',
  enderecoLocadora: 'Miami, FL [endereço]',
  dataInicio: new Date().toLocaleDateString('pt-BR'),
  adminPercent: 20,
  bonusOccupancy: 5,
  bondValor: 10000,
  prazoContrato: 12,
};

export function gerarContrato(params: ContratoParams): string {
  return `
CONTRATO DE ADMINISTRAÇÃO OPERACIONAL COM KPIs
Locadora de Veículos – Miami, Florida, EUA

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PARTES

CONTRATANTE: ${params.nomeLocadora}
EIN: ${params.cnpjLocadora}
Endereço: ${params.enderecoLocadora}
("A Empresa")

CONTRATADO: ${params.nomeAdmin}
SSN/ITIN: ${params.cpfAdmin}
Endereço: ${params.enderecoAdmin}
("O Administrador")

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. OBJETO

1.1 O presente contrato regula a prestação de serviços de administração operacional 
on-site da frota de veículos da Empresa em Miami, Flórida.

1.2 Escopo de serviços:
  a) Recebimento e entrega de veículos (pickup/dropoff)
  b) Inspeção pré e pós-aluguel (fotográfica obrigatória)
  c) Limpeza e detalhamento de veículos
  d) Coordenação de manutenção preventiva e corretiva
  e) Atendimento ao cliente (WhatsApp, telefone, presencial)
  f) Gestão de reservas no sistema designado (ex: Rent Centric, HQ Rental)
  g) Reporte diário de métricas ao proprietário via dashboard

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. REMUNERAÇÃO

2.1 COMISSÃO BASE: ${params.adminPercent}% (${params.adminPercent} por cento) da 
receita bruta mensal verificada no sistema de reservas.

2.2 BÔNUS DE DESEMPENHO (KPI Occupancy):
  - Se occupancy média mensal ≥ 90%: +${params.bonusOccupancy}% adicional sobre receita bruta
  - Se occupancy média mensal ≥ 95%: +${params.bonusOccupancy * 2}% adicional sobre receita bruta
  - Bônus é calculado e pago no dia 15 do mês subsequente

2.3 DEDUÇÃO POR NÃO-CONFORMIDADE:
  - NPS médio < 4.5/5.0: -2% da comissão base do mês
  - 2+ claims de dano por negligência operacional comprovada: -5% da comissão base
  - Reserva sem inspeção fotográfica documentada: -$50 por ocorrência

2.4 Pagamento via ACH ou Zelle até o dia 10 de cada mês referente ao mês anterior.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. KPIs OBRIGATÓRIOS

3.1 UTILIZAÇÃO (Occupancy Rate):
  - Meta mínima: 80% (avaliada por média móvel de 30 dias)
  - Meta performance: 90%+
  - Trigger de rescisão: <65% por 2 meses consecutivos

3.2 NET PROMOTER SCORE (NPS):
  - Meta mínima: 4.5/5.0 (Google Reviews + feedback direto)
  - Trigger de revisão: <4.3 por 1 mês
  - Trigger de rescisão: <4.0 por 2 meses consecutivos

3.3 CHURN DE CLIENTES:
  - Meta máxima: 10% de cancelamentos/mês (vs reservas confirmadas)

3.4 TEMPO DE RESPOSTA:
  - WhatsApp/mensagens: máximo 15 minutos em horário comercial (8h-22h)
  - Pickup/dropoff: máximo 30 minutos de atraso permitido

3.5 INSPEÇÕES FOTOGRÁFICAS:
  - 100% dos veículos antes e depois de cada aluguel
  - Upload no sistema em até 2 horas após entrega

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. OBRIGAÇÕES DO ADMINISTRADOR

4.1 Disponibilidade 24/7 on-call (com direito a 1 folga/semana acordada previamente)
4.2 Manter fiança (Performance Bond) de $${params.bondValor.toLocaleString()} em vigor
4.3 Não contratar subadmins sem aprovação escrita prévia da Empresa
4.4 Não aceitar pagamentos em cash diretamente (apenas via sistema)
4.5 Reportar qualquer acidente ou incidente em até 2 horas (por WhatsApp + foto)
4.6 Manter sigilo absoluto sobre lista de clientes, preços e estratégias

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. OBRIGAÇÕES DA EMPRESA

5.1 Fornecer veículos em plenas condições de uso, com seguro ativo
5.2 Pagar comissão nos prazos estipulados
5.3 Fornecer acesso ao sistema de gestão de frotas
5.4 Comunicar expansões de frota com mínimo 7 dias de antecedência
5.5 Cobrir custo de ferramentas operacionais aprovadas previamente

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. CLÁUSULA DE RESCISÃO

6.1 RESCISÃO COM CAUSA IMEDIATA pela Empresa:
  - Fraude, desvio de recursos ou clientes
  - Crime ou conduta antiética comprovada
  - Ocupação <65% por 2 meses consecutivos
  - NPS <4.0 por 2 meses consecutivos
  - Violação de confidencialidade

6.2 RESCISÃO SEM CAUSA: 30 dias de aviso prévio por escrito, com pagamento 
integral do mês em andamento.

6.3 TRIGGER DE 21 DIAS (Cláusula Nuclear):
Nos primeiros 21 dias, se occupancy for <60%, a Empresa pode renegociar termos 
ou rescindir com 7 dias de aviso e pagamento proporcional, sem penalidade.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. CLASSIFICAÇÃO DO CONTRATADO

7.1 O Administrador é contratado como INDEPENDENT CONTRACTOR (1099), não como 
employee (W-2), conforme IRS guidelines e FL labor law.

7.2 O Administrador é responsável por seus próprios impostos, benefícios e seguro 
de saúde.

7.3 A Empresa emitirá Form 1099-NEC se pagamentos totais anuais ≥ $600.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. JURISDIÇÃO

8.1 Este contrato é regido pelas leis do Estado da Florida, EUA.
8.2 Foro: Miami-Dade County Circuit Court ou AAA Arbitration (escolha da Empresa).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. VIGÊNCIA

9.1 Início: ${params.dataInicio}
9.2 Duração: ${params.prazoContrato} meses com renovação automática por igual período
9.3 Revisão de KPIs e comissão: trimestral, por acordo mútuo escrito

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ASSINATURAS

_________________________________          Data: ___/___/______
${params.nomeLocadora}
Representante Legal

_________________________________          Data: ___/___/______
${params.nomeAdmin}
Administrador

TESTEMUNHA 1: _____________________   CPF/ID: ________________

TESTEMUNHA 2: _____________________   CPF/ID: ________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NOTA: Este contrato é um template. Consulte um attorney FL antes de assinar.
Este documento não constitui assessoria jurídica.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`.trim();
}
