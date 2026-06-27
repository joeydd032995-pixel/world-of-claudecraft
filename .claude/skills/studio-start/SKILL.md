---
name: studio-start
description: Entry point and router for the ClaudeCraft Vanilla Studio. Detects the current phase from repo state, sets the review mode, confirms the provenance posture, and routes you to the right studio skill. For a feature too large for one session, hands off to the feature-plan skill. Use to begin or resume any studio work, or when you ask where to start.
user-invocable: true
disable-model-invocation: true
---

# Studio start: bootstrap and route

The CCGS `/start` role, native to this repo. Read docs/studio/README.md,
docs/studio/workflow-catalog.md, and docs/studio/PROVENANCE.md before routing.

## Steps

1. Read `docs/studio/active.md` for in-progress work; if a feature is mid-flight, resume it.
2. Ask the user where they are: no idea, a vague concept, a clear design, or existing work to
   extend. Adopt the relevant director role from docs/studio/org-chart.md.
3. Confirm review mode in `docs/studio/review-mode.txt` (`full | lean | solo`); set it if asked.
4. Confirm the provenance posture: the studio is reference-only and original
   (docs/studio/PROVENANCE.md). If the user wants to import copyrighted data, stop and explain
   the boundary; do not proceed.
5. Detect the phase and route:
   - No spec yet -> `/vanilla-mechanics-research <system>` (Phase 1).
   - Spec exists, no GDD -> `/studio-gdd <feature>` (Phase 1).
   - GDD approved, needs sim behavior -> `/author-system` (Phase 2/4).
   - Needs content records -> `/author-zone` | `/author-class` | `/author-talents` |
     `/author-dungeon` | `/author-profession` | `/economy-model` (Phase 5).
   - Needs verification -> `/verify-mechanic-fidelity` | `/balance-check` |
     `/studio-gate-check` (Phase 6).
   - Large multi-session feature -> hand off to `feature-plan`.
6. Update `docs/studio/active.md` (feature, phase, next action, log entry).

## Output

A short plan: the chosen phase, the skill to run next, the review mode, and an updated
`active.md`. Present 2 to 4 options with tradeoffs when the path is open; wait for sign-off.

## Guardrail

Reference-only and original at every step (docs/studio/PROVENANCE.md). Never import or commit
copyrighted content, client-extracted data, or emulator dumps.
