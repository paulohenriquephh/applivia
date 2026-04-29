"use client";

import { useState } from "react";

export default function ContratoGenerator() {
  const [loading, setLoading] = useState(false);
  const [contrato, setContrato] = useState<string | null>(null);
  const [form, setForm] = useState({
    nomeAdmin: "Gabriel Santos",
    cpfAdmin: "XXX-XX-XXXX",
    enderecoAdmin: "Miami, FL 33132",
    emailAdmin: "gabriel@miamicars.com",
    telefoneAdmin: "+1 (305) 000-0000",
    nomeEmpresa: "Miami Car Rental LLC",
    einEmpresa: "XX-XXXXXXX",
    dataInicio: new Date().toLocaleDateString("en-US"),
    numCarros: 2,
    percentualAdmin: 20,
    bonusUtil: 90,
    bonusValor: 1500,
    trigger21dias: true,
    kpiOccupancy: 90,
    kpiNPS: 4.8,
    kpiChurn: 5,
  });

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contrato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setContrato(data.contrato);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (contrato) navigator.clipboard.writeText(contrato);
  };

  const F = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const val = e.target.type === "checkbox"
      ? (e.target as HTMLInputElement).checked
      : e.target.type === "number"
      ? Number(e.target.value)
      : e.target.value;
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">📄</span> Gerador de Contrato Admin
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Nome do Operador">
            <input
              type="text"
              value={form.nomeAdmin}
              onChange={F("nomeAdmin")}
              className="input-field"
            />
          </Field>
          <Field label="SSN/ITIN Operador">
            <input type="text" value={form.cpfAdmin} onChange={F("cpfAdmin")} className="input-field" />
          </Field>
          <Field label="Endereço Operador">
            <input type="text" value={form.enderecoAdmin} onChange={F("enderecoAdmin")} className="input-field" />
          </Field>
          <Field label="Email Operador">
            <input type="email" value={form.emailAdmin} onChange={F("emailAdmin")} className="input-field" />
          </Field>
          <Field label="Nome da LLC">
            <input type="text" value={form.nomeEmpresa} onChange={F("nomeEmpresa")} className="input-field" />
          </Field>
          <Field label="EIN da LLC">
            <input type="text" value={form.einEmpresa} onChange={F("einEmpresa")} className="input-field" />
          </Field>
          <Field label="Comissão Admin (%)">
            <input
              type="number"
              value={form.percentualAdmin}
              onChange={F("percentualAdmin")}
              min={10}
              max={35}
              className="input-field"
            />
          </Field>
          <Field label="Bônus Mensal ($)">
            <input
              type="number"
              value={form.bonusValor}
              onChange={F("bonusValor")}
              step={250}
              className="input-field"
            />
          </Field>
          <Field label="Util. mínima para bônus (%)">
            <input
              type="number"
              value={form.bonusUtil}
              onChange={F("bonusUtil")}
              min={70}
              max={95}
              className="input-field"
            />
          </Field>
          <Field label="KPI: Occupancy mínimo (%)">
            <input
              type="number"
              value={form.kpiOccupancy}
              onChange={F("kpiOccupancy")}
              min={60}
              max={95}
              className="input-field"
            />
          </Field>
          <Field label="KPI: NPS mínimo">
            <input
              type="number"
              value={form.kpiNPS}
              onChange={F("kpiNPS")}
              step={0.1}
              min={3.0}
              max={5.0}
              className="input-field"
            />
          </Field>
          <Field label="KPI: Churn máximo (%)">
            <input
              type="number"
              value={form.kpiChurn}
              onChange={F("kpiChurn")}
              min={1}
              max={20}
              className="input-field"
            />
          </Field>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <input
            type="checkbox"
            id="trigger21"
            checked={form.trigger21dias}
            onChange={F("trigger21dias")}
            className="w-4 h-4"
          />
          <label htmlFor="trigger21" className="text-sm text-neutral-300">
            Ativar cláusula trigger 21 dias (util &lt;70% = revisão imediata)
          </label>
        </div>

        <button
          onClick={generate}
          disabled={loading}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-600 text-white font-bold py-3 rounded-lg transition-colors text-sm"
        >
          {loading ? "⚙️ Gerando..." : "📋 GERAR CONTRATO"}
        </button>
      </div>

      {contrato && (
        <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-white">Contrato Gerado</h3>
            <button
              onClick={copyToClipboard}
              className="text-xs bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1 rounded transition-colors"
            >
              📋 Copiar
            </button>
          </div>
          <pre className="text-xs text-neutral-300 font-mono whitespace-pre-wrap overflow-auto max-h-96 bg-neutral-900 rounded-lg p-4 border border-neutral-700">
            {contrato}
          </pre>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-neutral-400 block mb-1">{label}</label>
      {children}
    </div>
  );
}
