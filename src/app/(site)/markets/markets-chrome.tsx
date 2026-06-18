"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { MarketNav } from "./market-nav";

/** A single coin page is /markets/champion/[code] — one segment below the
 *  champion market. Those pages are content-first (the coin's data fills the
 *  viewport), so they drop the market hero + switcher entirely. */
function isCoinPage(segments: string[]): boolean {
  return segments[0] === "champion" && segments.length >= 2;
}

/** Market chrome: the "Trade Belief Markets" hero + the market switcher,
 *  shown on every /markets/* board. Suppressed on a single coin page so its
 *  on-chain + championship data starts at the top of the locked viewport
 *  instead of below a half-screen hero. */
export function MarketsChrome() {
  const segments = useSelectedLayoutSegments();
  if (isCoinPage(segments)) return null;
  return (
    <>
      <section className="shrink-0 px-6 pt-28 pb-5 text-center lg:pt-24">
        <h1 className="font-serif text-[clamp(2rem,8.5vmin,4.5rem)] leading-[0.9] font-normal uppercase tracking-tight [-webkit-text-stroke:0.75px_rgba(0,0,0,0.9)] [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.95))_drop-shadow(0_10px_28px_rgba(0,0,0,0.55))]">
          Trade Belief Markets
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base font-medium text-white [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.95))_drop-shadow(0_4px_14px_rgba(0,0,0,0.7))] md:text-lg">
          Each coin is one belief. Choose a market, then trade the belief you
          share.
        </p>
      </section>

      {/* Nav sits OUTSIDE the scroll region: in the locked layout the
          header, switcher and (on champion) status tabs never move — only
          each market's own board panel scrolls. */}
      <MarketNav />
    </>
  );
}
