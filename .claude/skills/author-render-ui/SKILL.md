---
name: author-render-ui
description: Phase 3 of the ClaudeCraft Vanilla Studio. Adds renderer and HUD surfaces for a system, talking only to IWorld, and captures visual evidence. Use after the sim behavior exists and you need to show it on screen. Keeps presentation original and procedural.
user-invocable: true
---

# Author render and UI: show the system

Add the client surface for a system without ever importing a concrete world.

## Steps

1. Read the GDD's systems-and-seams section for the `IWorld` members to consume.
2. Renderer: add a new `src/render/<thing>.ts` the renderer calls (procedural geometry/
   texture/VFX); read the world, never mutate it. Do not bolt onto `renderer.ts`.
3. HUD: a self-contained window/panel module the HUD composes (pure view model plus a thin
   DOM consumer, per the `src/ui/unit_portrait.ts` reference), not a new banner section in
   `hud.ts`.
4. i18n: every label/tooltip/aria string is an English `t()` key in the right catalog domain;
   the rendered text always comes from `t()`. No concat, no fallback strings.
5. Capture evidence: add or run a `scripts/<feature>_shot.mjs` (puppeteer-core against
   `npm run dev`) and save the PNG.

## Output

The render module, the HUD module, the i18n keys, and a visual evidence PNG.

## Gate

`npx vitest run tests/localization_fixes.test.ts` (S3 i18n); visual evidence captured;
`npx tsc --noEmit`.

## Guardrail

Original procedural visuals only: no copyrighted art, models, textures, icons, or audio. The
renderer/UI talk only to `IWorld`.
