import { CHECKLIST_7_DIAS } from '@/lib/parcerias-scripts';

const corPrioridade = (p: string) => ({
  CRITICO: 'bg-red-900/50 text-red-300 border border-red-500/40',
  ALTO: 'bg-orange-900/40 text-orange-300 border border-orange-500/30',
  MEDIO: 'bg-gray-800/60 text-gray-400 border border-gray-700/40',
})[p] ?? 'bg-gray-800 text-gray-400 border border-gray-700';

const corCategoria = (i: number) => [
  'border-red-500/40 bg-red-950/20',
  'border-yellow-500/40 bg-yellow-950/20',
  'border-blue-500/40 bg-blue-950/20',
  'border-green-500/40 bg-green-950/20',
  'border-purple-500/40 bg-purple-950/20',
][i] ?? 'border-gray-700';

export default function OperacoesPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/locadora" className="text-gray-500 hover:text-gray-300 text-sm">← Voltar</a>
          <h1 className="text-3xl font-black mt-2">⚡ Cronograma Operacional 7 Dias</h1>
          <p className="text-gray-400 mt-1">LLC → EIN → Seguro → Frota → Lançamento → Métricas · Trigger de pivot dia 7</p>
        </div>

        {/* Alerta dealer license */}
        <div className="mb-6 p-4 bg-red-950/60 border border-red-500/50 rounded-xl">
          <p className="text-red-300 font-black text-sm">
            🚨 ITEM CRÍTICO NÃO-NEGOCIÁVEL: Dealer License MV-205 (FHSMV) leva 30-60 dias.
            INICIE NO DIA 1, mesmo que os carros não estejam comprados.
            Sem ela, operação independente acima de ~3 aluguéis é ILEGAL em Miami-Dade.
          </p>
        </div>

        {/* Checklist por dia */}
        <div className="space-y-6">
          {CHECKLIST_7_DIAS.map((cat, ci) => (
            <div key={ci} className={`p-5 rounded-xl border ${corCategoria(ci)}`}>
              <h3 className="font-black text-lg mb-4">{cat.categoria}</h3>
              <div className="space-y-2">
                {cat.itens.map((item, ii) => (
                  <div key={ii} className="flex items-start gap-3 p-3 bg-gray-900/60 rounded-lg">
                    <div className="flex-shrink-0 w-5 h-5 mt-0.5 rounded border border-gray-600 bg-gray-800" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-200">{item.texto}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Prazo: {item.prazo}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded flex-shrink-0 ${corPrioridade(item.prioridade)}`}>
                      {item.prioridade}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Links recursos */}
        <div className="mt-8 p-5 bg-gray-900 border border-gray-700 rounded-xl">
          <h3 className="font-bold mb-4 text-gray-200">Links Essenciais – Bookmarks para Dia 1</h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            {[
              ['LLC Florida', 'sunbiz.org', 'Registro LLC online – $125'],
              ['EIN IRS', 'irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online', 'EIN instantâneo – grátis'],
              ['Dealer License', 'flhsmv.gov/motor-vehicles-tags-titles/dealers/how-to-become-a-licensed-dealer/', 'Processo MV-205'],
              ['GMI Insurance', 'gmiinsurance.com', 'Specialty broker FL frota'],
              ['Blake Insurance', 'blakeinsurancegroup.com', 'Commercial auto FL'],
              ['Univista Insurance', 'univistainsurance.com', 'Specialty broker Miami'],
              ['Spireon Telematics', 'spireon.com', 'GPS + telematics frota'],
              ['Samsara', 'samsara.com', 'Fleet management alternativo'],
              ['Rent Centric', 'rentcentric.com', 'Software gestão reservas'],
              ['Manheim Miami', 'manheim.com', 'Leilão carros usados frota'],
            ].map(([nome, url, desc]) => (
              <div key={nome} className="p-3 bg-gray-800/50 rounded-lg">
                <p className="font-semibold text-blue-300">{nome}</p>
                <p className="text-xs text-gray-500">{url}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trigger de pivot */}
        <div className="mt-6 p-5 bg-orange-950/30 border border-orange-500/40 rounded-xl">
          <h3 className="font-black text-orange-300 mb-3">Trigger de Pivot – Dia 21 (Cláusula Nuclear)</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-green-300 font-bold mb-2">✓ Util ≥70% → Continue B Nuclear</p>
              <ul className="text-gray-300 space-y-1">
                <li>• Proceeder compra carros 3-5 imediatamente</li>
                <li>• Ativar financing Toyota/CarMax</li>
                <li>• Quote luxury para mês 3</li>
                <li>• Intensificar parcerias hotel/Airbnb</li>
              </ul>
            </div>
            <div>
              <p className="text-red-300 font-bold mb-2">✗ Util &lt;60% → Pivot imediato</p>
              <ul className="text-gray-300 space-y-1">
                <li>• Listar ambos os carros no Turo imediatamente</li>
                <li>• Revisar pricing (reduzir $10-15/dia temporariamente)</li>
                <li>• Dobrar esforço parcerias (50 msgs/dia)</li>
                <li>• Avaliar mover 1 carro para aeroporto particular (Opa-locka)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
