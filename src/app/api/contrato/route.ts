import { NextRequest, NextResponse } from "next/server";

interface ContratoParams {
  nomeAdmin: string;
  cpfAdmin: string;
  enderecoAdmin: string;
  emailAdmin: string;
  telefoneAdmin: string;
  nomeEmpresa: string;
  einEmpresa: string;
  dataInicio: string;
  numCarros: number;
  percentualAdmin: number;
  bonusUtil: number; // % util para ganhar bônus
  bonusValor: number; // valor do bônus mensal
  trigger21dias: boolean;
  kpiOccupancy: number;
  kpiNPS: number;
  kpiChurn: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContratoParams = await request.json();
    const {
      nomeAdmin = "Gabriel Santos",
      cpfAdmin = "XXX-XX-XXXX",
      enderecoAdmin = "Miami, FL",
      emailAdmin = "gabriel@locadora.com",
      telefoneAdmin = "+1 (305) 000-0000",
      nomeEmpresa = "Miami Car Rental LLC",
      einEmpresa = "XX-XXXXXXX",
      dataInicio = new Date().toLocaleDateString("en-US"),
      numCarros = 2,
      percentualAdmin = 20,
      bonusUtil = 90,
      bonusValor = 1500,
      trigger21dias = true,
      kpiOccupancy = 90,
      kpiNPS = 4.8,
      kpiChurn = 5,
    } = body;

    const contrato = `
================================================================================
        OPERATIONAL MANAGEMENT AGREEMENT — RENTAL FLEET
        ${nomeEmpresa} | EIN: ${einEmpresa}
================================================================================
Date: ${dataInicio}
State: Florida, United States

PARTIES:
--------
COMPANY: ${nomeEmpresa}, a Florida Limited Liability Company
         EIN: ${einEmpresa}

OPERATOR: ${nomeAdmin}
          SSN/ITIN: ${cpfAdmin}
          Address: ${enderecoAdmin}
          Email: ${emailAdmin}
          Phone: ${telefoneAdmin}

================================================================================
1. SCOPE OF SERVICES
================================================================================

The Operator agrees to manage a rental vehicle fleet of ${numCarros} vehicle(s) 
on behalf of the Company, including but not limited to:

  a) Daily vehicle inspections and pre/post-rental condition documentation
  b) Customer check-in and check-out (in-person and remote)
  c) Key management and delivery logistics
  d) Coordination with insurance broker for claims (within 24h)
  e) Vehicle maintenance scheduling (oil change, tires, detailing)
  f) Daily fuel/charge level maintenance (minimum 80% EV / ¾ tank hybrid)
  g) Response to customer inquiries via WhatsApp/Phone (max response: 30 min)
  h) Collection of signed rental agreements and ID documentation per FL law
  i) Daily revenue and utilization reporting via AI dashboard
  j) Partnership coordination (Airbnb hosts, hotel concierge, cruise port)

================================================================================
2. COMPENSATION
================================================================================

  Base Commission: ${percentualAdmin}% of gross monthly revenue (paid by 5th of following month)
  
  Performance Bonus: $${bonusValor.toLocaleString()}/month when fleet utilization exceeds ${bonusUtil}%
  
  Occupancy Bonus Structure:
    - ${bonusUtil}%–94%: $${bonusValor.toLocaleString()}/month
    - 95%+: $${Math.round(bonusValor * 1.5).toLocaleString()}/month (1.5x multiplier)
    - Below ${bonusUtil - 10}%: No bonus + mandatory Performance Improvement Plan (PIP)

  Deductions (from Operator commission):
    - Unreported accidents/damage: 100% of deductible cost
    - Late reporting (>24h) to insurance: $250/incident
    - Customer complaint resolution failure (NPS <4.0): $150/incident

================================================================================
3. KEY PERFORMANCE INDICATORS (KPIs) — LEGALLY BINDING
================================================================================

The Operator MUST maintain the following metrics, measured monthly:

  ┌─────────────────────────────┬──────────────────┬──────────────────────┐
  │ KPI                         │ Target           │ Minimum (PIP Trigger)│
  ├─────────────────────────────┼──────────────────┼──────────────────────┤
  │ Fleet Occupancy Rate        │ ≥${kpiOccupancy}%          │ <${kpiOccupancy - 15}% (2 months)      │
  │ Net Promoter Score (NPS)    │ ≥${kpiNPS}           │ <4.5 (1 month)       │
  │ Customer Churn Rate         │ <${kpiChurn}%           │ >10% (1 month)       │
  │ Incident Response Time      │ <30 minutes      │ >60 min (3 incidents)│
  │ Documentation Completion    │ 100%             │ <95% (any month)     │
  │ Vehicle Availability (7am)  │ 100%             │ <98% (any week)      │
  └─────────────────────────────┴──────────────────┴──────────────────────┘

================================================================================
4. 21-DAY PERFORMANCE TRIGGER ${trigger21dias ? "(ACTIVE)" : "(WAIVED)"}
================================================================================
${
  trigger21dias
    ? `
  If fleet utilization falls below 70% for any rolling 21-day period:
  
