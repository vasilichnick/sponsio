import type { Metadata } from "next";
import fixturesData from "@/data/fixtures.json";
import tokensData from "@/data/tokens.json";
import { LocalTime } from "../local-time";

export const metadata: Metadata = {
  title: "Trade Teams — Sponsio",
  description:
    "All 48 FIFA World Cup 2026 team coins in launch order. Each coin goes live at its team's first kickoff, June 11–18, 2026.",
};

type Token = { name: string; flag: string; ticker: string; address: string };
type Fixture = { kickoffUtc: string; home: string; away: string };

const tokens = tokensData.teams as Record<string, Token>;
const fixtures = fixturesData.matches as Fixture[];

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;
const uniswap = (a: string) =>
  `https://app.uniswap.org/swap?chain=base&outputCurrency=${a}`;
const basescan = (a: string) => `https://basescan.org/token/${a}`;

// Launch rule: a team's coin launches at the team's first match kickoff
// (verified against the official FWC26 schedule v17 — all 48 first matches
// fall on June 11–18, 2026).
const firstKickoff: Record<string, string> = {};
for (const fx of fixtures) {
  for (const code of [fx.home, fx.away]) {
    if (!firstKickoff[code] || fx.kickoffUtc < firstKickoff[code]) {
      firstKickoff[code] = fx.kickoffUtc;
    }
  }
}

const coins = Object.keys(tokens)
  .map((code) => ({ code, team: tokens[code], launch: firstKickoff[code] }))
  .sort((a, b) =>
    a.launch === b.launch
      ? a.code.localeCompare(b.code)
      : a.launch < b.launch
        ? -1
        : 1,
  );

// Shared column template: Country | Launch | CA (sm+) | Trade
const COLS =
  "grid grid-cols-[minmax(0,1.7fr)_1.1fr_auto] items-center gap-3 px-4 sm:grid-cols-[minmax(0,1.7fr)_1.1fr_1fr_auto] sm:px-5";

function CoinRow({ team, launch }: { team: Token; launch: string }) {
  const live = team.address !== ZERO_ADDRESS;
  return (
    <div className={`${COLS} border-b border-white/5 py-3 last:border-0`}>
      <div className="flex min-w-0 items-center gap-3">
        <span className="text-2xl leading-none">{team.flag}</span>
        <div className="min-w-0">
          <div className="font-cond truncate font-semibold text-white uppercase">
            {team.name}
          </div>
          <div className="font-mono text-[11px] text-zinc-500">
            ${team.ticker}
            {/* CA folds in here on phones, where the column is hidden */}
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
            href={uniswap(team.address)}
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

export default function Coins() {
  return (
    <>
      <section className="shrink-0 px-6 pt-28 pb-5 text-center lg:pt-24">
        <h1 className="font-serif text-[clamp(2rem,8.5vmin,4.5rem)] leading-[0.9] font-normal uppercase tracking-tight [-webkit-text-stroke:0.75px_rgba(0,0,0,0.9)] [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.95))_drop-shadow(0_10px_28px_rgba(0,0,0,0.55))]">
          Trade Teams
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base font-medium text-white [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.95))_drop-shadow(0_4px_14px_rgba(0,0,0,0.7))] md:text-lg">
          All 48 coins in launch order — each goes live with its team&apos;s
          first kickoff, June 11–18. Times are shown in your local time.
        </p>
      </section>

      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 md:px-10">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-zinc-950/75 shadow-lg shadow-black/40 ring-1 ring-white/10 backdrop-blur-md">
          <div
            className={`${COLS} border-b border-white/10 py-3 text-[11px] font-semibold tracking-[0.15em] text-zinc-400 uppercase`}
          >
            <span>Country</span>
            <span>Launch</span>
            <span className="hidden sm:block">CA</span>
            <span className="text-right">Trade</span>
          </div>
          {coins.map((c) => (
            <CoinRow key={c.code} team={c.team} launch={c.launch} />
          ))}
        </div>
      </main>
    </>
  );
}
