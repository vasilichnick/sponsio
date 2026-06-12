"use client";

import Link from "next/link";
import fixturesData from "@/data/fixtures.json";
import tokensData from "@/data/tokens.json";
import { Countdown } from "../countdown";
import { LocalTime } from "../local-time";
import { useNowSec } from "../use-now";

const ZERO = "0x0000000000000000000000000000000000000000";

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
const fixtures = fixturesData.matches as Fixture[];

// A team's coin launches at the team's first match (same rule as
// @/data/launches — computed by min-scan so it doesn't depend on the
// JSON being sorted). debuts[i] = coins that go live at fixture i.
const firstFixture: Record<string, Fixture> = {};
for (const fx of fixtures) {
  for (const code of [fx.home, fx.away]) {
    if (!firstFixture[code] || fx.kickoffUtc < firstFixture[code].kickoffUtc) {
      firstFixture[code] = fx;
    }
  }
}
const debuts = fixtures.map((f) =>
  [f.home, f.away].filter((c) => firstFixture[c] === f),
);

function TeamSide({ team }: { team: Token }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-0.5">
      <span aria-hidden className="text-2xl leading-none">
        {team.flag}
      </span>
      <span className="font-cond text-sm leading-[1.15] font-bold tracking-wide text-balance text-white uppercase md:text-base">
        {team.name}
      </span>
      <span className="font-mono text-[11px] text-zinc-400">
        ${team.ticker}
      </span>
    </div>
  );
}

/** The next coin launch as a match card: who plays whom, where and when
 *  (viewer-local), which coins go live at that kickoff, and the countdown.
 *  Selection is live — the moment a kickoff passes, the card advances to
 *  the following launch, so the home page never shows a stale "Live now". */
export function NextLaunch() {
  const now = useNowSec();

  // Next launch = earliest fixture that debuts a coin not yet live on-chain,
  // with a kickoff still in the future. During SSR (now === null) the time
  // test is skipped — address state alone picks the fixture and the client
  // corrects within one tick.
  let idx = -1;
  fixtures.forEach((f, i) => {
    const eligible =
      debuts[i].some((c) => tokens[c].address === ZERO) &&
      (now === null || Date.parse(f.kickoffUtc) / 1000 > now);
    if (eligible && (idx === -1 || f.kickoffUtc < fixtures[idx].kickoffUtc)) {
      idx = i;
    }
  });

  if (idx === -1) {
    return (
      <p
        className="rise font-cond text-sm font-semibold uppercase [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.95))_drop-shadow(0_4px_14px_rgba(0,0,0,0.7))] md:text-base"
        style={{ "--rise-delay": "540ms" } as React.CSSProperties}
      >
        All 48 beliefs are live — every coin is trading now.
      </p>
    );
  }

  const f = fixtures[idx];

  return (
    <div
      className="rise w-full max-w-sm rounded-2xl bg-zinc-950/65 px-5 pt-3 pb-5 shadow-lg shadow-black/40 ring-1 ring-white/15 backdrop-blur-md"
      style={{ "--rise-delay": "540ms" } as React.CSSProperties}
    >
      <div className="flex items-start justify-center gap-4">
        <TeamSide team={tokens[f.home]} />
        <span className="font-cond self-center text-sm text-emerald-300 uppercase">
          vs
        </span>
        <TeamSide team={tokens[f.away]} />
      </div>

      <p className="font-cond mt-1.5 text-center text-xs font-semibold tracking-[0.15em] text-zinc-300 uppercase">
        {f.group} · {f.city} — <LocalTime iso={f.kickoffUtc} mode="date" /> ·{" "}
        <LocalTime iso={f.kickoffUtc} mode="time" />
      </p>

      <div className="mt-2">
        <Countdown targetIso={f.kickoffUtc} compact />
      </div>

      {/* The primary action lives inside the card — it can never be pushed
          past the fold by the card's own height. A pill button, not a bar:
          width from its own label, centered. */}
      <Link
        href="/markets/champion"
        className="font-cond mx-auto mt-3 flex h-10 w-fit items-center justify-center rounded-full bg-emerald-400 px-8 text-base font-bold tracking-wide text-zinc-950 uppercase transition-colors hover:bg-emerald-300 active:scale-[0.99]"
      >
        Trade belief
      </Link>
    </div>
  );
}
