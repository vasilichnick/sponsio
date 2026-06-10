import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sponsio — Trade belief",
  description:
    "World Cup 2026 belief coins on Base — every coin is one belief: this team becomes champion. Champion believers split one fee-funded pool.",
};

/** Bare layout: the Farcaster host draws its own chrome around the
 *  webview, so the mini app brings nothing but itself. */
export default function MiniLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
