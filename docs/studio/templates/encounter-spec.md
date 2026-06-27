# Encounter spec: <original encounter name>

Used by `/author-dungeon` and the `encounter-design-advisor` agent. Maps Vanilla boss
patterns to an original ClaudeCraft encounter using the existing `MobTemplate` affix
vocabulary. All names and text are original.

## Encounter overview

- Dungeon: `DungeonDef` id and `interior` key.
- Suggested players: <n>.
- Fantasy: one line.

## Boss and adds

| Role | Mob id (original) | Key affixes |
|---|---|---|
| boss | | `enrage`, `summonAdds`, `aoePulse`, `rampage`, ... |
| add | | |

## Phases and triggers

State machine: HP thresholds, add waves (`summonAdds.atHpPct`), enrage timer
(`enrage.belowHpPct`), ground AoE (`aoePulse`/`groundAoE`). Keep it deterministic (seeded).

## Mechanics borrowed (neutral) vs expression (original)

| Mechanical pattern | Original ClaudeCraft expression |
|---|---|
| (e.g. periodic raid-wide AoE) | original aoePulse name, school, fx |

## Loot

Original item ids and rarities; drop rates tied to the economy model.

## Validation

- [ ] Determinism: adds and timers seeded; same seed same fight.
- [ ] `cross-platform-sync` PASS if it touches `IWorld`/wire.
- [ ] Provenance clean.
