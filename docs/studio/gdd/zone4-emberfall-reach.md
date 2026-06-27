# GDD: Zone 4 - Emberfall Reach (levels 20-26) + level-cap extension

Status: refined (content design integrated) - awaiting sign-off before implementation
Phase: 1 (Research and Design)   Owner role: Content Lead
Linked mechanics spec: `docs/studio/mechanics/level-curve-21-26.md` (to be authored; section 2)

## 1. Summary

The first content step past the shipped 1-20 game and the first concrete move toward 1-60.
`docs/design/master-spec.md` realized levels 6-20 (zones 2 and 3) and ends with Korzul the
Gravewyrm dead at level 20; `MAX_LEVEL` is 20 and `XP_TABLE` holds vanilla values only through
20. This GDD adds **Emberfall Reach**, an original level 20-26 zone (hub "Cinderhold"), plus
the systemic prerequisite it forces: raising the cap to 26 and extending the XP curve with
authentic classic values. It follows master-spec's patterns exactly (XP budget method, mob HP
anchor, 25% quest-XP ceiling, three-archetype rewards) so it reads as a native continuation.

Player fantasy: Korzul's death-pyre did not go out. It crept through the rock and surfaced
beyond Thornpeak as a blighted ember frontier. A cult remnant, the **Emberbound**, now worship
the fire as the Wyrm's true legacy and try to forge a permanent "ember heart" to make the
blight outlive its own cooling. Heroes push into ash and lava to put the ember out.

This is the integrated design from the studio's `content-design-advisor` and
`encounter-design-advisor` passes, with all advisor conflicts resolved (section 11) and all
engine facts verified against the code (section 12).

## 2. Mechanics reference (neutral)

- **XP-to-level curve, levels 21-26.** The authentic classic per-level XP-to-next values,
  derived from the real classic XP formula (the same source `XP_TABLE` already follows through
  20). Not invented; per the repo invariant they must be sourced. This GDD does NOT list them:
  they come from `docs/studio/mechanics/level-curve-21-26.md`, produced by
  `/vanilla-mechanics-research level-curve-21-26` before implementation.
- **Mob / itemization curves.** Continue master-spec's anchors: mob `hpBase ~= 40 + 18*level`,
  the dmg/level and armor/level slope continuing zone 3, kill XP at level = 45 + 5*mobLevel,
  elite x2, the three-chamber dungeon pacing.

## 3. Original-content mapping (mandatory)

