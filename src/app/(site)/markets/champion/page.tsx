import type { Metadata } from "next";
import { coinLaunches, ZERO_ADDRESS, type Token } from "@/data/launches";
import { LocalTime } from "../../../local-time";
import { LaunchBadge } from "./launch-status";
import { StatusTabs } from "./status-tabs";

export const metadata: Metadata = {
  title: "Belief Markets — Sponsio",
  description:
    "Trade belief markets for World Cup 2026 on Base. The Champion market: 48 coins, one per team — each the belief that this team becomes champion. A Top Scorer market is coming.",
};

const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;
const gmgn = (a: string) => `https://gmgn.ai/base/token/${a}`;
const basescan = (a: string) => `https://basescan.org/token/${a}`;

const upcoming = coinLaunches.filter((c) => c.team.address === ZERO_ADDRESS);
const tradable = coinLaunches.filter((c) => c.team.address !== ZERO_ADDRESS);

// Shared column template: Country | Launch | CA (sm+) | Trade
const COLS =
  "grid grid-cols-[minmax(0,1.7fr)_1.1fr_auto] items-center gap-3 px-4 sm:grid-cols-[minmax(0,1.7fr)_1.1fr_1fr_auto] sm:px-6 md:px-10";

function CoinRow({
  team,
  launch,
  group,
  opponent,
  index,
  hero = false,
}: {
  team: Token;
  launch: string;
  group?: string;
  opponent: Token;
  index: number;
  hero?: boolean;
}) {
  const live = team.address !== ZERO_ADDRESS;
  return (
    <div
      className={`${COLS} row-rise border-b border-white/5 transition-colors last:border-0 ${
        hero
          ? "bg-emerald-400/[0.06] py-4 ring-1 ring-emerald-400/30 ring-inset hover:bg-emerald-400/[0.09]"
          : "py-3 hover:bg-white/[0.04]"
      }`}
      style={{ "--rise-delay": `${Math.min(index * 22, 500)}ms` } as React.CSSProperties}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="text-2xl leading-none">{team.flag}</span>
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <span className="font-cond truncate font-semibold text-white uppercase">
              {team.name}
            </span>
            {hero && (
              <span className="font-cond shrink-0 rounded-full bg-emerald-400/90 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-emerald-950 uppercase">
                Next
              </span>
            )}
          </div>
          <div className="font-mono text-[11px] text-zinc-500">
            ${team.ticker}
            {/* Group rides here where the CA has its own column … */}
            {group && <span className="hidden sm:inline"> · {group}</span>}
            {/* … and the CA folds in here on phones, where it doesn't */}
            <span className="sm:hidden"> · {short(team.address)}</span>
          </div>
        </div>
      </div>
      <div>
        <div className="font-cond text-sm font-semibold text-zinc-100">
          <LocalTime iso={launch} mode="date" />
        </div>
        <div className="font-mono text-xs text-zinc-500">
          <LocalTime iso={launch} mode="time" />
        </div>
        <div className="font-cond text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">
          vs {opponent.flag} {opponent.ticker}
        </div>
        <LaunchBadge iso={launch} live={live} always={hero} />
      </div>
      <div className="hidden sm:block">
        {live ? (
          <a
            href={basescan(team.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-zinc-400 transition-colors hover:text-white"
          >
            {short(team.address)}
          </a>
        ) : (
          <span className="font-mono text-xs text-zinc-600 select-none">
            {short(team.address)}
          </span>
        )}
      </div>
      <div className="text-right">
        {live ? (
          <a
            href={gmgn(team.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-cond inline-block rounded-lg bg-emerald-400 px-5 py-2 text-sm font-bold text-zinc-950 uppercase transition-colors hover:bg-emerald-300"
          >
            Trade
          </a>
        ) : (
          <span className="font-cond inline-block cursor-not-allowed rounded-lg bg-white/5 px-5 py-2 text-sm font-bold text-zinc-600 uppercase ring-1 ring-white/10 select-none">
            Trade
          </span>
        )}
      </div>
    </div>
  );
}

/** One board panel (Upcoming or Live). `hero` lifts the nearest launch —
 *  every row sharing the earliest kickoff (a launch is one match, so the
 *  opener always debuts two coins), ring-lit with a NEXT tag and an
 *  always-on countdown. */
function Board({
  rows,
  hero = false,
  emptyText,
}: {
  rows: typeof coinLaunches;
  hero?: boolean;
  emptyText: string;
}) {
  return (
    <div className="max-h-full w-full overflow-y-auto">
      <div
        className={`${COLS} sticky top-0 z-10 border-b border-white/10 bg-black py-3 text-[11px] font-semibold tracking-[0.15em] text-zinc-400 uppercase`}
      >
        <span>Country</span>
        <span>Launch</span>
        <span className="hidden sm:block">CA</span>
        <span className="text-right">Trade</span>
      </div>
      {rows.length === 0 ? (
        <p className="font-cond px-5 py-8 text-center text-sm font-semibold tracking-wide text-zinc-400 uppercase">
          {emptyText}
        </p>
      ) : (
        rows.map((c, i) => (
          <CoinRow
            key={c.code}
            team={c.team}
            launch={c.launch}
            group={c.group}
            opponent={c.opponent}
            index={i}
            hero={hero && c.launch === rows[0].launch}
          />
        ))
      )}
    </div>
  );
}

// Market 1 — the live one. Belief: this team becomes champion. 48 team
// coins split by status: Upcoming (launch schedule, nearest first — the
// default view) and Live (tradable now).
export default function ChampionMarket() {
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
            hero
            emptyText="All 48 beliefs are live — every coin is trading now."
          />
        }
        live={
          <Board
            rows={tradable}
            emptyText="First coins go live at kickoff — see Upcoming for the schedule."
          />
        }
      />
    </>
  );
}
