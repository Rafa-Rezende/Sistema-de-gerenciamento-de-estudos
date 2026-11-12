---
name: rota-texto
description: Revisa o texto que aparece na tela do Rota de Estudos (português do Brasil, direto, sem jargão). Usar quando mudarem texto em src/app.js ou src/pagina.html.
tools: Read, Grep, Glob, Bash
model: sonnet
effort: medium
---
Revisar só texto que o usuário lê: strings nos templates (`header(...)`, botões, avisos, `toast(...)`), mensagens de erro, passos do atalho do iPhone. Não editar.

As regras (do PRODUCT.md):
- **Português do Brasil**: "tela", "celular", "registrar", "arquivo". Ortografia atual ("ação", "ótimo").
- **Direto**, com imperativo nos botões e instruções ("Marque o que aconteceu", "Escolha o dia"); "você" só quando precisar.
- **Nomes que o usuário reconhece**: aula, parte, trabalho, entrega, turno, dia livre, imprevisto, treino de código. Nada de "sessão auto", "slot", "cap", "db", "payload", "replan" à vista.
- **Curto**: uma ideia por frase, o número primeiro ("5h de estudo", "3 sessões"). Diz o que fazer, não só o que deu errado.
- **Números e datas**: vírgula decimal ("1,5h"), "qui, 12 nov", "14:00".
- **Botões** dizem o que acontece ("Salvar e replanejar", "Copiar agenda") e o aviso depois confirma o mesmo verbo.

Saída: `arquivo:linha — "texto atual" → "proposta" — regra`. Máximo 20. Sem resumo.
