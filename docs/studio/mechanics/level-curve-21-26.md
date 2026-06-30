# Mechanics spec: experience-to-next-level curve, levels 21 to 26

NEUTRAL spec. Original prose. Math and structure only. No copyrighted names, no pasted DB
rows. This file is checked by `scripts/studio/mechanics_spec_lint.mjs` and is the firewall
the implementation is tested against.

Status: approved
Linked GDD: `docs/studio/gdd/zone4-emberfall-reach.md`

## Formula

The amount of experience a character must accumulate to advance from a given level L to level
L+1 is a deterministic, closed-form function of L. It follows the standard classic-era
per-level shape:

```
xpToNext(L) = round100( ( 8 * L + diff(L) ) * mxp(L) * rf(L) )
```

Variables, all integer-valued unless noted:

- `L` is the character's current level (the level being advanced FROM). `xpToNext(L)` is the
  experience required to reach `L + 1`. This matches the existing repo contract:
  `xpForLevel(L)` in `src/sim/types.ts` returns the cost of the L -> L+1 step, indexed as
  `XP_TABLE[min(L - 1, len - 1)]`.
- `mxp(L)` is the per-level base experience scalar (the "average single-kill" reference value
  the curve is built on):

  ```
  mxp(L) = 45 + 5 * L
  ```

- `diff(L)` is a small difficulty addend that is zero for all low-to-mid levels and only
  becomes nonzero near the late game. For every level in this spec's range (and for all
  L <= 28) it is exactly 0:

  ```
  diff(L) = 0            for L <= 28
  ```

  Because `diff(L) = 0` across levels 1 through 26, it drops out of the math here and is
  listed only so the formula's general shape is complete and the variable is defined.
- `rf(L)` is a rounding/relief multiplier. It is a later-era addition (introduced in a
  post-classic content patch) used to discount mid-level costs. The target here is the
  classic (pre-relief) curve, so:

  ```
  rf(L) = 1             (classic era; the relief discount is not applied)
  ```

- `round100(x)` rounds the product to the nearest multiple of 100, with halves rounding up
  (`round100(x) = floor((x + 50) / 100) * 100`). This is the published quantization of the
  classic table and is what reproduces the exact integer anchors below. Without it the raw
  product is off by up to 40 XP on roughly half the levels.

For the levels in scope, since `diff(L) = 0` and `rf(L) = 1`, this reduces to:

```
xpToNext(L) = round100( 8 * L * (45 + 5 * L) )
```

### Anchor cross-check