| Mechanical role | Original ClaudeCraft expression |
|---|---|
| Level 20-26 outdoor zone (reuse `peaks` biome) | `ZoneDef` `emberfall_reach`, hub "Cinderhold" |
| Continuing antagonist faction | the Emberbound (Wyrmcult remnant feeding on Korzul's fire) |
| Recurring known face | Brother Aldric -> `brother_aldric_cinderhold` (only character present at Korzul's death) |
| Volcanic/blighted rosters (no new family) | beasts (wargs, charwing rocs), kobolds, undead (blightash), ogres (slagjaw), elementals (magma/ember), humanoid cultists - all existing `MobFamily` |
| 5-player capstone dungeon (index 6) | "The Emberward Vault" (section 8) |
| Tier of greens/blues + final epics | original ids continuing master-spec's naming/itemization cadence |

All names, text, and coordinates are original; no copyrighted content (`docs/studio/PROVENANCE.md`).
Checked: 0 id collisions against the existing corpus. `lore-consistency-reviewer` and
`content-provenance-auditor` run before merge.

## 4. Systems and seams (engine changes - minimal list, mirrors master-spec section 7)

- **Levels and XP (sim core, determinism-sensitive).**
  - Raise `MAX_LEVEL` 20 -> 26 (`src/sim/types.ts`).
  - Extend `XP_TABLE` with six sourced values for 21-26 (from the mechanics spec).
  - **Audit hardcoded level-20 caps** in level-up / ability-learn / talent-point plumbing
    (master-spec section 7.6 warned of a stray level-10 cap; repeat for 20). Grep `MAX_LEVEL`,
    `20`, and clamps across `src/sim/progression/*`, `src/sim/entity.ts`
    (`recalcPlayerStats`), `content/classes.ts` (`abilitiesKnownAt`).
  - No new ability ranks this increment (characters keep their highest existing rank past 20;
    new ranks are a later GDD).
- **Zone content** (`src/sim/content/zone4.ts`, merged in `src/sim/data.ts`): `ZONE4_ZONE`,
  `ZONE4_CAMPS`, `ZONE4_MOBS`, `ZONE4_NPCS`, `ZONE4_QUESTS`, `ZONE4_QUEST_ORDER`,
  `ZONE4_OBJECTS`. z-band 900..1260 (append; `zoneAt`/`WORLD_MIN_Z`/`WORLD_MAX_Z` derive).
- **Biome:** reuse `'peaks'` (zero renderer work). An `'ashlands'` palette is a deferred
  follow-up.
- **MobFamily:** no additions (verified: the roster fits `beast`, `kobold`, `humanoid`,
  `undead`, `ogre`, `elemental`).
- **Dungeon** (`src/sim/content/dungeons.ts`): one `DungeonDef`, **`index: 6`** (verified:
  0-5 are taken, including `drowned_temple` at 3), `interior: 'sanctum'` (reuse, zero renderer
  cost). Deterministic boss mechanics from existing affixes only; no new sim mechanic.
- **IWorld / net:** none expected (pure content through existing snapshot/quest/loot/instance
  paths). If anything surfaces, extend `IWorld` in both `Sim` and `ClientWorld` +
  `cross-platform-sync`.
- **i18n:** new mob/item/quest ids get English source entries in the existing
  `src/ui/world_entity_i18n.ts` / `sim_i18n.ts` id lists (the path zones 1-3 use). S3 guard
  (`tests/localization_fixes.test.ts`) must pass.
- **Guide:** `npm run wiki:content`.

## 5. Zone narrative (3-beat arc, 20-26)

1. **The Ember Frontier (20-22).** The pyre crept down through fissures and surfaced beyond
   Thornpeak: ash dunes, lava pools, cinder scrub. Cinderhold, a half-built waystation, holds a
   line against frontier beasts and mutated kobold-kin. The Emberbound move openly for the first
   time, feeding the fire rather than fleeing it.
2. **The Emberbound Rite (22-24).** The cult are Wyrmcult zealots and necromancers who, denied
   their god's waking, now worship the fire as Korzul's legacy. They raise blightash revenants
   and tame the frontier's beasts as engines of the blight's spread, forging an "ember heart" to
   make it permanent.
3. **The Emberward Vault (24-26).** The forging site is an old vault the cult cracked into a
   furnace-temple. The 5-player capstone ends as the rite completes and calls an elemental
   horror into being; its death seals the vault and the frontier begins to cool - not closed,
   but no longer spreading (a clean hook for a later `ashlands` zone).

## 6. ZoneDef, hub, POIs

`ZoneDef`: id `emberfall_reach`, name "Emberfall Reach", zMin 900, zMax 1260, levelRange [20,26],
biome `peaks`, hub Cinderhold (0,980,r20), graveyard (14,965), lakes used as lava pools
(Slagmere (-60,1060,r16), The Cinderpit (90,1140,r12)), welcome "Warden Ulra holds the line at
Cinderhold, against fire that should have died with the Wyrm."

POIs (z in 900..1260, x in [-180,180]): Cinderhold (0,980); Ashclaw Scrub (-55,1010);
Cindermarch Tunnels (70,1030); The Slagmere (-90,1070); Charwing Roost (50,1080); Blightash
Flats (-40,1120); Slagjaw's Hold (100,1110); Emberbound Camp (0,1160); The Cinderpit (-20,1200);
The Emberward Vault (0,1240). Road continues from the Gravewyrm Sanctum (0,880) -> Cinderhold
(0,980) -> spokes to the POIs (full coords in the advisor proposal, carried into `zone4.ts`).

## 7. Content tables

### 7a. Hub NPCs (Cinderhold) - 6

| id | name / title | quests | vendor |
|---|---|---|---|
| `warden_ulra` | Warden Ulra, Cinderhold Warden | `q_cinderhold_signal` (turn-in), ashclaw/cindermarch/slagjaw lines | - |
| `brother_aldric_cinderhold` | Brother Aldric, Priest of the Vale | Emberbound + blightash + emberward + vault chain | - |
| `scout_brannis` | Scout Brannis, Frontier Tracker | ashclaw alpha, charwing eggs/matriarch | - |
| `quartermaster_dessa` | Quartermaster Dessa | ashclaw pelts, cinder resin | food/drink + armor whites |
| `armorer_kovan` | Armorer Kovan | - | weapon whites |
| `loremaster_sela` | Loremaster Sela | emberash study/cores, vrask | - |

### 7b. Overworld mob roster (14) - all existing families/affixes (verified)

`hpBase ~= 40 + 18*level` anchor; dmg/armor slope continues zone 3 (which ended ~68/24,
13/2.8 at L19-20). Affixes shown are all real `MobTemplate` fields.

| id | name | family | lvl | flags | hp b/lvl | dmg b/lvl | atk | key affix / loot |
|---|---|---|---|---|---|---|---|---|
| `ashclaw_warg` | Ashclaw Warg | beast | 20-21 | - | 70/24 | 13/2.8 | 2.0 | `ashclaw_pelt` 0.6 |
| `ashclaw_alpha` | Ashclaw Alpha | beast | 21 | rare | 380/64 | 17/3.4 | 1.9 | `packFrenzy`; rare timer; `alphas_fang` |
| `cindermarch_kobold` | Cindermarch Stoker | kobold | 21-22 | - | 74/25 | 14/2.9 | 2.1 | `cinder`; `cinder_resin` 0.5 |
| `cindermarch_blaster` | Cindermarch Blaster | kobold | 22 | elite | 130/30 | 16/3.1 | 2.1 | `aoePulse` "Powder Cask" |
| `emberbound_initiate` | Emberbound Initiate | humanoid | 22-23 | - | 78/25 | 15/3.0 | 2.0 | `emberbound_orders` 0.5 |
| `emberbound_pyromancer` | Emberbound Pyromancer | humanoid | 23 | - | 76/25 | 16/3.1 | 2.0 | `smolder`, `spellVuln` |
| `blightash_revenant` | Blightash Revenant | undead | 23-24 | - | 82/26 | 16/3.1 | 2.3 | `soulrot` |
| `blightash_wight` | Blightash Wight | undead | 24 | elite | 150/32 | 18/3.3 | 2.2 | `enervate`; `wight_ash_locket` |
| `charwing_roc` | Charwing Roc | beast | 24 | - | 86/27 | 17/3.2 | 1.9 | `cleave`; `charwing_egg` 0.5 |
| `charwing_matriarch` | Charwing Matriarch | beast | 25 | rare,elite | 520/82 | 22/4.0 | 1.8 | `aoePulse`+`enrage`; rare timer; `matriarchs_talon` |
| `slagjaw_marauder` | Slagjaw Marauder | ogre | 24-25 | - | 90/27 | 18/3.2 | 2.6 | `staggerHit`; `slagjaw_brand` |
| `slagjaw_chieftain` | Slagjaw Chieftain | ogre | 25 | elite,boss | 320/40 | 21/3.6 | 2.7 | `rampage`; gear |
| `magma_husk` | Magma Husk | elemental | 25-26 | - | 96/28 | 19/3.3 | 2.2 | `thorns`; `cooling_slag_core` 0.5 |
| `ember_wisp` | Ember Wisp | elemental | 25 | - | 80/26 | 17/3.1 | 2.4 | `manaBurn`; `ember_wisp_core` 0.5 |
| `vrask_the_emberseer` | Vrask the Emberseer | humanoid | 26 | rare,elite | 560/88 | 23/4.0 | 2.1 | `mendAlly`+`petSpell`; rare timer; `vrasks_emberstaff` |

Camps (~19) and ground sparkles (`cinderhold_signal_flare`, `cinder_resin`,
`emberash_core_sample`, `vault_seal_ember`) per the advisor proposal, carried into `zone4.ts`
with packs spaced >= 14-22 yd (zone 3 spacing) and rares offset 1-2 radii from their camp.

### 7c. Quest chain (20)

Giver/turn-in, objectives, gates per the advisor proposal. Every `xpReward` is "rising by chain
depth, capped at 25% of the at-level requirement" - no absolute numbers until the XP curve spec
lands. Chain spine: `q_cinderhold_signal` (breadcrumb, minLevel 20) -> ashclaw/cindermarch/
emberbound/blightash/charwing/slagjaw/emberash arcs -> `q_emberward_signal` ->
`q_emberward_wisps` -> `q_grand_pyrist` (collect vault seals) -> `q_korzuls_ember` (kill mid-boss
`grand_pyrist_thessian`, 5-player) -> `q_the_emberward_vault` (kill final boss
`vrothaxis_the_ember_heart`, 5-player, ceiling-tier reward ~24.9% precedent). `QUEST_ORDER`
appends after `ZONE3_QUEST_ORDER`'s tail.

### 7d. Itemization (slots fixed to real EquipSlots: mainhand/helmet/shoulder/chest/waist/legs/gloves/feet)

- Quest items (kind 'quest'): `ashclaw_pelt`, `alphas_fang`, `cinder_resin`, `emberbound_orders`
  (single id; `emberbound_token` dropped), `cooling_slag_core`, `wight_ash_locket`,
  `charwing_egg`, `matriarchs_talon`, `ember_wisp_core`, `cinderhold_signal_flare`,
  `emberash_core_sample`, `vault_seal_ember`.
- Greens (uncommon): `ashclaw_treads` (feet, all), `alphas_fang_mantle` (shoulder, all - was
  "cloak"; no back slot exists).
- Blues (rare): `boneash_vest`/`cinderwrought_robe`/`ashveil_jerkin` (chest, WAR/MAG/ROG);
  `chieftains_maul`/`slagforge_warstaff`/`slagjaw_skinning_knife` (mainhand);
  `vrasks_emberstaff`/`emberseer_warblade`/`emberseer_fangs` (mainhand); `matriarchs_crest_helm`
  (helmet, all - was a "bow"; no ranged slot/item kind exists).
- Epics (Emberward Vault final boss): `wyrmash_greatblade` (str12/sta7), `staff_of_the_emberward`
  (int14/spi7), `cinderfang_blades` (agi13/sta6) - one step above zone-3 epics (str10/sta6),
  sell 9000.
- Vendor whites + food/drink (Dessa, Kovan): sized to ~L26 pools (food up to ~1040 hp, drink
  ~1080 mana), armor/weapon whites priced to the band's quest income. Full table in the advisor
  proposal, carried into `zone4.ts`.

## 8. The Emberward Vault (dungeon, index 6, 5-player, level 26)

`DungeonDef`: id `emberward_vault`, name "The Emberward Vault", index 6, doorPos (0,1240),
entry (0,0), exitOffset (0,-6), interior `'sanctum'` (reuse), suggestedPlayers 5, original
enter/leave text. Linear 3-chamber spawn list (~14 trash + mid-boss + final boss), packs of 2
spaced beyond social-aggro, mirroring the Gravewyrm Sanctum pacing.

**Mid-boss `grand_pyrist_thessian`** (humanoid, L26, elite/miniboss): `summonAdds`
{`emberbound_pyromancer`, count 3, atHpPct [0.66, 0.33]} + `aoePulse` "Cinder Nova". The
rite's caster.

**Final boss `vrothaxis_the_ember_heart`** (elemental, L26, elite/boss; the rite-summoned
horror - a distinct entity, not a transformed cultist, matching zone 3's Velkhar/Korzul split).
hpBase 460, hpPerLevel 56, dmgBase 26, dmgPerLevel 4.6 (above the linear baseline, as Korzul ran
420 vs 400). Deterministic affix-driven state machine (HP fraction + sim clock; no `Math.random`):

```
hp >= 0.50   -> aoePulse "Heartfire Eruption" (min34 max48 r16 every9, fire, fx nova)   [P1]
hp first < 0.50 -> summonAdds ember_wisp x2 (one-shot, latched)                          [adds]
hp < 0.25    -> enrage (dmgMult 1.5, hasteMult 1.25) + pulse continues                   [P2 burn]
```

Loot: 6000 copper + one of three epics (`wyrmash_greatblade` 0.34 / `staff_of_the_emberward`
0.33 / `cinderfang_blades` 0.33, archetype-locked via `requiredClass`). Mid-boss drops a rare +
coin. The `q_the_emberward_vault` quest grants a guaranteed per-archetype chest piece
(`boneash_vest`/`cinderwrought_robe`/`ashveil_jerkin`) so every class leaves with best-in-slot,
exactly as `q_gravewyrm` did.

Borrowed-pattern -> original-expression and the full spawn list are recorded with the dungeon in
`zone4.ts`/`dungeons.ts` at implementation; all mechanics reuse existing affixes (`aoePulse`,
`summonAdds`, `enrage`), no new sim mechanic.

## 9. Balance targets

Derived, not invented, from the extended curve and master-spec's method (section 5):
total zone XP supply >= the 20->26 requirement with ~12% headroom (quests ~65% + required kills
x1.6); single quest reward <= 25% of the at-level requirement; mob `hpBase ~= 40 + 18*level`;
final-boss epics one quality step above zone-3 epics. Validated by `/balance-check` +
`balance-reviewer` + `economy-balance-advisor`.

## 10. Edge cases, determinism, i18n, tests

- Determinism: rare-spawn timers reuse the existing rare pattern; dungeon adds/timers seeded;
  all randomness via `Rng`; fixed 20 Hz; ordered iteration. `tests/architecture.test.ts` green.
- Cap raise must not break post-cap systems: audit `src/sim/progression/xp.ts` (prestige,
  rested, lifetime, virtual level) and `docs/prd/max-level-xp-overflow.md` so "max level" keys
  off `MAX_LEVEL`, not a literal 20. Confirm talent-point grants extend to 26.
- Save/load back-compat: existing level-20 characters load and continue past 20 (JSONB; spawn
  `migration-safety`).
- i18n: content names/text are English source surfaced via the existing matchers; S3 guard
  passes.
- Tests: `tests/studio/level-curve-21-26.fidelity.test.ts` (XP table vs spec; seeded 20->26
  level-up); `npm run audit:quests`; `npm run wiki:content` no diff; parity + `tsc`;
  `migration-safety`. Aggregated by `/studio-gate-check`.

## 11. Resolved decisions (advisor conflicts)

1. **Cap target = 26** (full zone band; user-confirmed).
2. **Biome = reuse `peaks`** (no renderer work this pass).
3. **Recurring NPC = Brother Aldric only** (`brother_aldric_cinderhold`); Scout Brannis is a new
   tracker (Maren's arc resolved at Korgath).
4. **Dungeon = "The Emberward Vault", index 6** (the encounter advisor's "Cindervault/index 3"
   was superseded: index 3 is `drowned_temple`; the roster advisor's integrated vault is
   canonical). Final-boss phase detail adopts the encounter advisor's deterministic state-machine
   format.
5. **Final boss = distinct entity** (`grand_pyrist_thessian` mid-boss casts the rite ->
   `vrothaxis_the_ember_heart` summoned final boss), matching the Velkhar/Korzul split.
6. **No new MobFamily; no new mob affix** (all verified to exist).
7. **Reward slots use only real EquipSlots** ("cloak"/"bow" rewards re-slotted to shoulder/helmet;
   `emberbound_token` folded into `emberbound_orders`).

## 12. Engine facts verified against the code

- `MAX_LEVEL = 20`, `XP_TABLE` has 20 entries (`src/sim/types.ts`).
- Dungeon indices 0-5 in use (`dungeons.ts` 0,1,2,4,5; `temple.ts` 3) -> index 6 free.
- `EquipSlot` = mainhand|helmet|shoulder|chest|waist|legs|gloves|feet (no ranged/back).
- All roster/boss affixes exist on `MobTemplate` (`cinder`, `smolder`, `soulrot`, `enervate`,
  `staggerHit`, `thorns`, `manaBurn`, `cleave`, `petSpell`, `packFrenzy`, `rampage`, `mendAlly`,
  `aoePulse`, `summonAdds`, `enrage`, `spellVuln`, plus `corrode`/`deathThroes` available if
  wanted).

## 13. Next steps (build vehicle)

Per `/studio-start`, the implementation spans determinism-sensitive sim core (cap/XP) + a full
content zone + a dungeon - large enough to run through `feature-plan`, in order:
1. `/vanilla-mechanics-research level-curve-21-26` (authentic XP values -> neutral spec).
2. `feature-plan`: Phase 2 sim core (MAX_LEVEL/XP_TABLE + cap audit), then `/author-zone`
   (zone4.ts content), then `/author-dungeon` (Emberward Vault), each gated by
   provenance + fidelity + balance + lore reviews + `cross-platform-sync` if any IWorld touch.

Sign-off: ____
