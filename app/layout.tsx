import "./globals.css";
import type { Metadata } from "next";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";

export const metadata: Metadata = {
  title: "Dramacut — Guess the K-drama from one cut",
  description:
    "Daily K-drama scene game. One cinematic cut a day — guess the drama in five tries. 드라마컷: 한 컷만 보고 드라마를 맞혀보세요.",
  openGraph: {
    title: "Dramacut / 드라마컷",
    description: "One cut. Guess the K-drama.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
