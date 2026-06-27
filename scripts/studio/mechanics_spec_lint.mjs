#!/usr/bin/env node
// Mechanics-spec linter for the ClaudeCraft Vanilla Studio.
//
// A neutral mechanics spec (docs/studio/mechanics/<system>.md) must be structurally complete
// and free of copyrighted names. This enforces both, so the spec is a trustworthy firewall
// for fidelity tests.
//
// Usage:
//   node scripts/studio/mechanics_spec_lint.mjs                  lint all specs
//   node scripts/studio/mechanics_spec_lint.mjs <files...>       lint given files
//   --json     machine-readable output
//   --quiet    suppress the human summary

import { readFileSync, statSync, readdirSync } from 'node:fs';
import { join, relative, isAbsolute } from 'node:path';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const inputs = args.filter((a) => !a.startsWith('--'));

const SPEC_DIR = 'docs/studio/mechanics';
const REQUIRED_SECTIONS = ['## Formula', '## Ordered rolls', '## State machine', '## Sources'];
const README = 'README.md';

function specFiles() {
  if (inputs.length) return inputs.map((p) => (isAbsolute(p) ? p : join(ROOT, p)));
  const dir = join(ROOT, SPEC_DIR);
  let names = [];
  try {
    names = readdirSync(dir);
  } catch {
    return [];
  }
  return names
    .filter((n) => n.endsWith('.md') && n !== README)
    .map((n) => join(dir, n));
}

function lintSpec(absPath) {
  const rel = relative(ROOT, absPath);
  const issues = [];
  let text;
  try {
    text = readFileSync(absPath, 'utf8');
    if (!statSync(absPath).isFile()) return { file: rel, issues: [] };
  } catch {
    return { file: rel, issues: [{ kind: 'missing', detail: 'cannot read file' }] };
  }
  for (const section of REQUIRED_SECTIONS) {
    if (!text.includes(section)) {
      issues.push({ kind: 'missing-section', detail: section });
    }
  }
  // A spec must affirm neutrality in its Sources section.
  if (!/no copyrighted names|no copied text|reference-only/i.test(text)) {
    issues.push({
      kind: 'missing-neutrality-affirmation',
      detail: 'Sources must state that no copyrighted names or data tables were reproduced',
    });
  }
  return { file: rel, issues };
}

function main() {
  const results = specFiles().map(lintSpec);
  const failed = results.filter((r) => r.issues.length > 0);

  if (flags.has('--json')) {
    process.stdout.write(JSON.stringify({ results }, null, 2) + '\n');
  } else if (!flags.has('--quiet')) {
    if (results.length === 0) {
      process.stdout.write('spec-lint: no specs found (nothing to lint)\n');
    } else if (failed.length === 0) {
      process.stdout.write(`spec-lint: ${results.length} spec(s) OK\n`);
    } else {
      for (const r of failed) {
        process.stdout.write(`spec-lint: ${r.file}\n`);
        for (const i of r.issues) process.stdout.write(`  ${i.kind}: ${i.detail}\n`);
      }
    }
  }
  process.exit(failed.length > 0 ? 1 : 0);
}

main();
