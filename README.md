# Sonar.tv

Netflix-style video hub for SonarQube tutorials and certification courses. Browse 200+ videos by category, track watch progress, search, filter, and pick up where you left off.

**Live:** [sonar.tv](https://sonarqube-tv.vercel.app)

## Tech Stack

- **Next.js 16** (App Router, SSG via `generateStaticParams`)
- **React 19** + TypeScript
- **Tailwind CSS 4** with Sonar brand design tokens
- **Vitest** — 1,160+ unit tests across 70 test files
- **Playwright** — 28 E2E tests across 6 spec files

## Quick Start

```bash
npm install
npm run dev       # http://localhost:3000
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:watch` | Watch mode |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run lint` | ESLint |

## Features

- **Video catalog** — 200+ SonarQube tutorials organized into 11 categories
- **Certification courses** — Guided learning paths with progress tracking
- **Watch progress** — Resume videos where you left off (localStorage)
- **Search** — Header search with `/` keyboard shortcut and live results
- **Filters** — Sort by date, duration, or relevance via modal filter panel
- **Dark/light mode** — Theme toggle with system preference detection
- **Transcript + articles** — AI-generated summaries and chapter-synced transcripts
- **Responsive** — Mobile-first with 44px touch targets, swipe hints, and bottom sheets
- **Keyboard shortcuts** — Video player controls (space, arrows, `f`, `m`, `?`)

## Project Structure

```
src/
├── app/                     # Next.js App Router pages
│   ├── page.tsx             # Home page
│   ├── watch/[id]/          # Video watch page (SSG)
│   ├── category/[slug]/     # Category landing page
│   └── courses/             # Certification course pages
├── components/              # 24 React components
│   ├── Hero.tsx             # Featured video banner
│   ├── HomeContent.tsx      # Filter/sort state, renders video rows
│   ├── VideoCard.tsx        # Card with progress bar + hover play
│   ├── VideoPlayer.tsx      # YouTube iframe + progress tracking
│   ├── Header.tsx           # Nav with search + dropdowns
│   └── ...
├── data/videos.ts           # Static video + category data
├── lib/                     # Watch progress, theme utilities
└── types/                   # TypeScript interfaces
e2e/                         # Playwright E2E tests
docs/                        # E2E test documentation
```

## Design System

This app uses the latest [Sonar brand guidelines](https://brand.sonarsource.com) as of March 20, 2026.

## Organic Search Strategy

Sonar already has 200+ video tutorials on YouTube. The problem: YouTube owns the search real estate. When a developer searches "SonarQube setup tutorial," YouTube gets the click and the engagement data — not sonarsource.com. Sonar.tv fixes this by giving every video its own page on a Sonar-owned domain.

### What Google sees

Every one of the 240+ pages emits structured data that qualifies for [Google Video rich results](https://developers.google.com/search/docs/appearance/structured-data/video):

- **VideoObject JSON-LD** on each watch page — title, description, ISO 8601 duration, thumbnail, upload date, `WatchAction`, publisher (SonarSource), and `isAccessibleForFree`. This is the data Google needs to show video thumbnails with duration badges directly in search results.
- **ItemList JSON-LD** on the home page — the 12 newest videos as a structured carousel. Google can surface this as a video pack from a single URL.
- **BreadcrumbList JSON-LD** on watch and category pages — Home > Category > Video navigation paths displayed in SERPs.
- **Organization JSON-LD** — SonarSource identity with logo and social links in the root layout.

### Why this drives traffic

| Without Sonar.tv | With Sonar.tv |
|-------------------|---------------|
| Developer searches "SonarQube CI/CD integration" | Same search |
| YouTube result appears — click goes to youtube.com | Sonar.tv result appears with video thumbnail, duration, and date — click goes to a Sonar-branded domain |
| Viewer watches on YouTube, leaves | Viewer watches on Sonar.tv, sees related tutorials, certification courses, category pages — deeper engagement |
| No retargeting, no attribution | Full analytics, engagement tracking, progress data on your domain |

Video rich results in Google Search have [significantly higher CTR](https://developers.google.com/search/docs/appearance/structured-data/video) than plain blue links. Sonar.tv creates 240+ new opportunities for Sonar to appear in search with rich thumbnails — on queries like "code quality static analysis tutorial," "SonarQube setup," "code quality practices," and "SAST tool comparison."

### Sitemap and crawlability

- Auto-generated `sitemap.xml` with all 240+ URLs — priority-weighted (home 1.0, categories 0.8, courses 0.7, videos 0.6) with real `lastModified` dates from publish timestamps.
- Every page has unique `<title>`, `<meta description>`, Open Graph tags, Twitter card tags, and canonical URLs. Zero duplicate content signals.
- All 11 category pages are linked from the footer on every page — no orphan pages, full crawl coverage.

### Social sharing

Watch pages use YouTube `maxresdefault` (1280x720) as the OG image. When someone shares a Sonar.tv link on Slack, Twitter, or LinkedIn, it renders a high-res video thumbnail with the Sonar-branded title — not a generic YouTube embed. The home page and category pages use a custom Sonar OG image.

## Brand Consistency

The entire site is built on the [Sonar brand guide](https://brand.sonarsource.com):

- **Persistence Purple** (`#290042`), **Sonar Red** (`#D3121D`), **Qube Blue** (`#126ED3`), and the full n1–n9 neutral scale — no off-brand colors anywhere
- **Poppins** for headings, **Inter** for body text — matching Sonar's typography system
- Dark theme as default (background `#0a0a0a`) with light mode toggle
- Every component, badge, button, and hover state uses design tokens from the brand guide

### Naming Conventions

| In this app | Not used | Why |
|-------------|----------|-----|
| **Sonar.tv** | SonarQube TV | App brand — renders as "Sonar" + ".tv" in Qube Blue |
| **SonarSource** | — | Company entity (footer, legal) |
| **SonarQube Cloud** | SonarCloud | Product rebrand |
| **SonarQube Server** | SonarQube (self-hosted) | Deployment distinction |
| **SonarQube for IDE** | SonarLint | Product rebrand |
| code quality / code health | Clean Code (branded) | More precise and descriptive |

### Voice and Tone

- **Authoritative, not arrogant** — confidence from 16+ years of trust with millions of developers
- **Insightful, not abstract** — connect tactical code issues to strategic business challenges
- **Empowering, not prescriptive** — help developers grow their skills and reduce toil
- **"Vibe, then verify"** — approved messaging framework for AI-assisted development

### Company Boilerplate

> Sonar, the industry standard for code verification and automated code review, helps reduce outages, improve security, and lower risks associated with AI and agentic coding. As an independent verification platform, Sonar enables organizations to securely develop at the speed of AI. Sonar is the foundation for high performance software engineering, analyzing over 750 billion lines of code daily to ensure applications are secure, reliable, and maintainable. Rooted in the open source community, Sonar is trusted by 7M+ developers globally, including teams at Snowflake, Booking.com, Deutsche Bank, AstraZeneca, and Ford Motor Company.

**Mission:** Supercharge developers to build better, faster.

This isn't a third-party platform with Sonar content on it. It's a Sonar-owned experience that looks and feels like the rest of the Sonar ecosystem.

## Cost to Run

The entire site is statically generated at build time. Every page is pre-rendered to HTML and served from a CDN. There is no server, no database, no API, and no runtime compute.

| Line item | Cost |
|-----------|------|
| Hosting (Vercel / GitHub Pages / Cloudflare Pages) | **$0** — static sites are free tier on all major platforms |
| CDN and bandwidth | **$0** — included in free tier; scales to millions of pageviews |
| Database | **None** — all data is compiled into the build |
| Server functions | **None** — fully static, no cold starts |
| Video hosting | **$0** — videos stream from YouTube; Sonar.tv is a branded player wrapper |
| Incremental cost per pageview | **$0** |

**Compare to alternatives:**
- A custom CMS (WordPress/Contentful) with video embedding would cost $50-500/mo in hosting plus ongoing maintenance.
- A Wistia or Vidyard-style video marketing platform runs $300-1,000+/mo for 200+ videos with analytics.
- Sonar.tv achieves the same outcome — branded video hub with search visibility, progress tracking, and structured data — at zero ongoing cost.

Adding new videos requires only a data entry in a single TypeScript file and a rebuild. No CMS login, no media upload, no infrastructure changes.

## Performance

Fast pages rank higher and retain visitors longer. Sonar.tv is built for speed.

- **All 240+ pages are pre-rendered** — no server-side rendering, no loading spinners. Every page loads instantly from CDN cache.
- **Code splitting** — Below-fold components (transcript viewer, playlist queue, course navigation) load only when needed. The initial page load is lightweight.
- **Optimized thumbnails** — Card grids use 480px thumbnails; only the hero and social previews use full 1280px. Cuts thumbnail bandwidth ~75% across the catalog.
- **YouTube preconnect** — Browser begins connecting to YouTube servers before the user clicks play, shaving 100-300ms off video start time.
- **Lazy-loaded sections** — Video rows below the fold render on scroll, keeping the home page fast even with 11+ category sections.
- **Core Web Vitals optimized** — Largest Contentful Paint, Cumulative Layout Shift, and Interaction to Next Paint are all tuned. Google uses these as ranking signals.

## Testing

1,160+ unit tests and 28 end-to-end tests ensure nothing breaks when content is updated. Tests run automatically and cover navigation, search, filters, video playback, mobile interactions, and accessibility.

See [`docs/e2e-tests.md`](docs/e2e-tests.md) for the full E2E test reference.

## License

Private
