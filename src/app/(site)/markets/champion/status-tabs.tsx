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
  const [active, setActive] = useState<Status>("live");
  const tabs: { id: Status; label: string; count: number }[] = [
    { id: "live", label: "Live", count: liveCount },
    { id: "upcoming", label: "Upcoming", count: upcomingCount },
  ];

  return (
    <>
      <div
        role="tablist"
        aria-label="Coin status"
        className="mx-auto mt-3 mb-3 flex w-fit shrink-0 gap-1 rounded-full bg-zinc-950/60 p-1 ring-1 ring-white/10 backdrop-blur-md"
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

      {/* Panels fill the remaining height of the locked viewport; the
          board inside each panel is the actual scroll container. */}
      <div className="min-h-0 flex-1">
        <div
          role="tabpanel"
          id="panel-status-upcoming"
          aria-labelledby="tab-status-upcoming"
          hidden={active !== "upcoming"}
          className={
            active === "upcoming" ? "flex h-full min-h-0 flex-col" : "hidden"
          }
        >
          {upcoming}
        </div>
        <div
          role="tabpanel"
          id="panel-status-live"
          aria-labelledby="tab-status-live"
          hidden={active !== "live"}
          className={
            active === "live" ? "flex h-full min-h-0 flex-col" : "hidden"
          }
        >
          {live}
        </div>
      </div>
    </>
  );
}
