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

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://hankut.shivachandra.work");

export const viewport: Viewport = {
  themeColor: "#1C1917",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  verification: {
    google: "JFPWZNVDMgpP1ekXERoqFTrfum4L4CW55JO3MMGgxeI",
  },
  title: {
    default: "Dramacut — Daily K-Drama Quiz, Scene & OST Game | 드라마컷",
    template: "%s | Dramacut — 드라마컷",
  },
  description:
    "Daily K-Drama game & trivia quiz. Guess the drama from iconic scene cuts, OST song clips, and actor clues. Replay past puzzles by genre and test your K-culture deokryeok. 드라마컷: 매일 새로운 K-드라마 명장면, 드라마 OST 퀴즈 게임.",
  keywords: [
    "kdrama quiz",
    "korean drama quiz",
    "guess the kdrama",
    "kdrama game",
    "k drama games",
    "korean drama game",
    "kpop heardle",
    "kdrama heardle",
    "드라마 OST 퀴즈",
    "OST 퀴즈",
    "드라마 퀴즈",
    "guess the drama",
    "kdrama trivia",
    "kdrama puzzle",
    "드라마컷",
    "Dramacut",
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
    title: "Dramacut — Daily K-Drama Quiz, Scene & OST Game | 드라마컷",
    description:
      "Daily K-Drama game & trivia quiz. Guess the drama from iconic scene cuts, OST audio clips, and actor clues in 5 attempts.",
    url: baseUrl,
    siteName: "Dramacut",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/api/og?title=Daily%20K-Drama%20Quiz%20%26%20OST%20Game&date=DAILY%20CUT",
        width: 1200,
        height: 630,
        alt: "Dramacut — K-Drama Scene & OST Quiz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dramacut — Daily K-Drama Quiz, Scene & OST Game | 드라마컷",
    description: "Daily K-Drama scene & OST game. Guess the drama from clips and test your K-culture knowledge every day!",
    images: ["/api/og?title=Daily%20K-Drama%20Quiz%20%26%20OST%20Game&date=DAILY%20CUT"],
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
