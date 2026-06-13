import type { Metadata } from "next";
import { coinLaunches, ZERO_ADDRESS, type Token } from "@/data/launches";
import { FIFA_RANK } from "@/data/rankings";
import { getBeliefMap } from "@/lib/belief";
import { LocalTime } from "../../../local-time";
import { LaunchBadge } from "./launch-status";
import { StatusTabs } from "./status-tabs";

export const metadata: Metadata = {
  title: "Belief Markets — Sponsio",
  description:
    "Trade belief markets for World Cup 2026 on Base. The Champion market: 48 coins, one per team — each the belief that this team becomes champion. A Top Scorer market is coming.",
};

const gmgn = (a: string) => `https://gmgn.ai/base/token/${a}`;

const upcoming = coinLaunches.filter((c) => c.team.address === ZERO_ADDRESS);
const tradable = coinLaunches.filter((c) => c.team.address !== ZERO_ADDRESS);

type Entry = (typeof coinLaunches)[number];

/** FIFA rank + live "World belief" chips — shown on every card. Belief is
 *  omitted when the team isn't in the market / the feed is unavailable. */
function Stats({ code, belief }: { code: string; belief?: number }) {
  const rank = FIFA_RANK[code];
  return (
    <div className="font-cond flex items-center gap-1.5 text-[10px] font-semibold tracking-wide uppercase">
      {rank != null && (
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-zinc-300">
          FIFA #{rank}
        </span>
      )}
      {belief != null && (
        <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-emerald-300">
          belief {belief > 0 ? `${belief}%` : "<1%"}
        </span>
      )}
    </div>
  );
}

/** Live coin card: flag, ticker, the belief sentence, a Trade button.
 *  No CA. Plus the rank + belief chips. */
function LiveCard({ entry, belief }: { entry: Entry; belief?: number }) {
  const { team, code, group } = entry;
  return (
    <div className="row-rise flex flex-col gap-2 rounded-xl bg-white/[0.04] p-4 ring-1 ring-white/20 transition-colors hover:bg-white/[0.06]">
      <div className="flex items-start justify-between gap-2">
        <span className="text-3xl leading-none">{team.flag}</span>
        <Stats code={code} belief={belief} />
      </div>
      <div className="font-mono text-[11px] text-zinc-500">
        ${team.ticker}
        {group && ` · ${group}`}
      </div>
      <p className="font-cond text-[15px] leading-snug font-semibold text-white">
        One belief: {team.name} becomes champion
      </p>
      <div className="mt-auto flex justify-end pt-1">
        <a
          href={gmgn(team.address)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-cond inline-flex h-8 items-center rounded-full bg-emerald-400 px-4 text-xs font-bold tracking-wide text-zinc-950 uppercase transition-colors hover:bg-emerald-300"
        >
          Trade ↗
        </a>
      </div>
    </div>
  );
}

/** Upcoming coin card: flag, name, NEXT badge (hero), $TICKER · Group,
 *  date, time, VS opponent, countdown. No Trade, no CA. Plus rank + belief. */
function UpcomingCard({
  entry,
  belief,
  hero,
}: {
  entry: Entry;
  belief?: number;
  hero: boolean;
}) {
  const { team, code, group, opponent, launch } = entry;
  return (
    <div
      className={`row-rise flex flex-col gap-2 rounded-xl p-4 transition-colors ${
        hero
          ? "bg-emerald-400/[0.07] ring-1 ring-emerald-400/50 hover:bg-emerald-400/[0.10]"
          : "bg-white/[0.04] ring-1 ring-white/20 hover:bg-white/[0.06]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-3xl leading-none">{team.flag}</span>
        <div className="flex items-center gap-1.5">
          {hero && (
            <span className="font-cond rounded-full bg-emerald-400/90 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-emerald-950 uppercase">
              Next
            </span>
          )}
          <Stats code={code} belief={belief} />
        </div>
      </div>
      <div className="font-cond text-base font-bold tracking-wide text-white uppercase">
        {team.name}
      </div>
      <div className="font-mono text-[11px] text-zinc-500">
        ${team.ticker}
        {group && ` · ${group}`}
      </div>
      <div className="font-cond text-sm font-semibold text-zinc-100">
        <LocalTime iso={launch} mode="date" /> ·{" "}
        <LocalTime iso={launch} mode="time" />
      </div>
      <div className="font-cond text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">
        vs {opponent.flag} {opponent.ticker}
      </div>
      <LaunchBadge iso={launch} live={false} always={hero} />
    </div>
  );
}

/** A board panel: a responsive card grid (1 / 2 / 3 columns) that scrolls
 *  inside the locked viewport. `hero` lifts the cards sharing the earliest
 *  kickoff (a launch is one match → two coins debut together). */
function Board({
  rows,
  belief,
  variant,
  emptyText,
}: {
  rows: Entry[];
  belief: Record<string, number>;
  variant: "live" | "upcoming";
  emptyText: string;
}) {
  if (rows.length === 0) {
    return (
      <p className="font-cond px-5 py-8 text-center text-sm font-semibold tracking-wide text-zinc-400 uppercase">
        {emptyText}
      </p>
    );
  }
  return (
    <div className="max-h-full w-full overflow-y-auto px-4 pt-1 pb-4 sm:px-6 lg:px-10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((c) =>
          variant === "live" ? (
            <LiveCard key={c.code} entry={c} belief={belief[c.code]} />
          ) : (
            <UpcomingCard
              key={c.code}
              entry={c}
              belief={belief[c.code]}
              hero={c.launch === rows[0].launch}
            />
          ),
        )}
      </div>
    </div>
  );
}

// Market 1 — the live one. Belief: this team becomes champion. 48 team
// coins as cards, split by status: Live (tradable now, default) and
// Upcoming (launch schedule, nearest first). Each card carries the team's
// FIFA rank and its live "World belief" (Polymarket-implied win %).
export default async function ChampionMarket() {
  const belief = await getBeliefMap();
  return (
    <>
      <p className="mx-auto mt-3 mb-3 max-w-2xl shrink-0 px-6 text-center text-sm leading-relaxed text-zinc-400">
        Back the team you believe lifts the trophy. 48 coins, in launch order —
        each goes live at its team&apos;s first kickoff, June 11–18. Times shown
        in your local time.
      </p>
      <StatusTabs
        upcomingCount={upcoming.length}
        liveCount={tradable.length}
        upcoming={
          <Board
            rows={upcoming}
            belief={belief}
            variant="upcoming"
            emptyText="All 48 beliefs are live — every coin is trading now."
          />
        }
        live={
          <Board
            rows={tradable}
            belief={belief}
            variant="live"
            emptyText="First coins go live at kickoff — see Upcoming for the schedule."
          />
        }
      />
    </>
  );
}
