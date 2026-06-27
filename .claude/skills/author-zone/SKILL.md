---
name: author-zone
description: Phase 5 of the ClaudeCraft Vanilla Studio. Authors an original zone as typed content records (ZoneDef, camps, mobs, NPCs, quests, ground objects) and merges it in data.ts. Use to expand the world toward 1-60 with original, level-banded content.
user-invocable: true
---

# Author zone: an original region

Add a new original zone that fits the existing content shapes, lore, and progression curve.

## Steps

1. Read `src/sim/content/zone1.ts` end to end as the template, and the record types in
   `src/sim/types.ts` (`ZoneDef`, `CampDef`, `MobTemplate`, `NpcDef`, `QuestDef`,
   `GroundObjectDef`).
2. Fan out the `content-design-advisor` agent for the design (theme, original names, mob
   roster with affixes, quest chain, item rewards) tuned to the target level band's
   `xpForLevel` pacing. Fan out one advisor per camp/quest cluster for large zones.
3. Author `src/sim/content/zone<N>.ts` exporting `ZONE<N>_ZONE`, `ZONE<N>_CAMPS`,
   `ZONE<N>_MOBS`, `ZONE<N>_NPCS`, `ZONE<N>_QUESTS`, `ZONE<N>_QUEST_ORDER`, objects.
4. Merge in `src/sim/data.ts` (ITEMS/MOBS/NPCS/QUESTS/ZONES/CAMPS, QUEST_ORDER) in
   deterministic array order.
5. Regenerate the guide: `npm run wiki:content`.

## Output

A new `zone<N>.ts`, merged in `data.ts`, with the guide regenerated.

## Gate

`npx tsc --noEmit`; `npm run audit:quests` (quest graph valid); `npm run wiki:content` leaves
no diff; `/content-provenance-audit` PASS; spawn `lore-consistency-reviewer` and
`balance-reviewer`.

## Guardrail

Original names, text, and layout only. No copyrighted zone/mob/NPC/quest names, no copied
coordinates (docs/studio/PROVENANCE.md).
