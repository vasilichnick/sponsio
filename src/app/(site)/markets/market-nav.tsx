"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MARKETS: { href: string; label: string; soon?: boolean }[] = [
  { href: "/markets/champion", label: "Champion" },
  { href: "/markets/top-scorer", label: "Top Scorer", soon: true },
];

/** Segmented market switcher — same pill language as the old in-page tabs,
 *  but each market is a real route now (/markets/champion, /markets/
 *  top-scorer), so markets are linkable, shareable, and back-button sane. */
export function MarketNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Belief markets"
      className="mx-auto mb-5 flex w-fit gap-1 rounded-full bg-zinc-950/75 p-1 shadow-lg shadow-black/40 ring-1 ring-white/10 backdrop-blur-md"
    >
      {MARKETS.map((m) => {
        const selected = pathname === m.href;
        return (
          <Link
            key={m.href}
            href={m.href}
            aria-current={selected ? "page" : undefined}
            className={`font-cond flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold tracking-wide uppercase transition-colors ${
              selected
                ? "bg-emerald-400 text-zinc-950"
                : "text-zinc-300 hover:text-white"
            }`}
          >
            {m.label}
            {m.soon && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold tracking-wide ${
                  selected
                    ? "bg-zinc-950/20 text-zinc-900"
                    : "bg-amber-400/90 text-amber-950"
                }`}
              >
                Soon
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
