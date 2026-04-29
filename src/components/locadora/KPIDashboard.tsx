"use client";

import { useState } from "react";

interface CarData {
  id: string;
  modelo: string;
  placa: string;
  status: "disponivel" | "alugado" | "manutencao" | "inativo";
  km: number;
  ultimaRevisao: string;
  rendimentoMes: number;
  diasAlugadoMes: number;
}

interface BookingData {
  id: string;
  cliente: string;
  carro: string;
  dataInicio: string;
  dataFim: string;
  valor: number;
  status: "confirmado" | "ativo" | "concluido" | "cancelado";
  origem: "direto" | "parceiro" | "google" | "indicacao";
}

const INITIAL_CARS: CarData[] = [
  {
    id: "c1",
    modelo: "RAV4 Hybrid 2025",
    placa: "ABC-1234",
    status: "alugado",
    km: 8420,
    ultimaRevisao: "2026-03-15",
    rendimentoMes: 2040,
    diasAlugadoMes: 24,
  },
  {
    id: "c2",
    modelo: "RAV4 Hybrid 2024",
    placa: "XYZ-5678",
    status: "disponivel",
    km: 12850,
    ultimaRevisao: "2026-02-28",
    rendimentoMes: 1904,
    diasAlugadoMes: 22,
  },
];

const INITIAL_BOOKINGS: BookingData[] = [
  {
    id: "b1",
    cliente: "Carlos Silva",
    carro: "RAV4 Hybrid 2025",
    dataInicio: "2026-04-25",
    dataFim: "2026-05-05",
    valor: 680,
    status: "ativo",
    origem: "parceiro",
  },
  {
    id: "b2",
    cliente: "Maria Ferreira",
    carro: "RAV4 Hybrid 2024",
    dataInicio: "2026-05-02",
    dataFim: "2026-05-07",
    valor: 340,
    status: "confirmado",
    origem: "indicacao",
  },
  {
    id: "b3",
    cliente: "John Martinez",
    carro: "RAV4 Hybrid 2024",
    dataInicio: "2026-04-20",
    dataFim: "2026-04-28",
    valor: 544,
    status: "concluido",
    origem: "google",
  },
];

function statusColor(status: CarData["status"]) {
  const colors = {
    alugado: "bg-green-700 text-green-200",
    disponivel: "bg-blue-700 text-blue-200",
    manutencao: "bg-yellow-700 text-yellow-200",
    inativo: "bg-neutral-700 text-neutral-400",
  };
  return colors[status];
}

function bookingStatusColor(status: BookingData["status"]) {
  const colors = {
    ativo: "bg-green-700 text-green-200",
    confirmado: "bg-blue-700 text-blue-200",
    concluido: "bg-neutral-700 text-neutral-300",
    cancelado: "bg-red-800 text-red-200",
  };
  return colors[status];
}

function origemIcon(origem: BookingData["origem"]) {
  const icons = { direto: "📞", parceiro: "🤝", google: "🔍", indicacao: "👥" };
  return icons[origem];
}

