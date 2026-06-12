"use client";

import { useNowSec } from "../../../use-now";

const pad = (n: number) => String(n).padStart(2, "0");

/** "2d 3h 04m 09s" — seconds included only when under an hour out matters
 *  (the stat strip wants the live tick; row badges stay calmer). */
function fmtDur(s: number, seconds: boolean) {
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${pad(m)}m`;
  if (seconds) return h > 0 ? `${h}h ${pad(m)}m ${pad(s % 60)}s` : `${m}m ${pad(s % 60)}s`;
  return h > 0 ? `${h}h ${pad(m)}m` : `${m}m`;
}

/** Stat-strip chip: live countdown to the next coin launch ("first launch
 *  in 21h 14m 03s"). SSR renders a placeholder; on the client it ticks
 *  every second off the shared store. */
export function NextLaunchIn({
  label,
  launches,
}: {
  label: string;
  launches: { launch: string; live: boolean }[];
}) {
  const now = useNowSec();
  if (now === null) {
    return (
      <span>
        {label} <span className="text-emerald-300">soon</span>
      </span>
    );
  }
  const upcoming = launches
    .filter((l) => !l.live)
    .map((l) => Math.floor(Date.parse(l.launch) / 1000))
    .filter((t) => t > now);
  if (upcoming.length === 0) {
    return (
      <span className="text-emerald-300">
        {launches.every((l) => l.live) ? "all 48 live" : "launching now"}
      </span>
    );
  }
  return (
    <span>
      {label} in{" "}
      <span className="font-mono text-emerald-300 normal-case">
        {fmtDur(Math.min(...upcoming) - now, true)}
      </span>
    </span>
  );
}

/** Row badge: pulsing LIVE for launched coins, a ticking "in 21h 14m" chip
 *  for coins launching within 24h, "launching…" once kickoff has passed but
 *  the address hasn't dropped yet. Nothing for far-out rows — unless
 *  `always` (the hero next-launch row keeps its countdown at any range). */
export function LaunchBadge({
  iso,
  live,
  always = false,
}: {
  iso: string;
  live: boolean;
  always?: boolean;
}) {
  const now = useNowSec();
  if (live) {
    return (
      <span className="flex items-center gap-1 font-cond text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
        <span aria-hidden className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Live
      </span>
    );
  }
  if (now === null) return null;
  const t = Math.floor(Date.parse(iso) / 1000);
  if (t <= now) {
    return (
      <span className="font-cond text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
        Launching…
      </span>
    );
  }
  if (always || t - now <= 86400) {
    return (
      <span className="font-mono text-[11px] text-emerald-300">
        in {fmtDur(t - now, false)}
      </span>
    );
  }
  return null;
}
