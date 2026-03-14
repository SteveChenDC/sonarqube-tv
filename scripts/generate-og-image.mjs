import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="50%" cy="0%" r="80%" fx="50%" fy="0%">
      <stop offset="0%" stop-color="#290042" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#0a0a0a" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#0a0a0a"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>

  <!-- Play button circle -->
  <circle cx="600" cy="240" r="50" fill="#D3121D"/>
  <polygon points="588,215 588,265 625,240" fill="#ffffff"/>

  <!-- Title -->
  <text x="600" y="345" text-anchor="middle"
        font-family="sans-serif" font-weight="700" font-size="64" fill="#FFFFFF"
        letter-spacing="-1">SonarQube.tv</text>

  <!-- Subtitle -->
  <text x="600" y="395" text-anchor="middle"
        font-family="sans-serif" font-weight="400" font-size="24" fill="#A8B3C2">
    Video tutorials for code quality &amp; security
  </text>

  <!-- Accent bars -->
  <rect x="510" y="440" width="60" height="4" rx="2" fill="#D3121D"/>
  <rect x="574" y="440" width="60" height="4" rx="2" fill="#126ED3"/>
  <rect x="638" y="440" width="60" height="4" rx="2" fill="#290042"/>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile("public/og-image.png");
console.log("Created public/og-image.png");
