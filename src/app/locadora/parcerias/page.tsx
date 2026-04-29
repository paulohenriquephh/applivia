'use client';

import { useState } from 'react';
import { SCRIPTS_PARCERIAS, CHECKLIST_7_DIAS } from '@/lib/parcerias-scripts';

export default function ParceriasPage() {
  const [scriptAtivo, setScriptAtivo] = useState(0);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const copiar = (texto: string, idx: number) => {
    navigator.clipboard.writeText(texto);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const corPrioridade = (p: string) => ({
    CRITICO: 'bg-red-900/40 text-red-300 border-red-500/30',
    ALTO: 'bg-orange-900/40 text-orange-300 border-orange-500/30',
    MEDIO: 'bg-gray-800 text-gray-400 border-gray-600/30',
  })[p] ?? 'bg-gray-800 text-gray-400';

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/locadora" className="text-gray-500 hover:text-gray-300 text-sm">← Voltar</a>
          <h1 className="text-3xl font-black mt-2">🤝 Scripts de Parcerias & Marketing</h1>
          <p className="text-gray-400 mt-1">5 canais · PT + EN + ES · Comissão 8-10% · Copy-paste ready</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Seletor de scripts */}
          <div className="space-y-2">
            {SCRIPTS_PARCERIAS.map((s, i) => (
              <button
                key={i}
                onClick={() => setScriptAtivo(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  scriptAtivo === i
                    ? 'bg-green-950/50 border-green-500/50 text-green-200'
                    : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                <div className="font-bold text-sm">{s.tipo}</div>
                <div className="text-xs mt-1 opacity-70">{s.canal}</div>
                <div className="text-xs mt-2 text-green-400/80">{s.kpiAlvo}</div>
              </button>
            ))}
          </div>

          {/* Script ativo */}
          <div className="lg:col-span-2 space-y-4">
            {SCRIPTS_PARCERIAS[scriptAtivo] && (() => {
              const s = SCRIPTS_PARCERIAS[scriptAtivo];
              return (
                <>
                  <div className="p-5 bg-gray-900 border border-gray-700 rounded-xl">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-xl">{s.tipo}</h3>
                        <p className="text-gray-400 text-sm mt-0.5">Canal: {s.canal}</p>
                      </div>
                      <button
                        onClick={() => copiar(s.corpo, 0)}
                        className="px-3 py-1.5 bg-green-700 hover:bg-green-600 rounded-lg text-sm font-bold transition-colors"
                      >
                        {copiedIdx === 0 ? '✓ Copiado!' : '📋 Copiar'}
                      </button>
                    </div>
                    <div className="mb-3 p-2 bg-gray-800/60 rounded text-xs text-gray-400">
                      <strong>Assunto:</strong> {s.assunto}
                    </div>
                    <pre className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed font-sans bg-gray-800/30 rounded-lg p-4">
                      {s.corpo}
                    </pre>
                  </div>

                  <div className="p-4 bg-blue-950/30 border border-blue-500/30 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-blue-300 text-sm">Follow-up (3-5 dias depois)</h4>
                      <button
                        onClick={() => copiar(s.followUp, 1)}
                        className="px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded text-xs font-bold transition-colors"
                      >
                        {copiedIdx === 1 ? '✓' : '📋'} Copiar
                      </button>
                    </div>
                    <pre className="text-sm text-blue-200 whitespace-pre-wrap font-sans">
                      {s.followUp}
                    </pre>
                  </div>

                  <div className="p-3 bg-yellow-950/30 border border-yellow-500/30 rounded-lg">
                    <p className="text-xs text-yellow-400 font-bold">KPI ALVO</p>
                    <p className="text-sm text-yellow-200 mt-1">{s.kpiAlvo}</p>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Notas de compliance parcerias */}
        <div className="mt-6 p-4 bg-red-950/30 border border-red-500/30 rounded-xl">
          <h4 className="font-bold text-red-300 mb-2">⚠ Alertas de Compliance em Parcerias</h4>
          <ul className="text-sm text-red-200 space-y-1">
            <li>• Airbnb TOS 2023 proíbe recomendações pagas de terceiros fora da plataforma. Aborde hosts via mensagem direta ou contato externo (WhatsApp/email).</li>
            <li>• Parcerias com hotéis: exija que eles não representem sua empresa como afiliada oficial sem contrato formal.</li>
            <li>• Comissões pagas a agências BR: documente via contrato de referral formal para compliance IRS (1099 se &gt;$600/ano).</li>
            <li>• Grupos Facebook: verifique regras do grupo antes de postar ofertas comerciais. Crie seu próprio grupo para máxima liberdade.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
