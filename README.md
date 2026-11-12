# Sistema de gerenciamento de estudos

**Rota de Estudos**: o planejador pessoal que organiza as aulas da faculdade em partes de 30 min, encaixa nos horários livres entre os turnos do trabalho e refaz o plano sozinho quando aparece um imprevisto.

- Progresso por parte de aula (grade 10 aulas × 5 partes por matéria).
- "Mudou o dia?": dia livre, sem estudo ou ocupado num horário. O plano se refaz na hora.
- Prazos com contagem regressiva e os trabalhos encaixados depois das aulas.
- Treino de código em horário fixo, sem roubar tempo das aulas.
- Agenda no calendário do iPhone por um atalho do app Atalhos.

A página roda como artefato do claude.ai: um HTML único com banco próprio, sem servidor.

## Código

| | |
|---|---|
| `src/pagina.html` | estrutura e visual (tema caderno, claro e escuro) |
| `src/planejador.js` | o planejador: função pura que transforma o que falta, a rotina e os imprevistos em sessões com dia e hora |
| `src/app.js` | telas, dados, imprevistos e sincronização com o iPhone |
| `montar.js` | junta tudo em `index.html`, o arquivo publicado |
| `test/` | testes do planejador e da montagem |

```bash
npm test
```

```bash
npm run montar
```

Sem dependências: só o Node 20 ou mais novo.

## No ar: Supabase + Vercel

O mesmo código roda em dois lugares:

- **Site** (Vercel): dados no Supabase, entrada com e-mail e senha, calendário que o iPhone assina.
- **Artefato do claude.ai**: dados no banco do artefato (como era no começo).

| | |
|---|---|
| `supabase/migracoes/001_rota.sql` | tabelas `documentos` e `calendarios`, com regras para cada conta só ver os próprios dados |
| `supabase/functions/calendario/` | o link `.ics` que o iPhone assina (`ics.mjs` é testado em `test/calendario.test.js`) |
| `config.json` | endereço do projeto e chave **anon** do Supabase (públicas por natureza) |
| `vercel.json` | o Vercel roda `node montar.js` e publica `publico/`, com cabeçalhos de segurança |

### Configurar uma vez

1. **Supabase → New project.** Anote a senha do banco num lugar seguro.
2. **SQL Editor → New query:** cole `supabase/migracoes/001_rota.sql` → **Run**.
3. **Authentication → Sign In / Providers → Email:** desligue **Confirm email** e salve (a entrada é por e-mail e senha; sem isso o Supabase exige confirmar por e-mail). Deixe **Enable custom SMTP** desligado em Authentication → Emails.
4. **Project Settings → API:** copie a **Project URL** e a chave **anon public** para o `config.json`.
5. **Vercel → Add New → Project:** importe este repositório e clique em **Deploy** (o `vercel.json` já diz o resto). Cada push no `main` publica de novo.
6. **Authentication → URL Configuration:** em **Site URL**, coloque o endereço do Vercel.
7. Abra o site e toque em **Primeira vez? Criar conta** (senha com pelo menos 8 caracteres).
8. **Authentication → Sign In / Providers:** desligue **Allow new users to sign up**, para ninguém mais criar conta.
9. **Função do calendário**, do seu computador, na pasta do repositório:
   ```bash
   npx supabase login
   ```
   ```bash
   npx supabase functions deploy calendario --project-ref SEU_PROJECT_REF
   ```
   O `supabase/config.toml` já desliga a exigência de login (o iPhone não manda login: o token secreto no link é a chave).
10. No site, aba **iPhone → Criar link do calendário → Assinar no iPhone**.
