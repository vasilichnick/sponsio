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

      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 md:px-10">
        <MarketNav />
        {children}
      </main>
    </>
  );
}
