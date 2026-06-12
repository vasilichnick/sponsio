import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Scorer Market — Sponsio",
  description:
    "A second belief market is coming to Sponsio: every coin is one belief — this player ends the World Cup as top scorer.",
};

// Market 2 — scaffolded, not live. Belief: this player ends the tournament
// as top scorer. No coins, no reward mechanics committed here on purpose
// (settlement still being designed); honest coming-soon + skeleton hint.
export default function TopScorerMarket() {
  return (
    <div className="mx-auto min-h-0 w-full max-w-3xl flex-1 overflow-y-auto px-4 pt-4 pb-6 md:px-0">
      <div className="rounded-2xl bg-zinc-950/75 px-6 py-8 text-center shadow-lg shadow-black/40 ring-1 ring-white/10 backdrop-blur-md md:px-8">
        <span className="font-cond inline-block rounded-full bg-amber-400/90 px-3 py-1 text-[11px] font-bold tracking-wide text-amber-950 uppercase">
          Coming soon
        </span>
        <h2 className="font-serif mt-4 text-2xl leading-tight uppercase tracking-tight text-white md:text-3xl">
          Top Scorer market
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-zinc-400">
          A second belief market. Every coin is one belief:{" "}
          <span className="font-semibold text-white">
            this player ends the World Cup as top scorer.
          </span>{" "}
          The Champion market trades who lifts the trophy — this one trades who
          finds the net most, repricing with every goal.
        </p>
        <a
          href="https://x.com/sponsio_world"
          target="_blank"
          rel="noopener noreferrer"
          className="font-cond mt-5 inline-flex h-11 items-center rounded-full bg-emerald-400 px-6 text-sm font-bold tracking-wide text-zinc-950 uppercase transition-colors hover:bg-emerald-300"
        >
          Follow for the launch
        </a>
      </div>
      {/* Skeleton hint — conveys "a list of player coins is coming" without
          inventing players or data. Decorative. */}
      <div
        aria-hidden
        className="mx-auto mt-3 overflow-hidden rounded-2xl bg-zinc-950/40 ring-1 ring-white/10 backdrop-blur-md"
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 border-b border-white/5 px-5 py-3.5 opacity-[var(--o)] last:border-0"
            style={{ "--o": `${1 - i * 0.22}` } as React.CSSProperties}
          >
            <div className="h-7 w-7 shrink-0 rounded-full bg-white/10" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-32 rounded bg-white/10" />
              <div className="h-2.5 w-16 rounded bg-white/5" />
            </div>
            <div className="h-7 w-16 rounded-lg bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
