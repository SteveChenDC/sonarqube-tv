import sharp from "sharp";
import { mkdirSync } from "fs";
import { join } from "path";

const OUT_DIR = join(import.meta.dirname, "..", "public", "courses");
mkdirSync(OUT_DIR, { recursive: true });

const WIDTH = 800;
const HEIGHT = 450;

// Sonar brand colors
const PURPLE = "#290042";
const RED = "#D3121D";
const BLUE = "#126ED3";
const BG = "#0a0a0a";
const N7 = "#5F656D";
const N8 = "#3B3F44";
const WHITE = "#FFFFFF";

// Course definitions with unique icon SVG paths and accent colors
const courses = [
  {
    id: "scd",
    title: "SonarQube Certified Developer",
    shortTitle: "SCD",
    subtitle: "BEGINNER",
    accent: BLUE,
    accentLight: "#126ED340",
    // Code bracket icon
    icon: `<g transform="translate(340, 120) scale(3.5)" stroke="${BLUE}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
      <line x1="14" y1="4" x2="10" y2="20" opacity="0.5"/>
    </g>`,
  },
  {
    id: "scse",
    title: "SonarQube Certified Security Engineer",
    shortTitle: "SCSE",
    subtitle: "INTERMEDIATE",
    accent: RED,
    accentLight: "#D3121D40",
    // Shield icon
    icon: `<g transform="translate(340, 120) scale(3.5)" stroke="${RED}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" opacity="0.7"/>
    </g>`,
  },
  {
    id: "scde",
    title: "SonarQube Certified DevOps Engineer",
    shortTitle: "SCDE",
    subtitle: "INTERMEDIATE",
    accent: BLUE,
    accentLight: "#126ED340",
    // Git branch / pipeline icon
    icon: `<g transform="translate(340, 120) scale(3.5)" stroke="${BLUE}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 15V9a3 3 0 0 0-3-3H9" />
      <path d="M6 9v6" />
    </g>`,
  },
  {
    id: "scai",
    title: "SonarQube Certified AI Code Verification",
    shortTitle: "SCAI",
    subtitle: "INTERMEDIATE",
    accent: PURPLE,
    accentLight: "#4a0e6e50",
    // Brain/AI icon
    icon: `<g transform="translate(340, 120) scale(3.5)" stroke="#9333ea" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2a4 4 0 0 1 4 4c0 1.1-.5 2.1-1.2 2.8" />
      <path d="M8 6a4 4 0 0 1 4-4" />
      <path d="M6.5 9A3.5 3.5 0 0 0 3 12.5c0 1.3.7 2.4 1.7 3" />
      <path d="M17.5 9a3.5 3.5 0 0 1 3.5 3.5c0 1.3-.7 2.4-1.7 3" />
      <path d="M5 16a4 4 0 0 0 3 3.9" />
      <path d="M19 16a4 4 0 0 1-3 3.9" />
      <path d="M12 22v-2" />
      <circle cx="12" cy="12" r="2" fill="#9333ea" opacity="0.3"/>
      <line x1="12" y1="10" x2="12" y2="6" opacity="0.5"/>
      <line x1="10" y1="12" x2="6.5" y2="12" opacity="0.5"/>
      <line x1="14" y1="12" x2="17.5" y2="12" opacity="0.5"/>
      <line x1="12" y1="14" x2="12" y2="18" opacity="0.5"/>
    </g>`,
  },
  {
    id: "scea",
    title: "SonarQube Certified Enterprise Architect",
    shortTitle: "SCEA",
    subtitle: "ADVANCED",
    accent: RED,
    accentLight: "#D3121D40",
    // Building/architecture icon
    icon: `<g transform="translate(340, 120) scale(3.5)" stroke="${RED}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4" y="8" width="16" height="14" rx="1"/>
      <path d="M12 2L4 8h16L12 2z" />
      <rect x="8" y="14" width="3" height="4" opacity="0.5"/>
      <rect x="13" y="14" width="3" height="4" opacity="0.5"/>
      <line x1="8" y1="11" x2="10" y2="11" opacity="0.5"/>
      <line x1="14" y1="11" x2="16" y2="11" opacity="0.5"/>
    </g>`,
  },
];

