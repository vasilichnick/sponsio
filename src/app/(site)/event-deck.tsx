"use client";

import { useCallback, useEffect, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { coinLaunches, type Token } from "@/data/launches";
import type { CoinStat } from "@/lib/coin-stats";
import type { R32Match } from "@/data/r32-schedule";
import { CopyAddress } from "./markets/champion/copy-address";

const gmgn = (a: string) => `https://gmgn.ai/base/token/${a}`;
const tradeHref = (t: Token) => t.tradeUrl ?? gmgn(t.address);

// code → team (flag, name, ticker, address). Client-bundled, static.
const byCode = new Map(coinLaunches.map((c) => [c.code, c.team]));

/** Compact USD market cap: "$1.2M", "$940K", "$8.4B". null when absent. */
function fmtMcap(n?: number | null): string | null {
  if (!n || !Number.isFinite(n) || n <= 0) return null;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${Math.round(n)}`;
}

/** One team — the upper or lower half of a match card. Own rounded border.
 *  Flag, name, $ticker, market cap, then a copyable CA + Trade (gmgn). */
function TeamHalf({ team, stat }: { team: Token; stat?: CoinStat }) {
  const mcap = fmtMcap(stat?.marketCapUsd);
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-emerald-400/60 bg-white/[0.03] px-5 py-3 text-center">
      <span className="text-5xl leading-none sm:text-6xl">{team.flag}</span>
      <h3 className="font-serif text-2xl leading-none font-normal tracking-tight text-white uppercase sm:text-3xl">
        {team.name}
      </h3>
      <p className="font-cond max-w-[15rem] text-[11px] leading-snug font-semibold text-zinc-400">
        one belief: {team.name} becomes champion
      </p>
      <div className="font-cond flex items-center gap-2 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
        <span className="font-mono">${team.ticker}</span>
        <span aria-hidden className="h-3 w-px bg-white/15" />
        <span>
          mcap <span className="text-zinc-300">{mcap ?? "—"}</span>
        </span>
      </div>
      {/* z-10 + stopPropagation so Copy / Trade never start a card drag. */}
      <div
        className="relative z-10 mt-1 flex items-center gap-2.5"
        onPointerDownCapture={(e) => e.stopPropagation()}
      >
        <CopyAddress address={team.address} />
        <a
          href={tradeHref(team)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-cond inline-flex h-9 items-center justify-center rounded-full bg-emerald-400 px-7 text-sm font-bold tracking-wide text-zinc-950 uppercase transition-colors hover:bg-emerald-300"
        >
          Trade
        </a>
      </div>
    </div>
  );
}

/** One MATCH = one card = two team half-cards split horizontally, VS in the
 *  seam. Opaque, rounded outer border; each half has its own border. */
function MatchCard({
  match,
  stats,
}: {
  match: R32Match;
  stats: Record<string, CoinStat>;
}) {
  const home = byCode.get(match.home);
  const away = byCode.get(match.away);
  if (!home || !away) return null;
  const statOf = (t: Token) => stats[t.address.toLowerCase()];
  return (
    <div className="relative flex h-full w-full flex-col gap-2.5 rounded-3xl border border-white/15 bg-[#0c0c0e] p-2.5 shadow-xl shadow-black/40">
      <TeamHalf team={home} stat={statOf(home)} />
      <span
        aria-hidden
        className="font-cond pointer-events-none absolute top-1/2 left-1/2 z-10 rounded-full border border-white/15 bg-[#0c0c0e] px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase [transform:translate(-50%,-50%)]"
      >
        vs
      </span>
      <TeamHalf team={away} stat={statOf(away)} />
    </div>
  );
}

/** Full-screen swipeable EVENT deck: each card a knockout match (two teams).
 *  Throw LEFT → next match in the schedule, RIGHT → previous; arrows on desktop;
 *  ends bounce. Matches arrive pre-ordered (kickoff, nearest first) from the
 *  server (live API-Football or the static R32 fallback). */
export function EventDeck({
  matches,
  stats,
}: {
  matches: R32Match[];
  stats: Record<string, CoinStat>;
}) {
  const [pos, setPos] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-9, 9]);
  const current = matches[pos];

  // delta +1 = next match (throws LEFT); delta -1 = previous (throws RIGHT).
  const go = useCallback(
    (delta: number) => {
      const target = pos + delta;
      if (target < 0 || target >= matches.length) {
        animate(x, 0, { type: "spring", stiffness: 500, damping: 40 }); // bounce at ends
        return;
      }
      const off = delta > 0 ? -1 : 1;
      const w = typeof window !== "undefined" ? window.innerWidth : 500;
      animate(x, off * w * 1.2, {
        duration: 0.25,
        ease: "easeIn",
        onComplete: () => {
          setPos(target);
          x.set(0);
        },
      });
    },
    [pos, matches.length, x],
  );

  const onDragEnd = useCallback(
    (_e: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 500) {
        go(info.offset.x < 0 ? +1 : -1); // left → next, right → previous
      } else {
        animate(x, 0, { type: "spring", stiffness: 500, damping: 40 });
      }
    },
    [go, x],
  );

  // Desktop: arrow keys mirror the swipe (Left = next, Right = previous).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(+1);
      else if (e.key === "ArrowRight") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (!current) return null;

  return (
    <div className="relative h-full w-full overflow-hidden select-none">
      {/* The card is a phone-width column: full-width on mobile, capped +
          centered on desktop (card width = a phone screen). Centering lives on
          this wrapper, NOT the motion card — Motion owns the card's transform. */}
      <div className="absolute inset-y-0 left-1/2 w-full max-w-[430px] [transform:translateX(-50%)]">
        <motion.div
          key={`${current.home}-${current.away}`}
          className="absolute inset-0 cursor-grab touch-pan-y px-3 active:cursor-grabbing [padding-bottom:3.25rem] [padding-top:max(4.75rem,calc(env(safe-area-inset-top)+4.25rem))]"
          style={{ x, rotate }}
          drag="x"
          onDragEnd={onDragEnd}
        >
          <MatchCard match={current} stats={stats} />
        </motion.div>
      </div>

      {/* Desktop flip arrows (mobile uses swipe). */}
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="previous match"
        className="font-serif absolute left-2 z-20 hidden h-11 w-11 items-center justify-center rounded-full bg-white/[0.06] text-2xl leading-none text-zinc-300 ring-1 ring-white/10 transition hover:bg-white/[0.12] hover:text-white lg:flex [top:50%] [transform:translateY(-50%)]"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => go(+1)}
        aria-label="next match"
        className="font-serif absolute right-2 z-20 hidden h-11 w-11 items-center justify-center rounded-full bg-white/[0.06] text-2xl leading-none text-zinc-300 ring-1 ring-white/10 transition hover:bg-white/[0.12] hover:text-white lg:flex [top:50%] [transform:translateY(-50%)]"
      >
        ›
      </button>

      <div className="font-cond pointer-events-none absolute inset-x-0 bottom-2 flex items-center justify-center gap-2 text-[11px] tracking-[0.25em] text-zinc-500 uppercase">
        <span>
          {pos + 1} / {matches.length}
        </span>
        <span className="text-zinc-700">·</span>
        <span className="text-zinc-600">swipe</span>
      </div>
    </div>
  );
}
