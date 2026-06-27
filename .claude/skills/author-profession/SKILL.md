---
name: author-profession
description: Phase 5 of the ClaudeCraft Vanilla Studio. Designs and implements an original profession subsystem (gathering or crafting with a skill-up curve) as a SimContext module plus content records. Use to add professions as part of the 1-60 systemic spine.
user-invocable: true
---

# Author profession: a new subsystem

A profession is both behavior (a `SimContext` module) and content (recipes, materials,
trainers). Build it the module-first way.

## Steps

1. Research the mechanics first: `/vanilla-mechanics-research professions` to produce a
   neutral spec (skill-up curve, gather/craft resolution, difficulty colors), then `/studio-gdd`.
2. Behavior: add `src/sim/<profession>/` (or a shared `src/sim/professions/`) module behind
   `SimContext`; state on `Sim`. Draw randomness from the shared `Rng` per the spec.
3. Surface: extend `IWorld` (gather action, craft action, skill query) in both `Sim` and
   `ClientWorld` via `/author-system`.
4. Content: recipes and materials as `ItemDef` records (with `use`/`tool` where relevant),
   trainer NPCs, and gather `GroundObjectDef` nodes, all original and merged in `data.ts`.
5. Tie skill-up rates and material values to the balance budget and the economy model.
6. Regenerate the guide: `npm run wiki:content`.

## Output

The profession module, the `IWorld` surface in both worlds, content records, and tests.

## Gate

`npx tsc --noEmit`; `tests/architecture.test.ts`; a fidelity test for the skill-up curve;
`/economy-model` + `/balance-check`; spawn `cross-platform-sync`; `/content-provenance-audit`
PASS.

## Guardrail

Original profession, recipe, and material names. Deterministic; reference-only and original.
