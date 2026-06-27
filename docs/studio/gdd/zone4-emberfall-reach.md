# GDD: Zone 4 - Emberfall Reach (levels 20-26) + level-cap extension

Status: draft
Phase: 1 (Research and Design)   Owner role: Content Lead
Linked mechanics spec: `docs/studio/mechanics/level-curve-21-26.md` (to be authored; see section 2)

## 1. Summary

The first content step past the shipped 1-20 game and the first concrete move toward the
1-60 vision. `docs/design/master-spec.md` realized levels 6-20 (zones 2 and 3) and ends with
Korzul the Gravewyrm dead at level 20; `MAX_LEVEL` is 20 and `XP_TABLE` holds vanilla values
only through 20. This GDD adds **Emberfall Reach**, an original level 20-26 zone, plus the
systemic prerequisite it forces: raising the level cap and extending the XP curve with
authentic classic-era values. It follows master-spec's established patterns exactly (XP budget
method, mob HP anchor, quest XP ceiling, three-archetype rewards) so it reads as a native
continuation, not a bolt-on.

Player fantasy: the Gravewyrm's death-pyre scorched the far slopes beyond Thornpeak into a
blighted volcanic frontier. The necrotic fire did not die with Korzul; it took root. Heroes
push past the peaks into ash and ember to stop the blight before it spreads back down the range.

## 2. Mechanics reference (neutral)

Two mechanical pieces, both from the host repo's existing classic-era model:

- **XP-to-level curve, levels 21-26.** The vanilla per-level XP-to-next values for 21-26,
  derived from the real classic XP formula (the same source `XP_TABLE` already follows through
  20). These are authentic numbers, not invented; per the repo invariant they must be sourced,
  not guessed. This GDD does NOT list them: they come from the neutral spec
  `docs/studio/mechanics/level-curve-21-26.md`, produced by `/vanilla-mechanics-research
  level-curve-21-26` before implementation.
- **Mob and itemization curves.** Continue master-spec's anchors unchanged: mob
  `hpBase ~= 40 + 18*level`, dmg/level and armor/level continuing the zone-3 slope, kill XP at
  level = 45 + 5*mobLevel, elite x2, the three-chamber dungeon pacing.

## 3. Original-content mapping (mandatory)

| Mechanical role | Original ClaudeCraft expression |
|---|---|
| Level 20-26 outdoor zone, new biome | `ZoneDef` id `emberfall_reach`, name "Emberfall Reach", hub "Cinderhold" |
| Continuing antagonist faction | the Emberbound (original): cultists who fed on Korzul's necrotic fire |
| New mob family or two (volcanic/blighted) | candidates: an ash-elemental variant (reuse `elemental` family) and a blighted-beast roster; a new `MobFamily` only if a roster needs it |
| 5-player capstone dungeon (index 3) | original dungeon "The Emberward Vault" with an original final boss |
| Tier of quest greens/blues + final epics | original item ids continuing the master-spec naming cadence |

All names, flavor text, and layout are original. No copyrighted names, coordinates, or text
(see `docs/studio/PROVENANCE.md`). The `lore-consistency-reviewer` checks continuity with the
Gravecaller saga; the `content-provenance-auditor` checks originality.

## 4. Systems and seams

Mirrors master-spec section 7 (the proven "minimal engine changes" list), advanced one band:

- **Levels and XP (sim core, determinism-sensitive).**
  - Raise `MAX_LEVEL` 20 -> 26 in `src/sim/types.ts`.
  - Extend `XP_TABLE` with the six sourced values for 21-26 (from the mechanics spec).
  - **Audit for hardcoded level-20 caps** in level-up and ability-learn plumbing (master-spec
    section 7.6 warned about a stray level-10 cap; repeat that audit for 20). Grep for `20`,
    `MAX_LEVEL`, and level clamps across `src/sim/progression/*`, `src/sim/sim.ts`,
    `content/classes.ts` (`abilitiesKnownAt`).
  - Abilities: no new ability ranks this increment. Characters keep their highest existing
    rank past 20 (vanilla does not add a rank every level). New ranks are a separate later GDD.
- **Zone content** (`src/sim/content/zone4.ts`, merged in `src/sim/data.ts`): `ZONE4_ZONE`,
  `ZONE4_CAMPS`, `ZONE4_MOBS`, `ZONE4_NPCS`, `ZONE4_QUESTS`, `ZONE4_QUEST_ORDER`, ground
  objects. z-band 900..1260 (append; `zoneAt`/`WORLD_MIN_Z`/`WORLD_MAX_Z` derive). World grows
  to 360 x 1440.
