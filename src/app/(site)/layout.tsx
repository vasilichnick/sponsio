import Link from "next/link";
import { getRewardPool, formatEth } from "@/lib/reward-pool";
import { SiteBackdrop } from "./site-backdrop";

// ISR: regenerate every 5 min so the live Reward Pool figure stays current
// (the eth_getBalance call is a POST, which Next's data cache won't cache).
// Still a prerendered/static render — the home page never scrolls.
export const revalidate = 300;

/** Site chrome: animated photo-strip background, header, pinned footer.
 *  Lives in the (site) route group so /mini (the Farcaster Mini App)
 *  renders bare — Farcaster hosts draw their own header, and the strip
 *  engine is too heavy for a webview splash. */
export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pool = await getRewardPool();
  return (
    <div className="page-shell relative isolate flex h-full flex-col">
      <SiteBackdrop />
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
        <div className="flex items-center">
          {/* One wide button: "Reward Pool" and the live pool size inline on a
              single row, split by a thin divider — emerald mono amount + pulse
              dot. Falls back to just "Reward Pool" when the on-chain read is
              unavailable. Tighter padding on small screens so the wide title
              still clears the header at 390px. */}
          <Link
            href="/rewards"
            aria-label={
              pool != null ? `Reward Pool: ${formatEth(pool)}` : "Reward Pool"
            }
            className="flex h-[42px] items-center gap-2.5 rounded-full bg-white/10 px-4 backdrop-blur transition-colors hover:bg-white/5 sm:px-5"
          >
            <span className="text-sm font-semibold whitespace-nowrap text-white">
              Reward Pool
            </span>
            {pool != null && (
              <>
                <span aria-hidden className="h-4 w-px bg-white/20" />
                <span className="flex items-center gap-1.5 font-mono text-sm font-bold whitespace-nowrap text-emerald-300">
                  <span
                    aria-hidden
                    className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-400"
                  />
                  {formatEth(pool)}
                </span>
              </>
            )}
          </Link>
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
  );
}
