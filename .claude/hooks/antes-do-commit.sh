#!/bin/bash
# PreToolUse Bash: antes de `git commit`, os testes (planejador e montagem) e procura de segredos.
source "$(dirname "$0")/lib.sh"
in=$(cat); cmd=$(json_get command)
[[ $cmd =~ (^|[;&|[:space:]])git[[:space:]]+commit([[:space:]]|$) ]] || exit 0
unset GIT_DIR
r=$(raiz); cd "$r" || exit 0

# o commit pode vir no mesmo comando que o `git add`: conta o staged e o que mudou no working tree
mudados=$( { git diff --cached --name-only; git diff HEAD --name-only 2>/dev/null; git ls-files --others --exclude-standard; } | sort -u)
[ -z "$mudados" ] && exit 0
problemas=""

if grep -qE '^(src/|test/|montar\.js|index\.html|package\.json)' <<<"$mudados"; then
  out=$(node montar.js --verificar 2>&1) || problemas+="$out"$'\n'
  out=$(node --test 2>&1) || problemas+=$'testes:\n'"$( (grep -E '^not ok|AssertionError|expected|actual' <<<"$out" || tail -15 <<<"$out") | head -15)"$'\n'
fi

# segredos: padrões conhecidos. Só linhas e arquivos novos.
novo=$( git diff HEAD 2>/dev/null | grep -E '^\+[^+]'; git diff --cached | grep -E '^\+[^+]'; git ls-files --others --exclude-standard -z | xargs -0 cat 2>/dev/null )
suspeitos=$(grep -E 'AKIA[0-9A-Z]{16}|sk-ant-[A-Za-z0-9_-]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|gh[pousr]_[0-9A-Za-z]{36}|(postgres(ql)?|mysql)://[^:/[:space:]]+:[^@[:space:]]+@' <<<"$novo" \
  | grep -vE '@(localhost|127\.0\.0\.1)' | head -1)
[ -n "$suspeitos" ] && problemas+=$'Parece haver uma chave ou URL com senha nas alterações.\n'

sensiveis=$(grep -E '(^|/)\.env(\..*)?$|(^|/)node_modules/' <<<"$mudados")
[ -n "$sensiveis" ] && problemas+=$'Arquivos que não devem ir para o git:\n'"$sensiveis"$'\n'

[ -z "$problemas" ] && exit 0
printf 'Commit bloqueado:\n%s' "$problemas" >&2
exit 2
