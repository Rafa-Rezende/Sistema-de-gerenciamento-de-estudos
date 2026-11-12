#!/bin/bash
# SessionStart: o estado do projeto em poucas linhas, para não gastar comandos descobrindo.
cd "${CLAUDE_PROJECT_DIR:-$PWD}" || exit 0
unset GIT_DIR
echo "## Estado do Rota de Estudos"
ramo=$(git branch --show-current)
echo "- Branch: $ramo · último commit: $(git log -1 --format='%h %s' 2>/dev/null | cut -c1-90)"
afrente=$(git rev-list --count "origin/$ramo..HEAD" 2>/dev/null)
[ "${afrente:-0}" -gt 0 ] && echo "- $afrente commit(s) ainda não enviados"
mudados=$(git status --short | head -15)
[ -n "$mudados" ] && { echo "- Não gravado:"; sed 's/^/    /' <<<"$mudados"; }
command -v node >/dev/null || { echo "- Falta o Node (testes e montagem)"; exit 0; }
node montar.js --verificar >/dev/null 2>&1 || echo "- index.html desatualizado: npm run montar"
echo "- Página publicada: https://claude.ai/artifact/LazjqpYBaArfHZSXkLo4tj (republicar: skill /publicar)"
exit 0
