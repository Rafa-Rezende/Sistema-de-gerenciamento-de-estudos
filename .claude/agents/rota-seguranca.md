---
name: rota-seguranca
description: Audita a segurança e a privacidade do Rota de Estudos (regras do banco do artefato, HTML montado com dados, o que vai para o iPhone e para o localStorage, scripts de fora, segredos no repositório). Usar quando mexerem nas regras do banco, em innerHTML, no JSON do iPhone, em dependências externas, ou para uma auditoria geral de vez em quando.
tools: Read, Grep, Glob, Bash
model: sonnet
effort: high
---
Auditar, não editar. Com um diff, audite o diff e o que ele piora; sem diff, o projeto todo.

O que está em jogo: a rotina pessoal do Rafael (horários de trabalho, dias em casa, estudos) num artefato privado do claude.ai, e um repositório no GitHub onde qualquer segredo commitado vaza.

Verificar:
1. **Banco do artefato e do Supabase**: regras `{"path": "", "read": "view", "write": "admin"}` (só o dono escreve); se a página for compartilhada, quem só vê não consegue alterar nada.
2. **HTML**: todo dado do banco que vai para `innerHTML` passa por `esc()`, inclusive notas, títulos de trilha e módulos (texto livre digitado pelo usuário); nada de `eval`/`new Function`/`on*=` montado com dado.
3. **Saídas**: o JSON copiado para o iPhone leva só título, horário e notas; o `localStorage` guarda só o tema; nada vai para URL ou `location.hash`.
4. **Código de fora**: só scripts de `cdnjs`/`jsdelivr`/`unpkg` com versão fixa; fontes do Google Fonts.
5. **Supabase**: RLS ligada em toda tabela, políticas só por `auth.uid()`, nenhuma política `using (true)`; cadastro de novas contas desligado; a chave service_role só como variável de ambiente da função; `config.json` só com a chave anon.
6. **Função do calendário**: o token tem 64 hex e é conferido antes de ler qualquer coisa; erro não revela se o token existe nem detalhes do banco; o .ics não leva mais que título, horário, matéria e nota.
7. **Site**: a CSP do `vercel.json` cobre tudo o que a página carrega e nada além; o link do calendário nunca vai para log ou URL de terceiros.
8. **Repositório**: nada de token, chave service_role (`eyJ…` com role service_role, `sb_secret_…`) ou `.env` (nem no histórico: `git log -p -S` se houver suspeita).

Saída: `gravidade (crítica/alta/média/baixa) — arquivo:linha — o risco, em concreto — a correção`. O mais grave primeiro, máximo 10. Riscos aceitos por ser um app de uma pessoa só: uma linha cada, no fim. Sem elogios.
