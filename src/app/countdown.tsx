"use client";

import { Fragment } from "react";
import { useNowSec } from "./use-now";

const pad = (n: number) => String(n).padStart(2, "0");

/** Hero-grade digit treatment — Archivo Black with the hardened
 *  stroke/shadow edge recipe (shared by digits, colons and the live line).
 *  Two sizes: full (hero) and compact (inside cards — sized so the whole
 *  card fits the locked composition's height budget). */
const EDGE =
  "font-serif leading-none text-white [-webkit-text-stroke:0.75px_rgba(0,0,0,0.9)] [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.95))_drop-shadow(0_10px_28px_rgba(0,0,0,0.55))]";
const SIZE_FULL = "text-[clamp(2rem,8vmin,4rem)]";
const SIZE_COMPACT = "text-[clamp(1.4rem,4.2vmin,2.1rem)]";

/** Days/hours/minutes/seconds to a kickoff. Each digit character is keyed
 *  by its value, so a change remounts it and fires the .digit-in scoreboard
 *  tick. At T-0 the block swaps to a pulsing "Live now" in the same type
 *  system. */
export function Countdown({
  targetIso,
  compact = false,
}: {
  targetIso: string;
  compact?: boolean;
}) {
  const now = useNowSec();
  const size = compact ? SIZE_COMPACT : SIZE_FULL;
  const digit = `${EDGE} ${size}`;
  const diff =
    now === null
      ? null
      : Math.max(0, Math.floor(Date.parse(targetIso) / 1000) - now);

  if (diff === 0) {
    return (
      <p className={`${digit} flex items-center justify-center gap-4 uppercase`}>
        <span
          aria-hidden
          className="pulse-dot inline-block h-[0.45em] w-[0.45em] rounded-full bg-emerald-400"
        />
        Live now
      </p>
    );
  }

  const units: [string, string][] =
    diff === null
      ? [
          ["Days", "––"],
          ["Hours", "––"],
          ["Minutes", "––"],
          ["Seconds", "––"],
        ]
      : [
          ["Days", pad(Math.floor(diff / 86400))],
          ["Hours", pad(Math.floor((diff % 86400) / 3600))],
          ["Minutes", pad(Math.floor((diff % 3600) / 60))],
          ["Seconds", pad(diff % 60)],
        ];
  return (
    <div
      className={`flex items-start justify-center ${compact ? "gap-1.5 sm:gap-2" : "gap-2 sm:gap-3"}`}
    >
      {units.map(([label, value], i) => (
        <Fragment key={label}>
          {i > 0 && (
            <span
              aria-hidden
              className={`font-serif ${size} leading-none text-white [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.95))]`}
            >
              :
            </span>
          )}
          <div className="flex min-w-[2.6ch] flex-col items-center">
            <span className={digit}>
              {value.split("").map((ch, c) => (
                <span
                  key={`${c}-${ch}`}
                  className={diff === null ? undefined : "digit-in"}
                >
                  {ch}
                </span>
              ))}
            </span>
            <span
              className={`font-cond font-semibold uppercase text-white/85 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] ${
                compact
                  ? "mt-1 text-[9px] tracking-[0.2em]"
                  : "mt-1.5 text-[10px] tracking-[0.25em] sm:text-xs"
              }`}
            >
              {label}
            </span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
