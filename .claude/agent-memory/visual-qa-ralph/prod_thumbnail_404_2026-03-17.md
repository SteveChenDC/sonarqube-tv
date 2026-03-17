---
name: Production thumbnail 404s — thumbnails/ directory not deployed
description: All 21 local /thumbnails/*.jpg images return 404 on the live server; out/thumbnails/ was never uploaded
type: project
---

## All local thumbnail files are 404 on the live server

**Confirmed on 2026-03-17.** The production site at `https://www.stevechen.me/sonarqube-tv/` returns HTTP 404 for every URL under `/sonarqube-tv/thumbnails/`. There are 21 videos with local thumbnail paths (stored in `public/thumbnails/`) and all 229 files in that directory are missing from the server.

**Why:** The basePath fix (commit `99e3c3a`, `fix: local video thumbnails missing basePath prefix in prod`) was applied to `src/data/videos.ts` and the build was run locally — `out/thumbnails/` contains all 229 files. But the deployment step was never completed: the `out/thumbnails/` directory was not uploaded/synced to the hosting server at `stevechen.me`. The `/courses/` directory WAS successfully deployed (from a prior fix, commit `960f9e6`), but `/thumbnails/` was skipped.

**Visible impact:**
- Hero banner shows a grey gradient instead of the thumbnail image (the featured video randomly rotates, so whichever video has a local thumbnail gets a blank hero on that rotation)
- Video cards for the 21 affected videos show the shimmer skeleton permanently (never resolve) because `onError` clears the skeleton but the image area stays empty
- Affected video IDs: v62, v63, v65, v66, v70, v72, v76, v79, v81, v84, v85, v89, v93, v123, v128, v129, v147, v148, v149, v153, v210

**What is NOT broken:**
- YouTube thumbnails — all load fine
- Course card images (`/courses/*.png`) — all load fine (200 OK)
- The `/courses` index page — has no images, text-only layout
- Layout, colors, fonts, interactive elements — all correct

**How to fix:** Upload/sync the `out/thumbnails/` directory (229 files) to the hosting server so they are served at `https://www.stevechen.me/sonarqube-tv/thumbnails/`. No code changes needed — the fix is already in the built output.

**How to apply:** When checking thumbnails in future QA passes, verify HTTP status of a sample local thumbnail with `curl -s -o /dev/null -w "%{http_code}" "https://www.stevechen.me/sonarqube-tv/thumbnails/doEikRO9GF8.jpg"`. If it returns 200, the deployment is complete.
