---
name: studio-gdd
description: Phase 1 of the ClaudeCraft Vanilla Studio. Authors a Game Design Document for a feature from the studio template, including the mandatory Original-content mapping that turns borrowed mechanics into original ClaudeCraft expression. Use after a neutral mechanics spec exists and before implementation.
user-invocable: true
---

# Studio GDD: design a feature

Write the GDD that bridges a neutral mechanics spec to original, seam-aware implementation.

## Steps

1. Confirm the linked spec exists (`docs/studio/mechanics/<system>.md`); if not, run
   `/vanilla-mechanics-research` first.
2. Adopt the Game Design Lead role (docs/studio/org-chart.md). Consult the
   `content-design-advisor` and (for economy) `economy-balance-advisor` agents for options.
3. Author `docs/studio/gdd/<feature>.md` from docs/studio/templates/gdd.md. Fill every
   section. The Original-content mapping section is mandatory: for every borrowed rule, name
   the original ClaudeCraft expression that will ship.
4. Name the seams precisely: the `SimContext` module, the `IWorld` members (in both `Sim` and
   `ClientWorld`), the `src/sim/content/*` record types, and any net command.
5. Tie balance targets to existing formula budgets; do not invent numbers.
6. List i18n keys (every player string is an English `t()` key) and the test plan.
7. Present open questions; get user sign-off in `full` review mode.

## Output

A complete `docs/studio/gdd/<feature>.md` and an updated `docs/studio/active.md`.

## Gate

Every template section present; Original-content mapping non-empty; balance targets sourced.

## Guardrail

Reference-only and original (docs/studio/PROVENANCE.md).
