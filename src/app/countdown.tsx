"use client";

import { Fragment, useSyncExternalStore } from "react";

const tick = (cb: () => void) => {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
};

const pad = (n: number) => String(n).padStart(2, "0");

/** Seconds-resolution clock; null during SSR so the statically prerendered
 *  HTML shows placeholders instead of a countdown frozen at build time. */
function useNowSec() {
  return useSyncExternalStore<number | null>(
    tick,
    () => Math.floor(Date.now() / 1000),
    () => null,
  );
}

/** Days/hours/minutes/seconds to the first token launch (= first kickoff),
 *  in the hero's type system: Archivo Black digits with the hardened
 *  stroke/shadow edge treatment, emerald colons, condensed labels. */
export function Countdown({ targetIso }: { targetIso: string }) {
  const now = useNowSec();
  const diff =
    now === null
      ? null
      : Math.max(0, Math.floor(Date.parse(targetIso) / 1000) - now);
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
    <div className="flex items-start justify-center gap-2 sm:gap-3">
      {units.map(([label, value], i) => (
        <Fragment key={label}>
          {i > 0 && (
            <span
              aria-hidden
              className="font-serif text-[clamp(2rem,7vmin,3.5rem)] leading-none text-white [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.95))]"
            >
              :
            </span>
          )}
          <div className="flex min-w-[2.6ch] flex-col items-center">
            <span className="font-serif text-[clamp(2rem,7vmin,3.5rem)] leading-none text-white [-webkit-text-stroke:0.75px_rgba(0,0,0,0.9)] [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.95))_drop-shadow(0_10px_28px_rgba(0,0,0,0.55))]">
              {value}
            </span>
            <span className="font-cond mt-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/85 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] sm:text-xs">
              {label}
            </span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
