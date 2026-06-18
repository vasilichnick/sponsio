import type { Metadata } from "next";
import Link from "next/link";
import { coinLaunches, isLive, type Token } from "@/data/launches";
import { FIFA_RANK } from "@/data/rankings";
import { getBeliefMap } from "@/lib/belief";
import { getCoinStats, formatVolUsd, type CoinStat } from "@/lib/coin-stats";
import { LocalTime } from "../../../local-time";
import { CopyAddress } from "./copy-address";
import { LaunchBadge } from "./launch-status";
import { StatusTabs } from "./status-tabs";

export const metadata: Metadata = {
  title: "Belief Markets — Sponsio",
  description:
    "Trade belief markets for World Cup 2026 on Base. The Champion market: 48 coins, one per team — each the belief that this team becomes champion. A Top Scorer market is coming.",
};

// Fresher than the 5-min site default: live coin stats (price/volume/txns)
// move fast, so this market regenerates every 2 minutes.
export const revalidate = 120;

const gmgn = (a: string) => `https://gmgn.ai/base/token/${a}`;

// Where its Trade button points: the explicit URL if set, else GmGn on Base.
const tradeHref = (t: { address: string; tradeUrl?: string }) =>
  t.tradeUrl ?? gmgn(t.address);

const upcoming = coinLaunches.filter((c) => !isLive(c.team));
// Live tab shows the most recently launched coins first (newest on top);
// coinLaunches is launch-ascending, so sort the live set descending by
// kickoff (stable for same-kickoff pairs). Upcoming stays nearest-first.
const tradable = coinLaunches
  .filter((c) => isLive(c.team))
  .sort((a, b) => (a.launch < b.launch ? 1 : a.launch > b.launch ? -1 : 0));

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
          belief {belief >= 1 ? `${belief}%` : "<1%"}
        </span>
      )}
    </div>
  );
}

/** Live coin card: flag, name, ticker, the belief sentence, plus live on-chain
 *  stats from based.bid (ATH multiple, 24h txns + volume) and a Trade button.
 *  Stats are omitted on coins that haven't traded yet. */
function LiveCard({
  entry,
  belief,
  stat,
}: {
  entry: Entry;
  belief?: number;
  stat?: CoinStat;
}) {
  const { team, code, group } = entry;
  const showAth = stat?.athPct != null && stat.athPct > 100.5;
  const showFlow = (stat?.txns24 ?? 0) > 0;
  return (
    <div className="row-rise relative flex flex-col gap-2 rounded-3xl bg-white/[0.04] p-5 ring-1 ring-white/20 transition-colors hover:bg-white/[0.06]">
      {/* Stretched link: the whole card opens this team's coin page. It's a
          sibling overlay (z-0), never a wrapper — so the Trade <a> and the
          copyable CA below sit at z-10 and act independently (no nested <a>). */}
      <Link
        href={`/markets/champion/${code}`}
        aria-label={`${team.name} — open coin page`}
        className="absolute inset-0 z-0 rounded-3xl"
      />
      <div className="flex items-start justify-between gap-2">
        <span className="text-3xl leading-none">{team.flag}</span>
        <div className="flex items-center gap-1.5">
          <Stats code={code} belief={belief} />
          {showAth && (
            <span className="font-cond rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-300 uppercase">
              ATH {stat!.athPct!.toFixed(1)}%
            </span>
          )}
        </div>
      </div>
      <div className="font-cond text-base font-bold tracking-wide text-white uppercase">
        {team.name}
      </div>
      <div className="font-mono text-[11px] text-zinc-500">
        ${team.ticker}
        {group && ` · ${group}`}
      </div>
      <p className="font-cond text-[15px] leading-snug font-semibold text-white">
        One belief: {team.name} becomes champion
      </p>
      {/* Trading block: the critical info — contract address (copyable),
          live txns + volume, and the Trade CTA. */}
      <div className="mt-auto flex flex-col gap-3 border-t border-white/5 pt-3">
        <div className="flex items-center justify-between gap-2">
          {/* z-10: stays clickable above the stretched card link (it's a
              <button>, so safe to overlap the link — never nested). */}
          <span className="relative z-10 inline-flex">
            <CopyAddress address={team.address} />
          </span>
          <span className="font-mono text-[11px] tracking-wide text-zinc-400">
            {showFlow ? (
              <>
                {stat!.txns24} txs · {formatVolUsd(stat!.vol24Usd)} vol
              </>
            ) : (
              <span className="text-zinc-600">No trades yet</span>
            )}
          </span>
        </div>
        {/* z-10: a separate link to the trading terminal (new tab). Sits above
            the stretched card link so clicking Trade never opens the coin page. */}
        <a
          href={tradeHref(team)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-cond relative z-10 inline-flex h-9 w-1/3 items-center justify-center self-end rounded-full bg-emerald-400 text-xs font-bold tracking-wide text-zinc-950 uppercase transition-colors hover:bg-emerald-300"
        >
          Trade
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
      className={`row-rise flex flex-col gap-2 rounded-3xl p-5 transition-colors ${
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
  stats,
  variant,
  emptyText,
}: {
  rows: Entry[];
  belief: Record<string, number>;
  stats?: Record<string, CoinStat>;
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
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {rows.map((c) =>
          variant === "live" ? (
            <LiveCard
              key={c.code}
              entry={c}
              belief={belief[c.code]}
              stat={stats?.[c.team.address.toLowerCase()]}
            />
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
  const [belief, stats] = await Promise.all([getBeliefMap(), getCoinStats()]);
  // Live tab order: a freshly launched coin pins to the top for a 24h grace
  // window (newest first), regardless of volume; after that it settles into
  // volume order (most traded first, newest launch breaks ties).
  const GRACE_MS = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const isNew = (e: Entry) => {
    const ls = e.team.liveSince;
    return ls != null && now - new Date(ls).getTime() < GRACE_MS;
  };
  const vol = (e: Entry) => stats[e.team.address.toLowerCase()]?.vol24Usd ?? 0;
  const liveSorted = [...tradable].sort((a, b) => {
    const na = isNew(a);
    const nb = isNew(b);
    if (na !== nb) return na ? -1 : 1; // new coins above established ones
    if (na && nb)
      return (
        new Date(b.team.liveSince!).getTime() -
        new Date(a.team.liveSince!).getTime()
      ); // newest launch first
    return vol(b) !== vol(a)
      ? vol(b) - vol(a)
      : a.launch < b.launch
        ? 1
        : a.launch > b.launch
          ? -1
          : 0;
  });
  return (
    <>
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
            rows={liveSorted}
            belief={belief}
            stats={stats}
            variant="live"
            emptyText="First coins go live at kickoff — see Upcoming for the schedule."
          />
        }
      />
    </>
  );
}
