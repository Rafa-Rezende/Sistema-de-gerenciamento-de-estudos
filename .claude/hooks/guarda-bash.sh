#!/bin/bash
# PreToolUse Bash: comandos que travam a sessão ou reescrevem o histórico. Exit 2 = bloqueado.
source "$(dirname "$0")/lib.sh"
in=$(cat); cmd=$(json_get command); bg=$(json_get run_in_background)
servidor='(^|[;&|(/[:space:]])(http-server|serve|live-server)([[:space:]]|$)|http\.server|npx[[:space:]]+(serve|http-server)'

# servidores nunca terminam: em primeiro plano a sessão fica presa
if [[ $bg != true && $cmd =~ $servidor ]]; then
  bloquear "Servidores ficam rodando para sempre. Use run_in_background: true."
fi

# o main é o histórico do projeto: nada de reescrever
if [[ $cmd =~ git[[:space:]]+push && $cmd =~ (--force|[[:space:]]-f([[:space:]]|$)|--force-with-lease) ]]; then
  bloquear "Nada de push forçado: o main é o histórico do projeto."
fi
if [[ $cmd =~ git[[:space:]]+reset[[:space:]]+--hard[[:space:]]+origin ]]; then
  bloquear "reset --hard para o remoto apaga trabalho local. Confira com git status e pergunte ao usuário."
fi
exit 0
