# ClaudeCraft Vanilla Studio

A hyper-specialized game-development studio for World of ClaudeCraft, adapted from the
Claude-Code-Game-Studios (CCGS) framework into this repo's native conventions. It drives the
game toward Vanilla-WoW-grade mechanical and systemic depth (1.12.x-era feel, scaling toward
1-60 progression) using 100 percent original content and a reference-only data posture.

## What it is

Four cooperating layers, each riding the repo's existing build and test gates:

| Layer | Where | Native form |
|---|---|---|
| Orchestration and process | `docs/studio/` | the 7-phase workflow, org chart, GDD/ADR/parity templates, and the neutral mechanics spec corpus |
| Agents | `.claude/agents/` | read-only research and reviewer agents (`name/description/tools/model/maxTurns`) |
| Skills | `.claude/skills/<name>/SKILL.md` | user-invocable workflows that author original content through existing seams |
| Tooling and gates | `scripts/studio/`, `tests/studio/`, `.claude/settings.json` | provenance scanner, spec lint, fidelity tests, guard hook |

## The one rule that shapes everything

Game mechanics and formulas are not copyrightable, and this repo already mandates "real
classic-era MMO formulas." So studio agents may study public sources to extract math and
structure. They never import, commit, or redistribute copyrighted content (item/quest/NPC/
zone names, flavor text, map geometry, art, audio), client-extracted data (DBC/WDB/MPQ/
cache), or client-mod/cheat tooling. Everything authored is original. See `PROVENANCE.md`.

## Arming the provenance guard (opt-in)

The studio ships a pre-commit guard (`.claude/hooks/provenance-guard.sh`) and an example
config (`docs/studio/settings.example.json`), but does not auto-install startup hooks. To arm
it, merge the example into `.claude/settings.json` yourself. The scanner also runs on demand
via `npm run studio:provenance` regardless.

## Where to start

Run `/studio-start`. It detects the current phase, sets the review mode
(`docs/studio/review-mode.txt`), and routes you to the right skill. For a feature too large
for one session it hands off to the existing `feature-plan` skill.

## Map

- `workflow-catalog.md` - the 7 phases, each bound to a driving skill, a seam, and a gate.
- `org-chart.md` - the director/lead/specialist roles and the fan-out policy.
- `PROVENANCE.md` - the legal and data-sourcing posture (load-bearing).
- `templates/` - GDD, ADR, mechanics spec, parity checklist, economy model, sprint, encounter.
- `mechanics/` - neutral, original-prose mechanics specifications (the firewall).
- `gdd/`, `economy/`, `adr/` - design artifacts produced by the skills.
- `active.md` - current session state. `review-mode.txt` - `full | lean | solo`.
