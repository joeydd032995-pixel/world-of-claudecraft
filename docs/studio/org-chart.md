# Studio org chart and fan-out policy

The CCGS director / lead / specialist hierarchy, expressed for World of ClaudeCraft. The key
adaptation: scale comes from parallel fan-out of a small set of read-only agent types across
independent content slices (the repo's documented Opus-4.8 pattern), not from 49 distinct
agent files.

## Roles a skill adopts (directors and leads)

These are personas the orchestrating skills (`/studio-start`, `/studio-gdd`) write in. They
make tradeoff calls, present 2 to 4 options with pros and cons, and wait for user sign-off.

- Creative Director: vision, player feel, fidelity-vs-novelty calls.
- Technical Director: architecture, determinism, the seam discipline (SimContext, IWorld).
- Producer: phase gating, sprint planning (delegates to `feature-plan`), scope control.
- Game Design Lead: systems and balance direction.
- Content Lead: zones, classes, quests, items, encounters.
- QA Lead: gate-check and the reviewer roster.

## Specialists (the read-only agents)

Fanned out N-wide for batch work. Defined in `.claude/agents/`:

- `vanilla-mechanics-analyst` - research; produces neutral mechanics specs.
- `content-design-advisor` - proposes original zone/quest/mob/item designs to a target.
- `encounter-design-advisor` - dungeon and raid encounter mechanics.
- `economy-balance-advisor` - vendor/AH/drop/profession economy modeling.
- `content-provenance-auditor` - IP/legal guard (BLOCK/PASS).
- `fidelity-parity-reviewer` - sim vs neutral spec.
- `balance-reviewer` - numbers vs GDD targets.
- `lore-consistency-reviewer` - originality and internal consistency.

Reused unchanged from the repo: `architecture-reviewer`, `cross-platform-sync`,
`migration-safety`, `privacy-security-review`, `qa-checklist`, `release-malware-audit`.

## Fan-out policy

- Build work happens in the main thread via skills (matching `feature-plan` and
  `extract-and-test`); subagents stay read-only (research and review).
- For batch content (many zones, mobs, items), fan out the same advisor agent type across
  independent slices in parallel, then run a single reviewer pass for coverage.
- Never spawn for work doable in one response. Never let two agents edit the same files.
- Before declaring a slice done, a fresh reviewer agent audits the diff for coverage (every
  gap with confidence and severity), per the repo's review discipline.

## Collaboration protocol (from CCGS)

1. Vertical delegation: directors to leads to specialists.
2. Horizontal consultation: same-tier roles consult but do not bind.
3. Conflict resolution: escalate to the shared parent role.
4. Change propagation: cross-domain changes coordinated by the Producer role.
5. Domain boundaries: no edits outside a role's domain without delegation.
6. User stays in control: present options, wait for explicit sign-off.
