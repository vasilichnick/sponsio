import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { coinLaunches, isLive } from "@/data/launches";
import fixturesData from "@/data/fixtures.json";
import { FIFA_RANK } from "@/data/rankings";
import { getBeliefMap } from "@/lib/belief";
import { getCoinStats, formatVolUsd, type CoinStat } from "@/lib/coin-stats";
import { recentResults, type Result } from "@/lib/results";
import { getStandings, tableForTeam, type GroupTable } from "@/lib/standings";
import { getTeamLive, type TeamLive } from "@/lib/team-live";
import { upcomingFixtures } from "@/lib/upcoming";
import { Countdown } from "../../../../countdown";
import { LocalTime } from "../../../../local-time";
import { CopyAddress } from "../copy-address";

// Live data on this page moves fast on match days — group standings and the
// next-match prediction refresh on a ~90s ISR cadence (the standings/team-live
// libs set the same 90s fetch-level cache, which also pulls the whole route's
// regeneration down to 90s). Belief (5-min) and fixtures (1-hour) have their
// own longer fetch-level caches inside their libs.
export const revalidate = 90;

const gmgn = (a: string) => `https://gmgn.ai/base/token/${a}`;
const tradeHref = (t: { address: string; tradeUrl?: string }) =>
  t.tradeUrl ?? gmgn(t.address);

/** 1 → "1st", 2 → "2nd", 3 → "3rd"… for an explicit group-position label. */
function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

type Entry = (typeof coinLaunches)[number];
type Fixture = {
  match: number;
  kickoffUtc: string;
  group?: string;
  home: string;
  away: string;
};

const bundledFixtures = fixturesData.matches as Fixture[];
const byCode = new Map(coinLaunches.map((e) => [e.code, e]));

/** Resolve the path param to a roster entry. Case-insensitive on the FIFA
 *  code; anything we don't recognise falls through to notFound(). */
function resolve(raw: string): Entry | undefined {
  return byCode.get(raw.toUpperCase());
}

