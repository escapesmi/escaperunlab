// src/app/layout.tsx
import type { Metadata } from "next";
import { Space_Grotesk, Bebas_Neue, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Echo Stride Club — Adaptive Running Coach",
  description:
    "Your personal adaptive running coach. Build consistency safely with plans that evolve with your fitness — built for Indonesian runners.",
  keywords: ["running", "lari", "adaptive training", "running coach", "Indonesia"],
  openGraph: {
    title: "Echo Stride Club",
    description: "Adaptive Running Coach for Indonesian Runners",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${spaceGrotesk.variable} ${bebasNeue.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-bg text-text-primary font-body antialiased">
        {children}
      </body>
    </html>
  );
}
