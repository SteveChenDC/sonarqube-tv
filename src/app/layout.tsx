import type { Metadata, Viewport } from "next";
import { Poppins, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SearchProvider } from "@/components/SearchContext";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stevechendc.github.io/sonarqube-tv"),
  title: {
    default: "Sonar.tv — Video Tutorials for Code Quality & Security",
    template: "%s | Sonar.tv",
  },
  description:
    "Video tutorials, webinars, and demos for code verification, code quality, and code security with Sonar.",
  keywords: [
    "SonarQube",
    "code quality",
    "code security",
    "static analysis",
    "clean code",
    "tutorials",
    "webinars",
  ],
  openGraph: {
    type: "website",
    siteName: "Sonar.tv",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sonar.tv — Video tutorials for code quality & security",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    // @SonarSource is the official Twitter/X account for the brand.
    // Appears in the "from @SonarSource" attribution line on Twitter cards,
    // and is inherited by child pages via Next.js metadata merging.
    site: "@SonarSource",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#D3121D" },
    { media: "(prefers-color-scheme: light)", color: "#D3121D" },
  ],
};

const BASE_URL = "https://stevechendc.github.io/sonarqube-tv";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SonarSource",
  url: "https://www.sonarsource.com",
  logo: "https://www.sonarsource.com/favicon.ico",
  sameAs: [
    "https://www.youtube.com/c/SonarSource",
    "https://twitter.com/SonarSource",
    "https://www.linkedin.com/company/sonarsource",
    "https://github.com/SonarSource",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Sonar.tv",
  url: BASE_URL,
  description:
    "Video tutorials, webinars, and demos for code verification, code quality, and code security with Sonar.",
  publisher: {
    "@type": "Organization",
    name: "SonarSource",
    url: "https://www.sonarsource.com",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Content Security Policy — restricts resource loading to known-safe origins.
          script-src uses a sha256 hash to allow only the specific theme-detection IIFE
          below, rather than the broad 'unsafe-inline'. Per CSP Level 2+, a hash source
          makes 'unsafe-inline' ineffective, so the hash is the tighter, explicit form.
          All other inline scripts (JSON-LD data blocks) are type="application/ld+json"
          and are not subject to script-src restrictions.
          style-src keeps 'unsafe-inline' for Tailwind's generated inline styles.
          frame-src limits iframes to YouTube only, blocking injected third-party embeds.
          Note: frame-ancestors cannot be set via meta CSP (only HTTP header), so
          clickjacking protection depends on the hosting CDN/server configuration.
        */}
        <meta
          httpEquiv="Content-Security-Policy"
          content={[
            "default-src 'none'",
            // sha256 hash of the theme-detection IIFE below — allows only that one
            // specific inline script. Any other injected inline script is blocked.
            "script-src 'self' 'sha256-imH7XyQgTpje3D1+3Md3+y/TzEwctHI4pQ4BYCgyr58=' https://www.youtube.com",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https://img.youtube.com https://i.ytimg.com https://www.youtube.com",
            "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
            "connect-src 'self'",
            "font-src 'self'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join("; ")}
        />
        {/* Referrer-Policy — only send origin (no path/query) on cross-origin requests. */}
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        {/* Preconnect to YouTube domains used for all video thumbnails and embeds.
            Eliminates DNS + TCP + TLS round-trips before the LCP thumbnail image
            starts downloading, improving Core Web Vitals (LCP) across all pages. */}
        <link rel="preconnect" href="https://img.youtube.com" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
        <link rel="preconnect" href="https://www.youtube.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://www.youtube-nocookie.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.youtube-nocookie.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('sonarqube-tv-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){document.documentElement.classList.add('dark')}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
      </head>
      <body
        className={`${poppins.variable} ${inter.variable} flex min-h-screen flex-col overflow-x-hidden bg-background font-body antialiased`}
      >
        <SearchProvider>
          {/* Skip to main content — WCAG 2.4.1 Bypass Blocks (Level A).
              Visually hidden until focused; appears top-left so keyboard-only
              users can jump past the header nav on every page. */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-background focus:px-4 focus:py-2.5 focus:font-heading focus:text-sm focus:font-medium focus:text-n1 focus:ring-2 focus:ring-qube-blue focus:ring-offset-2 focus:ring-offset-background focus:shadow-xl"
          >
            Skip to main content
          </a>
          <Header />
          {/* id + tabIndex={-1} lets the skip link move focus here; outline-none
              prevents a browser focus ring on the entire content area. */}
          <main id="main-content" tabIndex={-1} className="flex-1 outline-none">{children}</main>
          <Footer />
        </SearchProvider>
      </body>
    </html>
  );
}
