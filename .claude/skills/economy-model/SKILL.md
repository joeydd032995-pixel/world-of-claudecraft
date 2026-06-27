---
name: economy-model
description: Phase 5 of the ClaudeCraft Vanilla Studio. Models the copper economy (faucets, drains, vendor spreads, drop EV, World Market fees, profession output) and proposes tuned numbers tied to formula budgets. Use when adding content that affects the economy or when balancing currency flow.
user-invocable: true
---

# Economy model

Keep the economy stable and tied to the progression curve as content scales toward 1-60.

## Steps

1. Spawn the `economy-balance-advisor` agent. It reads `ItemDef.sellValue`/`buyValue`,
   `LootEntry`, vendor `vendorItems`, the World Market (`src/sim/market.ts`), quest
   `copperReward`/`xpReward`, and `xpForLevel` pacing.
2. Build the model from docs/studio/templates/economy-model.md: faucets-and-drains, targets
   (copper per level band, vendor spreads, drop EV, AH fee/cut), and a tuning table mapping
   each original item/source to a field, a value, and its derivation.
3. Save it to `docs/studio/economy/<scope>.md`.
4. Apply tuned numbers to the content records (or hand them to the relevant `author-*` skill).

## Output

A saved economy model and the tuned numbers (or a tuning handoff).

## Gate

`/balance-check` PASS; every number tied to a budget; no inflation/exploit risk flagged
unaddressed.

## Guardrail

Item and currency names are original; numbers come from formulas, not copied data tables.
