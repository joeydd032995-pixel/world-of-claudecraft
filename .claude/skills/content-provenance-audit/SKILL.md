---
name: content-provenance-audit
description: IP and legal gate for the ClaudeCraft Vanilla Studio. Runs the provenance scanner and the content-provenance-auditor agent to confirm new or changed content is 100 percent original and free of copyrighted names, emulator DB identifiers, and client-extracted artifacts. Use before any content commit and at release. Returns BLOCK or PASS.
user-invocable: true
---

# Content provenance audit

Enforces docs/studio/PROVENANCE.md: the studio is reference-only and original.

## Steps

1. Run the scanner over the changed surface:
   - whole content tree: `npm run studio:provenance`
   - staged only: `node scripts/studio/content_provenance_scan.mjs --staged`
   - specific paths: `node scripts/studio/content_provenance_scan.mjs <paths...> --json`
2. Spawn the `content-provenance-auditor` agent to triage findings into REAL vs FALSE
   POSITIVE and to read the changed content for originality beyond the scanner's deny-list
   (thin re-spellings, close paraphrase, copied coordinates, GPL imports).
3. Synthesize a single verdict.

## Output

BLOCK or PASS. On BLOCK, each real finding with file:line, why it is real, and the original
alternative to write. On PASS, the dismissed false positives and why.

## Gate

This skill IS a gate. A BLOCK stops the commit or release. The scanner exits nonzero on any
finding; the agent decides which findings are real.

## Guardrail

Never edit content to merely evade the scanner (for example renaming one letter). Author
genuinely original content.
