import type { Metadata } from "next";
import fixturesData from "@/data/fixtures.json";
import tokensData from "@/data/tokens.json";
import { LocalTime } from "../local-time";

export const metadata: Metadata = {
  title: "Leaderboard — Sponsio",
  description:
    "Market-implied World Cup champion odds: each team's share of total token market cap.",
};

type Token = { name: string; flag: string; ticker: string; address: string };
type Fixture = { kickoffUtc: string; home: string; away: string };

const tokens = tokensData.teams as Record<string, Token>;
const fixtures = fixturesData.matches as Fixture[];

// First kickoff per team = its token launch moment (staggered launch model).
const firstKickoff: Record<string, string> = {};
for (const fx of fixtures) {
  for (const code of [fx.home, fx.away]) {
    if (!firstKickoff[code] || fx.kickoffUtc < firstKickoff[code]) {
      firstKickoff[code] = fx.kickoffUtc;
    }
  }
}

// ---------------------------------------------------------------------------
// MOCK DATA — demo only, until BasedBid launches are live. Pretend "now" is
// mid-launch-window: teams whose first match is before Jun 17 have launched.
// ---------------------------------------------------------------------------
const MOCK_NOW = "2026-06-17T02:00:00Z";

const MOCK_MCAPS: Record<string, number> = {
  ARG: 840_000, BRA: 760_000, FRA: 705_000, ESP: 660_000, GER: 470_000,
  NED: 425_000, MEX: 395_000, USA: 360_000, JPN: 305_000, BEL: 250_000,
  SUI: 195_000, SEN: 180_000, MAR: 175_000, URU: 165_000, NOR: 160_000,
  SWE: 120_000, CAN: 115_000, AUS: 98_000, KOR: 95_000, IRN: 88_000,
  TUR: 85_000, EGY: 80_000, ECU: 76_000, CZE: 70_000, TUN: 64_000,
  KSA: 60_000, SCO: 58_000, PAR: 55_000, ALG: 52_000, CIV: 50_000,
  RSA: 45_000, QAT: 40_000, BIH: 33_000, IRQ: 30_000, NZL: 28_000,
  HAI: 22_000, CPV: 19_000, CUW: 15_000,
};

const MOCK_DELTAS: Record<string, number> = {
  ARG: 2.1, BRA: -0.4, FRA: 5.7, ESP: -1.2, GER: 0.8, NED: 3.4, MEX: 12.6,
  USA: -2.8, JPN: 1.1, NOR: 9.3, MAR: 6.2, SUI: -1.9, SEN: 4.4, URU: -3.5,
  SWE: 2.2, CAN: 7.1, KOR: -5.3, EGY: 1.8, SCO: -2.2, HAI: 14.9,
};

const SUPPLY = 1_000_000_000;
// ---------------------------------------------------------------------------

const launched = Object.keys(tokens)
  .filter((c) => firstKickoff[c] < MOCK_NOW)
  .map((c) => ({ code: c, mcap: MOCK_MCAPS[c] ?? 10_000 }))
  .sort((a, b) => b.mcap - a.mcap);

const upcoming = Object.keys(tokens)
  .filter((c) => firstKickoff[c] >= MOCK_NOW)
  .sort((a, b) => (firstKickoff[a] < firstKickoff[b] ? -1 : 1));

const totalMcap = launched.reduce((s, t) => s + t.mcap, 0);
const maxPct = (launched[0]?.mcap ?? 1) / totalMcap;

const fmtUsd = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${Math.round(n / 1000)}k`;

export default function Leaderboard() {
  return (
    <>
      <section className="shrink-0 px-6 pt-28 pb-5 text-center lg:pt-24">
        <h1 className="font-serif text-3xl font-normal uppercase tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] md:text-4xl [-webkit-text-stroke:0.35px_rgba(0,0,0,0.85)]">
          Leaderboard
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm font-medium text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] md:text-base">
          Each team&apos;s share of total market cap — the market&apos;s implied
          chance of winning the Cup.
        </p>
        <span className="mt-3 inline-block rounded-full bg-amber-400/90 px-3 py-1 text-xs font-semibold text-amber-950">
          Demo data — tokens launch with their first match
        </span>
      </section>

      <main className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 md:px-10">
        <div className="mx-auto max-w-2xl rounded-xl bg-white/85 px-4 py-3 text-zinc-900 shadow-lg shadow-black/25 ring-1 ring-black/5 backdrop-blur-md">
          <div className="flex items-baseline justify-between border-b border-zinc-200 pb-2 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
            <span>Team</span>
            <span>
              Belief · 24h · Price &nbsp;·&nbsp; Total {fmtUsd(totalMcap)}
            </span>
          </div>

          {launched.map((t, i) => {
            const team = tokens[t.code];
            const pct = (t.mcap / totalMcap) * 100;
            const delta = MOCK_DELTAS[t.code] ?? 0;
            return (
              <div key={t.code} className="border-b border-zinc-100 py-2 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="w-6 text-right font-mono text-xs text-zinc-400">
                    {i + 1}
                  </span>
                  <span className="text-2xl leading-none">{team.flag}</span>
                  <span className="font-cond min-w-0 flex-1 truncate font-semibold uppercase">
                    {team.name}
                  </span>
                  <span className="font-cond w-16 text-right text-lg font-semibold tabular-nums">
                    {pct.toFixed(1)}%
                  </span>
                  <span
                    className={`w-14 text-right font-mono text-xs tabular-nums ${
                      delta > 0
                        ? "text-emerald-600"
                        : delta < 0
                          ? "text-red-500"
                          : "text-zinc-400"
                    }`}
                  >
                    {delta > 0 ? "▲" : delta < 0 ? "▼" : ""}
                    {Math.abs(delta).toFixed(1)}%
                  </span>
                  <span className="hidden w-20 text-right font-mono text-xs text-zinc-500 tabular-nums sm:block">
                    ${(t.mcap / SUPPLY).toFixed(5)}
                  </span>
                </div>
                <div className="mt-1 ml-9 h-1 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-emerald-500/70"
                    style={{ width: `${(pct / (maxPct * 100)) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}

          {upcoming.length > 0 && (
            <>
              <div className="border-b border-zinc-200 pt-3 pb-2 text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">
                Not yet launched
              </div>
              {upcoming.map((code) => {
                const team = tokens[code];
                return (
                  <div
                    key={code}
                    className="flex items-center gap-3 border-b border-zinc-100 py-2 opacity-60 last:border-0"
                  >
                    <span className="w-6 text-right font-mono text-xs text-zinc-300">
                      —
                    </span>
                    <span className="text-2xl leading-none">{team.flag}</span>
                    <span className="font-cond min-w-0 flex-1 truncate font-semibold uppercase">
                      {team.name}
                    </span>
                    <span className="text-xs text-zinc-500">
                      Launches <LocalTime iso={firstKickoff[code]} mode="date" /> →
                    </span>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </main>
    </>
  );
}
