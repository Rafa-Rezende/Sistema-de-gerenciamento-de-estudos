---
name: rever
description: Revisão do código alterado no Rota de Estudos (bugs, lógica do planejador, texto da tela, segurança dos dados) com os agentes especializados em paralelo. Usar quando pedirem para revisar alterações, um commit ou um intervalo de commits.
---
1. **Alvo**:
   - Commit ou intervalo dado (`/rever HEAD~3`, `/rever abc123`) → esse intervalo até `HEAD`.
   - Senão → o que não está no `origin/main` (`git diff origin/main`) mais o não gravado.
   - Nada mudou → diga e pare.
2. **Intenção**: leia as mensagens de commit do intervalo. Revise contra o que a mudança diz que faz.
3. **Em paralelo**, numa mensagem só, passando a cada agente a lista de arquivos e a intenção:
   - `rota-revisor`: sempre.
   - `rota-planejador`: só se o diff mexe em `src/planejador.js`, nas funções de replanejamento de `src/app.js` (`replan`, `planStatus`, `isPast`, `dayExtras`, `missedList`) ou nos padrões de rotina (`DEFAULTS`).
   - `rota-texto`: só se o diff muda texto que o usuário lê (strings em `src/app.js`, `src/pagina.html`).
   - `rota-seguranca`: só se o diff mexe nas regras do banco, em HTML montado com dados (`innerHTML`), no JSON do iPhone, em `localStorage` ou carrega algo de fora.
4. **Juntar**: tire duplicados e o que estiver fora das linhas mudadas (a não ser que a mudança piore). Confirme cada achado lendo o código; descarte os falsos.
5. **Saída**:
   - Veredito: `pode publicar` / `pode publicar, com retoques` / `corrigir antes`.
   - Achados, o mais grave primeiro: `gravidade — arquivo:linha — problema — correção`. Máximo 20.
   - Testes que faltam, uma linha cada.

Não corrigir nada sem o usuário pedir.
