---
name: author-talents
description: Phase 5 of the ClaudeCraft Vanilla Studio. Authors original talent trees (TalentNode/TalentTree) for a class into the talents content modules. Use to add or extend a class's talent specs.
user-invocable: true
---

# Author talents: original trees

Add talent trees using the existing talent shapes and the one-time-at-respec computation model.

## Steps

1. Read `src/sim/content/talents.ts` (`TalentNode`, `TalentTree`, `TalentEffect`,
   `StatModEffect`, `AbilityModEffect`, `GlobalModEffect`, `computeTalentModifiers`) and an
   existing tree module (`talents_warrior.ts` / `talents_classic.ts`).
2. Design the trees: rows, columns, prerequisites (`requires`, `pointsGate`), node kinds
   (`passive`/`active`/`choice`), and effects (stat mods, ability mods, grants, global mods).
3. Author `src/sim/content/talents_<class>.ts` exporting `<CLASS>_TALENTS` and register it in
   the `TALENTS` map.
4. Keep modifiers precomputed at allocation (no per-tick branching); tie magnitudes to the
   balance budget.
5. Regenerate the guide: `npm run wiki:content`.

## Output

The talent module and its registration, with the guide regenerated.

## Gate

`npx tsc --noEmit`; a fidelity test for any new talent math; `/balance-check`;
`/content-provenance-audit` PASS; spawn `lore-consistency-reviewer`.

## Guardrail

Original talent names and descriptions; borrow only the mechanical structure.
