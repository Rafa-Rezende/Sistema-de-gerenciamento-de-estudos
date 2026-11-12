# Rota de Estudos

Sistema pessoal de gerenciamento de estudos do Rafael: planeja as aulas da faculdade em partes de 30 min, encaixa nos horários livres entre os turnos da pizzaria, refaz o plano quando aparece um imprevisto, acompanha prazos e o treino de código, e manda a agenda para o calendário do iPhone. Produto, usuário e regras de texto no [PRODUCT.md](PRODUCT.md).

É um projeto pessoal, de uma pessoa só.

## Como roda

O mesmo código roda em dois lugares, escolhidos em `boot()` (`naWeb()`):

- **Site no Vercel** (`publico/`, gerado pelo `montar.js`): dados no **Supabase** (tabela `documentos`, uma linha por documento, protegida por RLS), login com código de 6 dígitos no e-mail, e o calendário que o iPhone assina (função `calendario`).
- **Artefato do claude.ai** (https://claude.ai/artifact/LazjqpYBaArfHZSXkLo4tj, privado, `index.html`): dados no banco do artefato.

`bancoSupabase()` em `src/app.js` imita a interface do banco do artefato (`collection().onSnapshot`, `doc().set`, `doc().delete`): o resto do app não sabe onde os dados estão. Sem servidor próprio e sem dependências de build.

## Estrutura

- `src/pagina.html`: título, fontes, CSS (tokens do tema caderno, claro e escuro) e a estrutura fixa.
- `src/planejador.js`: `RotaPlanner.buildPlan(estado, agora)`, função pura.
- `src/app.js`: telas, banco, imprevistos, replanejamento, sincronização com o iPhone.
- `montar.js`: junta as três partes em `index.html` (artefato) e em `publico/` (site: config, ícones, manifesto). Os dois são gerados: não editar à mão. `publico/` não vai para o git.
- `config.json`: Project URL e chave anon do Supabase (públicas; a chave service_role **nunca** entra no repositório).
- `supabase/migracoes/`: SQL (rodar no SQL Editor). `supabase/functions/calendario/`: `index.ts` (Deno) e `ics.mjs` (gerador puro do .ics).
- `marca/`: logo e ícones (`gerar.py` refaz os SVGs).
- `test/`: `planejador.test.js` (situação real como base), `calendario.test.js` e `montagem.test.js`.

## Comandos

- Testes: `npm test` (node:test, sem dependências, < 1 s).
- Montar: `npm run montar` · conferir sem gravar: `npm run verificar`.
- Ver o site local: `npm run montar` e abrir `publico/index.html` (sem `config.json` preenchido ele pede para configurar o Supabase).

## Publicar

`main` é a versão atual. Push no `main` = o GitHub Actions roda os testes e o Vercel publica o site sozinho. O artefato do claude.ai é republicado pela ferramenta Artifact; a função do calendário pelo Supabase CLI (`npx supabase functions deploy calendario`), do computador do usuário. Mudança no banco = SQL novo em `supabase/migracoes/` (numerado, que pode rodar de novo sem quebrar). Passo a passo: README, skills `/publicar` e `/rota`.

## Regras

- Código, commits e telas em **português do Brasil**.
- Mudou o planejador → caso novo em `test/planejador.test.js`.
- Mudou o formato de um documento do banco → os dados antigos continuam abrindo (valor padrão ou migração) e a tabela da skill `rota` é atualizada.
- Mudou o JSON do iPhone → o atalho do usuário quebra: avise e atualize os passos na tela iPhone.
- Regras do artefato: scripts só de `cdnjs`/`jsdelivr`/`unpkg` com versão fixa, fontes só do Google Fonts, sem `alert`/`confirm`/`prompt`, dados no banco, todo dado em HTML por `esc()`. O `localStorage` guarda o tema por aparelho e, no site, a sessão do Supabase.
- Site: o `vercel.json` tem uma CSP que só deixa falar com `cdn.jsdelivr.net`, Google Fonts e `*.supabase.co`. Script ou serviço novo → atualizar a CSP junto.
- Supabase: toda tabela nova com RLS ligada e políticas por `auth.uid()`; a função do calendário só lê com a chave de serviço do próprio Supabase (variável de ambiente, nunca no código).
- Cor nova = token em `:root` e nos dois blocos do tema escuro. Tema padrão: papel claro.

## Ferramentas do projeto (`.claude/`)

- Hooks: checam cada arquivo editado (`node --check`) e remontam o `index.html`; antes de cada `git commit` rodam a montagem, os testes e a procura de segredos (inclusive a chave service_role do Supabase); bloqueiam servidor em primeiro plano, push forçado e `reset --hard` para o remoto; protegem `index.html` e `.env`.
- Skills: `/preflight` (está pronto?), `/rever` (revisão com agentes), `/publicar` (commit, push e republicar a página; só o usuário chama), `/rota` (o app, o banco, o planejador e o atalho do iPhone).
- Agentes: `rota-revisor` (bugs), `rota-planejador` (lógica do plano), `rota-texto` (texto da tela), `rota-seguranca` (dados e artefato), `rota-testes` (escreve testes).
