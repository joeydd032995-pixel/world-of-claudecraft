# Mechanics specs (neutral firewall)

Original-prose specifications of game mechanics: formulas, ordered roll tables, state
machines. Math and structure only. No copyrighted names, no pasted data tables.

Produced by `/vanilla-mechanics-research` (which fans out the `vanilla-mechanics-analyst`
agent). Linted by `scripts/studio/mechanics_spec_lint.mjs`. Implementations are tested
against these specs by `tests/studio/<system>.fidelity.test.ts`, never against live WoW.

Use `templates/mechanics-spec.md`. One file per system, for example `combat-hit-table.md`,
`threat.md`, `resist.md`, `professions.md`.
