#!/usr/bin/env node
// Fidelity report rollup for the ClaudeCraft Vanilla Studio.
//
// Runs the studio fidelity Vitest suites (tests/studio/*.fidelity.test.ts) and prints a
// human-readable rollup of which mechanics specs are verified against the sim. Optional
// convenience over raw vitest output; the suites themselves are the source of truth.
//
// Usage:
//   node scripts/studio/fidelity_report.mjs            run all studio fidelity suites
//   node scripts/studio/fidelity_report.mjs <system>   run one system's suite
//   --json     machine-readable output

import { execSync } from 'node:child_process';

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const system = args.find((a) => !a.startsWith('--'));

const pattern = system
  ? `tests/studio/${system}.fidelity.test.ts`
  : 'tests/studio';

function run() {
  try {
    const out = execSync(`npx vitest run ${pattern} --reporter=json`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { ok: true, raw: out };
  } catch (e) {
    return { ok: false, raw: (e.stdout || '') + (e.stderr || '') };
  }
}

function main() {
  const result = run();
  if (flags.has('--json')) {
    process.stdout.write(JSON.stringify(result) + '\n');
  } else {
    process.stdout.write(`fidelity: ${result.ok ? 'PASS' : 'FAIL'} for ${pattern}\n`);
    if (!result.ok) process.stdout.write(result.raw + '\n');
  }
  process.exit(result.ok ? 0 : 1);
}

main();
