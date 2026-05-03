# Product Context: P2HM Imoveis landing

## Why This Product Exists

A pagina existe para apresentar de forma auditavel a tese `P2HM Imoveis`, condensando estrategia, validacoes, arquitetura de monetizacao, budget e criterios de operacao em uma unica landing page clara.

## Problems It Solves

1. **Falta de material visivel**: responde diretamente ao "cade P2HM" com uma entrega navegavel
2. **Narrativa dispersa**: organiza a tese longa em secoes legiveis e escaneaveis
3. **Contexto de execucao**: mostra stack, KPIs, riscos e plano Day 0 / Day 1
4. **Posicionamento da marca**: move a home de template generico para uma experiencia alinhada ao negocio

## How It Should Work

1. O visitante abre a home `/`
2. Entende o posicionamento e as metricas centrais no hero
3. Percorre validacoes, tiers, canais, stack e plano operacional
4. Usa a pagina como material de apresentacao, alinhamento interno ou validacao rapida
5. Pode navegar ao `/dashboard` como area secundaria existente

## Key User Experience Goals

- **Immediate clarity**: tese central compreensivel nos primeiros segundos
- **Auditability**: dados e suposicoes operacionais organizados por secao
- **Premium presentation**: visual escuro, denso e executivo
- **Low-friction navigation**: leitura continua, sem depender de interacoes complexas

## What This Product Provides

1. **Hero executivo** com headline, posicionamento e metricas-chave
2. **Blocos auditaveis** para validacao, receita, execucao, KPIs e riscos
3. **Resumo de stack e budget** em formato visual simples
4. **Compatibilidade com o dashboard existente** sem remover a rota secundaria

## Integration Points

- **Landing principal**: `src/app/page.tsx`
- **Metadata / idioma**: `src/app/layout.tsx`
- **Dashboard legado**: `src/app/dashboard/page.tsx`
- **Memory bank**: arquivos em `.kilocode/rules/memory-bank/`
