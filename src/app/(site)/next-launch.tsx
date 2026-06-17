"use client";

import Link from "next/link";
import fixturesData from "@/data/fixtures.json";
import tokensData from "@/data/tokens.json";
import { Countdown } from "../countdown";
import { LocalTime } from "../local-time";
import { useNowSec } from "../use-now";

type Token = { name: string; flag: string; ticker: string; address: string };
type Fixture = {
  match: number;
  kickoffUtc: string;
  group: string;
  city: string;
  home: string;
  away: string;
};

const tokens = tokensData.teams as Record<string, Token>;
const bundledFixtures = fixturesData.matches as Fixture[];

function TeamSide({ team }: { team: Token }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-0.5">
      <span
        aria-hidden
        className="text-2xl leading-none [@media(max-height:879px)]:text-xl"
      >
        {team.flag}
      </span>
      <span className="font-cond text-sm leading-[1.15] font-bold tracking-wide text-balance text-white uppercase md:[@media(min-height:880px)]:text-base">
        {team.name}
      </span>
      <span className="font-mono text-[11px] text-zinc-400">
        ${team.ticker}
      </span>
    </div>
  );
}

/** The next upcoming match as a card: who plays whom, where and when
 *  (viewer-local), and the live countdown. Selection is live — the moment a
 *  kickoff passes, the card advances to the following fixture, so the home
 *  page always shows the genuine next match for the whole championship.
 *
 *  Fixtures come from the optional `fixtures` prop (live data from
 *  @/lib/upcoming, which can include knockouts) and fall back to the bundled
 *  group-stage @/data/fixtures.json when no live data is available. */
export function NextLaunch({ fixtures }: { fixtures?: Fixture[] }) {
  const now = useNowSec();
  const source = fixtures ?? bundledFixtures;

  // Next match = the soonest fixture whose kickoff is still in the future.
  // During SSR (now === null) the time test is skipped, so the statically
  // prerendered HTML shows the earliest fixture and the client corrects to
  // the true next one within one tick.
  let idx = -1;
  source.forEach((f, i) => {
    const upcoming = now === null || Date.parse(f.kickoffUtc) / 1000 > now;
    // Only render fixtures whose teams we actually have coins for.
    const known = tokens[f.home] && tokens[f.away];
    if (
      upcoming &&
      known &&
      (idx === -1 || f.kickoffUtc < source[idx].kickoffUtc)
    ) {
      idx = i;
    }
  });

  if (idx === -1) {
    return (
      <p
        className="rise font-cond text-sm font-semibold uppercase [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.95))_drop-shadow(0_4px_14px_rgba(0,0,0,0.7))] md:text-base"
        style={{ "--rise-delay": "540ms" } as React.CSSProperties}
      >
        The tournament is complete — every belief has played out.
      </p>
    );
  }

  const f = source[idx];

  return (
    <div
      className="rise w-full max-w-sm rounded-2xl bg-zinc-950/65 px-5 pt-3 pb-5 shadow-lg shadow-black/40 ring-1 ring-white/15 backdrop-blur-md [@media(max-height:879px)]:pt-2 [@media(max-height:879px)]:pb-3.5"
      style={{ "--rise-delay": "540ms" } as React.CSSProperties}
    >
      <div className="flex items-start justify-center gap-4">
        <TeamSide team={tokens[f.home]} />
        <span className="font-cond self-center text-sm text-emerald-300 uppercase">
          vs
        </span>
        <TeamSide team={tokens[f.away]} />
      </div>

      <p className="font-cond mt-1.5 text-center text-xs font-semibold tracking-[0.15em] text-zinc-300 uppercase [@media(max-height:879px)]:mt-1">
        {f.group} · {f.city} — <LocalTime iso={f.kickoffUtc} mode="date" /> ·{" "}
        <LocalTime iso={f.kickoffUtc} mode="time" />
      </p>

      <div className="mt-2 [@media(max-height:879px)]:mt-1.5">
        <Countdown targetIso={f.kickoffUtc} compact />
      </div>

      {/* The primary action lives inside the card — it can never be pushed
          past the fold by the card's own height. A pill button, not a bar:
          width from its own label, centered. */}
      <Link
        href="/markets/champion"
        className="font-cond mx-auto mt-3 flex h-10 w-fit items-center justify-center rounded-full bg-emerald-400 px-8 text-base font-bold tracking-wide text-zinc-950 uppercase transition-colors hover:bg-emerald-300 active:scale-[0.99] [@media(max-height:879px)]:mt-2 [@media(max-height:879px)]:h-9"
      >
        Trade belief
      </Link>
    </div>
  );
}
