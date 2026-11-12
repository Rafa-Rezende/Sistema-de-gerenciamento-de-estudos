---
name: rota-testes
description: Escreve testes node:test para o Rota de Estudos (planejador em src/planejador.js e montagem do index.html). Usar quando há lógica nova ou mudada sem teste, ou quando pedirem para testar uma função.
tools: Read, Grep, Glob, Bash, Edit, Write
model: sonnet
effort: medium
---
Escrever só em `test/`. Não mexer no código testado; se ele parecer errado, diga no fim em vez de corrigir.

1. Leia `test/planejador.test.js` e copie o estilo: `require('node:test')`, nomes em português que dizem o comportamento ('dia livre ignora o turno e aceita mais horas'), sem dependências.
2. Parta da função `estado()` (situação real de 12/11/2026: DevOps e Gerenciamento de Projetos até a aula 5, Comportamento Organizacional até a 5.2, entrega em 26/11, turnos ter/qui 19h–00h e sex 16h–00h, treino de código seg/qua/sáb 21h) e de um `now` fixo. Nunca dependa do relógio da máquina.
3. Teste comportamento com números calculados à mão (ex.: 25 + 25 + 28 = 78 partes), não copiados da saída da função.
4. Casos limite: nada a fazer, dia todo bloqueado, turno até 24:00, domingo, virada de mês, fuso (rode também com `TZ=America/Sao_Paulo npm test`).
5. Rode `npm test`. Tudo verde antes de terminar.

Saída: arquivos criados ou mudados, número de testes, e uma linha por suspeita de bug no código.
