"use client";

import { Fragment } from "react";
import { useNowSec } from "./use-now";

const pad = (n: number) => String(n).padStart(2, "0");

/** Two voices: full is the hero scoreboard — Archivo Black with the
 *  hardened stroke/shadow edge recipe (digits, colons and the live line).
 *  Compact matches the card's meta line exactly (font-cond text-xs
 *  semibold, no display chrome) so the counter reads as information,
 *  not as a second hero. */
const FULL_DIGIT =
  "font-serif leading-none text-white [-webkit-text-stroke:0.75px_rgba(0,0,0,0.9)] [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.95))_drop-shadow(0_10px_28px_rgba(0,0,0,0.55))] text-[clamp(2rem,8vmin,4rem)]";
const COMPACT_DIGIT =
  "font-cond text-xs leading-none font-semibold tracking-[0.15em] text-zinc-300";

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
  const digit = compact ? COMPACT_DIGIT : FULL_DIGIT;
  const diff =
    now === null
      ? null
      : Math.max(0, Math.floor(Date.parse(targetIso) / 1000) - now);

  if (diff === 0) {
    return (
      <p
        className={`${digit} flex items-center justify-center uppercase ${compact ? "gap-2" : "gap-4"}`}
      >
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
      className={`flex items-start justify-center ${compact ? "gap-1 sm:gap-1.5" : "gap-2 sm:gap-3"}`}
    >
      {units.map(([label, value], i) => (
        <Fragment key={label}>
          {i > 0 && (
            <span
              aria-hidden
              className={
                compact
                  ? COMPACT_DIGIT
                  : "font-serif text-[clamp(2rem,8vmin,4rem)] leading-none text-white [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.95))]"
              }
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
              className={`font-cond font-semibold uppercase ${
                compact
                  ? "mt-0.5 text-[8px] tracking-[0.18em] text-zinc-500"
                  : "mt-1.5 text-[10px] tracking-[0.25em] text-white/85 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] sm:text-xs"
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