export default function KPIDashboard() {
  const [cars] = useState<CarData[]>(INITIAL_CARS);
  const [bookings] = useState<BookingData[]>(INITIAL_BOOKINGS);

  // KPIs calculados
  const totalCars = cars.length;
  const activeCars = cars.filter((c) => c.status === "alugado").length;
  const utilizationRate = Math.round((activeCars / totalCars) * 100);
  const monthlyRevenue = cars.reduce((s, c) => s + c.rendimentoMes, 0);
  const avgDailyRevenue = Math.round(monthlyRevenue / 30);
  const totalDaysRented = cars.reduce((s, c) => s + c.diasAlugadoMes, 0);
  const avgUtilPerCar = Math.round(totalDaysRented / totalCars);
  const utilizationPct = Math.round((avgUtilPerCar / 30) * 100);

  // Lucro estimado (20% admin, $800 seguro, $280 manutenção)
  const estimatedProfit = Math.round(monthlyRevenue * 0.80 - 800 - 280 - (totalCars * 85));

  const bookingsByOrigin = bookings.reduce(
    (acc, b) => {
      acc[b.origem] = (acc[b.origem] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const kpis = [
    {
      label: "Frota Total",
      value: totalCars,
      unit: "carros",
      target: "2 → 50",
      ok: true,
    },
    {
      label: "Utilização Hoje",
      value: utilizationRate,
      unit: "%",
      target: ">80%",
      ok: utilizationRate >= 80,
    },
    {
      label: "Util. Mensal",
      value: utilizationPct,
      unit: "%",
      target: ">85%",
      ok: utilizationPct >= 70,
    },
    {
      label: "Receita Mês",
      value: `$${monthlyRevenue.toLocaleString()}`,
      unit: "",
      target: "$4K+",
      ok: monthlyRevenue >= 3000,
    },
    {
      label: "Lucro Est. Mês",
      value: `$${estimatedProfit.toLocaleString()}`,
      unit: "",
      target: "$1.5K+",
      ok: estimatedProfit >= 1000,
    },
    {
      label: "Receita/Dia Média",
      value: `$${avgDailyRevenue}`,
      unit: "",
      target: "$130+",
      ok: avgDailyRevenue >= 100,
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">📊</span> Dashboard Operacional
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {kpis.map((kpi, i) => (
            <div
              key={i}
              className={`bg-neutral-800 rounded-xl p-4 border ${
                kpi.ok ? "border-neutral-700" : "border-red-800"
              }`}
            >
              <p className="text-xs text-neutral-400 mb-1">{kpi.label}</p>
              <p className="text-2xl font-bold text-white">
                {kpi.value}
                {kpi.unit && <span className="text-lg text-neutral-400 ml-1">{kpi.unit}</span>}
              </p>
              <p className={`text-xs mt-1 ${kpi.ok ? "text-green-400" : "text-red-400"}`}>
                {kpi.ok ? "✓" : "⚠️"} Meta: {kpi.target}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Trigger Alert */}
      {utilizationPct < 70 && (
        <div className="bg-red-950/50 rounded-xl p-4 border border-red-700">
          <p className="text-red-400 font-bold text-sm">🚨 TRIGGER 21 DIAS ATIVADO</p>
          <p className="text-xs text-red-300 mt-1">
            Utilização {utilizationPct}% abaixo do mínimo 70%. Executar: 1) Review parceiros 2) Ativar Turo backup 3) Revisar preços
          </p>
        </div>
      )}

      {utilizationPct >= 70 && utilizationPct < 80 && (
        <div className="bg-yellow-950/50 rounded-xl p-4 border border-yellow-800">
          <p className="text-yellow-400 font-bold text-sm">⚠️ ATENÇÃO: Utilização abaixo de 80%</p>
          <p className="text-xs text-yellow-300 mt-1">
            Utilização {utilizationPct}%. Meta: 80%+. Ativar promoções semanais + follow-up parceiros.
          </p>
        </div>
      )}

      {/* Frota */}
      <div className="bg-neutral-800 rounded-xl p-5 border border-neutral-700">
        <h3 className="text-sm font-bold text-white mb-3">🚗 Status da Frota</h3>
        <div className="space-y-3">
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-neutral-900 rounded-lg p-4 border border-neutral-700 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-white">{car.modelo}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${statusColor(car.status)}`}>
                    {car.status}
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  {car.placa} · {car.km.toLocaleString()} km · Revisão: {car.ultimaRevisao}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white">${car.rendimentoMes.toLocaleString()}/mês</p>
                <p className="text-xs text-neutral-400">{car.diasAlugadoMes}/30 dias ({Math.round((car.diasAlugadoMes/30)*100)}% util)</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reservas recentes */}
      <div className="bg-neutral-800 rounded-xl p-5 border border-neutral-700">
        <h3 className="text-sm font-bold text-white mb-3">📅 Reservas Recentes</h3>
        <div className="space-y-2">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-neutral-900 rounded-lg p-3 border border-neutral-700 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm">{origemIcon(b.origem)}</span>
                  <p className="text-sm text-white">{b.cliente}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${bookingStatusColor(b.status)}`}>
                    {b.status}
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  {b.carro} · {b.dataInicio} → {b.dataFim}
                </p>
              </div>
              <p className="text-sm font-bold text-green-400">${b.valor}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Origem das reservas */}
      <div className="bg-neutral-800 rounded-xl p-5 border border-neutral-700">
        <h3 className="text-sm font-bold text-white mb-3">📈 Origem das Reservas</h3>
        <div className="grid grid-cols-4 gap-3">
          {Object.entries(bookingsByOrigin).map(([origem, count]) => (
            <div key={origem} className="bg-neutral-900 rounded-lg p-3 text-center border border-neutral-700">
              <p className="text-2xl mb-1">{origemIcon(origem as BookingData["origem"])}</p>
              <p className="text-xl font-bold text-white">{count}</p>
              <p className="text-xs text-neutral-400 capitalize">{origem}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Guardrails monitor */}
      <div className="bg-neutral-800 rounded-xl p-5 border border-neutral-700">
        <h3 className="text-sm font-bold text-white mb-3">🛡️ Monitor Guardrails Nucleares</h3>
        <div className="space-y-2">
          {[
            { label: "Seguro total/mês", atual: "$760", meta: "<$840", ok: true },
            { label: "Utilização mensal", atual: `${utilizationPct}%`, meta: ">70%", ok: utilizationPct >= 70 },
            { label: "NPS estimado", atual: "4.8", meta: ">4.5", ok: true },
            { label: "Tempo resp. WhatsApp", atual: "18 min", meta: "<30 min", ok: true },
            { label: "Dealer license", atual: "Em processo", meta: "Antes 5+ carros", ok: true },
            { label: "Tourist Dev. Tax", atual: "Registrado", meta: "D1 obrigatório", ok: true },
          ].map((g, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-2 rounded-lg ${
                g.ok ? "bg-green-950/20" : "bg-red-950/20"
              }`}
            >
              <span className="text-xs text-neutral-300">{g.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-400">Meta: {g.meta}</span>
                <span className={`text-xs font-bold ${g.ok ? "text-green-400" : "text-red-400"}`}>
                  {g.ok ? "✓" : "✗"} {g.atual}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