- **Biome** (`BiomeId` in `src/sim/types.ts`): add one literal (for example `'ashlands'`) if a
  distinct palette is wanted; otherwise reuse `'peaks'`. Renderer needs the palette only if a
  new biome is added (Phase 3, `/author-render-ui`).
- **Mob families** (`MobFamily` union): add only what a roster truly needs; prefer reusing
  `elemental`, `undead`, `humanoid`, `dragonkin`.
- **Dungeon** (`src/sim/content/dungeons.ts`): one `DungeonDef`, `index: 3`, reusing an
  existing `interior` key (`'sanctum'` or `'crypt'`) for zero renderer cost. Deterministic
  boss mechanics only (reuse `aoePulse`, `summonAdds`, `enrage`; no new sim mechanic).
- **IWorld / net.** None expected: zones, mobs, quests, and items are pure content and flow
  through the existing snapshot/quest/loot paths. If the cap raise surfaces any new player
  query, extend `IWorld` in both `Sim` and `ClientWorld` (then `cross-platform-sync`).
- **Guide.** Player-facing content regenerates via `npm run wiki:content`.

## 5. Balance targets

Derived, not invented, from the extended curve and master-spec's method (section 5):

- Total zone XP supply >= the 20->26 requirement (sum of the new `XP_TABLE` values), with
  master-spec's ~12% headroom, split quests (~65%) + required kills x1.6 overshoot (~35%).
- Single quest reward <= 25% of the at-level XP requirement (master-spec ceiling; precedent
  q_gravewyrm 24.9%).
- Mob `hpBase ~= 40 + 18*level`; kill XP at level = 45 + 5*mobLevel; elite x2.
- Quest copper and vendor prices scale from the band's quest income (continue the zone-3
  economy slope); final-boss epics at the next quality step above zone-3 epics.
- Validated by `/balance-check` and the `balance-reviewer` and `economy-balance-advisor` agents.

## 6. Edge cases

- Determinism: rare-spawn timers reuse the `old_greyjaw` pattern; dungeon adds/timers seeded.
- The cap raise must not break post-cap systems: audit `src/sim/progression/xp.ts` (prestige,
  rested XP, lifetime XP, virtual level) and the max-level XP-overflow PRD
  (`docs/prd/max-level-xp-overflow.md`) so "max level" logic keys off `MAX_LEVEL`, not a literal 20.
- Talents: confirm talent-point grants extend correctly to level 26 (points-per-level plumbing).
- Save/load back-compat: existing level-20 characters must load and be able to continue past 20
  (JSONB state; spawn `migration-safety`).
- Empty/dead-target, CC, instancing, and PvP behave as in existing zones (no new mechanic).

## 7. Determinism notes

All randomness via `Rng`; fixed 20 Hz; ordered iteration for camps/spawns. No `Date.now` or
`Math.random`. `tests/architecture.test.ts` must stay green.

## 8. i18n keys

Content names and flavor text live in the content records as the English source and surface
through the existing `src/ui/sim_i18n.ts` / `server_i18n.ts` matchers (the same path zones 1-3
use). Any genuinely new UI string (none expected) is an English `t()` key. The S3 guard
(`tests/localization_fixes.test.ts`) must pass.

## 9. Test plan

- Fidelity: `tests/studio/level-curve-21-26.fidelity.test.ts` asserts `XP_TABLE`/`xpForLevel`
  match the neutral spec, and that a seeded character can level 20 -> 26.
- Content: `npm run audit:quests` (quest graph valid, no orphan prerequisites); `npm run
  wiki:content` leaves no diff.
- Determinism/parity: `tests/architecture.test.ts`, parity tests, `tsc --noEmit`.
- Migration: `migration-safety` on the cap-raise save/load path.
- Gates aggregated by `/studio-gate-check`.

## 10. Open questions and sign-off

Decisions to confirm before implementation (Phase 2/5):

1. **Cap target.** 26 (a 6-7 level band matching the existing zone cadence) vs a smaller first
   step (for example 23). Recommendation: 26.
2. **New biome vs reuse.** Add `'ashlands'` (one renderer palette of Phase 3 work) vs reuse
   `'peaks'` (zero renderer work). Recommendation: reuse `'peaks'` for the first pass, add the
   palette in a follow-up.
3. **Build vehicle.** This spans determinism-sensitive sim core (cap/XP), a full content zone,
   and a dungeon: large enough that `/studio-start` prescribes handing the implementation to
   the `feature-plan` skill, starting with `/vanilla-mechanics-research level-curve-21-26`.
   Recommendation: yes, run it through `feature-plan`.

Sign-off: ____
