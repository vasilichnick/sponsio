import Link from "next/link";
import { Web3Providers } from "@/lib/web3";
import { AccountChip } from "./account-chip";
import { BgStrips } from "./bg-strips";
import { Menu } from "./menu";

/** Site chrome: animated photo-strip background, header, pinned footer.
 *  Lives in the (site) route group so /mini (the Farcaster Mini App)
 *  renders bare — Farcaster hosts draw their own header, and the strip
 *  engine is too heavy for a webview splash. */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Web3Providers>
    <div className="page-shell relative isolate flex h-full flex-col">
      <BgStrips />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/65 via-black/25 to-black/60" />
      <header className="absolute inset-x-0 top-0 z-20 flex h-16 items-center justify-between bg-black/20 px-6 backdrop-blur-[10px] md:px-10">
        <Link
          href="/"
          aria-label="Sponsio — home"
          className="font-serif -mx-3 flex items-center gap-2 px-3 py-3 text-lg font-normal tracking-tight transition-opacity hover:opacity-75"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.png" alt="" className="h-8 w-8 object-contain" />
          SPONSIO
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/rewards"
            className="hidden h-[42px] items-center rounded-full bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/5 sm:flex"
          >
            Reward Pool
          </Link>
          <AccountChip />
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
          {/* Ambush-marketing hygiene: visible site-wide, not just in
              Terms. Hidden on the narrowest screens (covered by the
              /coins FAQ there). */}
          <span className="hidden text-white/80 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] sm:inline">
            Not affiliated with FIFA
          </span>
        </span>
        <span className="flex items-center gap-4">
          <Link
            href="/manifesto"
            className="drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] transition-colors hover:text-zinc-300"
          >
            Manifesto
          </Link>
          <a
            href="https://x.com/sponsio_world"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Sponsio on X"
            className="transition-colors hover:text-zinc-300"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </span>
      </footer>
    </div>
    </Web3Providers>
  );
}
