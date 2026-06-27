# Fidelity parity checklist: <system>

Used by `/verify-mechanic-fidelity` and the `fidelity-parity-reviewer` agent. Parity is
measured against the neutral spec `docs/studio/mechanics/<system>.md`, never against live WoW.

## Quantitative

- [ ] Formula output matches the spec across the documented input range (seeded, deterministic).
- [ ] Ordered-roll probabilities match within tolerance over a large seeded sample.
- [ ] Rng draw count and order match the spec (no extra or reordered draws).
- [ ] Caps, floors, and level-difference terms match.
- [ ] Costs, cooldowns, GCD, and durations match.

## Qualitative (feel)

- [ ] Pacing and cadence read as intended at the target levels.
- [ ] Edge cases (immunity, dead target, empty resource) behave per spec.

## Determinism and parity

- [ ] Same seed gives identical results across Sim, server, and headless env.
- [ ] `tests/architecture.test.ts` passes (sim purity, no `Math.random`/`Date.now`).
- [ ] `cross-platform-sync` PASS for any `IWorld` or wire change.

## Provenance

- [ ] No copyrighted names, text, or data tables in the implementation or spec.
- [ ] `npm run studio:provenance` exits 0.
