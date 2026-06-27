#!/usr/bin/env node
// Provenance scanner for the ClaudeCraft Vanilla Studio.
//
// Reference-only posture (see docs/studio/PROVENANCE.md): mechanics and formulas may be
// studied, but copyrighted content (iconic in-game proper nouns, emulator DB tables) and
// client-extracted data artifacts must never enter the tree. This is a high-recall guard,
// not a legal oracle: it flags suspicious strings and artifacts so a human (or the
// content-provenance-auditor agent) can judge them.
//
// Usage:
//   node scripts/studio/content_provenance_scan.mjs            scan default content paths
//   node scripts/studio/content_provenance_scan.mjs <paths...> scan given files/dirs
//   --staged   scan only git-staged files (for the pre-commit guard hook)
//   --json     machine-readable output
//   --gate     exit 1 if any finding (default behavior is also exit 1 on findings)
//   --quiet    suppress the human summary
//
// The scanner intentionally does NOT scan the studio's own policy and template docs, which
// legitimately name emulator projects and discuss the posture.

import { readFileSync, statSync, readdirSync } from 'node:fs';
import { join, relative, extname, basename, isAbsolute } from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const inputPaths = args.filter((a) => !a.startsWith('--'));

// Default scan surface: authored content and design artifacts only.
const DEFAULT_PATHS = [
  'src/sim/content',
  'docs/studio/mechanics',
  'docs/studio/gdd',
  'docs/studio/economy',
];

// Files exempt because they exist to describe or enforce this very policy.
const EXEMPT = new Set([
  'docs/studio/PROVENANCE.md',
  'docs/studio/README.md',
  'docs/studio/workflow-catalog.md',
  'docs/studio/org-chart.md',
  'scripts/studio/content_provenance_scan.mjs',
]);
// Exempt instruction/config/template surfaces: the studio's own agents, skills, and docs
// legitimately reference DB identifiers and policy terms as examples of what to block. Game
// content (src/sim/content) and authored design artifacts (docs/studio/{mechanics,gdd,
// economy}) are NOT exempt and are always scanned.
const EXEMPT_DIRS = ['docs/studio/templates', '.claude'];

// Iconic, unmistakably Blizzard in-game proper nouns. A small curated denylist used only to
// PREVENT these from appearing in original content. Not exhaustive; the auditor agent
// handles the long tail. Deliberately excludes WoW names that collide with common English
// words (for example "thrall", "barrens"), since this gate must not block legitimate
// original content.
const COPYRIGHTED_NAMES = [
  // Cities and zones
  'Azeroth', 'Kalimdor', 'Elwynn', 'Westfall', 'Stormwind', 'Ironforge', 'Darnassus',
  'Orgrimmar', 'Durotar', 'Mulgore', 'Thunder Bluff', 'Undercity', 'Stranglethorn',
  'Tanaris', 'Silithus', 'Winterspring', 'Tirisfal', 'Teldrassil',
  // Iconic items
  'Thunderfury', 'Sulfuras', 'Ashbringer', 'Quelserrar',
  // Iconic NPCs and bosses
  'Ragnaros', 'Onyxia', 'Nefarian', 'Mankrik', 'Arthas', 'Sylvanas',
  'Illidan', 'Kazzak', 'Azuregos', 'Magtheridon',
];

// Emulator database identifiers and client-extracted data artifacts.
const DB_IDENTIFIERS = [
  'item_template', 'creature_template', 'quest_template', 'gameobject_template',
  'creature_loot_template', 'npc_text', 'spell_dbc', 'page_text', 'creature_ai_scripts',
];
const ARTIFACT_EXTS = new Set(['.dbc', '.wdb', '.mpq', '.adt', '.wdt', '.m2', '.blp']);

const SCAN_EXTS = new Set(['.ts', '.tsx', '.js', '.mjs', '.json', '.md', '.txt', '.sql']);

function isExempt(rel) {
  if (EXEMPT.has(rel)) return true;
  return EXEMPT_DIRS.some((d) => rel === d || rel.startsWith(d + '/'));
}

function walk(p, out) {
  let st;
  try {
    st = statSync(p);
  } catch {
    return;
  }
  if (st.isDirectory()) {
    if (basename(p) === 'node_modules' || basename(p) === '.git') return;
    for (const name of readdirSync(p)) walk(join(p, name), out);
  } else if (st.isFile()) {
    out.push(p);
  }
}

function buildMatchers() {
  const wb = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const names = new RegExp('\\b(' + COPYRIGHTED_NAMES.map(wb).join('|') + ')\\b', 'gi');
  const dbids = new RegExp('\\b(' + DB_IDENTIFIERS.map(wb).join('|') + ')\\b', 'gi');
  return { names, dbids };
}

function scanFile(absPath, matchers, findings) {
  const rel = relative(ROOT, absPath);
  if (isExempt(rel)) return;
  const ext = extname(absPath).toLowerCase();

  if (ARTIFACT_EXTS.has(ext)) {
    findings.push({ file: rel, line: 0, kind: 'client-artifact', match: ext });
    return;
  }
  if (!SCAN_EXTS.has(ext)) return;

  let text;
  try {
    text = readFileSync(absPath, 'utf8');
  } catch {
    return;
  }
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const m of line.matchAll(matchers.names)) {
      findings.push({ file: rel, line: i + 1, kind: 'copyrighted-name', match: m[1] });
    }
    for (const m of line.matchAll(matchers.dbids)) {
      findings.push({ file: rel, line: i + 1, kind: 'db-identifier', match: m[1] });
    }
  }
}

function resolveTargets() {
  if (flags.has('--staged')) {
    let out = '';
    try {
      out = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' });
    } catch {
      return [];
    }
    return out.split('\n').map((s) => s.trim()).filter(Boolean).map((p) => join(ROOT, p));
  }
  const paths = inputPaths.length ? inputPaths : DEFAULT_PATHS;
  const files = [];
  for (const p of paths) walk(isAbsolute(p) ? p : join(ROOT, p), files);
  return files;
}

function main() {
  const matchers = buildMatchers();
  const findings = [];
  for (const f of resolveTargets()) scanFile(f, matchers, findings);

  if (flags.has('--json')) {
    process.stdout.write(JSON.stringify({ findings }, null, 2) + '\n');
  } else if (!flags.has('--quiet')) {
    if (findings.length === 0) {
      process.stdout.write('provenance: clean (no copyrighted names, db identifiers, or client artifacts)\n');
    } else {
      process.stdout.write(`provenance: ${findings.length} finding(s)\n`);
      for (const f of findings) {
        process.stdout.write(`  ${f.kind}: "${f.match}" at ${f.file}:${f.line}\n`);
      }
      process.stdout.write('See docs/studio/PROVENANCE.md. Author original content instead.\n');
    }
  }
  process.exit(findings.length > 0 ? 1 : 0);
}

main();
