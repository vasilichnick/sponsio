import { MarketNav } from "./market-nav";

/** Shared chrome for every belief market (/markets/*): the page header and
 *  the market switcher. Each market page renders only its own board. */
export default function MarketsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      {/* Data zone: solid #000 — the animated photo strips stop reading
          here (the layer is opaque and its ::after paints black behind the
          footer too, at negative z so footer text stays on top). The
          border is the table↔footer divider. */}
      <div className="relative min-h-0 flex-1 border-b border-white/15 bg-black after:absolute after:inset-x-0 after:top-full after:-z-[1] after:h-28 after:bg-black after:content-['']">
        <main className="flex h-full min-h-0 flex-col">{children}</main>
      </div>
    </>
  );
}
