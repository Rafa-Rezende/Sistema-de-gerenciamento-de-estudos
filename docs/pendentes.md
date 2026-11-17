# Estado e próximos passos

Atualizado: 2026-11-17. Projeto Supabase: `ncazblxqmkhonbbsemqm` (URL e chave publishable em `config.json`).

## Configuração do site (a meio)

- [x] Tabelas criadas (`supabase/migracoes/001_rota.sql` rodado: "Success").
- [x] Conta do Rafael criada pelo painel (Authentication → Users), id `1dbd5861-de59-4c51-b870-fe88f2711056`.
- [ ] Confirmar que **Confirm email** está desligado (Sign In / Providers → Email) e que **Enable custom SMTP** ficou desligado.
- [ ] Importar os dados do artefato: foi entregue um `importar-dados.sql` (64 documentos, grava no id acima). Se o ficheiro se perdeu, regenerar: ler as 6 coleções do artefato https://claude.ai/artifact/LazjqpYBaArfHZSXkLo4tj com `ArtifactData` (subjects, sessions, progress, settings, tasks, days) e gerar `insert ... on conflict (user_id, colecao, id) do update` em `public.documentos`. Não confirmado se o utilizador rodou.
- [ ] Desligar **Allow new users to sign up** depois de a conta existir.
- [ ] Vercel: importar este repositório e fazer Deploy; registar o endereço no CLAUDE.md e em Authentication → URL Configuration (Site URL, para o "esqueci a senha").
- [ ] Função do calendário, no computador do utilizador: `npx supabase functions deploy calendario --project-ref ncazblxqmkhonbbsemqm`. Depois: no site, aba iPhone → Criar link → Assinar.

## Limites destas sessões

A rede das sessões cloud bloqueia `*.supabase.co`, `vercel.app` e `ibjjf.com`: não dá para testar o site real daqui; os testes usam um Supabase simulado no navegador (Playwright).

## Fora deste repositório

- No repositório da faculdade (`Rafa-Rezende/Gestor-Estudos`) ficou a branch `organizacao-claude` com uma cópia antiga do Rota; apagar foi bloqueado pelas permissões. O utilizador pode apagá-la no GitHub (Branches → lixeira). O `main` de lá nunca foi tocado.
- O "esquema de treino de programação" que o utilizador mencionou nunca foi encontrado; a trilha "Treino de código" tem horário provisório (seg/qua/sáb 21h–22h) e nenhum módulo. Pedir o esquema.