// Sonar whale mark path (simplified from Header.tsx)
const WHALE_MARK = `<g transform="translate(52, 360) scale(0.42)" fill="${N7}" opacity="0.5">
  <path d="M53.3436 27.3993C53.3652 22.3987 52.4257 17.4406 50.5765 12.7945C50.1937 12.9514 49.9182 13.0969 49.7192 13.1964C49.312 13.4075 48.9791 13.738 48.765 14.1436C48.5509 14.5493 48.4658 15.0106 48.5212 15.4659C48.7564 17.4987 48.8766 19.5432 48.881 21.5895C48.881 30.9433 45.8613 39.9144 40.3769 46.8494C35.1909 53.4055 28.233 57.6231 20.6665 58.8287L20.7315 58.867C22.9163 60.1079 25.3713 60.796 27.8827 60.8713C30.3941 60.9467 32.8859 60.4071 35.1412 59.2995C45.8192 54.0638 53.3436 41.7362 53.3436 27.3993Z" fill="${RED}"/>
  <path d="M55.4294 11.8415C54.7661 11.8234 54.1025 11.8656 53.4469 11.9678C55.3652 16.8856 56.3402 22.1207 56.3212 27.3993C56.3212 43.4738 47.3654 57.738 34.2915 62.9392C34.9498 62.9813 35.6157 63.0081 36.2855 63.0081H36.385C39.5002 62.9942 42.5732 62.2866 45.3808 60.9367C48.1884 59.5869 50.6601 57.6287 52.6164 55.2043C57.6224 49.008 60.6957 40.6607 60.6957 31.5098C60.7431 24.5991 58.9236 17.8039 55.4294 11.8415Z" fill="${RED}"/>
  <path d="M67.7677 31.5098C67.7729 27.3658 66.9573 23.2619 65.368 19.4348C64.6767 17.7166 63.6472 16.1548 62.3407 14.8421C61.6395 14.135 60.8388 13.5342 59.964 13.0586C59.742 12.9438 59.5162 12.8404 59.298 12.7448C62.1863 18.5731 63.6787 24.9936 63.6573 31.4983C63.6573 40.7985 60.6261 49.7581 55.2373 56.6319C59.13 53.702 62.2883 49.9073 64.4629 45.5474C66.6376 41.1876 67.7689 36.3819 67.7677 31.5098Z" fill="${RED}"/>
  <path d="M58.8813 9.56814C55.9524 6.53916 52.4437 4.13095 48.5642 2.48709C44.6847 0.843234 40.5139-0.002607 36.3005 6.03584e-06C18.8941 6.03584e-06 4.62992 14.4211 4.80597 31.8275C4.84353 35.9542 5.69545 40.0329 7.31284 43.8297C6.7941 43.7608 6.27025 43.7377 5.74746 43.7608C4.3352 43.8259 2.33742 43.3169 1.43419 43.0643C0.530954 42.8117-0.276601 43.535 0.0908155 44.377V44.4038C3.21768 51.5646 10.1488 56.2262 16.7661 56.2109C17.2059 56.2109 17.6454 56.1879 18.0827 56.142C33.5793 54.9632 45.8763 39.9183 45.8763 21.5934C45.8763 20.4375 45.8265 19.2894 45.727 18.1489C45.715 18.0113 45.6615 17.8806 45.5736 17.7741C45.4856 17.6677 45.3674 17.5904 45.2346 17.5527C45.1018 17.5149 44.9607 17.5184 44.8299 17.5627C44.6991 17.6069 44.5848 17.6899 44.5022 17.8006C40.2157 23.4726 33.8663 33.4464 25.9248 28.249C22.863 26.255 21.2325 21.9646 22.1549 17.5977C23.8083 9.75568 32.9478 4.58506 36.9741 6.20781C37.2879 6.33411 38.4207 6.78572 38.8073 7.81908C39.3967 9.39591 37.6208 10.6934 36.7138 13.4872C35.7378 16.5108 36.289 19.7142 36.9741 19.8558C37.7395 20.0089 39.0216 17.2035 42.183 14.6507C44.4793 12.8022 46.2092 12.2817 47.2962 10.3183C48.3448 8.40465 46.4771 6.38769 47.1125 6.20781C47.7478 6.02793 48.341 8.23243 50.2317 9.32702C51.8123 10.2456 53.2208 9.67147 55.299 9.58727C56.068 9.58177 56.8361 9.64067 57.5953 9.76333C57.5953 9.76333 58.001 9.82074 58.644 9.9547C58.6931 9.96735 58.745 9.9639 58.792 9.94489C58.8391 9.92587 58.8788 9.89227 58.9053 9.84903C58.9319 9.80579 58.9439 9.75518 58.9395 9.70462C58.9352 9.65407 58.9148 9.60623 58.8813 9.56814Z" fill="${N7}"/>
</g>`;

