import type { Metadata } from "next";
import {
  Archivo_Black,
  Barlow,
  Barlow_Semi_Condensed,
  JetBrains_Mono,
} from "next/font/google";
import Link from "next/link";
import { BgStrips } from "./bg-strips";
import { Menu } from "./menu";
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
  metadataBase: new URL("https://sponsio.world"),
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
      <body className="h-full">
        <div className="relative isolate flex h-full flex-col">
          <BgStrips />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/25 to-black/60" />
          <header className="absolute inset-x-0 top-0 z-20 flex h-16 items-center justify-between bg-black/20 px-6 backdrop-blur-[10px] md:px-10">
            <Link href="/" className="font-serif text-lg font-normal tracking-tight">
              SPONSIO<span className="text-emerald-400">.world</span>
            </Link>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="h-[42px] rounded-full bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/5"
              >
                Get the app
              </button>
              <Menu />
            </div>
          </header>
          {children}
          <footer className="flex h-12 shrink-0 items-center justify-between px-6 text-xs text-white md:px-10">
            <span className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] transition-colors hover:text-zinc-300"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] transition-colors hover:text-zinc-300"
              >
                Terms
              </Link>
            </span>
            <span className="flex items-center gap-4">
              <Link
                href="/manifesto"
                className="drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] transition-colors hover:text-zinc-300"
              >
                Manifesto
              </Link>
              <a href="#" aria-label="X" className="transition-colors hover:text-zinc-300">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </span>
          </footer>
        </div>
      </body>
    </html>
  );
}
