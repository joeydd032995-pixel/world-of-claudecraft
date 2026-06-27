# Studio workflow catalog: the 7-phase pipeline

The CCGS 7-phase pipeline, bound to World of ClaudeCraft's seams and gates. Each phase names
its driving skill, the seam it writes to, and the gate it must clear before the next phase.
Markdown (not YAML) to match the repo's docs.

## Phases

| # | Phase | Driving skill | Output seam | Exit gate |
|---|---|---|---|---|
| 0 | Setup | `/studio-start` | `docs/studio/active.md` (session state) | provenance hook armed; phase detected; review mode set |
| 1 | Research and Design | `/vanilla-mechanics-research`, `/studio-gdd` | `docs/studio/mechanics/*`, `docs/studio/gdd/*` | spec lint clean; GDD template complete |
| 2 | Sim systems | `/author-system` (+ `extract-and-test`) | `SimContext` module + `IWorld` in both worlds | `tsc`, `tests/architecture.test.ts`, parity |
| 3 | Client and feel | `/author-render-ui` | `src/render/`, `src/ui/` via `IWorld` | i18n S3 gate; visual `.mjs` evidence |
| 4 | Net and multiplayer | `/author-system` (net slice) | wire protocol, server commands | `cross-platform-sync` review PASS |
| 5 | Content population | `/author-zone`, `/author-class`, `/author-dungeon`, `/author-profession`, `/economy-model` | `src/sim/content/*` | `npm run audit:quests`; wiki content fresh |
| 6 | Test and iterate | `/verify-mechanic-fidelity`, `/balance-check`, `/studio-gate-check` | `tests/studio/*` | fidelity suites green; balance signed off |
| 7 | Release and maintain | `/release-malware-audit`, `/studio-gate-check` | release notes, `docs/studio/adr/*` | malware audit PASS; provenance audit PASS |

## Phase detail

### Phase 0: Setup
`/studio-start` detects where the project is from repo state, sets the review mode in
`docs/studio/review-mode.txt` (`full | lean | solo`), confirms the provenance guard is armed,
and routes to the right phase. Large multi-session features are handed to the existing
`feature-plan` skill rather than reinventing planning.

### Phase 1: Research and Design
`/vanilla-mechanics-research` fans out the `vanilla-mechanics-analyst` agent to produce a
neutral mechanics spec (`docs/studio/mechanics/<system>.md`) - math and structure only, no
copyrighted names. `/studio-gdd` then authors a GDD (`docs/studio/gdd/<feature>.md`) from the
`gdd.md` template, including the mandatory Original-content mapping section. Gate: the spec
passes `studio:spec-lint` and the GDD has every required section.

### Phase 2: Sim systems
`/author-system` implements behavior as a `SimContext` module (state stays on `Sim`) and
extends `IWorld` (`src/world_api.ts`), implemented in both `Sim` (`src/sim/sim.ts`) and
`ClientWorld` (`src/net/online.ts`). Driven by the `extract-and-test` discipline. Gate: `tsc`,
`tests/architecture.test.ts` (sim purity, determinism), and parity tests.

### Phase 3: Client and feel
`/author-render-ui` adds renderer and HUD surfaces that talk only to `IWorld`, and captures
visual evidence with a `scripts/*_shot.mjs`. Gate: the i18n S3 guard
(`tests/localization_fixes.test.ts`) and visual evidence.

### Phase 4: Net and multiplayer
The net slice of `/author-system` wires the server command and wire protocol. Gate: the
`cross-platform-sync` agent returns PASS (IWorld parity, wireEntity/applyWire, SimEvent,
command coverage).

### Phase 5: Content population
`/author-zone`, `/author-class`, `/author-talents`, `/author-dungeon`, `/author-profession`,
and `/economy-model` author original typed records into `src/sim/content/` and merge them in
`src/sim/data.ts`. Gate: `npm run audit:quests` and a clean `npm run wiki:content` (no diff).
Every content run is provenance-scanned.

### Phase 6: Test and iterate
`/verify-mechanic-fidelity` generates and runs `tests/studio/<system>.fidelity.test.ts`
asserting sim behavior equals the neutral spec. `/balance-check` validates numbers against
GDD targets and formula budgets. `/studio-gate-check` aggregates the phase gates plus the
relevant reviewer agents. Gate: fidelity suites green; balance report signed off.

### Phase 7: Release and maintain
Reuse `/release-malware-audit` and `/studio-gate-check`; record decisions as ADRs in
`docs/studio/adr/`. Gate: malware audit PASS and provenance audit PASS.

## Review modes

Set in `docs/studio/review-mode.txt`:
- `full` - every phase runs all reviewer gates and asks for user sign-off at each gate.
- `lean` - phase-exit gates only.
- `solo` - no gates; for throwaway spikes only.
