#!/bin/bash
# Funções usadas pelos hooks. Uso: source lib.sh; in=$(cat); f=$(json_get file_path)
json_get() {
  if command -v jq >/dev/null; then jq -r ".tool_input.$1 // empty" <<<"$in"
  else python3 -c 'import sys,json;v=json.load(sys.stdin).get("tool_input",{}).get(sys.argv[1]);print("" if v is None else str(v).lower() if isinstance(v,bool) else v)' "$1" <<<"$in"; fi
}
raiz() { echo "${CLAUDE_PROJECT_DIR:-$PWD}"; }
bloquear() { echo "$1" >&2; exit 2; }
