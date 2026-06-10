"use client";

import { useState } from "react";

/** Join the worked example: wallets A, B and C are fixed (scores 5,000 /
 *  2,500 / 625 — sum 8,125, pool $1,000,000); you hold the same 5,000 $ARG
 *  peak and choose how many of the champion's 8 match days you hold it
 *  through. Same maths as the table above — your score joins the sum, so
 *  the pool re-splits live. */

const POOL = 1_000_000;
const PEAK = 5_000;
const DAYS = 8;
const OTHERS_SUM = 8_125;

const fmt = new Intl.NumberFormat("en-US");

export function SplitPlayground() {
  const [days, setDays] = useState(8);
  const score = (PEAK * days) / DAYS;
  const total = OTHERS_SUM + score;
  const share = Math.round(POOL * (score / total));

  const segs = [
    { label: "A", score: 5_000, tone: "bg-emerald-400/80" },
    { label: "B", score: 2_500, tone: "bg-emerald-400/50" },
    { label: "C", score: 625, tone: "bg-emerald-400/25" },
    { label: "You", score, tone: "bg-emerald-300" },
  ];

  return (
    <div className="mt-6 rounded-xl border border-white/10 bg-white/5 px-4 py-5 md:px-5">
      <p className="font-cond text-base font-semibold uppercase tracking-tight text-white">
        Now add yourself
      </p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
        You also hold 5,000 $ARG. How many of Argentina&apos;s 8 match days do
        you hold it through?
      </p>

      <div className="mt-4 flex items-center gap-4">
        <label
          htmlFor="match-days"
          className="font-cond shrink-0 text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-400"
        >
          Match days
        </label>
        <input
          id="match-days"
          type="range"
          min={0}
          max={DAYS}
          step={1}
          value={days}
          aria-valuetext={`${days} of ${DAYS} match days`}
          onChange={(e) => setDays(Number(e.target.value))}
          className="h-2 w-full cursor-pointer accent-emerald-400"
        />
        <span className="w-10 shrink-0 text-right font-mono text-sm font-semibold text-white">
          {days}/{DAYS}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="text-sm text-zinc-400">
          Champion Score{" "}
          <span className="font-mono font-semibold text-white">
            {fmt.format(score)}
          </span>
        </p>
        <p className="text-sm text-zinc-400">
          Your slice{" "}
          <span className="font-mono text-lg font-semibold text-emerald-300">
            ${fmt.format(share)}
          </span>
        </p>
      </div>

      {/* The pool, re-split live across A, B, C and you. */}
      <div
        className="mt-3 flex h-3 w-full gap-px overflow-hidden rounded-sm"
        aria-hidden
      >
        {segs.map(
          (s) =>
            s.score > 0 && (
              <span
                key={s.label}
                className={`${s.tone} transition-[flex-grow] duration-300 motion-reduce:transition-none`}
                style={{ flexGrow: s.score / total, flexBasis: 0 }}
              />
            ),
        )}
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[10px] tracking-wide text-zinc-500">
        <span>A · B · C</span>
        <span className={days === 0 ? "text-zinc-500" : "text-emerald-300"}>
          {days === 0 ? "You — no snapshots, no slice" : "You"}
        </span>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-zinc-500">
        Same maths as the table above — your score joins the sum, so the pool
        re-splits. Show up more days, take a bigger slice.
      </p>
    </div>
  );
}
