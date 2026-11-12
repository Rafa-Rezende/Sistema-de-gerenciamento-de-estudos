---
name: publicar
description: Grava as alterações do Rota de Estudos (commit e push no main) e republica a página no claude.ai, migrando o banco se o formato dos dados mudou.
disable-model-invocation: true
---
Projeto pessoal de uma pessoa só: o `main` é a versão atual. Publicar = commit no `main`, push, e atualizar o artefato no claude.ai (é ele que o usuário abre no computador e no iPhone). O GitHub Actions roda os testes a cada push.

1. **Preflight**: rode a skill `preflight`. NÃO PRONTO → pare e mostre o que falta.
2. **Revisão**: se o que vai sair mexe em `src/`, rode a skill `rever` (a não ser que já tenha rodado sobre estas mesmas mudanças nesta conversa). `corrigir antes` → pare e mostre. `com retoques` → mostre e pergunte se publica assim ou corrige antes. Só documentação ou testes → pule.
3. **Commit**: só os arquivos desta tarefa (`git add <arquivos>`, nunca `git add -A`). Mensagem em português, no estilo do `git log`: um título que diz o que muda para o usuário ("Dia livre aceita 5h de estudo"), e se preciso um parágrafo curto com o porquê. Termine com as linhas de atribuição que o sistema indicar.
4. **Push**: `git push origin main`. Nunca forçado. Rejeitado → `git pull --rebase origin main`, rode `npm test` de novo, e só então push.
5. **Artefato**: se `index.html` mudou, siga a skill `rota`, seção "Republicar". Se o formato dos dados mudou, migre o banco antes de avisar o usuário.
6. **Testes no GitHub**: `gh run list --limit 1` (se o `gh` estiver ligado). Vermelho → mostre o passo que falhou.
7. **Relatório**, curto: o commit (hash e título), se a página foi republicada, e o que o usuário precisa fazer (recarregar a página; rodar o atalho "Sincronizar Estudos" no iPhone se o plano mudou).
