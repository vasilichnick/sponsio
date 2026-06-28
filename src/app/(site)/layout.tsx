import Link from "next/link";
import { getRewardPool, formatEth } from "@/lib/reward-pool";
import { SiteBackdrop } from "./site-backdrop";
import { SiteHeader } from "./site-header";

// ISR: regenerate every 5 min so the live Reward Pool figure stays current
// (the eth_getBalance call is a POST, which Next's data cache won't cache).
export const revalidate = 300;

/** Site chrome: clean-dark backdrop, header (logo + Reward Pool pill + burger
 *  drawer), and the footer. Lives in the (site) route group so /mini renders
 *  bare. */
export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pool = await getRewardPool();
  return (
    <div className="page-shell relative isolate flex h-full flex-col">
      <SiteBackdrop />
      <SiteHeader poolLabel={pool != null ? formatEth(pool) : null} />
      {children}
      <footer className="z-30 flex h-12 shrink-0 items-center justify-between border-t border-white/10 bg-[#0a0a0b]/80 px-4 text-xs text-white backdrop-blur-md sm:px-6 md:px-10">
        <span className="flex items-center gap-4">
          <Link
            href="/privacy"
            className="transition-colors hover:text-zinc-300"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="transition-colors hover:text-zinc-300"
          >
            Terms
          </Link>
          {/* Ambush-marketing hygiene: visible site-wide, not just in Terms. */}
          <span className="hidden text-white/80 sm:inline">
            Not affiliated with FIFA
          </span>
        </span>
        <span className="flex items-center gap-4">
          <Link
            href="/manifesto"
            className="transition-colors hover:text-zinc-300"
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
