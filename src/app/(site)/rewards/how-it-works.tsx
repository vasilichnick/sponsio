import Link from "next/link";

/** Trade → Snapshot → Split in thirty seconds: three cards, each with a
 *  small CSS-animated visual (sparkline draw, snapshot flashes, pool split).
 *  Visuals are aria-hidden decoration; the copy carries the meaning. Cards
 *  link to the action (/coins) or the detailed section below (#anchors). */

const CARD =
  "group block rounded-xl border border-white/10 bg-white/5 px-4 py-4 transition-colors hover:bg-white/[0.08]";
const STEP = "font-mono text-[11px] font-semibold tracking-[0.2em] text-emerald-300";
const TITLE = "font-cond mt-1 text-lg font-semibold uppercase tracking-tight text-white";
const BODY = "mt-1.5 text-sm leading-relaxed text-zinc-400";
const FOOT =
  "font-cond mt-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500 transition-colors group-hover:text-emerald-300";

function Sparkline() {
  return (
    <div aria-hidden className="mt-3 flex h-10 items-center">
      <svg viewBox="0 0 96 32" className="h-9 w-full" preserveAspectRatio="none">
        <path
          d="M2 26 L18 20 L34 23 L50 12 L66 16 L82 6 L94 9"
          fill="none"
          stroke="#34D399"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={100}
          className="spark-draw"
        />
      </svg>
    </div>
  );
}

function SnapshotDays() {
  return (
    <div aria-hidden className="mt-3 flex h-10 items-center justify-between px-1">
      {Array.from({ length: 8 }).map((_, i) => (
        <span
          key={i}
          className="snap-flash h-2 w-2 rounded-full bg-white/20"
          style={{ animationDelay: `${i * 0.9}s` }}
        />
      ))}
    </div>
  );
}

function PoolSplit() {
  // Segment widths mirror the worked example's shares (62% / 31% / 7%).
  return (
    <div aria-hidden className="mt-3 flex h-10 items-center">
      <div className="flex h-2.5 w-full gap-1">
        <span className="split-grow w-[62%] rounded-sm bg-emerald-400/90" />
        <span
          className="split-grow w-[31%] rounded-sm bg-emerald-400/50"
          style={{ animationDelay: "0.25s" }}
        />
        <span
          className="split-grow w-[7%] rounded-sm bg-emerald-400/25"
          style={{ animationDelay: "0.5s" }}
        />
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-3">
      <Link href="/markets/champion" className={CARD}>
        <p className={STEP}>01</p>
        <p className={TITLE}>Trade</p>
        <p className={BODY}>
          Every coin is one belief: this team becomes champion. Buy the
          beliefs you share, sell when yours fades — every trade feeds the
          pool.
        </p>
        <Sparkline />
        <p className={FOOT}>See the coins →</p>
      </Link>
      <a href="#snapshots" className={CARD}>
        <p className={STEP}>02</p>
        <p className={TITLE}>Snapshot</p>
        <p className={BODY}>
          On each match day, one balance snapshot at a random moment. Hold
          through the days your team plays.
        </p>
        <SnapshotDays />
        <p className={FOOT}>How snapshots work ↓</p>
      </a>
      <a href="#champion-score" className={CARD}>
        <p className={STEP}>03</p>
        <p className={TITLE}>Split</p>
        <p className={BODY}>
          Champion believers split the pool after the final — sized by the
          match days they showed up for.
        </p>
        <PoolSplit />
        <p className={FOOT}>The maths ↓</p>
      </a>
    </div>
  );
}
