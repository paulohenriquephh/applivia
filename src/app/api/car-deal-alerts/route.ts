import { NextResponse } from "next/server";

const alertBlueprint = {
  name: "Miami Car Deal Hunter",
  thresholds: {
    triggerScore: 82,
    minimumDiscountPercent: 20,
    maximumDistanceMiles: 80,
    targetAlertSlaSeconds: 60,
  },
  domain: {
    primary: "deals.seudominio.com",
    recommendedHost: "deals.seudominio.com",
    productionChecklist: [
      "Comprar dominio ou criar subdominio dedicado",
      "Apontar CNAME para Vercel ou Cloudflare",
      "Configurar HTTPS automatico",
      "Configurar SPF, DKIM e DMARC para o dominio de e-mail",
    ],
  },
  channels: [
    {
      name: "whatsapp",
      provider: "Evolution API ou Twilio WhatsApp",
      trigger: "score >= 82",
      targetSlaSeconds: 60,
    },
    {
      name: "email",
      provider: "Resend ou SMTP transacional",
      trigger: "score >= 75 ou resumo diario",
      targetSlaSeconds: 180,
    },
  ],
  scoringModel: [
    { criterion: "discount_to_market", weight: 28, pass: ">= 20% below verified comparable" },
    { criterion: "seller_liquidity", weight: 18, pass: "credible urgency without coercive targeting" },
    { criterion: "title_vin_risk", weight: 16, pass: "clean title, VIN match, no odometer conflict" },
    { criterion: "rental_unit_economics", weight: 14, pass: "insurance, maintenance and ADR support profit" },
    { criterion: "closing_speed", weight: 10, pass: "seller accepts inspection and fast cash close" },
    { criterion: "reconditioning_cost", weight: 8, pass: "known repair budget below discount buffer" },
    { criterion: "resale_downside", weight: 6, pass: "quick resale path if rental thesis fails" },
  ],
  killSwitches: [
    "No VIN",
    "No clean title proof",
    "Seller refuses inspection",
    "Price is cheap because of hidden mechanical or legal risk",
    "Payment method suggests scam or chargeback risk",
  ],
  samplePayload: {
    vehicle: "2022 Toyota RAV4 Hybrid XLE",
    askingPrice: 23900,
    verifiedMarketPrice: 30500,
    discountPercent: 22,
    score: 88,
    action: "Send WhatsApp and email immediately",
  },
  sampleDeals: [
    {
      vehicle: "2022 Toyota RAV4 Hybrid XLE",
      market: "$30,500",
      target: "$23,900",
      discount: "22%",
      score: 88,
      action: "WhatsApp imediato + inspeção móvel",
    },
    {
      vehicle: "2021 Toyota Camry Hybrid LE",
      market: "$24,800",
      target: "$18,900",
      discount: "24%",
      score: 85,
      action: "E-mail + ligação em 5 minutos",
    },
    {
      vehicle: "2020 Toyota Highlander Hybrid",
      market: "$32,000",
      target: "$25,500",
      discount: "20%",
      score: 82,
      action: "Reservar inspeção e negociar título",
    },
  ],
};

export async function GET() {
  return NextResponse.json(alertBlueprint);
}
