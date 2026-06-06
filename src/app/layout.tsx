import type { Metadata } from "next";
import {
  Archivo_Black,
  Barlow,
  Barlow_Semi_Condensed,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: "400",
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const barlowSemiCondensed = Barlow_Semi_Condensed({
  variable: "--font-barlow-semicond",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Sponsio — Trade the teams you believe in",
  description:
    "Every World Cup 2026 team is a token on Base. The market prices belief, match by match. Trading fees fill one pool — champion-token holders share it.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivoBlack.variable} ${barlow.variable} ${barlowSemiCondensed.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="h-full">{children}</body>
    </html>
  );
}
