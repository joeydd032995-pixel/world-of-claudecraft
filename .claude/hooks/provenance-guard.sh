#!/usr/bin/env bash
# PreToolUse(Bash) guard for the ClaudeCraft Vanilla Studio.
#
# When a Bash command is about to run `git commit` or `git add`, scan the staged files for
# copyrighted names, emulator DB identifiers, or client-extracted artifacts. Block the commit
# if the provenance scanner finds anything (exit 2 surfaces stderr back to Claude).
#
# Wired in .claude/settings.json under hooks.PreToolUse with matcher "Bash".

set -euo pipefail

# The hook receives the tool call as JSON on stdin. Extract the command field without
# requiring jq (fall back to a grep if jq is absent).
input="$(cat || true)"
if command -v jq >/dev/null 2>&1; then
  cmd="$(printf '%s' "$input" | jq -r '.tool_input.command // empty' 2>/dev/null || true)"
else
  cmd="$(printf '%s' "$input" | grep -o '"command"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 || true)"
fi

# Only act on git commit / git add commands.
case "$cmd" in
  *"git commit"*|*"git add"*) ;;
  *) exit 0 ;;
esac

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || echo .)"
scan="$repo_root/scripts/studio/content_provenance_scan.mjs"
[ -f "$scan" ] || exit 0

if ! node "$scan" --staged --quiet; then
  echo "BLOCKED: provenance scan found copyrighted names, DB identifiers, or client artifacts in staged files." >&2
  echo "Run: node scripts/studio/content_provenance_scan.mjs --staged" >&2
  echo "See docs/studio/PROVENANCE.md. Author original content instead of importing." >&2
  exit 2
fi

exit 0
