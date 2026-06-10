import Link from "next/link";

/** Conversion support under the coins table: a three-step "how to trade"
 *  strip and a native <details> FAQ. Server-rendered, zero JS — summaries
 *  are keyboard-focusable by default. Copy restates the published reward
 *  mechanics; it never redefines them. */

const STEPS: [string, string][] = [
  [
    "Get a wallet",
    "Coinbase Wallet, MetaMask or Rainbow — any wallet that speaks Base works.",
  ],
  [
    "Fund it on Base",
    "Trades are paid in ETH on Base — buy it in-wallet or bridge from an exchange.",
  ],
  [
    "Hit Trade",
    "Pick a live coin above — the button opens its market. Buy belief, sell doubt, rotate.",
  ],
];

const FAQS: [string, React.ReactNode][] = [
  [
    "Why are the Trade buttons disabled?",
    <>
      Coins go live at each team&apos;s first kickoff, June 11–18. The moment a
      coin launches, its contract address appears here and its button lights
      up — until then it shows the zero address.{" "}
      <a
        href="https://x.com/sponsio_world"
        target="_blank"
        rel="noopener noreferrer"
        className="text-emerald-300 underline-offset-2 hover:underline"
      >
        Follow @sponsio_world
      </a>{" "}
      for the launch alerts.
    </>,
  ],
  [
    "My team got knocked out — is my coin dead?",
    <>
      The market stays open all tournament — every coin keeps trading until
      the final, so belief reprices; it never expires like a bet slip. But
      this is a market for traders, not hoarders: only the champion&apos;s
      believers split the pool, so the play is to hold a team&apos;s coin
      through its match days and rotate into whoever plays next. And the
      honest part — these are meme coins; prices can fall hard and can go to
      zero.
    </>,
  ],
  [
    "Where does trading actually happen?",
    <>
      On Base, from your own wallet — Sponsio never holds your funds. Each
      coin launches via our launch partner BasedBid and graduates to open
      Uniswap trading as it grows.
    </>,
  ],
  [
    "What is the Reward Pool?",
    <>
      Fees from coin launches and trading accumulate into one pool across the
      whole tournament. After the final, the champion coin&apos;s believers
      split it — sized by match-day snapshots. The full mechanics live on the{" "}
      <Link
        href="/rewards"
        className="text-emerald-300 underline-offset-2 hover:underline"
      >
        Split the Pool
      </Link>{" "}
      page.
    </>,
  ],
  [
    "Is this betting?",
    <>
      No bookmaker, no odds, no expiring slips. You buy and sell coins on an
      open market, any time, against other traders — never against a house.
      The Reward Pool is a discretionary promotional program funded by real
      trading fees, not a payout on a wager — see the{" "}
      <Link
        href="/terms"
        className="text-emerald-300 underline-offset-2 hover:underline"
      >
        Terms
      </Link>
      .
    </>,
  ],
  [
    "Is Sponsio affiliated with FIFA or the teams?",
    <>
      No. Sponsio is independent and unaffiliated with FIFA, the national
      federations and the teams. The coins are fan-made memecoins —
      expressions of belief, not official fan tokens or club products.
    </>,
  ],
];

export function CoinsFaq() {
  return (
    <>
      <div className="mx-auto mt-8 max-w-3xl">
        <h2 className="font-cond text-center text-xs font-semibold tracking-[0.25em] text-zinc-300 uppercase [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.95))_drop-shadow(0_4px_14px_rgba(0,0,0,0.7))]">
          New here — three steps
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {STEPS.map(([title, body], i) => (
            <div
              key={title}
              className="rounded-xl bg-zinc-950/75 px-4 py-4 ring-1 ring-white/10 shadow-lg shadow-black/40 backdrop-blur-md"
            >
              <p className="font-mono text-[11px] font-semibold tracking-[0.2em] text-emerald-300">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="font-cond mt-1 font-semibold text-white uppercase">
                {title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 mb-2 max-w-3xl">
        <h2 className="font-cond text-center text-xs font-semibold tracking-[0.25em] text-zinc-300 uppercase [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.95))_drop-shadow(0_4px_14px_rgba(0,0,0,0.7))]">
          Questions
        </h2>
        <div className="mt-3 overflow-hidden rounded-2xl bg-zinc-950/75 ring-1 ring-white/10 shadow-lg shadow-black/40 backdrop-blur-md">
          {FAQS.map(([q, a]) => (
            <details key={q} className="group border-b border-white/5 last:border-0">
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-4 py-3.5 select-none sm:px-5 [&::-webkit-details-marker]:hidden">
                <span className="font-cond font-semibold text-white uppercase">
                  {q}
                </span>
                <span
                  aria-hidden
                  className="font-mono text-lg leading-none text-emerald-300 transition-transform group-open:rotate-45 motion-reduce:transition-none"
                >
                  +
                </span>
              </summary>
              <p className="px-4 pb-4 text-sm leading-relaxed text-zinc-400 sm:px-5">
                {a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}
