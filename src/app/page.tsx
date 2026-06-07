import Link from "next/link";
import fixturesData from "@/data/fixtures.json";
import tokensData from "@/data/tokens.json";
import { Countdown } from "./countdown";
import { SeamSpacer } from "./seam-spacer";
import { LocalTime } from "./local-time";

type Token = { name: string; flag: string; ticker: string; address: string };
type Fixture = { kickoffUtc: string; home: string; away: string };

const tokens = tokensData.teams as Record<string, Token>;
const fixtures = fixturesData.matches as Fixture[];

// First launch = earliest kickoff (launch rule: a team's coin goes live at
// the team's first match). The opening fixture launches the first two coins.
const opener = fixtures.reduce((a, b) => (b.kickoffUtc < a.kickoffUtc ? b : a));
const home = tokens[opener.home];
const away = tokens[opener.away];

export default function Home() {
  return (
    <>
      {/* Hero owns exactly the top half — the same box as the upper photo
          row — so the next in-flow section starts at the strip divider.
          min-h-fit: if content ever outgrows the half, the sections below
          get pushed down instead of overlapped. */}
      {/* Top padding scales with viewport height (not width): 128px on tall
          phones, shrinking on short windows so the hero fits its half. */}
      <section id="hero" className="h-1/2 min-h-fit shrink-0 px-6 pt-[max(4rem,min(8rem,14vh))] pb-6 text-center lg:pt-18">
        {/* Edge treatment: tight dark shadow defines glyph edges over bright
            photo areas; the wide soft one seats the block on busy ones. */}
        <h1 className="font-serif text-[clamp(2rem,8.5vmin,4.5rem)] leading-[0.9] font-normal uppercase tracking-tight [-webkit-text-stroke:0.75px_rgba(0,0,0,0.9)] [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.95))_drop-shadow(0_10px_28px_rgba(0,0,0,0.55))]">
          <span className="block">Trade the teams</span>
          <span className="block">
            you{" "}
            <span className="text-emerald-300 [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.9))_drop-shadow(0_2px_6px_rgba(0,0,0,0.85))]">
              believe in
            </span>
          </span>
          {/* Visible gap between caps rows ≈ 0.9em leading − ~0.71em cap
              height ≈ 0.19em. 3× that gap → add 2×0.19em ≈ 0.38em. */}
          <span className="mt-[0.38em] block">split the pool</span>
        </h1>
        <p id="tagline" className="mx-auto mt-3 max-w-2xl text-base font-medium text-white [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.95))_drop-shadow(0_4px_14px_rgba(0,0,0,0.7))] md:text-lg">
          Every team is a coin. The market prices belief — match by match,
          all tournament. Fees fill one pool. Champion believers share it.
        </p>
      </section>

      {/* Symmetric offset: countdown starts as far below the seam as the
          tagline ends above it. */}
      <SeamSpacer />
      <section className="flex shrink-0 flex-col items-center gap-3 px-6 text-center">
        <h2 className="font-serif text-base font-normal uppercase tracking-tight [-webkit-text-stroke:0.5px_rgba(0,0,0,0.9)] [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.95))_drop-shadow(0_4px_12px_rgba(0,0,0,0.6))] md:text-xl">
          Sponsio FIFA World Cup 2026 Launch Countdown
        </h2>
        <Countdown targetIso={opener.kickoffUtc} />
        <p className="font-cond text-sm font-semibold uppercase [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.95))_drop-shadow(0_4px_14px_rgba(0,0,0,0.7))] md:text-base">
          First coins {home.flag} {home.ticker} &{" "}
          <span className="whitespace-nowrap">
            {away.flag} {away.ticker}
          </span>{" "}
          go live at kickoff — <LocalTime iso={opener.kickoffUtc} mode="date" />{" "}
          · <LocalTime iso={opener.kickoffUtc} mode="time" />
        </p>
        <Link
          href="/coins"
          className="font-cond mt-1 flex h-12 items-center rounded-full bg-emerald-400 px-8 text-base font-bold uppercase tracking-wide text-zinc-950 shadow-lg shadow-black/40 transition-colors hover:bg-emerald-300"
        >
          Trade teams
        </Link>
      </section>

      {/* Keeps the footer pinned to the viewport bottom. */}
      <div className="min-h-0 flex-1" />
    </>
  );
}
