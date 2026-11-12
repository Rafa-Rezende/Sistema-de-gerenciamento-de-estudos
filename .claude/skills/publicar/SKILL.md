---
name: publicar
description: Grava as alterações do Rota de Estudos (commit e push no main) e republica a página no claude.ai, migrando o banco se o formato dos dados mudou.
disable-model-invocation: true
---
Projeto pessoal de uma pessoa só: o `main` é a versão atual. Push no `main` = o GitHub Actions roda os testes e o Vercel publica o site. O artefato do claude.ai e a função do calendário no Supabase são publicados à parte.

1. **Preflight**: rode a skill `preflight`. NÃO PRONTO → pare e mostre o que falta.
2. **Revisão**: se o que vai sair mexe em `src/`, rode a skill `rever` (a não ser que já tenha rodado sobre estas mesmas mudanças nesta conversa). `corrigir antes` → pare e mostre. `com retoques` → mostre e pergunte se publica assim ou corrige antes. Só documentação ou testes → pule.
3. **Commit**: só os arquivos desta tarefa (`git add <arquivos>`, nunca `git add -A`). Mensagem em português, no estilo do `git log`: um título que diz o que muda para o usuário ("Dia livre aceita 5h de estudo"), e se preciso um parágrafo curto com o porquê. Termine com as linhas de atribuição que o sistema indicar.
4. **Push**: `git push origin main`. Nunca forçado. Rejeitado → `git pull --rebase origin main`, rode `npm test` de novo, e só então push.
5. **Artefato**: se `index.html` mudou, siga a skill `rota`, seção "Republicar".
6. **Supabase**: SQL novo em `supabase/migracoes/` → entregue ao usuário para rodar no SQL Editor (não há acesso daqui). Mudou `supabase/functions/calendario/` → peça ao usuário `npx supabase functions deploy calendario --project-ref <ref>`.
7. **Testes no GitHub**: `gh run list --limit 1` (se o `gh` estiver ligado). Vermelho → mostre o passo que falhou.
8. **Relatório**, curto: o commit (hash e título), se o site e a página do claude.ai foram atualizados, o que falta rodar no Supabase, e o que o usuário precisa fazer (recarregar a página; rodar o atalho "Sincronizar Estudos" no iPhone se o plano mudou).
