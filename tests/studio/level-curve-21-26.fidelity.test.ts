// Fidelity test for the level-cap extension to 26.
//
// Asserts the sim matches the NEUTRAL spec docs/studio/mechanics/level-curve-21-26.md
// (never live WoW): the XP curve, the deterministic level-up state machine, and the
// derived prestige / virtual-level / talent-point math that depend on MAX_LEVEL.
//
// Run: npx vitest run tests/studio/level-curve-21-26.fidelity.test.ts

import { describe, expect, it } from 'vitest';
import {
  MAX_LEVEL,
  PRESTIGE_XP_PER_RANK,
  XP_TABLE,
  maxPrestigeRank,
  virtualLevel,
  virtualLevelProgress,
  xpForLevel,
  xpToReachLevel,
} from '../../src/sim/types';
import { FIRST_TALENT_LEVEL, talentPointsAtLevel } from '../../src/sim/content/talents';
import { Sim } from '../../src/sim/sim';

// The classic per-level XP-to-next formula from the spec: round100(8*L*(45+5L)).
const round100 = (x: number) => Math.floor((x + 50) / 100) * 100;
const xpFormula = (L: number) => round100(8 * L * (45 + 5 * L));

// The six sourced values for levels 21..26 (spec section "Resulting values").
const NEW_VALUES: Record<number, number> = {
  21: 25200,
  22: 27300,
  23: 29400,
  24: 31700,
  25: 34000,
  26: 36400,
};

describe('level-curve 21-26: XP table matches the neutral spec', () => {
  it('raises the cap to 26', () => {
    expect(MAX_LEVEL).toBe(26);
  });

  it('XP_TABLE has 26 entries so XP_TABLE[MAX_LEVEL-1] is defined', () => {
    expect(XP_TABLE).toHaveLength(26);
    expect(XP_TABLE[MAX_LEVEL - 1]).toBeDefined();
    expect(Number.isFinite(XP_TABLE[MAX_LEVEL - 1])).toBe(true);
    expect(XP_TABLE[MAX_LEVEL - 1]).toBe(36400);
  });

  it('the new levels 21..26 hold the exact sourced values', () => {
    for (const L of [21, 22, 23, 24, 25, 26]) {
      expect(xpForLevel(L)).toBe(NEW_VALUES[L]);
    }
  });

  it('the closed-form formula reproduces the entire table (the spec trust check)', () => {
    for (let L = 1; L <= 26; L++) {
      expect(xpForLevel(L)).toBe(xpFormula(L));
    }
  });

  it('xpForLevel clamps at and beyond the cap (no out-of-range read)', () => {
    expect(xpForLevel(26)).toBe(36400);
    expect(xpForLevel(27)).toBe(36400); // min(level-1, len-1) clamp
    expect(xpForLevel(99)).toBe(36400);
  });
});

describe('level-curve 21-26: deterministic level-up state machine', () => {
  const TOTAL_20_TO_26 = [20, 21, 22, 23, 24, 25].reduce((s, L) => s + xpForLevel(L), 0);

  it('the 20->26 cost equals the sum of the six per-level steps', () => {
    expect(TOTAL_20_TO_26).toBe(170800);
  });

  it('a single grant carries a character from 20 to the new cap and freezes there', () => {
    const sim = new Sim({ seed: 7, playerClass: 'warrior', autoEquip: true });
    sim.setPlayerLevel(20);
    sim.grantXp(TOTAL_20_TO_26);
    expect(sim.player.level).toBe(26);
    expect(sim.xp).toBe(0); // bar frozen at cap
  });

  it('overshoot past the cap never advances the real level past 26', () => {
    const sim = new Sim({ seed: 7, playerClass: 'warrior', autoEquip: true });
    sim.setPlayerLevel(20);
    sim.grantXp(TOTAL_20_TO_26 + 999_999);
    expect(sim.player.level).toBe(26);
    expect(sim.xp).toBe(0);
  });

  it('carries the remainder into the new level on a partial grant', () => {
    const sim = new Sim({ seed: 7, playerClass: 'warrior', autoEquip: true });
    sim.setPlayerLevel(20);
    sim.grantXp(xpForLevel(20) + 5); // exactly one level + 5 leftover
    expect(sim.player.level).toBe(21);
    expect(sim.xp).toBe(5);
  });

  it('an exact-threshold grant dings the level and leaves xp at 0 (below the cap)', () => {
    const sim = new Sim({ seed: 7, playerClass: 'warrior', autoEquip: true });
    sim.setPlayerLevel(20);
    sim.grantXp(xpForLevel(20)); // exactly one level, no remainder
    expect(sim.player.level).toBe(21);
    expect(sim.xp).toBe(0);
  });

  it('a single grant crosses multiple new levels and keeps the remainder below the cap', () => {
    const sim = new Sim({ seed: 7, playerClass: 'warrior', autoEquip: true });
    sim.setPlayerLevel(20);
    sim.grantXp(xpForLevel(20) + xpForLevel(21) + 7); // 20 -> 22, ends below cap
    expect(sim.player.level).toBe(22);
    expect(sim.xp).toBe(7);
  });

  it('is deterministic: same seed and grants give identical level/xp/lifetimeXp', () => {
    const run = () => {
      const sim = new Sim({ seed: 11, playerClass: 'mage', autoEquip: true });
      sim.setPlayerLevel(20);
      sim.grantXp(TOTAL_20_TO_26 - 1);
      return { level: sim.player.level, xp: sim.xp, lifetime: sim.lifetimeXp };
    };
    expect(run()).toEqual(run());
  });
});

describe('level-curve 21-26: derived MAX_LEVEL-dependent math stays finite and correct', () => {
  it('prestige cost is the level-26 step', () => {
    expect(PRESTIGE_XP_PER_RANK).toBe(36400);
    expect(Number.isFinite(PRESTIGE_XP_PER_RANK)).toBe(true);
  });

  it('virtual-level table is finite and consistent with the new cap', () => {
    const atCap = xpToReachLevel(26);
    expect(Number.isFinite(atCap)).toBe(true);
    expect(atCap).toBeGreaterThan(xpToReachLevel(20));
    expect(virtualLevel(atCap)).toBe(26);
    const prog = virtualLevelProgress(atCap);
    expect(Number.isFinite(prog.span)).toBe(true);
    expect(prog.span).toBeGreaterThan(0);
  });

  it('prestige rank math is finite at and past the cap', () => {
    expect(maxPrestigeRank(xpToReachLevel(26))).toBe(0);
    expect(maxPrestigeRank(xpToReachLevel(26) + PRESTIGE_XP_PER_RANK)).toBe(1);
  });

  it('talent-point budget extends to 17 at level 26 (1 point per level past 9)', () => {
    expect(FIRST_TALENT_LEVEL).toBe(10);
    expect(talentPointsAtLevel(20)).toBe(11);
    expect(talentPointsAtLevel(26)).toBe(17);
    expect(talentPointsAtLevel(99)).toBe(17); // clamped at the cap
  });
});
