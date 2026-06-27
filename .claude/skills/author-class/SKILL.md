---
name: author-class
description: Phase 5 of the ClaudeCraft Vanilla Studio. Authors an original class kit (ClassDef plus AbilityDef abilities with ranks and a learn order) into classes.ts. Use to add a class or extend an existing class's kit toward higher levels.
user-invocable: true
---

# Author class: an original kit

Add or extend a class using the existing ability and class shapes.

## Steps

1. Read `src/sim/content/classes.ts` (`ClassDef`, `CLASSES`, `ABILITIES`,
   `abilitiesKnownAt`) and the `AbilityDef`/`AbilityEffect`/`AbilityRank` types in
   `src/sim/types.ts`.
2. Read the neutral spec for the resource model and any ability math
   (`docs/studio/mechanics/<system>.md`).
3. Define the `ClassDef` (base/per-level stats, HP/mana, `resourceType`, start gear, ability
   learn order, color) and the abilities as `AbilityDef` records with ranks, costs, cooldowns,
   schools, and effects drawn from the existing `AbilityEffect` union.
4. Tie costs/cooldowns/cast times to the resource model and damage to the per-level curve
   (no invented numbers).
5. Regenerate the guide: `npm run wiki:content`.

## Output

The class and abilities in `classes.ts`, with the guide regenerated.

## Gate

`npx tsc --noEmit`; a fidelity test for new ability math (`/verify-mechanic-fidelity`);
`/balance-check`; `/content-provenance-audit` PASS; spawn `lore-consistency-reviewer`.

## Guardrail

Original ability and class names and descriptions. Borrow the mechanical role, never the
copyrighted name or text (docs/studio/PROVENANCE.md).
