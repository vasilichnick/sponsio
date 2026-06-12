"use client";

import { useState } from "react";

type Status = "upcoming" | "live";

/** Status split for the champion board: Upcoming (not launched, the
 *  default view — the launch schedule) vs Live (tradable now). Both panels
 *  arrive server-rendered and stay in the DOM — the inactive one is
 *  `hidden` — so the full coin table remains in the HTML for SEO and
 *  switching is instant. Quieter pills than the market switcher above:
 *  this is a filter, not navigation. */
export function StatusTabs({
  upcoming,
  live,
  upcomingCount,
  liveCount,
}: {
  upcoming: React.ReactNode;
  live: React.ReactNode;
  upcomingCount: number;
  liveCount: number;
}) {
  const [active, setActive] = useState<Status>("upcoming");
  const tabs: { id: Status; label: string; count: number }[] = [
    { id: "upcoming", label: "Upcoming", count: upcomingCount },
    { id: "live", label: "Live", count: liveCount },
  ];

  return (
    <>
      <div
        role="tablist"
        aria-label="Coin status"
        className="mx-auto mb-3 flex w-fit gap-1 rounded-full bg-zinc-950/60 p-1 ring-1 ring-white/10 backdrop-blur-md"
      >
        {tabs.map((t) => {
          const selected = active === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-status-${t.id}`}
              aria-selected={selected}
              aria-controls={`panel-status-${t.id}`}
              onClick={() => setActive(t.id)}
              className={`font-cond flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors ${
                selected
                  ? "bg-white/15 text-white ring-1 ring-white/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {t.label}
              <span className={selected ? "text-emerald-300" : "text-zinc-500"}>
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id="panel-status-upcoming"
        aria-labelledby="tab-status-upcoming"
        hidden={active !== "upcoming"}
      >
        {upcoming}
      </div>
      <div
        role="tabpanel"
        id="panel-status-live"
        aria-labelledby="tab-status-live"
        hidden={active !== "live"}
      >
        {live}
      </div>
    </>
  );
}
