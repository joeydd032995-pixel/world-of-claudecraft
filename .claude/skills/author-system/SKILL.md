---
name: author-system
description: Phase 2 and 4 of the ClaudeCraft Vanilla Studio. Implements a new sim or net system as a SimContext module behind the IWorld seam, in both the offline Sim and the online ClientWorld, driven by the extract-and-test discipline. Use to turn an approved GDD plus neutral mechanics spec into deterministic, three-host-parity behavior.
user-invocable: true
disable-model-invocation: true
---

# Author system: behavior behind the seams

Implement a system the clean way this repo demands: a small module behind `SimContext`, a
minimal `IWorld` surface, parity across the three hosts, and determinism preserved.

## Steps

1. Read the GDD (`docs/studio/gdd/<feature>.md`) and the neutral spec
   (`docs/studio/mechanics/<system>.md`). Invoke the `extract-and-test` skill for the
   module-first, test-first workflow.
2. Sim behavior: add a sibling module under `src/sim/<system>/` that owns functions; keep
   state on `Sim`. Wire it through `SimContext` (`src/sim/sim_context.ts`); append callbacks,
   never reach into Sim internals. Draw all randomness from the shared `Rng` in the order the
   spec dictates.
3. Player-facing surface: extend `IWorld` in `src/world_api.ts`, then implement it in BOTH
   `Sim` (`src/sim/sim.ts`) and `ClientWorld` (`src/net/online.ts`). Render/UI consume only
   `IWorld`.
4. Net slice (Phase 4): add the server command and wire fields; keep the server authoritative
   (client sends intent, sim computes outcome). Update `wireEntity`/`applyWire` and `SimEvent`
   handling as needed.
5. i18n: every new player string is an English `t()` key; sim/server emit keys re-localized at
   the client boundary.
6. Tests: write the fidelity test (`/verify-mechanic-fidelity`) and any unit/parity tests
   alongside the module.

## Output

The module, the `IWorld` additions in both worlds, the net wiring, and tests.

## Gate

`npx tsc --noEmit`; `npx vitest run tests/architecture.test.ts` (sim purity, determinism);
parity tests; spawn `cross-platform-sync` for `IWorld`/wire changes; spawn
`architecture-reviewer` to audit the diff for coverage.

## Guardrail

No `Math.random`/`Date.now`/`performance.now` in sim. No DOM/Three imports in `src/sim/`. No
new method banks on the monoliths. Reference-only and original.
