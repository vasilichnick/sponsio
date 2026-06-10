"use client";

import { useState } from "react";

type MarketId = "champion" | "top-scorer";

/** Segmented switcher for the belief markets on /coins. Both panels are
 *  passed in already-rendered (server components) and kept in the DOM —
 *  inactive one is `hidden` — so the champion coin table stays in the
 *  server HTML for SEO and switching is instant. Standard tablist a11y:
 *  roles + aria-selected/controls, panels labelled by their tab. */
export function MarketTabs({
  champion,
  topScorer,
}: {
  champion: React.ReactNode;
  topScorer: React.ReactNode;
}) {
  const [active, setActive] = useState<MarketId>("champion");
  const tabs: { id: MarketId; label: string; soon?: boolean }[] = [
    { id: "champion", label: "Champion" },
    { id: "top-scorer", label: "Top Scorer", soon: true },
  ];

  return (
    <>
      <div
        role="tablist"
        aria-label="Belief markets"
        className="mx-auto mb-5 flex w-fit gap-1 rounded-full bg-zinc-950/75 p-1 shadow-lg shadow-black/40 ring-1 ring-white/10 backdrop-blur-md"
      >
        {tabs.map((t) => {
          const selected = active === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`panel-${t.id}`}
              onClick={() => setActive(t.id)}
              className={`font-cond flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold tracking-wide uppercase transition-colors ${
                selected
                  ? "bg-emerald-400 text-zinc-950"
                  : "text-zinc-300 hover:text-white"
              }`}
            >
              {t.label}
              {t.soon && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold tracking-wide ${
                    selected
                      ? "bg-zinc-950/20 text-zinc-900"
                      : "bg-amber-400/90 text-amber-950"
                  }`}
                >
                  Soon
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id="panel-champion"
        aria-labelledby="tab-champion"
        hidden={active !== "champion"}
      >
        {champion}
      </div>
      <div
        role="tabpanel"
        id="panel-top-scorer"
        aria-labelledby="tab-top-scorer"
        hidden={active !== "top-scorer"}
      >
        {topScorer}
      </div>
    </>
  );
}