// Prerender all 48 team coin pages at build; ISR keeps their live data fresh.
export function generateStaticParams() {
  return coinLaunches.map((e) => ({ code: e.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const entry = resolve(code);
  if (!entry) return { title: "Coin not found — Sponsio" };
  const { team } = entry;
  return {
    title: `${team.name} — Belief Markets — Sponsio`,
    description: `One belief: ${team.name} becomes World Cup 2026 champion. Live on-chain stats for the $${team.ticker} coin on Base, plus ${team.name}'s championship belief, FIFA rank and fixtures.`,
  };
}

/** Small-caps stat label over a value — the shared cell shape for both groups. */
function Stat({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-cond text-[10px] font-semibold tracking-[0.15em] text-zinc-400 uppercase">
        {label}
      </span>
      <span className="font-mono text-lg leading-none font-semibold text-white">
        {children}
      </span>
    </div>
  );
}

/** Static price sparkline — a pure polyline over the recent price series.
 *  No animation (real data, not decoration); renders nothing on <2 points. */
function Sparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;
  const w = 240;
  const h = 44;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / span) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const up = data[data.length - 1] >= data[0];
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className="h-11 w-full"
      aria-hidden
    >
      <polyline
        points={pts}
        fill="none"
        stroke={up ? "#34d399" : "#a1a1aa"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** The coin's on-chain group: ATH / 24h txns / 24h volume + sparkline, the
 *  copyable contract address, and the Trade CTA. Stats degrade gracefully —
 *  if based.bid is unreachable (or the coin hasn't traded), the CA + Trade
 *  button still render and a quiet line explains the absence. */
function CoinPanel({ entry, stat }: { entry: Entry; stat?: CoinStat }) {
  const { team } = entry;
  const showAth = stat?.athPct != null && stat.athPct > 100.5;
  const hasFlow = (stat?.txns24 ?? 0) > 0 || (stat?.vol24Usd ?? 0) > 0;
  const live = isLive(team);
  return (
    <section className="rounded-2xl bg-zinc-950/75 p-5 shadow-lg shadow-black/40 ring-1 ring-white/10 backdrop-blur-md md:p-6">
      <header className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-lg uppercase tracking-tight text-white">
          The coin
        </h2>
        {live ? (
          <span className="font-cond flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-emerald-300 uppercase">
            <span
              aria-hidden
              className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-400"
            />
            Live on Base
          </span>
        ) : (
          <span className="font-cond text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">
            Launches at kickoff
          </span>
        )}
      </header>

      {hasFlow ? (
        <div className="mt-4 grid grid-cols-3 gap-4">
          <Stat label="ATH">{showAth ? `${stat!.athPct!.toFixed(1)}%` : "—"}</Stat>
          <Stat label="24h txns">{stat!.txns24}</Stat>
          <Stat label="24h volume">{formatVolUsd(stat!.vol24Usd)}</Stat>
        </div>
      ) : (
        <p className="font-cond mt-4 text-sm font-medium text-zinc-400">
          {live
            ? "No trades yet — live on-chain stats appear once this coin starts trading."
            : "On-chain stats appear once this coin launches at the team's first kickoff."}
        </p>
      )}

      {stat?.spark && stat.spark.length >= 2 && (
        <div className="mt-4">
          <span className="font-cond text-[10px] font-semibold tracking-[0.15em] text-zinc-400 uppercase">
            Price
          </span>
          <div className="mt-1.5 rounded-xl bg-white/[0.03] px-3 py-2 ring-1 ring-white/10">
            <Sparkline data={stat.spark} />
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
        <CopyAddress address={team.address} />
        <a
          href={tradeHref(team)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-cond inline-flex h-10 items-center justify-center rounded-full bg-emerald-400 px-6 text-sm font-bold tracking-wide text-zinc-950 uppercase transition-colors hover:bg-emerald-300"
        >
          Trade
        </a>
      </div>
    </section>
  );
}

/** One fixture row: date, opponent, group/stage, and a scoreline (played),
 *  a live countdown (the next match), or a dash when a played match's score
 *  isn't available — never a bare kickoff time in a results context. */
function FixtureRow({
  code,
  opponentCode,
  kickoffUtc,
  group,
  score,
  next,
}: {
  code: string;
  opponentCode: string;
  kickoffUtc: string;
  group?: string;
  score?: { for: number; against: number };
  next?: boolean;
}) {
  const opp = byCode.get(opponentCode);
  const oppLabel = opp ? `${opp.team.flag} ${opp.team.name}` : opponentCode;
  const outcome =
    score == null
      ? null
      : score.for > score.against
        ? "W"
        : score.for < score.against
          ? "L"
          : "D";
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/5 py-3 last:border-0">
      <div className="min-w-0">
        <div className="font-cond text-sm font-semibold tracking-wide text-white uppercase">
          vs {oppLabel}
        </div>
        <div className="font-cond text-[11px] tracking-wide text-zinc-400 uppercase">
          {group ? `${group} · ` : ""}
          <LocalTime iso={kickoffUtc} mode="date" />
        </div>
      </div>
      {score != null ? (
        <span
          className={`font-mono text-sm font-bold ${
            outcome === "W"
              ? "text-emerald-300"
              : outcome === "L"
                ? "text-zinc-500"
                : "text-zinc-300"
          }`}
        >
          {outcome} {score.for}–{score.against}
        </span>
      ) : next ? (
        <span className="font-mono text-[11px] whitespace-nowrap text-emerald-300">
          <Countdown targetIso={kickoffUtc} compact />
        </span>
      ) : (
        <span className="font-mono text-sm font-bold text-zinc-600" title="score not available yet">—</span>
      )}
    </div>
  );
}

/** Recent form as a row of W/D/L pills (oldest → newest, left → right).
 *  Renders nothing on an empty string. */
function FormPills({ form }: { form: string }) {
  const chars = form.toUpperCase().replace(/[^WDL]/g, "").split("");
  if (chars.length === 0) return null;
  return (
    <span className="inline-flex gap-1" aria-label={`Recent form: ${chars.join(" ")}`}>
      {chars.map((c, i) => (
        <span
          key={i}
          aria-hidden
          className={`font-mono inline-flex h-4 w-4 items-center justify-center rounded text-[10px] font-bold leading-none ${
            c === "W"
              ? "bg-emerald-400/20 text-emerald-300"
              : c === "L"
                ? "bg-white/5 text-zinc-500"
                : "bg-white/10 text-zinc-300"
          }`}
        >
          {c}
        </span>
      ))}
    </span>
  );
}

/** The live group standings table for this team's group — every side in the
 *  group in standing order, with P/W/D/L/GF/GA/GD/Pts. THIS team's row is
 *  highlighted (emerald left accent + tint + ring) and its rank is stated in
 *  the caption ("3rd in Group A"), so you see where it sits at a glance. */
function StandingsTable({
  table,
  code,
}: {
  table: GroupTable;
  code: string;
}) {
  const mine = table.rows.find((r) => r.code === code);
  const groupLabel = table.group.replace(/^Group\s+/i, "Group ");
  return (
    <section className="rounded-2xl bg-zinc-950/75 p-5 shadow-lg shadow-black/40 ring-1 ring-white/10 backdrop-blur-md md:p-6">
      <header className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="font-serif text-lg uppercase tracking-tight text-white">
          {groupLabel || "Group standings"}
        </h2>
        {mine && (
          <span className="font-cond text-[11px] font-semibold tracking-wide text-emerald-300 uppercase">
            {ordinal(mine.rank)}
            {table.group ? ` in ${groupLabel}` : " in group"}
          </span>
        )}
      </header>

      {/* Compact, tabular: mono numerics, small-caps zinc header (BRANDING ›
          Data/market panels). Pos + Team are left-aligned; the rest right. */}
      <div className="mt-4 -mx-1 overflow-x-auto">
        <table className="w-full border-collapse text-right">
          <thead>
            <tr className="font-cond text-[10px] font-semibold tracking-[0.12em] text-zinc-400 uppercase">
              <th className="py-1.5 pr-2 pl-1 text-left font-semibold">#</th>
              <th className="py-1.5 text-left font-semibold">Team</th>
              <th className="px-1.5 py-1.5 font-semibold">P</th>
              <th className="px-1.5 py-1.5 font-semibold">W</th>
              <th className="px-1.5 py-1.5 font-semibold">D</th>
              <th className="px-1.5 py-1.5 font-semibold">L</th>
              <th className="px-1.5 py-1.5 font-semibold">GF</th>
              <th className="px-1.5 py-1.5 font-semibold">GA</th>
              <th className="px-1.5 py-1.5 font-semibold">GD</th>
              <th className="py-1.5 pr-1 pl-1.5 font-semibold text-white">Pts</th>
            </tr>
          </thead>
          <tbody className="font-mono text-sm">
            {table.rows.map((r) => {
              const here = r.code === code;
              const t = byCode.get(r.code)?.team;
              const name = t?.name ?? r.code;
              return (
                <tr
                  key={r.code}
                  aria-current={here ? "true" : undefined}
                  className={`border-t border-white/5 ${
                    here ? "bg-emerald-400/[0.08] ring-1 ring-inset ring-emerald-400/30" : ""
                  }`}
                >
                  <td
                    className={`relative py-2 pr-2 pl-1 text-left ${
                      here ? "font-bold text-emerald-300" : "text-zinc-400"
                    }`}
                  >
                    {/* Left accent bar marks the team's row (BRANDING accent). */}
                    {here && (
                      <span
                        aria-hidden
                        className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-emerald-400"
                      />
                    )}
                    {r.rank}
                  </td>
                  <td className="py-2 text-left">
                    <span
                      className={`font-cond inline-flex items-center gap-1.5 text-sm tracking-wide uppercase ${
                        here ? "font-bold text-white" : "font-semibold text-zinc-200"
                      }`}
                    >
                      {t?.flag && <span className="font-sans text-base leading-none">{t.flag}</span>}
                      {name}
                    </span>
                  </td>
                  <td className="px-1.5 py-2 text-zinc-300">{r.played}</td>
                  <td className="px-1.5 py-2 text-zinc-300">{r.win}</td>
                  <td className="px-1.5 py-2 text-zinc-300">{r.draw}</td>
                  <td className="px-1.5 py-2 text-zinc-300">{r.lose}</td>
                  <td className="px-1.5 py-2 text-zinc-300">{r.gf}</td>
                  <td className="px-1.5 py-2 text-zinc-300">{r.ga}</td>
                  <td className="px-1.5 py-2 text-zinc-300">
                    {r.gd > 0 ? `+${r.gd}` : r.gd}
                  </td>
                  <td
                    className={`py-2 pr-1 pl-1.5 font-bold ${
                      here ? "text-emerald-300" : "text-white"
                    }`}
                  >
                    {r.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** The next match + its win-probability prediction (home/draw/away %), the
 *  provider's one-line read, and each side's recent form. A live countdown to
 *  kickoff sits in the heading row. Renders only when getTeamLive returned a
 *  next match; the probability bar shows only when a prediction is present. */
function PredictionPanel({
  live,
}: {
  live: TeamLive;
}) {
  const { next, prediction, homeForm, awayForm } = live;
  if (!next) return null;
  const home = byCode.get(next.homeCode)?.team;
  const away = byCode.get(next.awayCode)?.team;
  const homeName = home?.name ?? next.homeCode;
  const awayName = away?.name ?? next.awayCode;
  const round = next.round?.replace(/\s*-\s*/g, " · ") || null;

  return (
    <section className="rounded-2xl bg-zinc-950/75 p-5 shadow-lg shadow-black/40 ring-1 ring-white/10 backdrop-blur-md md:p-6">
      <header className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-lg uppercase tracking-tight text-white">
          Next match
        </h2>
        <span className="font-mono text-[11px] whitespace-nowrap text-emerald-300">
          <Countdown targetIso={next.kickoffUtc} compact />
        </span>
      </header>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="font-cond text-base font-bold tracking-wide text-white uppercase">
          {home?.flag && <span className="font-sans">{home.flag} </span>}
          {homeName}
          <span className="px-1.5 text-zinc-500">vs</span>
          {away?.flag && <span className="font-sans">{away.flag} </span>}
          {awayName}
        </div>
      </div>
      <div className="font-cond mt-1 text-[11px] tracking-wide text-zinc-400 uppercase">
        {round ? `${round} · ` : ""}
        <LocalTime iso={next.kickoffUtc} mode="date" /> ·{" "}
        <LocalTime iso={next.kickoffUtc} mode="time" />
      </div>

      {prediction ? (
        <div className="mt-4 border-t border-white/5 pt-4">
          <span className="font-cond text-[10px] font-semibold tracking-[0.15em] text-zinc-400 uppercase">
            Win probability
          </span>
          {/* One stacked bar split home / draw / away. Emerald marks the
              outcome favouring the home side; draw + away are achromatic. */}
          <div className="mt-2 flex h-2.5 w-full overflow-hidden rounded-full bg-white/5">
            <span
              className="h-full bg-emerald-400"
              style={{ width: `${prediction.homePct}%` }}
              aria-hidden
            />
            <span
              className="h-full bg-zinc-500"
              style={{ width: `${prediction.drawPct}%` }}
              aria-hidden
            />
            <span
              className="h-full bg-zinc-700"
              style={{ width: `${prediction.awayPct}%` }}
              aria-hidden
            />
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="font-mono text-base font-bold text-emerald-300">
                {prediction.homePct}%
              </div>
              <div className="font-cond text-[10px] tracking-wide text-zinc-400 uppercase">
                {homeName}
              </div>
            </div>
            <div>
              <div className="font-mono text-base font-bold text-zinc-300">
                {prediction.drawPct}%
              </div>
              <div className="font-cond text-[10px] tracking-wide text-zinc-400 uppercase">
                Draw
              </div>
            </div>
            <div>
              <div className="font-mono text-base font-bold text-zinc-300">
                {prediction.awayPct}%
              </div>
              <div className="font-cond text-[10px] tracking-wide text-zinc-400 uppercase">
                {awayName}
              </div>
            </div>
          </div>
          {prediction.advice && (
            <p className="font-cond mt-3 text-[11px] tracking-wide text-zinc-500 uppercase">
              Model read: {prediction.advice}
            </p>
          )}
        </div>
      ) : (
        <p className="font-cond mt-4 border-t border-white/5 pt-4 text-sm font-medium text-zinc-400">
          No probability yet — the match prediction appears closer to kickoff.
        </p>
      )}

      {(homeForm || awayForm) && (
        <div className="mt-4 border-t border-white/5 pt-4">
          <span className="font-cond text-[10px] font-semibold tracking-[0.15em] text-zinc-400 uppercase">
            Recent form
          </span>
          <div className="mt-2 flex flex-col gap-2">
            {homeForm && (
              <div className="flex items-center justify-between gap-3">
                <span className="font-cond text-xs font-semibold tracking-wide text-zinc-300 uppercase">
                  {homeName}
                </span>
                <FormPills form={homeForm} />
              </div>
            )}
            {awayForm && (
              <div className="flex items-center justify-between gap-3">
                <span className="font-cond text-xs font-semibold tracking-wide text-zinc-300 uppercase">
                  {awayName}
                </span>
                <FormPills form={awayForm} />
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/** The team's championship group: FIFA rank, the live belief in lifting the
 *  trophy, the group, the next match (live countdown) and recent results.
 *  Everything degrades to the static schedule when the live feeds are absent. */
function TeamPanel({
  entry,
  belief,
  liveNext,
  results,
  hideNextMatch = false,
}: {
  entry: Entry;
  belief?: number;
  liveNext: Fixture | null;
  results: Result[] | null;
  // The PredictionPanel owns "Next match" when the live feed has one; this
  // panel then suppresses its own next-match block to avoid duplication.
  hideNextMatch?: boolean;
}) {
  const { team, code, group } = entry;
  const rank = FIFA_RANK[code];

  // Now is the render/revalidate instant — fine for picking a "next" fixture
  // server-side; the countdown itself corrects to device time on the client.
  const now = Date.now();
  const mine = bundledFixtures
    .filter((f) => f.home === code || f.away === code)
    .sort((a, b) => (a.kickoffUtc < b.kickoffUtc ? -1 : 1));

  // Recent results: prefer the live feed (with scores), else the static
  // schedule's past fixtures (date + opponent, no score available).
  const liveResults = (results ?? [])
    .filter((r) => r.home === code || r.away === code)
    .sort((a, b) => (a.kickoffUtc < b.kickoffUtc ? 1 : -1))
    .slice(0, 3);
  const staticPast = mine
    .filter((f) => Date.parse(f.kickoffUtc) <= now)
    .sort((a, b) => (a.kickoffUtc < b.kickoffUtc ? 1 : -1))
    .slice(0, 3);

  // Next match: the live feed (may include knockouts) wins; else the soonest
  // future fixture in the static schedule.
  const next =
    liveNext ??
    mine.find((f) => Date.parse(f.kickoffUtc) > now) ??
    null;

  return (
    <section className="rounded-2xl bg-zinc-950/75 p-5 shadow-lg shadow-black/40 ring-1 ring-white/10 backdrop-blur-md md:p-6">
      <h2 className="font-serif text-lg uppercase tracking-tight text-white">
        In the championship
      </h2>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <Stat label="FIFA rank">{rank != null ? `#${rank}` : "—"}</Stat>
        <Stat label="To lift the trophy">
          {belief != null ? (
            <span className="text-emerald-300">
              {belief > 0 ? `${belief}%` : "<1%"}
            </span>
          ) : (
            "—"
          )}
        </Stat>
        <Stat label="Group">{group ? group.replace(/^Group\s+/i, "") : "—"}</Stat>
      </div>
      {belief != null && (
        <p className="font-cond mt-2 text-[11px] tracking-wide text-zinc-500 uppercase">
          The world&rsquo;s live belief that {team.name} is crowned champion
        </p>
      )}

      {next && !hideNextMatch && (
        <div className="mt-5 border-t border-white/5 pt-4">
          <span className="font-cond text-[10px] font-semibold tracking-[0.15em] text-zinc-400 uppercase">
            Next match
          </span>
          <FixtureRow
            code={code}
            opponentCode={next.home === code ? next.away : next.home}
            kickoffUtc={next.kickoffUtc}
            group={next.group}
            next
          />
        </div>
      )}

      {(liveResults.length > 0 || staticPast.length > 0) && (
        <div className="mt-4 border-t border-white/5 pt-4">
          <span className="font-cond text-[10px] font-semibold tracking-[0.15em] text-zinc-400 uppercase">
            Recent results
          </span>
          {liveResults.length > 0
            ? liveResults.map((r) => {
                const home = r.home === code;
                return (
                  <FixtureRow
                    key={r.match}
                    code={code}
                    opponentCode={home ? r.away : r.home}
                    kickoffUtc={r.kickoffUtc}
                    group={r.group}
                    score={{
                      for: home ? r.homeGoals : r.awayGoals,
                      against: home ? r.awayGoals : r.homeGoals,
                    }}
                  />
                );
              })
            : staticPast.map((f) => (
                <FixtureRow
                  key={f.match}
                  code={code}
                  opponentCode={f.home === code ? f.away : f.home}
                  kickoffUtc={f.kickoffUtc}
                  group={f.group}
                />
              ))}
        </div>
      )}
    </section>
  );
}

// A team's coin page: its on-chain coin stats (live, from based.bid) beside
// its standing in the championship (FIFA rank, belief, group, fixtures).
// Keyed by FIFA code; unknown codes 404. All live sources are defensive —
// the page renders with whatever is available and never throws or blanks.
export default async function CoinPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const entry = resolve(code);
  if (!entry) notFound();

  const [stats, belief, upcoming, results, standings, teamLive] =
    await Promise.all([
      getCoinStats(),
      getBeliefMap(),
      upcomingFixtures(),
      recentResults(),
      getStandings(),
      getTeamLive(code),
    ]);

  const { team, code: teamCode, group } = entry;
  const stat = stats[team.address.toLowerCase()];

  // This team's live group table + its position within it (when standings are
  // available). The rank is surfaced in the header AND its row is highlighted.
  const groupTable = tableForTeam(standings, teamCode);
  const myRank =
    groupTable?.rows.find((r) => r.code === teamCode)?.rank ?? null;
  const groupLabel = groupTable?.group || group || null;

  // The team's live next fixture (incl. knockouts) from the API-Football feed,
  // if available — the static schedule fills in otherwise (inside TeamPanel).
  const liveNext =
    (upcoming ?? [])
      .filter((f) => f.home === teamCode || f.away === teamCode)
      .sort((a, b) => (a.kickoffUtc < b.kickoffUtc ? -1 : 1))[0] ?? null;

  // PredictionPanel owns "Next match" when the live feed resolved one; tell
  // TeamPanel to drop its own next-match block so the two never duplicate.
  const showPrediction = teamLive?.next != null;

  return (
    // Content-first: clears the absolute h-16 site header (pt-20) and fills the
    // locked viewport — the coin's data is the page, no half-screen hero. The
    // backdrop is the static #050505 surface (see SiteBackdrop), not the strips.
    <div className="mx-auto min-h-0 w-full max-w-4xl flex-1 overflow-y-auto px-4 pt-20 pb-8 md:px-6 lg:pt-[5.5rem]">
      <Link
        href="/markets/champion"
        className="font-cond inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-zinc-400 uppercase transition-colors hover:text-white"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" aria-hidden>
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Champion market
      </Link>

      {/* Team header — compact (NOT a hero). Flag + name + ticker, the belief
          line, and an explicit group-position chip when standings are live. */}
      <div className="mt-3 flex items-center gap-4">
        <span className="text-5xl leading-none">{team.flag}</span>
        <div className="min-w-0">
          <h1 className="font-serif text-3xl leading-[0.95] uppercase tracking-tight text-white md:text-4xl">
            {team.name}
          </h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-zinc-500">
              ${team.ticker}
              {group && ` · ${group}`}
            </span>
            {myRank != null && (
              <span className="font-cond rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-emerald-300 uppercase">
                {ordinal(myRank)}
                {groupLabel ? ` in ${groupLabel.replace(/^Group\s+/i, "Group ")}` : " in group"}
              </span>
            )}
          </div>
        </div>
      </div>
      <p className="font-cond mt-3 text-base font-semibold leading-snug text-white">
        One belief: {team.name} becomes champion
      </p>

      {/* Live/dynamic pair: the coin's on-chain stats + the next-match
          prediction (when the live feed has one). */}
      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CoinPanel entry={entry} stat={stat} />
        {showPrediction && <PredictionPanel live={teamLive!} />}
      </div>

      {/* The group standings — the user's emphasis: this team's row is
          highlighted and its rank is stated. Full width for the 10 columns. */}
      {groupTable && (
        <div className="mt-4">
          <StandingsTable table={groupTable} code={teamCode} />
        </div>
      )}

      {/* Championship context: FIFA rank, world belief, group, recent
          results. Next match is owned by PredictionPanel when it rendered. */}
      <div className="mt-4">
        <TeamPanel
          entry={entry}
          belief={belief[teamCode]}
          liveNext={liveNext}
          results={results}
          hideNextMatch={showPrediction}
        />
      </div>
    </div>
  );
}
