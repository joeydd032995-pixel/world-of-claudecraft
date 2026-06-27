---
name: studio-gate-check
description: Phase-exit gate for the ClaudeCraft Vanilla Studio. Runs the gates for the current phase plus the relevant read-only reviewer agents, and returns an aggregate PASS or NEEDS-WORK with a checklist. Use at the end of any phase before moving on, and as the final pre-release gate.
user-invocable: true
---

# Studio gate check

Aggregate the right gates for the phase (see docs/studio/workflow-catalog.md) so nothing
ships half-verified.

## Steps

Run the gates that apply to the work just done:

1. Build and determinism: `npx tsc --noEmit`, `npx vitest run tests/architecture.test.ts`.
2. Fidelity: `npm run studio:fidelity` (or the system's suite). Spawn `fidelity-parity-reviewer`.
3. Provenance: run `/content-provenance-audit`. Must PASS.
4. Balance: run `/balance-check` for content changes. Spawn `balance-reviewer`.
5. Lore: spawn `lore-consistency-reviewer` for new names/text.
6. Cross-host: spawn `cross-platform-sync` if `IWorld` or the wire protocol changed.
7. Content audits: `npm run audit:quests` for quest changes; `npm run wiki:content` must leave
   no diff. `npx vitest run tests/localization_fixes.test.ts` for new player strings.
8. Migration: spawn `migration-safety` if schema or saved state changed.
9. Release only: run the `release-malware-audit` skill.

## Output

An aggregate checklist with each gate PASS/FAIL and the reviewer verdicts. End with a single
PASS or NEEDS-WORK. List blockers first.

## Guardrail

Anchor on commands that actually ran, never on "looks done." Provenance and determinism are
non-negotiable.
