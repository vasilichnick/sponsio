import fixturesData from "@/data/fixtures.json";
import tokensData from "@/data/tokens.json";
import { Countdown } from "../countdown";
import { HeroCta } from "./hero-cta";
import { LaunchTicker } from "./launch-ticker";
import { SeamSpacer } from "./seam-spacer";
import { LocalTime } from "../local-time";

type Token = { name: string; flag: string; ticker: string; address: string };
type Fixture = { kickoffUtc: string; home: string; away: string };

const tokens = tokensData.teams as Record<string, Token>;
const fixtures = fixturesData.matches as Fixture[];

// First launch = earliest kickoff (launch rule: a team's coin goes live at
// the team's first match). The opening fixture launches the first two coins.
const opener = fixtures.reduce((a, b) => (b.kickoffUtc < a.kickoffUtc ? b : a));
const home = tokens[opener.home];
const away = tokens[opener.away];

export default function Home() {
  return (
    <>
      {/* Hero owns exactly the top half — the same box as the upper photo
          row — so the next in-flow section starts at the strip divider.
          min-h-fit: if content ever outgrows the half, the sections below
          get pushed down instead of overlapped. */}
      {/* Top padding scales with viewport height (not width): 128px on tall
          phones, shrinking on short windows so the hero fits its half. */}
      {/* Entrance choreography: .rise lives on inner wrappers only — the
          #hero and #tagline boxes are measured by SeamSpacer and must not
          transform. */}
      <section id="hero" className="h-1/2 min-h-fit shrink-0 px-6 pt-[max(4rem,min(8rem,14vh))] pb-6 text-center lg:pt-18">
        <p className="rise font-cond text-[11px] font-semibold uppercase tracking-[0.25em] text-white [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.95))_drop-shadow(0_4px_14px_rgba(0,0,0,0.7))] md:text-xs">
          The first financial market built around belief, not odds
        </p>
        {/* Edge treatment: tight dark shadow defines glyph edges over bright
            photo areas; the wide soft one seats the block on busy ones. */}
        <h1 className="mt-3 font-serif text-[clamp(2rem,8.5vmin,4.5rem)] leading-[0.9] font-normal uppercase tracking-tight [-webkit-text-stroke:0.75px_rgba(0,0,0,0.9)] [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.95))_drop-shadow(0_10px_28px_rgba(0,0,0,0.55))]">
          <span className="rise block" style={{ "--rise-delay": "80ms" } as React.CSSProperties}>
            Trade the teams
          </span>
          <span className="rise block" style={{ "--rise-delay": "180ms" } as React.CSSProperties}>
            you{" "}
            <span className="text-emerald-300 [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.9))_drop-shadow(0_2px_6px_rgba(0,0,0,0.85))]">
              believe in
            </span>
          </span>
          {/* Visible gap between caps rows ≈ 0.9em leading − ~0.71em cap
              height ≈ 0.19em. 3× that gap → add 2×0.19em ≈ 0.38em. */}
          <span className="rise mt-[0.38em] block" style={{ "--rise-delay": "300ms" } as React.CSSProperties}>
            split the pool
          </span>
        </h1>
        <p id="tagline" className="mx-auto mt-3 max-w-2xl text-base font-medium text-white [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.95))_drop-shadow(0_4px_14px_rgba(0,0,0,0.7))] md:text-lg">
          <span className="rise block" style={{ "--rise-delay": "420ms" } as React.CSSProperties}>
            Every coin is one belief: this team becomes champion. The market
            prices it match by match. Fees fill one pool. One belief comes
            true — its believers split it.
          </span>
        </p>
      </section>

      {/* Symmetric offset: countdown starts as far below the seam as the
          tagline ends above it. */}
      <SeamSpacer />
      <section className="relative flex shrink-0 flex-col items-center gap-3 px-6 text-center">
        {/* Spotlight: a soft dark ellipse seats the countdown on the moving
            photos — focus and worst-case contrast in one layer. */}
        <div
          aria-hidden
          className="absolute inset-x-0 -inset-y-8 -z-10 mx-auto max-w-3xl bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55),transparent_70%)]"
        />
        <h2 className="rise font-serif text-base font-normal uppercase tracking-tight [-webkit-text-stroke:0.5px_rgba(0,0,0,0.9)] [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.95))_drop-shadow(0_4px_12px_rgba(0,0,0,0.6))] md:text-xl" style={{ "--rise-delay": "500ms" } as React.CSSProperties}>
          World Cup 2026 — Launch Countdown
        </h2>
        <Countdown targetIso={opener.kickoffUtc} />
        <p className="rise font-cond text-sm font-semibold uppercase [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.95))_drop-shadow(0_4px_14px_rgba(0,0,0,0.7))] md:text-base" style={{ "--rise-delay": "580ms" } as React.CSSProperties}>
          First coins {home.flag} {home.ticker} &{" "}
          <span className="whitespace-nowrap">
            {away.flag} {away.ticker}
          </span>{" "}
          go live at kickoff — <LocalTime iso={opener.kickoffUtc} mode="date" />{" "}
          · <LocalTime iso={opener.kickoffUtc} mode="time" />
        </p>
        <div
          className="rise"
          style={{ "--rise-delay": "660ms" } as React.CSSProperties}
        >
          <HeroCta />
        </div>
      </section>

      {/* Keeps the launch tape + footer pinned to the viewport bottom. */}
      <div className="min-h-0 flex-1" />
      <LaunchTicker />
    </>
  );
}
