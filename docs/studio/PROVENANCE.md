# Provenance and data-sourcing posture

This is the load-bearing legal and creative rule of the ClaudeCraft Vanilla Studio. Every
agent and skill obeys it. The provenance scanner (`scripts/studio/content_provenance_scan.mjs`),
the pre-commit guard hook (`.claude/hooks/provenance-guard.sh`), and the
`content-provenance-auditor` agent exist to enforce it.

## The principle

Game mechanics, formulas, and systems are not protected by copyright. Specific creative
expression is. So the line is sharp:

| Allowed to study and reimplement (reference-only) | Never imported, committed, or redistributed |
|---|---|
| Combat math (hit tables, armor DR, rage/energy/mana, threat) | Item / quest / NPC / zone / spell **names** |
| XP and level curves, stat budgets | Quest and flavor **text**, lore, dialogue |
| Ordered roll resolution and state machines | Map geometry, coordinates, model/texture/audio assets |
| Economy structure (vendor/AH/drop mechanics) | Client-extracted data (DBC, WDB, MPQ, ADT, cache) |
| Progression and itemization curves | Emulator SQL dumps (`item_template`, `creature_template`, `quest_template`, ...) |
| | Client-mod, memory, or auth-bypass tooling |

The repo already ships entirely original content (for example "Eastbrook Vale", "Forest
Wolf", "Marshal Redbrook"). The studio continues that: it borrows the *rules*, never the
*words or pictures*.

## How fidelity stays lawful: the mechanics-spec firewall

Public sources (community wikis, dev posts, emulator math) are studied only to produce a
**neutral mechanics spec** in `docs/studio/mechanics/<system>.md`, written in original prose:
formulas, ordered roll tables, and state machines, with primary-source citations and no
pasted DB rows or copyrighted names. Implementation is then verified against *our own neutral
spec* (`tests/studio/<system>.fidelity.test.ts`), never against live WoW or an imported table.

## Cited sources and how each may be used

- Community wikis and developer write-ups: cite for mechanics and math only.
- cmangos / vmangos / TrinityCore / classic-db / mangoszero / classicdb / World0fWarcraft:
  these are GPL-licensed emulators whose databases also contain copyrighted Blizzard content.
  Read their *code/comments to understand mechanics*; do not copy their data tables, and do
  not introduce GPL-licensed code or data into this repo.
- thatsmybis/classic-wow-item-db, classic-wow-item-db, Kronos, Light's Hope dumps: server
  data dumps of copyrighted content. Reference posture forbids importing them.
- namreeb tooling (nampower, wowned, hadesmem, namigator, wowreeb): client-mod / auth-bypass
  / memory / extraction tooling. Out of scope entirely; never vendored or invoked.

## Off-repo private reference

If a contributor handles raw extracted data on their own machine, it stays in a gitignored
`reference-private/` directory and is never tracked, never read by skills, and never the
source of committed content. The studio's committed surface is reference-only.

## Conventions inherited from the repo

No model-identity strings, no em or en dashes, no emojis in any authored file.
