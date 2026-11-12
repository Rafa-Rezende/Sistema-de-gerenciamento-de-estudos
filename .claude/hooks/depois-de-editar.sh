#!/bin/bash
# PostToolUse Edit|Write: checagem rápida só do que mudou. Calado quando está tudo bem; erros voltam ao Claude.
source "$(dirname "$0")/lib.sh"
in=$(cat); f=$(json_get file_path); r=$(raiz)
case "$f" in
  "$r"/src/*|"$r"/montar.js)
    if [[ $f == *.js ]]; then out=$(node --check "$f" 2>&1) || bloquear "$(head -10 <<<"$out")"; fi
    # o artefato é um arquivo só: remonta para o index.html nunca ficar para trás
    out=$(cd "$r" && node montar.js 2>&1) || bloquear "montar.js: $out" ;;
  "$r"/supabase/functions/*.mjs)
    out=$(node --check "$f" 2>&1) || bloquear "$(head -10 <<<"$out")" ;;
  "$r"/test/*.js)
    out=$(node --check "$f" 2>&1) || bloquear "$(head -10 <<<"$out")" ;;
esac
exit 0
