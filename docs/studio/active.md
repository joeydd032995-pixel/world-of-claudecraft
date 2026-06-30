# Studio session state

Updated by `/studio-start` and the phase skills. Tracks the current feature, phase, and open
gates across sessions so work survives compaction and container restarts.

## Current

- Feature: Zone 4 - Emberfall Reach (levels 20-26) + level-cap extension
- Phase: PR 1 (level-cap core) COMPLETE - cap 20->26, XP curve, fidelity test, full suite green
- Review mode: lean (see `review-mode.txt`)
- Provenance guard: armed (`.claude/settings.json` runs `.claude/hooks/provenance-guard.sh` on git commit/add; `settings.example.json` documents the config)

## Next action

PR 1 (level-cap core) is ready to merge. PR 2 (content): `/author-zone Emberfall Reach`
(the `ZONE4_*` records + `world_entity_i18n.ts` names) then `/author-dungeon The Emberward Vault`
(index 6, the two bosses), on a fresh branch, gated by provenance + fidelity + balance +
lore-consistency + audit:quests + wiki:content. Full design in the GDD.

## Log

- Studio scaffolded (agents, skills, docs, tooling, guard hook).
- Studio merged to main via PR #1.
- Phase 1: drafted GDD `docs/studio/gdd/zone4-emberfall-reach.md` (first step past 1-20 toward
  the 1-60 vision; extends master-spec's patterns to a level 20-26 zone + cap raise).
- Phase 1 refine: fanned content-design-advisor (zone roster) + encounter-design-advisor
  (dungeon); integrated both, resolved conflicts (dungeon index 6 not 3; distinct final boss;
  reward slots fixed; no new family/affix - all verified against code). GDD provenance-clean.
- PR 1 (level-cap core): authored neutral XP-curve spec (level-curve-21-26.md, formula-verified
  against all 20 anchors), raised MAX_LEVEL 20->26 + extended XP_TABLE (21-26: 25200/27300/29400/
  31700/34000/36400), added fidelity suite (16 cases). Regenerated 3 max-level parity goldens
  (scenarios.ts untouched); updated 4 cap-dependent tests (talent budget 11->17). Full suite
  green (4335 pass), tsc clean. Reviews: fidelity PASS, migration-safety no data loss. Prestige
  cap-raise interaction documented + decided "land as-is" (existing ranks preserved).
