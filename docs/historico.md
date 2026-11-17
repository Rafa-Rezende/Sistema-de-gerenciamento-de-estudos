# Histórico de decisões

## 2026-11-12 a 2026-11-17

- **Origem.** Pedido: um sistema de estudos com a UI de referência (dashboard estilo LMS), sincronizado com o calendário do iPhone, para as aulas da PUC (10 aulas por matéria, 5 partes de ~30 min), prazos de entrega, treino de programação e outros estudos. Começou como artefato do claude.ai.
- **Dados iniciais** vieram do Notion do utilizador (base "Cronograma de estudos (20/10 a 26/11)", 82 sessões).
- **Visual**: primeiro roxo (como a referência), depois "caderno" (papel creme pontilhado, pastéis de marca-texto, Caveat nos detalhes) a pedido. Tema claro por padrão (no Mac em modo escuro aparecia grafite e o utilizador estranhou); escuro é opção por aparelho.
- **Planejador automático** (2026-11-12): o utilizador atrasou-se (cobriu férias na pizzaria) e pediu que o sistema realocasse as aulas sozinho com imprevistos. Rotina (turnos ter/qui 19h–00h, sex 16h–00h), dias livres/sem estudo/ocupado, limite diário, descanso ao domingo. Função pura `RotaPlanner.buildPlan`, testada.
- **iPhone**: página web não grava no Calendário e o artefato não deixa baixar .ics, por isso no artefato ficou um Atalho (app Atalhos) que recria os eventos; no site, um link .ics assinado (função Supabase `calendario`).
- **Kit do Claude**: o utilizador pediu para adaptar o kit `oguibueno/ai-tools` (inacessível: privado ou noutra conta); usado o que está aplicado no mycros. Primeiro foi posto por engano no repositório da disciplina de DevOps (`gestor-estudos`); o utilizador corrigiu: **o Rota é pessoal e não tem relação com o projeto da faculdade**. Tudo passou para este repositório.
- **No ar**: Supabase (dados, login) + Vercel (página). Login começou como código de 6 dígitos por e-mail, mas o Supabase só deixa editar os modelos de e-mail com SMTP próprio; trocado para **e-mail e senha**. Chave do projeto é do formato novo (`sb_publishable_`), por isso a biblioteca subiu de 2.45.4 para 2.118.0.
- **Logo**: rota de caneta sobre pontilhado, paradas nas cores das matérias, bandeira da entrega (`marca/`).
