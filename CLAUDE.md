# Rota de Estudos

Sistema pessoal de gerenciamento de estudos do Rafael: planeja as aulas da faculdade em partes de 30 min, encaixa nos horários livres entre os turnos da pizzaria, refaz o plano quando aparece um imprevisto, acompanha prazos e o treino de código, e manda a agenda para o calendário do iPhone. Produto, usuário e regras de texto no [PRODUCT.md](PRODUCT.md).

É um projeto pessoal, de uma pessoa só.

## Como roda

A página é um **artefato do claude.ai** (https://claude.ai/artifact/LazjqpYBaArfHZSXkLo4tj, privado): um HTML único, com os dados guardados no banco do próprio artefato. Não há servidor nem build com dependências.

## Estrutura

- `src/pagina.html`: título, fontes, CSS (tokens do tema caderno, claro e escuro) e a estrutura fixa.
- `src/planejador.js`: `RotaPlanner.buildPlan(estado, agora)`, função pura.
- `src/app.js`: telas, banco, imprevistos, replanejamento, sincronização com o iPhone.
- `montar.js`: junta as três partes em `index.html` (gerado, não editar à mão).
- `test/`: `planejador.test.js` (situação real como base) e `montagem.test.js`.

## Comandos

- Testes: `npm test` (node:test, sem dependências, < 1 s).
- Montar: `npm run montar` · conferir sem gravar: `npm run verificar`.
- Para ver a página fora do claude.ai, ela abre mas avisa que o banco não está disponível.

## Publicar

`main` é a versão atual. Publicar = commit e push no `main` (o GitHub Actions roda `npm run verificar` e `npm test`) e republicar o artefato pela ferramenta Artifact com a URL acima. Passo a passo e migração de dados: skills `/publicar` e `/rota`.

## Regras

- Código, commits e telas em **português do Brasil**.
- Mudou o planejador → caso novo em `test/planejador.test.js`.
- Mudou o formato de um documento do banco → os dados antigos continuam abrindo (valor padrão ou migração) e a tabela da skill `rota` é atualizada.
- Mudou o JSON do iPhone → o atalho do usuário quebra: avise e atualize os passos na tela iPhone.
- Regras do artefato: scripts só de `cdnjs`/`jsdelivr`/`unpkg` com versão fixa, fontes só do Google Fonts, sem `alert`/`confirm`/`prompt`, dados no banco (o `localStorage` guarda só o tema por aparelho), todo dado em HTML por `esc()`.
- Cor nova = token em `:root` e nos dois blocos do tema escuro. Tema padrão: papel claro.

## Ferramentas do projeto (`.claude/`)

- Hooks: checam cada arquivo editado (`node --check`) e remontam o `index.html`; antes de cada `git commit` rodam a montagem, os testes e a procura de segredos; bloqueiam servidor em primeiro plano, push forçado e `reset --hard` para o remoto; protegem `index.html` e `.env`.
- Skills: `/preflight` (está pronto?), `/rever` (revisão com agentes), `/publicar` (commit, push e republicar a página; só o usuário chama), `/rota` (o app, o banco, o planejador e o atalho do iPhone).
- Agentes: `rota-revisor` (bugs), `rota-planejador` (lógica do plano), `rota-texto` (texto da tela), `rota-seguranca` (dados e artefato), `rota-testes` (escreve testes).
