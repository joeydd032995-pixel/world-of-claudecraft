# GDD: <feature name>

Status: draft | in-review | approved
Phase: <0-7>   Owner role: <Game Design Lead | Content Lead | ...>
Linked mechanics spec: `docs/studio/mechanics/<system>.md`

## 1. Summary

One paragraph: what this feature is, the player fantasy it serves, and why now.

## 2. Mechanics reference (neutral)

The math and structure this feature implements, summarized from the linked neutral mechanics
spec. Formulas, ordered rolls, state machines. No copyrighted names or pasted data tables.

## 3. Original-content mapping (mandatory)

How the neutral mechanics become original ClaudeCraft content. For every borrowed *rule*,
name the original *expression* this repo will ship. Examples:

| Mechanical role | Original ClaudeCraft expression |
|---|---|
| (e.g. a fire DoT nuke) | original ability name, school, ranks, description |
| (e.g. a level 1-7 starter zone) | original `ZoneDef` id/name, hub, POIs |

This section is the proof of originality the `content-provenance-auditor` checks.

## 4. Systems and seams

- Sim behavior: `SimContext` module path, state it reads, callbacks it adds.
- `IWorld` surface: new members on `src/world_api.ts` (implemented in `Sim` and `ClientWorld`).
- Content records: which `src/sim/content/*` files and record types (`ItemDef`, `MobTemplate`,
  `AbilityDef`, `QuestDef`, `NpcDef`, `ZoneDef`, `DungeonDef`, `TalentNode`).
- Net: server command and wire fields, if any.

## 5. Balance targets

Numeric goals tied to existing formula budgets (`xpForLevel`, `armorReduction`, rage/energy/
mana costs, dmg-per-level). State the target, the formula it derives from, and the source.

## 6. Edge cases

Determinism hazards, RNG draw order, max/min values, CC interactions, instancing, PvP, empty
inventory, dead target, disconnect mid-action.

## 7. Determinism notes

Confirm: all randomness via `Rng`; fixed 20 Hz; ordered iteration; no `Date.now`/`Math.random`.

## 8. i18n keys

Every new player-visible string as an English `t()` key in the right catalog domain. Sim and
server emit keys, re-localized at the client boundary.

## 9. Test plan

- Fidelity: `tests/studio/<system>.fidelity.test.ts` asserts sim equals the neutral spec.
- Unit/parity: Vitest files touched.
- Visual/E2E: `scripts/*_shot.mjs` or `*_e2e.mjs` evidence.

## 10. Open questions and sign-off

Outstanding decisions for the user; record approvals here.
