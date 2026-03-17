import sharp from "sharp";
import { mkdirSync } from "fs";
import { join } from "path";

const OUT_DIR = join(import.meta.dirname, "..", "public", "courses");
mkdirSync(OUT_DIR, { recursive: true });

const WIDTH = 800;
const HEIGHT = 450;

const PURPLE = "#290042";
const RED = "#D3121D";
const BLUE = "#126ED3";
const WHITE = "#FFFFFF";
const CREAM = "#F4F7FB";

// Full whale mark from the header — the recognizable Sonar logo
const WHALE_BODY = `M58.8813 9.56814C55.9524 6.53916 52.4437 4.13095 48.5642 2.48709C44.6847 0.843234 40.5139-0.002607 36.3005 6.03584e-06C18.8941 6.03584e-06 4.62992 14.4211 4.80597 31.8275C4.84353 35.9542 5.69545 40.0329 7.31284 43.8297C6.7941 43.7608 6.27025 43.7377 5.74746 43.7608C4.3352 43.8259 2.33742 43.3169 1.43419 43.0643C0.530954 42.8117-0.276601 43.535 0.0908155 44.377V44.4038C3.21768 51.5646 10.1488 56.2262 16.7661 56.2109C17.2059 56.2109 17.6454 56.1879 18.0827 56.142C33.5793 54.9632 45.8763 39.9183 45.8763 21.5934C45.8763 20.4375 45.8265 19.2894 45.727 18.1489C45.715 18.0113 45.6615 17.8806 45.5736 17.7741C45.4856 17.6677 45.3674 17.5904 45.2346 17.5527C45.1018 17.5149 44.9607 17.5184 44.8299 17.5627C44.6991 17.6069 44.5848 17.6899 44.5022 17.8006C40.2157 23.4726 33.8663 33.4464 25.9248 28.249C22.863 26.255 21.2325 21.9646 22.1549 17.5977C23.8083 9.75568 32.9478 4.58506 36.9741 6.20781C37.2879 6.33411 38.4207 6.78572 38.8073 7.81908C39.3967 9.39591 37.6208 10.6934 36.7138 13.4872C35.7378 16.5108 36.289 19.7142 36.9741 19.8558C37.7395 20.0089 39.0216 17.2035 42.183 14.6507C44.4793 12.8022 46.2092 12.2817 47.2962 10.3183C48.3448 8.40465 46.4771 6.38769 47.1125 6.20781C47.7478 6.02793 48.341 8.23243 50.2317 9.32702C51.8123 10.2456 53.2208 9.67147 55.299 9.58727C56.068 9.58177 56.8361 9.64067 57.5953 9.76333C57.5953 9.76333 58.001 9.82074 58.644 9.9547C58.6931 9.96735 58.745 9.9639 58.792 9.94489C58.8391 9.92587 58.8788 9.89227 58.9053 9.84903C58.9319 9.80579 58.9439 9.75518 58.9395 9.70462C58.9352 9.65407 58.9148 9.60623 58.8813 9.56814ZM35.4049 33.8482C35.752 33.383 36.2669 33.0713 36.8401 32.9795C37.0885 32.9441 37.3416 32.9598 37.5838 33.0256C37.8259 33.0914 38.0521 33.2059 38.2485 33.3622C39.014 34.0702 38.7882 35.4404 38.1299 36.2288C37.5175 36.956 36.3119 37.4344 35.4738 36.8947C35.2403 36.7141 35.0518 36.4819 34.923 36.2163C34.7942 35.9508 34.7286 35.659 34.7313 35.3638C34.7555 34.7915 34.9962 34.2497 35.4049 33.8482Z`;
const WHALE_TAIL1 = `M53.3436 27.3993C53.3652 22.3987 52.4257 17.4406 50.5765 12.7945C50.1937 12.9514 49.9182 13.0969 49.7192 13.1964C49.312 13.4075 48.9791 13.738 48.765 14.1436C48.5509 14.5493 48.4658 15.0106 48.5212 15.4659C48.7564 17.4987 48.8766 19.5432 48.881 21.5895C48.881 30.9433 45.8613 39.9144 40.3769 46.8494C35.1909 53.4055 28.233 57.6231 20.6665 58.8287L20.7315 58.867C22.9163 60.1079 25.3713 60.796 27.8827 60.8713C30.3941 60.9467 32.8859 60.4071 35.1412 59.2995C45.8192 54.0638 53.3436 41.7362 53.3436 27.3993Z`;
const WHALE_TAIL2 = `M55.4294 11.8415C54.7661 11.8234 54.1025 11.8656 53.4469 11.9678C55.3652 16.8856 56.3402 22.1207 56.3212 27.3993C56.3212 43.4738 47.3654 57.738 34.2915 62.9392C34.9498 62.9813 35.6157 63.0081 36.2855 63.0081H36.385C39.5002 62.9942 42.5732 62.2866 45.3808 60.9367C48.1884 59.5869 50.6601 57.6287 52.6164 55.2043C57.6224 49.008 60.6957 40.6607 60.6957 31.5098C60.7431 24.5991 58.9236 17.8039 55.4294 11.8415Z`;
const WHALE_TAIL3 = `M67.7677 31.5098C67.7729 27.3658 66.9573 23.2619 65.368 19.4348C64.6767 17.7166 63.6472 16.1548 62.3407 14.8421C61.6395 14.135 60.8388 13.5342 59.964 13.0586C59.742 12.9438 59.5162 12.8404 59.298 12.7448C62.1863 18.5731 63.6787 24.9936 63.6573 31.4983C63.6573 40.7985 60.6261 49.7581 55.2373 56.6319C59.13 53.702 62.2883 49.9073 64.4629 45.5474C66.6376 41.1876 67.7689 36.3819 67.7677 31.5098Z`;

