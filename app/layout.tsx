import "./globals.css";
import type { Metadata, Viewport } from "next";
import { DM_Mono, Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { WebAppJsonLd } from "@/components/seo/JsonLd";
import { Analytics } from "@vercel/analytics/next";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const notoSerifKR = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-serif",
  display: "swap",
  preload: false,
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dramacut.com";

export const viewport: Viewport = {
  themeColor: "#1C1917",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Dramacut — Guess the K-drama from one cut | 드라마컷",
    template: "%s | Dramacut — 드라마컷",
  },
  description:
    "Daily K-drama scene guessing game. Test your Korean drama knowledge with cinematic cuts, sound clips, and daily puzzles. 드라마컷: 한 컷만 보고 드라마를 맞혀보세요.",
  keywords: [
    "K-Drama game",
    "Korean drama quiz",
    "Kdrama puzzle",
    "Guess the Kdrama",
    "드라마컷",
    "Dramacut",
    "Daily K-culture game",
    "Kdrama trivia",
  ],
  authors: [{ name: "Dramacut Team", url: baseUrl }],
  creator: "Dramacut",
  publisher: "Dramacut",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: "/icon.svg",
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "ko-KR": "/ko",
    },
  },
  openGraph: {
    title: "Dramacut — Guess the K-drama from one cut | 드라마컷",
    description:
      "One cut a day. Guess the K-drama in 5 attempts with clues, audio clips, and daily streaks.",
    url: baseUrl,
    siteName: "Dramacut",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/api/og?title=Guess%20the%20K-drama%20from%20one%20cut&date=DAILY%20CUT",
        width: 1200,
        height: 630,
        alt: "Dramacut — K-Drama Scene Game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dramacut — Guess the K-drama from one cut | 드라마컷",
    description: "Daily K-drama scene game. Test your K-culture knowledge every day!",
    images: ["/api/og?title=Guess%20the%20K-drama%20from%20one%20cut&date=DAILY%20CUT"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://bpohxfkuetoeumbudwti.supabase.co"
          crossOrigin=""
        />
        <link
          rel="dns-prefetch"
          href="https://bpohxfkuetoeumbudwti.supabase.co"
        />
        <WebAppJsonLd />
      </head>
      <body className={`${notoSansKR.variable} ${notoSerifKR.variable} ${dmMono.variable}`}>
        <LocaleProvider>{children}</LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}
