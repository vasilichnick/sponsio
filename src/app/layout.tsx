import type { Metadata } from "next";
import { Archivo_Black, Barlow_Semi_Condensed } from "next/font/google";
import "./globals.css";

// Two-font system: Archivo Black is the brand/display voice (wordmark,
// titles, countdown digits); Barlow Semi Condensed carries all running
// text. Addresses use the system mono stack — not a brand font.
const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: "400",
});

const barlowSemiCondensed = Barlow_Semi_Condensed({
  variable: "--font-barlow-semicond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/** Farcaster Mini App embed: any sponsio.world URL cast in a Farcaster
 *  client renders as a 3:2 card with a launch button into /mini.
 *  Spec: miniapps.farcaster.xyz — version "1", image must be 3:2,
 *  button title ≤32 chars, splash image 200×200. */
const FC_MINIAPP_EMBED = JSON.stringify({
  version: "1",
  imageUrl: "https://sponsio.world/embed-image.jpg",
  button: {
    title: "⚽ Trade belief",
    action: {
      type: "launch_frame",
      name: "Sponsio",
      url: "https://sponsio.world/mini",
      splashImageUrl: "https://sponsio.world/splash-200.png",
      splashBackgroundColor: "#050505",
    },
  },
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sponsio.world"),
  title: "Sponsio — Trade the teams you believe in",
  description:
    "48 coins on Base, one per World Cup 2026 team — each one a belief: this team becomes champion. The market prices belief match by match. Fees fill one pool — one belief comes true, and its believers split it.",
  openGraph: {
    title: "Sponsio — Trade the teams you believe in",
    description:
      "48 coins on Base, one per World Cup 2026 team — each one a belief: this team becomes champion. The market prices belief match by match. Fees fill one pool — one belief comes true, and its believers split it.",
    url: "https://sponsio.world",
    siteName: "Sponsio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@sponsio_world",
  },
  other: {
    "fc:miniapp": FC_MINIAPP_EMBED,
    // Base.dev ownership verification (project: Sponsio, correct account;
    // replaced the wrong-account id 6a29aa1d… on 2026-06-10)
    "base:app_id": "6a29ac5365478aa1565a99a9",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivoBlack.variable} ${barlowSemiCondensed.variable} h-full antialiased`}
    >
      <body className="h-full">{children}</body>
    </html>
  );
}
