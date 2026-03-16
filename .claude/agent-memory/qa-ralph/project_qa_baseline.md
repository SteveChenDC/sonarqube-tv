---
name: project_qa_baseline
description: Build and test baseline as of 2026-03-15 — what passes, known warnings
type: project
---

As of 2026-03-15 (second QA run), `npm run build` and `npm test` both pass clean.

**Build**: Next.js 16.1.6 (Turbopack), 242 static pages generated (SSG), no errors.
- Known non-fatal warning: "Next.js inferred your workspace root" due to multiple lockfiles at `/Users/stevec/package-lock.json` and project root. Safe to ignore; does not affect build output.

**Tests**: Vitest 4.1.0 — 21 test files, 193 tests, all pass. Duration ~5s.
- Test count grew from 188 to 193 between QA runs due to new tests for: 404 page, PlaylistQueue, duration color coding, watch page polish.

**Why:** Ongoing QA baseline tracking; no breakage has been seen across two runs.
**How to apply:** If a future run shows <193 tests or a new warning, investigate immediately. The workspace-root lockfile warning is pre-existing and harmless.