The same formula reproduces every value already present in `XP_TABLE` (levels 1 through 20),
which is the trust check. Spot anchors (using the repo's true indexing, where `xpForLevel(L) =
XP_TABLE[L - 1]`):

- L = 10: raw = 8 * 10 * (45 + 50) = 7600, round100 -> 7600 (repo entry for L = 10).
- L = 11: raw = 8 * 11 * (45 + 55) = 8800, round100 -> 8800 (repo entry for L = 11).
- L = 19: raw = 8 * 19 * (45 + 95) = 8 * 19 * 140 = 21280, round100 -> 21300 (matches anchor).
- L = 20: raw = 8 * 20 * (45 + 100) = 8 * 20 * 145 = 23200, round100 -> 23200 (matches the
  repo's known level-20 anchor exactly, the value the extension must stay consistent with).

A full replay over L = 1..20 reproduces all twenty existing `XP_TABLE` entries with zero
deviation, which validates the `mxp`, `diff`, `rf`, and `round100` choices.

### Resulting values, levels 21 to 26

`xpToNext(L)` is the experience to advance FROM the listed level to the next:

| Level L (advance L -> L+1) | Raw 8 * L * (45 + 5L) | XP to advance (round100) |
|---|---|---|
| 21 | 25200 | 25200 |
| 22 | 27280 | 27300 |
| 23 | 29440 | 29400 |
| 24 | 31680 | 31700 |
| 25 | 34000 | 34000 |
| 26 | 36400 | 36400 |

Implementation note: these six integers extend `XP_TABLE` to length 26, and `MAX_LEVEL`
becomes 26. The level-26 entry (36400) is the value `xpForLevel(MAX_LEVEL)` returns, which the
post-cap / virtual-level machinery in `src/sim/types.ts` reads as the first post-cap step
(`XP_TABLE[MAX_LEVEL - 1]`); it is therefore required even though no real level 27 exists.

## Ordered rolls

Not applicable. Leveling and the XP curve are fully deterministic: there are no random draws.
No `Rng.next()` call is made anywhere in level-up resolution, XP accrual, or threshold
comparison. The only randomness in the broader progression pipeline lives upstream in
loot/quest reward generation, which is out of scope for this curve spec. The XP-to-next value
for any level is a pure function of the level alone.

## State machine

XP and level live in player state as `xp` (progress into the current level) and `level`.
Level-up is resolved as a drain loop, evaluated whenever XP is granted. Within the fixed
20 Hz sim tick (DT = 0.05s), an XP grant for a tick is applied once and the loop runs to
completion in that same tick (it is not spread across ticks):

```
States: BELOW_CAP, AT_CAP

on xp grant (delta):
  xp += delta
  while level < MAX_LEVEL and xp >= xpForLevel(level):
    xp -= xpForLevel(level)     # carry the remainder into the new level
    level += 1
  if level >= MAX_LEVEL:
    state = AT_CAP
    # freeze the level; remaining xp does not roll the real level past MAX_LEVEL
  else:
    state = BELOW_CAP
```

Transitions and timers:

- BELOW_CAP -> BELOW_CAP: each iteration subtracts the current level's threshold and
  increments the level, carrying any leftover XP forward into the next level (a single large
  grant can cross multiple levels in one tick; the loop handles this).
- BELOW_CAP -> AT_CAP: the increment that reaches `MAX_LEVEL` (26) ends the loop via the
  `level < MAX_LEVEL` guard. No further real-level increments occur.
- AT_CAP: the loop body is never entered (guard fails immediately). XP continues to be
  tracked for the cosmetic virtual-level / prestige systems already in
  `src/sim/types.ts`, but `level` stays pinned at 26. This is the existing behavior; raising
  `MAX_LEVEL` from 20 to 26 only moves where the freeze happens.

There are no cooldowns, channels, GCDs, or auras involved; the loop is synchronous and
order-independent across players. Because every term is deterministic and the loop is a pure
function of `(level, xp, delta)`, replaying the same XP grants in the same order on any of the
three sim hosts produces identical levels and remainders.

## Edge cases

- Floor / boundary: `xp` is always non-negative and strictly less than `xpForLevel(level)`
  after the loop settles (for any level below the cap). Exact-threshold grants
  (`xp == xpForLevel(level)`) do trigger a level-up, leaving `xp = 0` in the new level.
- Cap clamp: at `level == MAX_LEVEL` the `level < MAX_LEVEL` guard blocks all further
  increments regardless of how much XP is granted; surplus XP is retained by state but never
  advances the real level. `xpForLevel` already clamps its index (`min(level - 1, len - 1)`),
  so calling it at or above the cap is safe and returns the level-26 entry.
- Level-difference terms: this curve is the player-side cost only. The amount of XP awarded
  per kill or quest (which does scale with the level gap between player and target) is a
  separate system and does not change these thresholds.
- `diff(L)` and `rf(L)`: both are inert across levels 1 to 26 (`diff = 0`, `rf = 1`). They are
  defined here only so the formula remains valid if the cap is ever pushed past level 28,
  where `diff(L)` first becomes nonzero. Any future extension past 28 must reintroduce the
  difficulty addend and must decide explicitly whether to keep the classic curve (`rf = 1`)
  or adopt the later relief multiplier; that decision is out of scope here.
- Cross-system interaction: `MAX_LEVEL` is consumed by the virtual-level and prestige helpers
  in `src/sim/types.ts` (`VLEVEL_CUM`, `virtualLevel`, `PRESTIGE_XP_PER_RANK`,
  `maxPrestigeRank`). Raising it to 26 shifts the cumulative real-level XP total and changes
  `PRESTIGE_XP_PER_RANK` (which equals `xpForLevel(MAX_LEVEL)`, now 36400 instead of 23200).
  Implementers must rebuild those derived tables and re-run their tests; the curve change is
  not isolated to `XP_TABLE`. The talent-point budget (`talentPointsAtLevel`, 1 point per
  level past level 9) likewise rises from 11 at the old cap to 17 at level 26.
- Integer exactness: all six values are exact multiples of 100 by construction, so there is no
  floating-point drift; store them as plain integers.

## Sources

Primary public sources consulted for the classic-era per-level experience formula and its
quantized values:

- WoWWiki archive, formula page describing the per-level experience function as
  `(8 * level + difficulty) * mobXPbase * roundingFactor` with the mob-XP base
  `45 + 5 * level`, the difficulty addend being zero below the late-game brackets, and the
  rounding factor being a later-patch relief term: https://wowwiki-archive.fandom.com/wiki/Formulas:XP_To_Level
- Wowpedia / Warcraft Wiki "Experience to level", which publishes the pre-relief (classic-era)
  per-level table; the levels 21 through 25 values derived here (25200, 27300, 29400, 31700,
  34000) match its pre-patch-2.3.0 figures: https://wowpedia.fandom.com/wiki/Experience_to_level
- Vanilla WoW archive "Experience point" reference, cross-checked for the same pre-relief
  table: https://vanilla-wow-archive.fandom.com/wiki/Experience_point

Verification performed independently of the sources: the formula above was replayed over
levels 1 to 20 and reproduces every value already in the repo's `XP_TABLE` exactly (including
the anchors 7600 at level 10, 8800 at level 11, 21300 at level 19, and 23200 at level 20),
giving high confidence in the levels 21 to 26 extrapolation. Level 26 (36400) rests on the
validated formula (its raw product is already a clean multiple of 100, so there is no rounding
ambiguity) rather than a directly quoted table row.

No copyrighted names, quest, zone, item, or flavor text, and no database rows were reproduced.
This spec contains only mathematics (a closed-form integer formula) and the resulting integer
thresholds, which are facts about a game system and are not themselves copyrightable
expression. The values were derived from the cited public formula and cross-checked against
published community tables; none were copied from an emulator data dump or client-extracted
data.
