# Economy model: <scope>

Used by `/economy-model` and the `economy-balance-advisor` agent. Models flows in copper and
ties tuned numbers back to formula budgets. All item and currency names are original.

## Sources and sinks

| Faucet (copper in) | Drain (copper out) |
|---|---|
| quest rewards, vendor sell, drops | vendor buy, repair, AH cut, consumables |

## Targets

- Copper per level band (derived from `xpForLevel` pacing and quest density).
- Vendor buy/sell spreads (`buyValue`/`sellValue` on `ItemDef`).
- Drop rates and expected value per kill (`LootEntry.chance`).
- AH (World Market) listing fee and cut.

## Tuning table

| Item / source | Field | Proposed value | Derivation / source |
|---|---|---|---|
| (original item id) | sellValue | | |

## Risks

Inflation/deflation, gold sinks adequacy, profession arbitrage, multi-account effects.

## Validation

- [ ] `/balance-check` report attached.
- [ ] Numbers tied to a formula budget, not invented.
