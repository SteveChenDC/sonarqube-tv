# SonarQube TV

Netflix-style video showcase for SonarQube tutorials. Next.js 16 + React 19 + TypeScript + Tailwind CSS 4.

## Commands
- `npm run build` — production build
- `npm test` — run all tests (Vitest)
- `npm run dev` — dev server

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (Header + Footer)
│   ├── page.tsx            # Home — renders HomeContent
│   ├── globals.css         # Tailwind config + design tokens
│   ├── category/[slug]/    # Category landing page
│   └── watch/[id]/         # Video watch page (SSG via generateStaticParams)
├── components/
│   ├── Header.tsx          # Fixed nav header
│   ├── Hero.tsx            # Featured video banner
│   ├── HomeContent.tsx     # Client component — filter/sort state, renders VideoRows
│   ├── VideoRow.tsx        # Horizontal scrolling video grid
│   ├── VideoCard.tsx       # Video card with progress bar + hover play icon
│   ├── FilterBar.tsx       # Modal filter panel (date, duration, sort)
│   ├── VideoPlayer.tsx     # YouTube iframe + postMessage progress tracking
│   ├── PlaylistQueue.tsx   # Playlist prev/next nav on watch page
│   └── Footer.tsx
├── data/videos.ts          # Static videos[] + categories[] arrays + helpers
├── lib/watchProgress.ts    # localStorage watch progress (get/set/getAll)
└── types/index.ts          # Video & Category interfaces
```

## Key Patterns
- **Server components by default**; `"use client"` only for interactive state (HomeContent, VideoCard, FilterBar, VideoPlayer, PlaylistQueue)
- **Static data** — no API calls; videos and categories are in `src/data/videos.ts`
- **Watch progress** stored in localStorage under key `sonarqube-tv-watch-progress`
- **Path alias**: `@/*` maps to `./src/*`

## Testing
- **Framework**: Vitest + @testing-library/react (jsdom environment)
- **Setup**: `src/__tests__/setup.ts` — afterEach cleanup + jest-dom matchers
- **Patterns**: Mock `next/link` → `<a>`, `next/image` → `<img>`; `localStorage.clear()` in beforeEach; `makeVideo()` factory for test data
- **Co-located tests**: each component has a `.test.tsx` beside it

## Design Rules
See `DESIGN_GUIDELINES.md` for the complete Sonar brand guide. Key constraints:
- Dark theme only (background: `#0a0a0a`)
- Colors: Persistence Purple (`#290042`), Sonar Red (`#D3121D`), Qube Blue (`#126ED3`), neutrals n1–n9
- Fonts: Poppins (headings, `font-heading`), Inter (body, `font-body`)
- Do NOT introduce colors or fonts outside the design system
