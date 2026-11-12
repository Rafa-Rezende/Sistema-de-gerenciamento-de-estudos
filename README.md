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
