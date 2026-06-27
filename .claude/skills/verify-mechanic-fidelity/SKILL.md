---
name: verify-mechanic-fidelity
description: Phase 6 of the ClaudeCraft Vanilla Studio. Generates and runs a Vitest suite that asserts sim behavior equals the NEUTRAL mechanics spec, deterministically. Use after implementing a system to prove it matches its spec (never live WoW).
user-invocable: true
---

# Verify mechanic fidelity

Prove the implementation matches `docs/studio/mechanics/<system>.md`.

## Steps

1. Read the spec's Formula, Ordered rolls, and State machine sections.
2. Write `tests/studio/<system>.fidelity.test.ts` that:
   - constructs the sim with a fixed seed and ticks deterministically (fixed 20 Hz);
   - asserts formula outputs across the documented input range;
   - asserts ordered-roll probabilities over a large seeded sample within tolerance;
   - asserts the `Rng` draw count and order match the spec;
   - asserts caps, floors, costs, cooldowns, and durations.
3. Run it: `npx vitest run tests/studio/<system>.fidelity.test.ts` (or `npm run studio:fidelity`).
4. Spawn the `fidelity-parity-reviewer` agent to check the suite actually covers the spec (not
   a tautology) and to flag any gap.

## Output

A passing, deterministic fidelity suite and the reviewer verdict.

## Gate

Suite green; same seed gives identical results; reviewer PASS. Use
docs/studio/templates/parity-checklist.md.

## Guardrail

Compare to the neutral spec only. If the sim and spec disagree, decide which is correct and
fix the right one; do not weaken the test to pass.
