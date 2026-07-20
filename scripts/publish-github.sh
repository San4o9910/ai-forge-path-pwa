#!/usr/bin/env bash
set -euo pipefail

OWNER="${GITHUB_OWNER:-San4o9910}"
REPO="${GITHUB_REPO:-ai-forge-path-pwa}"
VISIBILITY="${GITHUB_VISIBILITY:-public}"

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) не установлен: https://cli.github.com/" >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Сначала выполни: gh auth login" >&2
  exit 1
fi

if gh repo view "$OWNER/$REPO" >/dev/null 2>&1; then
  echo "Репозиторий $OWNER/$REPO уже существует."
else
  gh repo create "$OWNER/$REPO" --"$VISIBILITY" --source=. --remote=origin --description "Visual PWA learning OS for becoming a practical AI Engineer"
fi

git branch -M main
git push -u origin main

echo "Готово: https://github.com/$OWNER/$REPO"
