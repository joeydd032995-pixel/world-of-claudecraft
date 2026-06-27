# Studio session state

Updated by `/studio-start` and the phase skills. Tracks the current feature, phase, and open
gates across sessions so work survives compaction and container restarts.

## Current

- Feature: Zone 4 - Emberfall Reach (levels 20-26) + level-cap extension
- Phase: 1 (Research and Design) - GDD REFINED (content design integrated), awaiting sign-off
- Review mode: lean (see `review-mode.txt`)
- Provenance guard: armed (`.claude/settings.json` runs `.claude/hooks/provenance-guard.sh` on git commit/add; `settings.example.json` documents the config)

## Next action

Sign off on the refined GDD `docs/studio/gdd/zone4-emberfall-reach.md` (all advisor conflicts
resolved in section 11; engine facts verified in section 12). Then Phase 1 mechanics research
`/vanilla-mechanics-research level-curve-21-26`, then `feature-plan` for the multi-phase build
(sim cap/XP audit -> `/author-zone` -> `/author-dungeon`), each gated by provenance + fidelity +
balance + lore + cross-platform-sync.

## Log

- Studio scaffolded (agents, skills, docs, tooling, guard hook).
- Studio merged to main via PR #1.
- Phase 1: drafted GDD `docs/studio/gdd/zone4-emberfall-reach.md` (first step past 1-20 toward
  the 1-60 vision; extends master-spec's patterns to a level 20-26 zone + cap raise).
- Phase 1 refine: fanned content-design-advisor (zone roster) + encounter-design-advisor
  (dungeon); integrated both, resolved conflicts (dungeon index 6 not 3; distinct final boss;
  reward slots fixed; no new family/affix - all verified against code). GDD provenance-clean.
