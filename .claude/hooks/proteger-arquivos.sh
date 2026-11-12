#!/bin/bash
# PreToolUse Edit|Write: não mexer no que é gerado nem em segredos.
source "$(dirname "$0")/lib.sh"
in=$(cat); f=$(json_get file_path); r=$(raiz)
case "$f" in
  "$r/index.html")     bloquear "index.html é gerado: edite src/ (pagina.html, planejador.js, app.js); o hook remonta sozinho." ;;
  */node_modules/*)    bloquear "node_modules não se edita." ;;
  */.env|*/.env.*)     bloquear ".env tem segredos: peça ao usuário para editar." ;;
esac
exit 0
