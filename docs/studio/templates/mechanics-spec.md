# Mechanics spec: <system name>

NEUTRAL spec. Original prose. Math and structure only. No copyrighted names, no pasted DB
rows. This file is checked by `scripts/studio/mechanics_spec_lint.mjs` and is the firewall
the implementation is tested against.

Status: draft | approved
Linked GDD: `docs/studio/gdd/<feature>.md`

## Formula

The closed-form math. Define every variable. Prefer the form already used in
`src/sim/types.ts` where one exists (for example `armorReduction(armor, level)`).

```
example:
  reduction = armor / (armor + k1 * attackerLevel + k2),  capped at cap
```

## Ordered rolls

The resolution order of independent rolls, top to bottom, with each outcome's probability
expression. State how the shared `Rng` is drawn (how many draws, in what order) so the
implementation's draw order is deterministic and testable.

```
example:
  1. miss     p = ...
  2. dodge    p = ...
  3. ...      (single roll into a cumulative table, one Rng.next())
```

## State machine

States, transitions, timers, and tick cadence (the sim is fixed 20 Hz, DT = 0.05s). Note any
GCD, cooldown, channel, or aura duration interactions.

## Edge cases

Boundary values, caps and floors, level-difference effects, immunity, and interactions with
other systems.

## Sources

Primary public sources consulted (community wikis, developer posts). Citations only; no
copied text. State explicitly that no copyrighted names or data tables were reproduced.
