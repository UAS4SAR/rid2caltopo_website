import type { Metadata } from "next";
import { Barlow, IBM_Plex_Mono } from "next/font/google";
import { headers } from "next/headers";
import {
  CalTopoDisclosurePanel,
  CalTopoLink,
} from "./components/CalTopoTeamsLink";
import { SiteHeader } from "./components/SiteHeader";
import "./globals.css";

function canonicalHost(requestHeaders: Headers): string {
  const candidate = (
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    ""
  ).toLowerCase();
  return candidate === "rid2caltopo.com" || candidate === "www.rid2caltopo.com"
    ? "rid2caltopo.com"
    : "rid2caltopo.org";
}

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = canonicalHost(requestHeaders);
  const origin = `https://${host}`;
  const socialImage = new URL("/og-image.jpg", origin).toString();

  return {
    metadataBase: new URL(origin),
    title: {
      default:
        "RID2Caltopo — Track drone assignments and search coverage in real time",
      template: "%s | RID2Caltopo",
    },
    description:
      "Free and managed tools that turn Remote ID observations into useful field awareness for search-and-rescue teams.",
    applicationName: "RID2Caltopo",
    creator: "RID2Caltopo",
    publisher: "RID2Caltopo",
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    openGraph: {
      type: "website",
      title:
        "RID2Caltopo — Track drone assignments and search coverage in real time",
      description:
        "Open tools for Remote ID awareness, incident-map tracks, and coordinated SAR drone operations.",
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: "RID2Caltopo: track drone assignments and search coverage in real time",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title:
        "RID2Caltopo — Track drone assignments and search coverage in real time",
      description:
        "Open tools for Remote ID awareness, incident-map tracks, and coordinated SAR drone operations.",
      images: [socialImage],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const origin = `https://${canonicalHost(requestHeaders)}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "RID2Caltopo",
        url: origin,
        description:
          "Track drone assignments and search coverage in real time for search-and-rescue operations.",
      },
      {
        "@type": "SoftwareApplication",
        name: "RID2Caltopo",
        url: origin,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Android, iOS",
        isAccessibleForFree: true,
        codeRepository: "https://github.com/kjtsar/RID2Caltopo",
        description:
          "Remote ID field awareness, incident-map publishing, and drone search coordination for search-and-rescue teams.",
      },
    ],
  };
  return (
    <html lang="en">
      <body className={`${barlow.variable} ${plexMono.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <SiteHeader />
        {children}
        <aside className="site-affiliation-notice" aria-label="CalTopo relationship">
          <strong>Independent project.</strong>{" "}
          <CalTopoLink /> relationship disclosure
        </aside>
        <CalTopoDisclosurePanel />
      </body>
    </html>
  );
}
