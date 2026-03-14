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
  metadataBase: new URL("https://sonarqube-tv.vercel.app"),
  title: {
    default: "SonarQube.tv",
    template: "%s | SonarQube.tv",
  },
  description:
    "Video tutorials, webinars, and demos for code verification, code quality, and code security with SonarQube.",
  openGraph: {
    type: "website",
    siteName: "SonarQube.tv",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
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
        className={`${poppins.variable} ${inter.variable} min-h-screen bg-background font-body antialiased`}
      >
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
