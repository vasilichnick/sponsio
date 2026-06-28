"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { coinLaunches } from "@/data/launches";
import { orderByNextMatch, type DeckEntry } from "./deck-order";

const gmgn = (a: string) => `https://gmgn.ai/base/token/${a}`;
const tradeHref = (t: { address: string; tradeUrl?: string }) =>
  t.tradeUrl ?? gmgn(t.address);

/** One coin = one full-screen card (MVP mockup: flag, name, $ticker, belief
 *  line, Trade). Opaque background so cards never bleed through each other. */
function CoinCard({ entry }: { entry: DeckEntry }) {
  const { team } = entry;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-[#0a0a0b] px-8 text-center [padding-bottom:max(4rem,calc(env(safe-area-inset-bottom)+3rem))] [padding-top:max(5rem,calc(env(safe-area-inset-top)+4rem))]">
      <span className="text-7xl leading-none md:text-8xl">{team.flag}</span>
      <div className="flex flex-col items-center gap-2">
        <h2 className="font-serif text-4xl font-normal tracking-tight text-white uppercase md:text-5xl">
          {team.name}
        </h2>
        <span className="font-mono text-sm text-zinc-400">${team.ticker}</span>
      </div>
      <p className="font-cond max-w-xs text-base leading-snug font-semibold text-zinc-300">
        one belief: {team.name} becomes champion
      </p>
      <a
        href={tradeHref(team)}
        target="_blank"
        rel="noopener noreferrer"
        onPointerDownCapture={(e) => e.stopPropagation()}
        className="font-cond mt-2 inline-flex h-12 items-center justify-center rounded-full bg-emerald-400 px-12 text-base font-bold tracking-wide text-zinc-950 uppercase shadow-lg shadow-black/40 transition-colors hover:bg-emerald-300"
      >
        Trade
      </a>
    </div>
  );
}

/** Full-screen swipeable coin deck. Swipe/drag LEFT → next coin, RIGHT →
 *  previous; the dragged card tilts and throws off in the drag direction;
 *  short drags spring back; the ends bounce. Current coin tracked by CODE so
 *  re-ordering never loses the place, and the URL stays in sync. */
export function CoinDeck({ startCode }: { startCode?: string }) {
  const initial = (startCode || coinLaunches[0]?.code || "").toUpperCase();
  const [code, setCode] = useState(initial);

  // Stable order for SSR/first paint; re-order by real "now" after mount.
  const [deck, setDeck] = useState<DeckEntry[]>(() => [...coinLaunches]);
  useEffect(() => {
    setDeck(orderByNextMatch(Date.now()));
  }, []);

  const pos = useMemo(() => {
    const i = deck.findIndex((e) => e.code === code);
    return i < 0 ? 0 : i;
  }, [deck, code]);
  const current = deck[pos];

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-14, 14]); // tilt while dragging

  useEffect(() => {
    if (current) {
      window.history.replaceState(null, "", `/markets/champion/${current.code}`);
    }
  }, [current]);

  // delta +1 = next (throws LEFT); delta -1 = previous (throws RIGHT).
  const go = useCallback(
    (delta: number) => {
      const target = deck[pos + delta];
      if (!target) {
        animate(x, 0, { type: "spring", stiffness: 500, damping: 40 });
        return;
      }
      const off = delta > 0 ? -1 : 1;
      const w = typeof window !== "undefined" ? window.innerWidth : 500;
      animate(x, off * w * 1.2, {
        duration: 0.25,
        ease: "easeIn",
        onComplete: () => {
          setCode(target.code);
          x.set(0);
        },
      });
    },
    [deck, pos, x],
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
    <div className="relative h-full w-full overflow-hidden bg-[#0a0a0b] select-none">
      <motion.div
        key={current.code}
        className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
        style={{ x, rotate }}
        drag="x"
        onDragEnd={onDragEnd}
      >
        <CoinCard entry={current} />
      </motion.div>

      {/* Click/tap to flip — also covers the Mac, where a trackpad two-finger
          swipe is a scroll gesture, not a pointer drag Motion can read. */}
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="previous coin"
        className="font-serif absolute left-2 z-10 hidden h-11 w-11 items-center justify-center rounded-full lg:flex bg-white/[0.06] text-2xl leading-none text-zinc-300 ring-1 ring-white/10 transition hover:bg-white/[0.12] hover:text-white [top:50%] [transform:translateY(-50%)]"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => go(+1)}
        aria-label="next coin"
        className="font-serif absolute right-2 z-10 hidden h-11 w-11 items-center justify-center rounded-full lg:flex bg-white/[0.06] text-2xl leading-none text-zinc-300 ring-1 ring-white/10 transition hover:bg-white/[0.12] hover:text-white [top:50%] [transform:translateY(-50%)]"
      >
        ›
      </button>

      <div className="font-cond pointer-events-none absolute inset-x-0 [bottom:max(1.25rem,env(safe-area-inset-bottom))] flex flex-col items-center gap-1 text-[11px] tracking-[0.25em] text-zinc-500 uppercase">
        <span>
          {pos + 1} / {deck.length}
        </span>
        <span className="text-zinc-600">swipe</span>
      </div>
    </div>
  );
}