const courses = [
  {
    id: "scd",
    title: "SonarQube Certified",
    titleLine2: "Developer",
    shortTitle: "SCD",
    level: "BEGINNER",
    accent: BLUE,
  },
  {
    id: "scse",
    title: "SonarQube Certified",
    titleLine2: "Security Engineer",
    shortTitle: "SCSE",
    level: "INTERMEDIATE",
    accent: RED,
  },
  {
    id: "scde",
    title: "SonarQube Certified",
    titleLine2: "DevOps Engineer",
    shortTitle: "SCDE",
    level: "INTERMEDIATE",
    accent: BLUE,
  },
  {
    id: "scai",
    title: "SonarQube Certified",
    titleLine2: "AI Code Verification",
    shortTitle: "SCAI",
    level: "INTERMEDIATE",
    accent: PURPLE,
  },
  {
    id: "scea",
    title: "SonarQube Certified",
    titleLine2: "Enterprise Architect",
    shortTitle: "SCEA",
    level: "ADVANCED",
    accent: RED,
  },
];

function generateSVG(course) {
  const accentMuted = course.accent + "30";
  const levelColor = course.level === "BEGINNER" ? BLUE
    : course.level === "ADVANCED" ? RED
    : "#b45309";

  return `<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-${course.id}" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stop-color="${CREAM}"/>
      <stop offset="100%" stop-color="#E8EFF7"/>
    </linearGradient>
    <linearGradient id="accent-band-${course.id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${course.accent}"/>
      <stop offset="100%" stop-color="${course.accent}" stop-opacity="0.7"/>
    </linearGradient>
  </defs>

  <!-- Certificate background -->
  <rect width="${WIDTH}" height="${HEIGHT}" rx="12" fill="url(#bg-${course.id})"/>

  <!-- Double border (certificate frame) -->
  <rect x="6" y="6" width="${WIDTH - 12}" height="${HEIGHT - 12}" rx="8" fill="none" stroke="${course.accent}" stroke-width="1.5" opacity="0.25"/>
  <rect x="14" y="14" width="${WIDTH - 28}" height="${HEIGHT - 28}" rx="4" fill="none" stroke="${course.accent}" stroke-width="0.5" opacity="0.15"/>

  <!-- Corner ornaments -->
  <g opacity="0.2" stroke="${course.accent}" stroke-width="1.5" fill="none">
    <path d="M30 20 L20 20 L20 30"/>
    <path d="M770 20 L780 20 L780 30"/>
    <path d="M30 430 L20 430 L20 420"/>
    <path d="M770 430 L780 430 L780 420"/>
  </g>

  <!-- Top accent band -->
  <rect x="14" y="14" width="${WIDTH - 28}" height="6" rx="3" fill="url(#accent-band-${course.id})" opacity="0.8"/>

  <!-- Large whale mark — centered watermark -->
  <g transform="translate(290, 40) scale(3.2)" opacity="0.07">
    <path d="${WHALE_TAIL1}" fill="${RED}"/>
    <path d="${WHALE_TAIL2}" fill="${RED}"/>
    <path d="${WHALE_TAIL3}" fill="${RED}"/>
    <path d="${WHALE_BODY}" fill="${PURPLE}"/>
  </g>

  <!-- Small whale mark — top left branding -->
  <g transform="translate(40, 42) scale(0.55)">
    <path d="${WHALE_TAIL1}" fill="${RED}"/>
    <path d="${WHALE_TAIL2}" fill="${RED}"/>
    <path d="${WHALE_TAIL3}" fill="${RED}"/>
    <path d="${WHALE_BODY}" fill="${PURPLE}"/>
  </g>

  <!-- "Sonar" wordmark next to whale -->
  <text x="82" y="67" font-family="Poppins, Arial, sans-serif" font-weight="700" font-size="18" fill="${PURPLE}">Sonar</text>
  <text x="82" y="82" font-family="Poppins, Arial, sans-serif" font-weight="500" font-size="10" fill="#5F656D" letter-spacing="2">CERTIFICATION</text>

  <!-- Horizontal rule -->
  <line x1="40" y1="100" x2="760" y2="100" stroke="${course.accent}" stroke-width="0.5" opacity="0.2"/>

  <!-- Certificate title -->
  <text x="400" y="175" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-weight="600" font-size="20" fill="#5F656D" letter-spacing="3">${course.shortTitle} CERTIFICATION</text>

  <!-- Main title — large, bold -->
  <text x="400" y="230" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-weight="800" font-size="36" fill="${PURPLE}">${course.title}</text>
  <text x="400" y="278" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-weight="800" font-size="38" fill="${course.accent}">${course.titleLine2}</text>

  <!-- Horizontal rule -->
  <line x1="250" y1="310" x2="550" y2="310" stroke="${course.accent}" stroke-width="1" opacity="0.3"/>
  <circle cx="400" cy="310" r="3" fill="${course.accent}" opacity="0.4"/>

  <!-- Level badge -->
  <rect x="${400 - course.level.length * 5.5 - 16}" y="330" width="${course.level.length * 11 + 32}" height="28" rx="14" fill="${levelColor}" opacity="0.12"/>
  <text x="400" y="349" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-weight="700" font-size="12" fill="${levelColor}" letter-spacing="2">${course.level}</text>

  <!-- Bottom branding -->
  <text x="400" y="415" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-weight="600" font-size="13" fill="#A8B3C2">Sonar.tv Learning Path</text>

  <!-- Bottom accent line -->
  <rect x="14" y="${HEIGHT - 20}" width="${WIDTH - 28}" height="6" rx="3" fill="url(#accent-band-${course.id})" opacity="0.6"/>
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
  console.log("\nDone!");
}

main().catch(console.error);
