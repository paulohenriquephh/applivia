'use client';

import { useState } from 'react';
import { gerarContrato, DEFAULT_CONTRATO, ContratoParams } from '@/lib/contrato-admin';

export default function ContratoPage() {
  const [params, setParams] = useState<ContratoParams>({ ...DEFAULT_CONTRATO });
  const contrato = gerarContrato(params);

  const up = (field: keyof ContratoParams) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.type === 'number' ? +e.target.value : e.target.value;
    setParams(p => ({ ...p, [field]: val }));
  };

  const copiar = () => {
    navigator.clipboard.writeText(contrato);
    alert('Contrato copiado para o clipboard!');
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/locadora" className="text-gray-500 hover:text-gray-300 text-sm">← Voltar</a>
          <h1 className="text-3xl font-black mt-2">📋 Contrato Admin 20% + KPIs</h1>
          <p className="text-gray-400 mt-1">Gerador automático · Cláusula nuclear 21 dias · Bônus occupancy · Trigger rescisão</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Formulário */}
          <div className="space-y-4">
            <div className="p-5 bg-gray-900 border border-gray-700 rounded-xl">
              <h3 className="font-bold mb-4 text-gray-200">Dados da Empresa</h3>
              <div className="space-y-3">
                {([
                  ['nomeLocadora', 'Nome da LLC', 'text'],
                  ['cnpjLocadora', 'EIN da LLC', 'text'],
                  ['enderecoLocadora', 'Endereço da LLC (Miami)', 'text'],
                ] as [keyof ContratoParams, string, string][]).map(([field, label, type]) => (
                  <div key={field}>
                    <label className="block text-xs text-gray-400 mb-1">{label}</label>
                    <input type={type} value={String(params[field])} onChange={up(field)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm" />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 bg-gray-900 border border-gray-700 rounded-xl">
              <h3 className="font-bold mb-4 text-gray-200">Dados do Administrador</h3>
              <div className="space-y-3">
                {([
                  ['nomeAdmin', 'Nome Completo do Admin', 'text'],
                  ['cpfAdmin', 'SSN/ITIN do Admin', 'text'],
                  ['enderecoAdmin', 'Endereço do Admin', 'text'],
                ] as [keyof ContratoParams, string, string][]).map(([field, label, type]) => (
                  <div key={field}>
                    <label className="block text-xs text-gray-400 mb-1">{label}</label>
                    <input type={type} value={String(params[field])} onChange={up(field)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm" />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 bg-gray-900 border border-gray-700 rounded-xl">
              <h3 className="font-bold mb-4 text-gray-200">Termos do Contrato</h3>
              <div className="space-y-3">
                {([
                  ['dataInicio', 'Data de Início', 'text'],
                  ['adminPercent', 'Comissão Base (%)', 'number'],
                  ['bonusOccupancy', 'Bônus Occupancy 90%+ (%)', 'number'],
                  ['bondValor', 'Fiança (Performance Bond $)', 'number'],
                  ['prazoContrato', 'Prazo (meses)', 'number'],
                ] as [keyof ContratoParams, string, string][]).map(([field, label, type]) => (
                  <div key={field}>
                    <label className="block text-xs text-gray-400 mb-1">{label}</label>
                    <input type={type} value={String(params[field])} onChange={up(field)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm" />
                  </div>
                ))}
              </div>
            </div>

            {/* KPIs resumo */}
            <div className="p-4 bg-blue-950/30 border border-blue-500/30 rounded-xl">
              <h4 className="font-bold text-blue-300 mb-2">KPIs do Contrato</h4>
              <ul className="text-sm text-blue-200 space-y-1">
                <li>• Occupancy mínima: 80% | Meta: 90%+</li>
                <li>• Trigger rescisão: &lt;65% por 2 meses consecutivos</li>
                <li>• NPS mínimo: 4.5/5.0 | Rescisão: &lt;4.0 por 2 meses</li>
                <li>• Resposta WhatsApp: máx 15min (8h–22h)</li>
                <li>• Cláusula 21 dias: util &lt;60% → renegociação imediata</li>
                <li>• Classificação: 1099 (independent contractor)</li>
              </ul>
            </div>
          </div>

          {/* Preview do contrato */}
          <div>
            <div className="flex gap-3 mb-3">
              <button onClick={copiar}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-bold transition-colors">
                📋 Copiar Contrato
              </button>
              <span className="text-xs text-gray-500 self-center">⚠ Consulte um attorney FL antes de assinar</span>
            </div>
            <pre className="bg-gray-900 border border-gray-700 rounded-xl p-5 text-xs text-gray-300 overflow-auto max-h-[800px] whitespace-pre-wrap leading-relaxed font-mono">
              {contrato}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
