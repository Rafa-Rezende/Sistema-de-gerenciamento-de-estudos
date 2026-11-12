---
name: preflight
description: Checagem completa antes de gravar ou publicar alterações do Rota de Estudos (testes do planejador, montagem do index.html, limpeza, segredos, escopo, documentação). Usar antes de git commit/push, antes de /publicar, ou quando perguntarem "está pronto?".
---
Base: o que ainda não está no `origin/main` (`git diff origin/main`) e `git status --short`.

Na ordem. Se um passo falhar: corrija, repita esse passo, siga.

1. **Montagem**: `npm run verificar`. O `index.html` é exatamente o que sai de `src/`.
2. **Testes**: `npm test`. Tudo verde. Regra nova ou mudada em `src/planejador.js` sem caso em `test/planejador.test.js` → escreva (agente `rota-testes`) ou aponte a falta.
3. **Contrato com o banco**: mudou o formato de algum documento (`subjects`, `sessions`, `progress`, `tasks`, `days`, `settings`)? Os dados que já estão no artefato continuam abrindo (campo novo com valor padrão, nada renomeado sem migração), e a tabela da skill `rota` foi atualizada.
4. **Contrato com o iPhone**: mudou o JSON de `syncPayload()`? O atalho do usuário quebra: avise e atualize os passos da tela iPhone.
5. **Limpeza** no diff: sem `console.log` de depuração, sem código comentado, sem `.only`/`skip` esquecidos.
6. **Regras do artefato**: scripts só de `cdnjs`/`jsdelivr`/`unpkg`, fontes só do Google Fonts, sem `alert`/`confirm`/`prompt`, todo dado em HTML passa por `esc()` (o teste de montagem cobre parte disso).
7. **Segredos e arquivos**: nada de `.env`, tokens, chaves.
8. **Escopo**: o diff só tem o que é desta tarefa. O que for alheio → diga ao usuário, não grave escondido.
9. **Documentação**: `README.md`, `CLAUDE.md`, `PRODUCT.md` ou a skill `rota` ficaram errados com esta mudança? Atualize.

Relatório, uma linha por passo: `✅ passo` ou `❌ passo — o que falta`. Termine com PRONTO ou NÃO PRONTO.