  STEP 1 (Day 21): Written notice to Operator + mandatory strategy session
  STEP 2 (Day 28): Operator must present written remediation plan
  STEP 3 (Day 35): If utilization still <70%, Company may:
    - Reduce fleet to 1 vehicle (minimum viable operation)
    - List 1 vehicle on Turo Luxury program
    - Replace Operator with 30-day notice + 1 month severance
    - Pivot to hybrid model (off-airport + Turo)
  
  This trigger is NON-NEGOTIABLE and reflects market reality.
  Benchmark: Miami off-airport independents achieve 70-85% (Rentscout 2026).
`
    : "  21-Day trigger clause has been waived by mutual agreement.\n"
}

================================================================================
5. INSURANCE & LIABILITY
================================================================================

  a) Company maintains minimum $1,000,000 commercial auto liability (FL minimum: $25K)
  b) Operator is NOT personally liable for third-party claims IF:
     - Proper rental agreement was signed by renter
     - Driver was >25 years old with valid license (documented)
     - No renter under the influence (documented refusal if suspected)
  c) Operator IS liable for:
     - Damage caused while Operator (not renter) was operating vehicle
     - Incidents not reported within 24 hours
     - Renting to unauthorized drivers
  d) Telematics device (Spireon/GPS) MUST remain active on all vehicles at all times
  e) Operator must take post-rental photos (minimum 8 angles) using Company app

================================================================================
6. INTELLECTUAL PROPERTY & CONFIDENTIALITY
================================================================================

  a) Customer database is sole property of ${nomeEmpresa}
  b) Pricing algorithms and partner agreements are CONFIDENTIAL
  c) Operator may not solicit Company customers for personal business
  d) Non-compete: 12 months post-termination within Miami-Dade/Broward counties
  e) WhatsApp group data, Airbnb reviews, and Google ratings belong to Company

================================================================================
7. TERM & TERMINATION
================================================================================

  Initial Term: 6 months from ${dataInicio}, auto-renewing monthly
  
  Termination by Company (with cause):
    - Immediate for theft, fraud, or criminal conviction
    - 14 days for KPI failure (2 consecutive months below minimum)
    - 30 days for any other reason
  
  Termination by Operator:
    - 30 days written notice
    - Full handover of vehicles, keys, customer documentation
    - Final settlement within 15 days of termination

================================================================================
8. GOVERNING LAW
================================================================================

  This agreement is governed by the laws of the State of Florida.
  Disputes shall be resolved via binding arbitration in Miami-Dade County.
  Each party waives right to jury trial.

================================================================================
9. SIGNATURES
================================================================================

  COMPANY Representative:
  ________________________    Date: ___________
  ${nomeEmpresa}

  OPERATOR:
  ________________________    Date: ___________
  ${nomeAdmin}

  WITNESS:
  ________________________    Date: ___________
  Name: ___________________

================================================================================
  NOTARIZATION (recommended for amounts >$10K/month)
================================================================================

  State of Florida, County of Miami-Dade

  Sworn before me this ___ day of _______, 2026

  ________________________
  Notary Public
  Commission expires: ___________

================================================================================
EXHIBIT A — VEHICLE SCHEDULE (attached separately per vehicle)
EXHIBIT B — INSURANCE CERTIFICATES (attached from broker)
EXHIBIT C — KPI MEASUREMENT METHODOLOGY (AI dashboard screenshots)
================================================================================
`;

    return NextResponse.json({ contrato: contrato.trim() });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
