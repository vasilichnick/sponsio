import type { Metadata } from "next";
import Link from "next/link";
import { HowItWorks } from "./how-it-works";
import { SplitPlayground } from "./split-playground";

export const metadata: Metadata = {
  title: "Split the Pool — Sponsio",
  description:
    "How the Sponsio Reward Pool works: one pool, one champion, split among the believers who backed it — match-day snapshots, the Champion Score, and a worked example.",
};

const P = "mt-3 text-[15px] leading-relaxed text-zinc-400";
const H2 =
  "font-cond mt-8 text-xl font-semibold uppercase tracking-tight text-white";
const PULL =
  "font-cond mt-6 border-y border-white/10 py-4 text-center text-xl font-semibold uppercase leading-snug tracking-tight text-white md:text-2xl";

const ROWS: [string, string, string, string, string][] = [
  ["A", "Held $ARG through every Argentina match day", "5,000 × 8", "5,000", "$615,385"],
  ["B", "Caught 4 match days, mistimed the other 4", "5,000 ×4, 0 ×4", "2,500", "$307,692"],
  ["C", "Bought only for the final", "0 ×7, 5,000 ×1", "625", "$76,923"],
];

export default function Rewards() {
  return (
    <>
      <section className="shrink-0 px-6 pt-28 pb-5 text-center lg:pt-24">
        <h1 className="font-serif text-[clamp(2rem,8.5vmin,4.5rem)] leading-[0.9] font-normal uppercase tracking-tight [-webkit-text-stroke:0.75px_rgba(0,0,0,0.9)] [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.95))_drop-shadow(0_10px_28px_rgba(0,0,0,0.55))]">
          Split the Pool
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base font-medium text-white [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.95))_drop-shadow(0_4px_14px_rgba(0,0,0,0.7))] md:text-lg">
          One pool. One champion. Split among the believers who called it.
        </p>
      </section>

      <main className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 md:px-10">
        <div className="mx-auto max-w-2xl rounded-2xl bg-zinc-950/75 px-6 py-6 shadow-lg shadow-black/40 ring-1 ring-white/10 backdrop-blur-md md:px-8">
          <p className="text-lg font-semibold leading-snug text-white md:text-xl">
            Sponsio is the first financial market built around belief instead of
            outcomes.
          </p>

          <HowItWorks />

          <p className={P}>
            A prediction market sells you a contract on a result, settles it, and
            disappears. Sponsio is different: you buy and trade{" "}
            <span className="font-semibold text-white">beliefs</span> — one coin
            per nation at the World Cup, each one the belief that its team
            becomes champion — and they live for the entire tournament, moving
            with it.
          </p>
          <p className="font-mono mt-4 text-center text-sm tracking-wide text-emerald-300">
            $ARG · $BRA · $ENG · $FRA
          </p>
          <p className={P}>
            As the tournament unfolds, the market moves with the story. Some teams
            exceed expectations. Some collapse. Some become favourites; others go
            home. Every price reflects what the world believes about a team&apos;s
            chances, in real time.
          </p>

          <p className={PULL}>All of that activity feeds one pool.</p>

          <p className={P}>
            Fees from coin launches and trading accumulate into a single Reward
            Pool across the whole tournament. Nothing is paid out after a match.
            Nothing after the group stage. Nothing after the quarter-finals.
            Everything builds toward one outcome — the champion.
          </p>

          <h2 id="snapshots" className={`${H2} scroll-mt-4`}>
            Snapshots — taken only on match days
          </h2>
          <p className={P}>
            A team&apos;s coin launches at its first kickoff. From then on,{" "}
            <span className="font-semibold text-white">
              on each day that team plays, Sponsio takes one balance snapshot at a
              random moment between kickoff and the end of that day (UTC).
            </span>
          </p>
          <p className={P}>
            No snapshots on rest days. None before a team has played. Only match
            days count — the days a team is live and its market is loud.
          </p>
          <p className={P}>
            The moment is never announced, and it&apos;s random, so you can&apos;t
            snipe it. If you want a match day to count for you, hold the coin
            through that day.
          </p>
          <p className={P}>
            This is a market for traders, not hoarders. You don&apos;t sit on one
            coin for a month. The play is to hold a team&apos;s coin on the days it
            plays — then rotate into whoever plays next. Show up on the active
            days; move your capital on when they rest.
          </p>

          <h2 id="champion-score" className={`${H2} scroll-mt-4`}>
            The Champion Score
          </h2>
          <p className={P}>
            When the final is decided, the champion&apos;s coin becomes the{" "}
            <span className="font-semibold text-white">Champion Coin</span>. Sponsio
            looks only at that coin&apos;s match-day snapshots — every one, from the
            team&apos;s first match to the final.
          </p>
          <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-white/5 px-4 py-4">
            <p className="text-sm leading-relaxed text-zinc-200">
              <span className="font-cond font-semibold text-emerald-300 uppercase">
                Champion Score
              </span>{" "}
              = your average Champion Coin balance across all of its match-day
              snapshots
            </p>
            <p className="text-sm leading-relaxed text-zinc-200">
              <span className="font-cond font-semibold text-emerald-300 uppercase">
                Your share
              </span>{" "}
              = Reward Pool × ( your Champion Score ÷ the sum of every wallet&apos;s
              Champion Score )
            </p>
          </div>

          <h3 className="font-cond mt-6 text-base font-semibold uppercase text-white">
            A worked example
          </h3>
          <p className={P}>
            Say Argentina wins. To lift the trophy it played 8 matches, so there
            are 8 Argentina snapshots — one per match day, each at a random moment.
            Suppose the Reward Pool is{" "}
            <span className="font-semibold text-white">$1,000,000</span>.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
              <thead>
                <tr className="font-cond text-xs tracking-wide text-zinc-400 uppercase">
                  <th className="border-b border-white/10 py-2 pr-3 font-semibold">Wallet</th>
                  <th className="border-b border-white/10 px-3 py-2 font-semibold">What it did</th>
                  <th className="border-b border-white/10 px-3 py-2 font-semibold">$ARG at snapshots</th>
                  <th className="border-b border-white/10 px-3 py-2 font-semibold">Score</th>
                  <th className="border-b border-white/10 py-2 pl-3 text-right font-semibold">Share</th>
                </tr>
              </thead>
              <tbody className="text-zinc-400">
                {ROWS.map(([w, did, bal, score, share]) => (
                  <tr key={w}>
                    <td className="border-b border-white/5 py-2 pr-3 font-semibold text-white">{w}</td>
                    <td className="border-b border-white/5 px-3 py-2">{did}</td>
                    <td className="border-b border-white/5 px-3 py-2 font-mono text-xs">{bal}</td>
                    <td className="border-b border-white/5 px-3 py-2 font-mono font-semibold text-white">{score}</td>
                    <td className="border-b border-white/5 py-2 pl-3 text-right font-mono font-semibold text-emerald-300">{share}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={P}>
            Sum of all scores = 5,000 + 2,500 + 625 ={" "}
            <span className="font-semibold text-white">8,125</span>. Wallet
            A&apos;s share = 1,000,000 × (5,000 ÷ 8,125) ={" "}
            <span className="font-semibold text-white">$615,385</span>. The same
            maths gives B and C theirs, and the three shares add back to the full
            $1,000,000.
          </p>
          <p className={P}>
            All three held the same peak amount — 5,000 $ARG. What separated them
            was how many of the champion&apos;s match days they showed up for. A was
            there for all eight and took the largest split; C appeared once and was
            averaged against the seven it missed.
          </p>

          <SplitPlayground />

          <p className={PULL}>
            You don&apos;t win the pool. You take a slice of it — sized by how
            consistently you backed the champion on the days that mattered.
          </p>

          <h2 className={H2}>Who qualifies</h2>
          <p className={P}>
            Every wallet with a non-zero Champion Score shares the pool, except:
          </p>
          <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-zinc-400">
            <li className="flex gap-2">
              <span className="text-emerald-300">—</span>
              <span>
                <span className="font-semibold text-white">
                  Smart-contract balances
                </span>{" "}
                — liquidity pools, LP positions, launch-platform and custody
                contracts hold coins mechanically, not out of belief, and are
                excluded under the published methodology.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-300">—</span>
              <span>
                <span className="font-semibold text-white">
                  Addresses caught manipulating
                </span>{" "}
                — wash trading, snapshot gaming, and exploits forfeit eligibility.
              </span>
            </li>
          </ul>
          <p className={P}>
            Claims may be subject to eligibility checks, regional restrictions, and
            a deadline, as set out in the{" "}
            <Link
              href="/terms"
              className="text-emerald-300 underline-offset-2 hover:underline"
            >
              Terms
            </Link>
            . Snapshot data and the full methodology are published, so every split
            is verifiable on-chain.
          </p>

          <h2 className={H2}>The honest part</h2>
          <p className={P}>
            The Reward Pool is a discretionary promotional program, not an
            investment return. Its size depends entirely on real trading activity —
            it may be large, small, or zero. The coins are meme coins: they
            entitle you to nothing beyond the coin itself, and their price can fall
            to zero. The pool is a thank-you to the believers who were right —
            never a reason to spend more than you can afford to lose.
          </p>

          <p className="font-cond mt-7 text-center text-lg font-semibold uppercase leading-snug tracking-tight text-emerald-300 md:text-xl">
            One tournament. One pool. One champion. One split — among everyone who
            believed.
          </p>
        </div>
      </main>
    </>
  );
}
