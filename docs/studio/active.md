# Studio session state

Updated by `/studio-start` and the phase skills. Tracks the current feature, phase, and open
gates across sessions so work survives compaction and container restarts.

## Current

- Feature: Zone 4 - Emberfall Reach (levels 20-26) + level-cap extension
- Phase: 1 (Research and Design) - GDD drafted, awaiting scope sign-off
- Review mode: lean (see `review-mode.txt`)
- Provenance guard: armed (`.claude/settings.json` runs `.claude/hooks/provenance-guard.sh` on git commit/add; `settings.example.json` documents the config)

## Next action

Confirm the three open scope questions in `docs/studio/gdd/zone4-emberfall-reach.md` section 10
(cap target, biome reuse, feature-plan vehicle). Then Phase 1 mechanics research:
`/vanilla-mechanics-research level-curve-21-26` (the authentic vanilla XP values for 21-26),
followed by `feature-plan` for the multi-phase implementation (sim cap/XP, then `/author-zone`,
then `/author-dungeon`).

## Log

- Studio scaffolded (agents, skills, docs, tooling, guard hook).
- Studio merged to main via PR #1.
- Phase 1: drafted GDD `docs/studio/gdd/zone4-emberfall-reach.md` (first step past 1-20 toward
  the 1-60 vision; extends master-spec's patterns to a level 20-26 zone + cap raise).
