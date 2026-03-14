import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
    default: "SonarQube.tv — Video Tutorials for Code Quality & Security",
    template: "%s | SonarQube.tv",
  },
  description:
    "Video tutorials, webinars, and demos for code verification, code quality, and code security with SonarQube.",
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
    siteName: "SonarQube.tv",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SonarQube.tv — Video tutorials for code quality & security",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
      </head>
      <body
        className={`${poppins.variable} ${inter.variable} flex min-h-screen flex-col bg-background font-body antialiased`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
