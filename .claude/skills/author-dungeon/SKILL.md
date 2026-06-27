---
name: author-dungeon
description: Phase 5 of the ClaudeCraft Vanilla Studio. Authors an original instanced dungeon or raid encounter (DungeonDef, spawns, boss/add mobs with affixes) into dungeons.ts and encounter modules. Use to add instanced content with deterministic boss mechanics.
user-invocable: true
---

# Author dungeon: original instanced content

Add an original dungeon or raid encounter using the existing instance and affix shapes.

## Steps

1. Read `src/sim/content/dungeons.ts` (`DungeonDef`, `DungeonSpawn`), the `MobTemplate` affix
   vocabulary in `src/sim/types.ts`, and the reference encounter
   `src/sim/content/encounters/nythraxis.ts`.
2. Fan out the `encounter-design-advisor` agent to produce an encounter spec
   (docs/studio/templates/encounter-spec.md): boss and adds as original mob ids, phases and
   triggers as HP thresholds and timers, and a borrowed-pattern to original-expression table.
3. Author the `DungeonDef` (index, doors, entry/exit, interior key, spawns,
   `suggestedPlayers`, enter/leave text) and the boss/add `MobTemplate` records (affixes:
   `enrage`, `summonAdds`, `aoePulse`, `rampage`, `mendAlly`, ...). Original loot ids.
4. Register in `dungeons.ts`/`data.ts`. Keep adds, timers, and AoE deterministic from a seed.
5. Regenerate the guide: `npm run wiki:content` (spoiler-safe surface only).

## Output

The dungeon and encounter records, registered, with the guide regenerated.

## Gate

`npx tsc --noEmit`; a fidelity test for boss mechanics (deterministic adds/timers);
`/balance-check` (loot/EV); spawn `cross-platform-sync` if it touches `IWorld`/wire;
`/content-provenance-audit` PASS; spawn `lore-consistency-reviewer`.

## Guardrail

Original boss/dungeon/ability names and text; original layout. Borrow only mechanical
patterns (docs/studio/PROVENANCE.md).
