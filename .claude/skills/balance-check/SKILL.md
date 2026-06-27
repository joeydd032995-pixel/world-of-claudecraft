---
name: balance-check
description: Phase 6 of the ClaudeCraft Vanilla Studio. Audits combat and economy numbers in new or changed content against GDD targets and the repo's existing formula budgets, and reports outliers and progression cliffs. Use after authoring content or tuning numbers.
user-invocable: true
---

# Balance check

Catch numbers that drifted from a formula budget or GDD target. The invariant is "do not
invent balance numbers."

## Steps

1. Gather the changed content (`src/sim/content/*`) and the GDD's Balance targets plus any
   economy model.
2. Spawn the `balance-reviewer` agent (combat/itemization) and, for economy scope, the
   `economy-balance-advisor` agent.
3. Cross-check each number against its budget: `xpForLevel`/`XP_TABLE`, `armorReduction`,
   `rageConversion`, hit-table functions, per-level dmg/HP/armor curves, vendor spreads, drop
   EV, World Market fees.

## Output

A findings table (file:line, the number, expected range and derivation, severity) and a
one-line verdict. Recommend specific corrected values tied to budgets.

## Gate

No invented numbers; no progression cliffs or exploits; outliers justified or fixed.

## Guardrail

Reference-only and original; numbers come from formulas/targets, not from copied data tables.
