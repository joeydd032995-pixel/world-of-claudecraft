---
name: vanilla-mechanics-research
description: Phase 1 of the ClaudeCraft Vanilla Studio. Produces a NEUTRAL mechanics spec (formulas, ordered rolls, state machines) for one system by researching public sources, then lints it. Math and structure only; never copyrighted names or data tables. Use before implementing any system whose behavior should match classic-era MMO mechanics.
user-invocable: true
---

# Vanilla mechanics research: author a neutral spec

Turn public knowledge of a classic-era system into a neutral spec the team implements as
original content. The spec is the firewall: implementations are later tested against it, never
against live WoW.

## Steps

1. Name the system (for example `combat-hit-table`, `threat`, `resist`, `professions`).
2. Read the existing sim formulas first so the spec extends them, not contradicts them:
   `src/sim/types.ts` (`meleeMissChance`, `spellHitChance`, `armorReduction`, `rageConversion`,
   `xpForLevel`) and the relevant `src/sim/combat/*` module.
3. Fan out the `vanilla-mechanics-analyst` agent (read-only, web-enabled) to draft the spec
   from primary public sources. For a broad system, fan out one analyst per sub-mechanic.
4. Save the draft to `docs/studio/mechanics/<system>.md` using
   docs/studio/templates/mechanics-spec.md (Formula, Ordered rolls, State machine, Edge cases,
   Sources).
5. Lint it: `npm run studio:spec-lint`. Fix missing sections or any neutrality issue.
6. Provenance check: `node scripts/studio/content_provenance_scan.mjs docs/studio/mechanics`.

## Output

A linted `docs/studio/mechanics/<system>.md` and a note on confidence and unresolved numbers.

## Gate

`studio:spec-lint` clean; provenance clean.

## Guardrail

The analyst restates math and structure in original prose. No copyrighted names, no pasted DB
rows, no GPL code copied into the repo (docs/studio/PROVENANCE.md).
