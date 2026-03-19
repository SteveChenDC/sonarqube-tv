# Sonar Brand Design Guidelines

Reference: https://brand.sonarsource.com/718590635/p/2593ae-external-sonar-brand-guide

This file is the single source of truth for Design Ralph. All UI changes MUST conform to these guidelines.

---

## Colors

### Primary Palette

| Name              | Hex       | RGB              | Pantone      | CMYK             |
|-------------------|-----------|------------------|--------------|------------------|
| Persistence Purple | `#290042` | rgb(41, 0, 66)   | PANTONE 2627 C | 95 / 100 / 35 / 50 |
| Sonar Red         | `#D3121D` | rgb(211, 18, 29) | PANTONE 1795 C | 0 / 96 / 93 / 2    |
| Qube Blue         | `#126ED3` | rgb(18, 110, 211)| PANTONE 285 C  | 90 / 48 / 0 / 0    |

### Neutral Scale

| Token | Hex       | Usage                        |
|-------|-----------|------------------------------|
| n1    | `#FFFFFF` | Pure white                   |
| n2    | `#F4F7FB` | Light background             |
| n3    | `#E8EFF7` | Foreground text (light mode) |
| n4    | `#DDE6F3` | Borders, dividers            |
| n5    | `#D3DCE9` | Subtle borders               |
| n6    | `#A8B3C2` | Muted/secondary text         |
| n7    | `#5F656D` | Disabled/placeholder         |
| n8    | `#3B3F44` | Dark UI elements, borders    |
| n9    | `#000000` | Pure black                   |

### App-Specific Colors

| Token       | Hex       | Usage                  |
|-------------|-----------|------------------------|
| background  | `#0a0a0a` | App dark background    |
| foreground  | `#E8EFF7` | App light text (= n3)  |

### Rules
- ONLY use colors from the tables above
- Do NOT introduce new colors
- Use opacity variants (e.g., `bg-sonar-purple/70`) rather than new hex values
- Primary CTAs: `sonar-red`
- Links and secondary actions: `qube-blue`
- Progress bars and accents: `sonar-red`
- Maintain the dark theme (`background: #0a0a0a`)

---

## Typography

### Font Families
- **Headings, tags, CTAs:** Poppins (Google Font) — weights 400, 500, 600, 700
- **Body copy:** Inter (Google Font)

### Tailwind Usage
- Headings: `font-heading` (maps to `--font-poppins`)
- Body: `font-body` (maps to `--font-inter`)

### Rules
- Do NOT introduce any other fonts
- Use Poppins for all headings, buttons, labels, and tags
- Use Inter for all body text, descriptions, and paragraphs

---

## Logos

### Sonar Logo
- Consists of Logo Type + Mark
- Safe space is built into each logo version
- Use light background version on light backgrounds
- Use dark background version on dark backgrounds

### Do's
- Use a version of the logo on all Sonar collateral
- Use the version appropriate for the background color

### Don'ts
- Do NOT squish or stretch the logo
- Do NOT change the logo colors
- Do NOT modify or accessorize the logo

### Naming Conventions
- **Sonar** — the brand/company (use in logo, brand-level references)
- **SonarQube** — the product family (SonarQube Server, SonarQube Cloud, SonarQube for IDE)
- **Sonar.tv** — this app (the logo renders as "Sonar" in white + ".tv" in Qube Blue)
- **SonarSource** — the company entity (legal, footer links)
- Do NOT use "SonarQube" in the app logo — use "Sonar.tv"

---

## Tailwind Class Reference

### Colors
```
text-sonar-purple  bg-sonar-purple
text-sonar-red     bg-sonar-red
text-qube-blue     bg-qube-blue
text-n1 through text-n9
bg-n1 through bg-n9
text-foreground    bg-background
```

### Opacity variants
```
bg-sonar-purple/70  bg-sonar-red/85  bg-n9/80
from-black/90  to-transparent
```

### Fonts
```
font-heading  (Poppins)
font-body     (Inter)
```

---

## CSS Custom Properties

Defined in `src/app/globals.css`:
```css
--background: #0a0a0a;
--foreground: #E8EFF7;
--sonar-purple: #290042;
--sonar-red: #D3121D;
--qube-blue: #126ED3;
--n1: #FFFFFF;
--n2: #F4F7FB;
--n3: #E8EFF7;
--n4: #DDE6F3;
--n5: #D3DCE9;
--n6: #A8B3C2;
--n7: #5F656D;
--n8: #3B3F44;
--n9: #000000;
```

---

## Design Principles for This App

1. This is a Netflix-style TV display app — visual polish IS the product
2. Dark theme always — `#0a0a0a` background
3. Video cards should have hover states and smooth transitions
4. Use gradient overlays for text readability over images
5. Maintain consistent spacing and alignment across all components
6. Responsive design: must work on large TV screens and standard monitors
7. Accessibility: sufficient color contrast, keyboard navigation, ARIA labels

---

## Company Boilerplate

> Sonar, the industry standard for code verification and automated code review, helps reduce outages, improve security, and lower risks associated with AI and agentic coding. As an independent verification platform, Sonar enables organizations to securely develop at the speed of AI. Sonar is the foundation for high performance software engineering, analyzing over 750 billion lines of code daily to ensure applications are secure, reliable, and maintainable. Rooted in the open source community, Sonar is trusted by 7M+ developers globally, including teams at Snowflake, Booking.com, Deutsche Bank, AstraZeneca, and Ford Motor Company.

**Mission:** Supercharge developers to build better, faster.

---

## Terminology: Use This, Not That

| Use this | Not this | Notes |
|----------|----------|-------|
| SonarQube Cloud | SonarCloud | Product rebrand |
| SonarQube Server | SonarQube (when referring to self-hosted) | Deployment distinction |
| SonarQube for IDE | SonarLint | Product rebrand |
| SonarQube Community Build | Community Edition | Official name |
| code quality / code health / code security | Clean Code (as branded term) | More precise and descriptive |
| "improving code quality as you write" or "vibe, then verify" | Clean as You Code | Updated messaging framework |
| developer-written and AI-generated code | human-generated code | Preferred phrasing |
| open source (noun) / open-source (adjective before noun) | Open Source | Not a proper noun |
| blog post | blog (for a single article) | "Blog" = the site, "blog post" = one article |

### Product Names (always capitalized)
- SonarQube Cloud
- SonarQube Server
- SonarQube for IDE
- SonarQube Community Build
- SonarQube Advanced Security
- SonarQube Remediation Agent

### Capabilities (never capitalized unless starting a sentence)
- architecture management
- secrets detection
- code quality analysis
- code security analysis
- code reliability analysis
- code maintainability

---

## Voice and Tone

- **Authoritative, not arrogant** — We speak with confidence from 16+ years of trust with millions of developers
- **Insightful, not abstract** — We connect tactical code issues to strategic business challenges
- **Empowering, not prescriptive** — We help developers grow their skills and reduce toil
- **"Vibe, then verify"** — Our approved messaging framework for AI-assisted development workflows
