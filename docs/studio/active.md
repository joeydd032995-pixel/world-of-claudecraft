# Studio session state

Updated by `/studio-start` and the phase skills. Tracks the current feature, phase, and open
gates across sessions so work survives compaction and container restarts.

## Current

- Feature: (none yet)
- Phase: 0 (Setup)
- Review mode: lean (see `review-mode.txt`)
- Provenance guard: available, opt-in (merge `settings.example.json` into `.claude/settings.json` to arm `.claude/hooks/provenance-guard.sh`)

## Next action

Run `/studio-start` and name a feature, or jump straight to
`/vanilla-mechanics-research <system>` for a Phase 1 spec.

## Log

- Studio scaffolded (agents, skills, docs, tooling, guard hook).
