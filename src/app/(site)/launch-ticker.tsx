import Link from "next/link";
import { coinLaunches, ZERO_ADDRESS } from "@/data/launches";
import { LocalTime } from "../local-time";

/** Launch tape: all 48 coins drifting across a thin band above the footer —
 *  live coins show a pulsing LIVE marker, the rest their launch date. Real
 *  schedule data, no prices. The whole band links to /coins; the moving
 *  track is aria-hidden (it holds two copies for the seamless loop), the
 *  link label carries the meaning for screen readers. */
export function LaunchTicker() {
  return (
    <Link
      href="/coins"
      aria-label="All 48 coins and launch times"
      className="marquee relative h-9 shrink-0 overflow-hidden border-y border-white/10 bg-black/60 backdrop-blur-[6px]"
    >
      <div
        aria-hidden
        className="marquee-track flex h-full w-max items-center"
        style={{ "--marquee-dur": "160s" } as React.CSSProperties}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex h-full items-center">
            {coinLaunches.map(({ code, team, launch }) => (
              <span
                key={code}
                className="flex items-center gap-1.5 px-4 font-mono text-[11px] tracking-wide whitespace-nowrap text-zinc-300"
              >
                <span className="text-sm leading-none">{team.flag}</span>
                <span className="font-semibold text-white">
                  ${team.ticker}
                </span>
                {team.address !== ZERO_ADDRESS ? (
                  <span className="flex items-center gap-1 font-semibold text-emerald-300">
                    <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    LIVE
                  </span>
                ) : (
                  <span className="text-zinc-300">
                    <LocalTime iso={launch} mode="date" />
                  </span>
                )}
              </span>
            ))}
          </div>
        ))}
      </div>
      {/* Soft fade at both ends so entries don't pop at the viewport edge. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black/60 to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/60 to-transparent"
      />
    </Link>
  );
}
