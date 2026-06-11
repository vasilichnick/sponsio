import type { Metadata } from "next";
import { coinLaunches, ZERO_ADDRESS, type Token } from "@/data/launches";
import { LocalTime } from "../../local-time";
import { TradeButton } from "../trade-button";
import { CoinsFaq } from "./faq";
import { LaunchBadge, NextLaunchIn } from "./launch-status";
import { MarketTabs } from "./market-tabs";

export const metadata: Metadata = {
  title: "Belief Markets — Sponsio",
  description:
    "Trade belief markets for World Cup 2026 on Base. The Champion market: 48 coins, one per team — each the belief that this team becomes champion. A Top Scorer market is coming.",
};

const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;
const basescan = (a: string) => `https://basescan.org/token/${a}`;

const liveCount = coinLaunches.filter(
  (c) => c.team.address !== ZERO_ADDRESS,
).length;
const lastLaunch = coinLaunches[coinLaunches.length - 1].launch;

// Shared column template: Country | Launch | CA (sm+) | Trade
const COLS =
  "grid grid-cols-[minmax(0,1.7fr)_1.1fr_auto] items-center gap-3 px-4 sm:grid-cols-[minmax(0,1.7fr)_1.1fr_1fr_auto] sm:px-5";

function CoinRow({
  team,
  launch,
  group,
  opponent,
  index,
}: {
  team: Token;
  launch: string;
  group?: string;
  opponent: Token;
  index: number;
}) {
  const live = team.address !== ZERO_ADDRESS;
  return (
    <div
      className={`${COLS} row-rise border-b border-white/5 py-3 transition-colors last:border-0 hover:bg-white/[0.04]`}
      style={{ "--rise-delay": `${Math.min(index * 22, 500)}ms` } as React.CSSProperties}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="text-2xl leading-none">{team.flag}</span>
        <div className="min-w-0">
          <div className="font-cond truncate font-semibold text-white uppercase">
            {team.name}
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
        <LaunchBadge iso={launch} live={live} />
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
          <TradeButton
            coin={{
              name: team.name,
              flag: team.flag,
              ticker: team.ticker,
              address: team.address,
            }}
            code={team.ticker}
          />
        ) : (
          <span className="font-cond inline-block cursor-not-allowed rounded-lg bg-white/5 px-5 py-2 text-sm font-bold text-zinc-600 uppercase ring-1 ring-white/10 select-none">
            Trade
          </span>
        )}
      </div>
    </div>
  );
}

// Market 1 — the live one. Belief: this team becomes champion. 48 team
// coins in launch order, real schedule data, ticking next-launch clock.
function ChampionMarket() {
  return (
    <>
      <p className="mx-auto mb-4 max-w-2xl text-center text-sm leading-relaxed text-zinc-300 [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.95))_drop-shadow(0_4px_14px_rgba(0,0,0,0.7))]">
        Back the team you believe lifts the trophy. 48 coins, in launch order —
        each goes live at its team&apos;s first kickoff, June 11–18. Times shown
        in your local time.
      </p>
      <div className="font-cond mx-auto mb-3 flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-semibold tracking-[0.15em] text-zinc-300 uppercase [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.95))_drop-shadow(0_4px_14px_rgba(0,0,0,0.7))]">
        <span>{coinLaunches.length} coins</span>
        <span aria-hidden className="text-zinc-600">
          ·
        </span>
        <span>{liveCount} live</span>
        <span aria-hidden className="text-zinc-600">
          ·
        </span>
        <NextLaunchIn
          label={liveCount === 0 ? "first launch" : "next launch"}
          launches={coinLaunches.map((c) => ({
            launch: c.launch,
            live: c.team.address !== ZERO_ADDRESS,
          }))}
        />
        <span aria-hidden className="text-zinc-600">
          ·
        </span>
        <span>
          all live by <LocalTime iso={lastLaunch} mode="date" />
        </span>
      </div>
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-zinc-950/75 shadow-lg shadow-black/40 ring-1 ring-white/10 backdrop-blur-md">
        <div
          className={`${COLS} border-b border-white/10 py-3 text-[11px] font-semibold tracking-[0.15em] text-zinc-400 uppercase`}
        >
          <span>Country</span>
          <span>Launch</span>
          <span className="hidden sm:block">CA</span>
          <span className="text-right">Trade</span>
        </div>
        {coinLaunches.map((c, i) => (
          <CoinRow
            key={c.code}
            team={c.team}
            launch={c.launch}
            group={c.group}
            opponent={c.opponent}
            index={i}
          />
        ))}
      </div>
      <CoinsFaq />
    </>
  );
}

// Market 2 — scaffolded, not live. Belief: this player ends the tournament
// as top scorer. No coins, no reward mechanics committed here on purpose
// (settlement still being designed); honest coming-soon + skeleton hint.
function TopScorerMarket() {
  return (
    <div className="mx-auto max-w-3xl">
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

export default function Coins() {
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
        <MarketTabs
          champion={<ChampionMarket />}
          topScorer={<TopScorerMarket />}
        />
      </main>
    </>
  );
}
