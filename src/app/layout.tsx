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
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SearchProvider>
      </body>
    </html>
  );
}