function generateSVG(course) {
  // Grid pattern for background texture
  const gridPattern = `
    <defs>
      <pattern id="grid-${course.id}" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${N8}" stroke-width="0.5" opacity="0.3"/>
      </pattern>
      <linearGradient id="accent-grad-${course.id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${course.accent}" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="${BG}" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="bottom-grad-${course.id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${BG}" stop-opacity="0"/>
        <stop offset="100%" stop-color="${BG}" stop-opacity="0.9"/>
      </linearGradient>
      <radialGradient id="glow-${course.id}" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="${course.accent}" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="${BG}" stop-opacity="0"/>
      </radialGradient>
    </defs>`;

  // Decorative circuit-like lines
  const decorLines = `
    <line x1="0" y1="80" x2="180" y2="80" stroke="${course.accent}" stroke-width="1" opacity="0.15"/>
    <line x1="620" y1="130" x2="800" y2="130" stroke="${course.accent}" stroke-width="1" opacity="0.15"/>
    <line x1="0" y1="370" x2="260" y2="370" stroke="${course.accent}" stroke-width="1" opacity="0.1"/>
    <line x1="540" y1="370" x2="800" y2="370" stroke="${course.accent}" stroke-width="1" opacity="0.1"/>
    <circle cx="180" cy="80" r="3" fill="${course.accent}" opacity="0.3"/>
    <circle cx="620" cy="130" r="3" fill="${course.accent}" opacity="0.3"/>
  `;

  const subtitleColor = course.subtitle === "BEGINNER" ? BLUE
    : course.subtitle === "ADVANCED" ? RED
    : "#d97706";

  return `<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    ${gridPattern}

    <!-- Background -->
    <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}"/>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid-${course.id})"/>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#accent-grad-${course.id})"/>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow-${course.id})"/>

    <!-- Decorative lines -->
    ${decorLines}

    <!-- Large faded short title watermark -->
    <text x="400" y="260" text-anchor="middle" font-family="Poppins, sans-serif" font-weight="900" font-size="180" fill="${course.accent}" opacity="0.04" letter-spacing="8">${course.shortTitle}</text>

    <!-- Icon -->
    ${course.icon}

    <!-- Bottom gradient for text legibility -->
    <rect y="260" width="${WIDTH}" height="190" fill="url(#bottom-grad-${course.id})"/>

    <!-- Difficulty badge -->
    <rect x="52" y="310" width="${course.subtitle.length * 10 + 24}" height="24" rx="12" fill="${subtitleColor}" opacity="0.15"/>
    <text x="${52 + 12}" y="326" font-family="Poppins, sans-serif" font-weight="600" font-size="11" fill="${subtitleColor}" letter-spacing="1.5">${course.subtitle}</text>

    <!-- Title -->
    <text x="52" y="362" font-family="Poppins, sans-serif" font-weight="700" font-size="24" fill="${WHITE}">${course.title}</text>

    <!-- Sonar.tv branding -->
    <text x="708" y="428" font-family="Poppins, sans-serif" font-weight="700" font-size="14" fill="${N7}">Sonar</text><text x="751" y="428" font-family="Poppins, sans-serif" font-weight="700" font-size="14" fill="${BLUE}">.tv</text>

    <!-- Whale mark -->
    ${WHALE_MARK}

    <!-- Top accent line -->
    <rect x="0" y="0" width="${WIDTH}" height="3" fill="${course.accent}"/>

    <!-- Border -->
    <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="none" stroke="${N8}" stroke-width="1" rx="8"/>
  </svg>`;
}

async function main() {
  for (const course of courses) {
    const svg = generateSVG(course);
    const outputPath = join(OUT_DIR, `${course.id}.png`);

    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);

    console.log(`Generated: ${outputPath}`);
  }
  console.log("\nDone! Generated 5 course images.");
}

main().catch(console.error);
