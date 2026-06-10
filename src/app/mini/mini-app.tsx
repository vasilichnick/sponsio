"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { LocalTime } from "../local-time";
import { useNowSec } from "../use-now";

const ZERO = "0x0000000000000000000000000000000000000000";
// Base mainnet, CAIP-19 native-token id used by sdk.actions.swapToken.
const BASE_ETH = "eip155:8453/native";
const uniswap = (a: string) =>
  `https://app.uniswap.org/swap?chain=base&outputCurrency=${a}`;
const pad = (n: number) => String(n).padStart(2, "0");
const emptySubscribe = () => () => {};

// First-run intro: shown once (localStorage), replayable from the ? button.
const INTRO_KEY = "sponsio-mini-intro-v1";
const INTRO: { kicker: string; title: string; body: string }[] = [
  {
    kicker: "What this is",
    title: "Every coin is one belief",
    body: "48 World Cup teams, 48 coins on Base. Each coin is one belief: this team becomes champion.",
  },
  {
    kicker: "How it trades",
    title: "Belief has a price",
    body: "Buy the beliefs you share, sell when yours fades — the market reprices every coin match by match, all tournament.",
  },
  {
    kicker: "Why it pays to be right",
    title: "One pool. One champion.",
    body: "Every trade feeds one Reward Pool. When the final settles which belief came true, its believers split the pool.",
  },
];

type Coin = {
  code: string;
  name: string;
  flag: string;
  ticker: string;
  address: string;
  launch: string;
};

function countdown(target: number, now: number) {
  const d = Math.max(0, target - now);
  const days = Math.floor(d / 86400);
  return `${days}d ${pad(Math.floor((d % 86400) / 3600))}h ${pad(Math.floor((d % 3600) / 60))}m ${pad(d % 60)}s`;
}

function Intro({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const s = INTRO[step];
  const last = step === INTRO.length - 1;
  return (
    <div className="fixed inset-0 z-50 mx-auto flex h-dvh max-w-[480px] flex-col bg-[#050505] px-6 pt-5 pb-6 text-white">
      <div className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-mark.png" alt="" className="h-7 w-7 object-contain" />
        <span className="font-serif text-lg tracking-tight">SPONSIO</span>
        <button
          type="button"
          onClick={onDone}
          className="font-cond ml-auto px-2 py-1 text-xs font-semibold tracking-[0.15em] text-zinc-500 uppercase transition-colors hover:text-white"
        >
          Skip
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
        <p className="font-cond text-[11px] font-semibold tracking-[0.25em] text-emerald-300 uppercase">
          {s.kicker}
        </p>
        <h2 className="font-serif mt-3 text-[2rem] leading-[0.95] uppercase tracking-tight">
          {s.title}
        </h2>
        <p className="font-cond mt-4 max-w-[34ch] text-base leading-snug text-zinc-300">
          {s.body}
        </p>
      </div>

      <div className="flex items-center justify-center gap-1.5 pb-5">
        {INTRO.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === step ? "w-6 bg-emerald-400" : "w-1.5 bg-white/20"
            }`}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => (last ? onDone() : setStep(step + 1))}
        className="font-cond h-12 shrink-0 rounded-full bg-emerald-400 text-base font-bold tracking-wide text-zinc-950 uppercase transition-colors hover:bg-emerald-300"
      >
        {last ? "Show me the coins" : "Next"}
      </button>
    </div>
  );
}

export function MiniApp({
  coins,
  openerIso,
}: {
  coins: Coin[];
  openerIso: string;
}) {
  const now = useNowSec();
  const openerTs = Math.floor(Date.parse(openerIso) / 1000);
  const [inMini, setInMini] = useState(false);
  const [market, setMarket] = useState<"champion" | "top-scorer">("champion");

  // First-run detection without effect-driven setState: localStorage read
  // via useSyncExternalStore (SSR snapshot pretends "seen" so the server
  // HTML never flashes the intro); introChoice overrides after the user
  // dismisses or replays it via the ? button.
  const introSeen = useSyncExternalStore(
    emptySubscribe,
    () => {
      try {
        return localStorage.getItem(INTRO_KEY) !== null;
      } catch {
        return true;
      }
    },
    () => true,
  );
  const [introChoice, setIntroChoice] = useState<boolean | null>(null);
  const showIntro = introChoice ?? !introSeen;

  // Hide the Farcaster splash once mounted. Calling ready() is mandatory —
  // without it the user is stuck on an infinite splash (the #1 Mini App bug).
  // Outside a Farcaster host the SDK no-ops; we track that so actions
  // degrade to normal links.
  useEffect(() => {
    sdk.isInMiniApp().then(setInMini).catch(() => {});
    sdk.actions.ready().catch(() => {});
  }, []);

  function dismissIntro() {
    try {
      localStorage.setItem(INTRO_KEY, "1");
    } catch {}
    setIntroChoice(false);
  }

  const liveCount = useMemo(
    () => coins.filter((c) => c.address !== ZERO).length,
    [coins],
  );
  const anyLive = liveCount > 0;

  async function onTrade(c: Coin) {
    if (c.address === ZERO) return;
    if (!inMini) {
      window.open(uniswap(c.address), "_blank", "noopener,noreferrer");
      return;
    }
    // Native in-client swap first; fall back to Uniswap if the host
    // doesn't support swapToken.
    try {
      await sdk.actions.swapToken({
        sellToken: BASE_ETH,
        buyToken: `eip155:8453/erc20:${c.address}`,
      });
    } catch {
      await sdk.actions.openUrl(uniswap(c.address)).catch(() => {});
    }
  }

  async function onShare(c: Coin) {
    await sdk.actions
      .composeCast({
        text: `I believe ${c.flag} ${c.name} becomes champion. $${c.ticker} on @base — every coin is one belief, and the champion's believers split the pool. ⚽`,
        embeds: ["https://sponsio.world/mini"],
      })
      .catch(() => {});
  }

  return (
    <main className="relative mx-auto flex h-dvh max-w-[480px] flex-col bg-[#050505] px-4 text-white">
      {showIntro && <Intro onDone={dismissIntro} />}

      {/* Header: brand + replayable explainer + add */}
      <div className="flex shrink-0 items-center gap-2 pt-5 pb-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-mark.png" alt="" className="h-7 w-7 object-contain" />
        <span className="font-serif text-lg tracking-tight">SPONSIO</span>
        <button
          type="button"
          onClick={() => setIntroChoice(true)}
          aria-label="How Sponsio works"
          className="font-cond ml-auto h-7 w-7 rounded-full bg-white/10 text-sm font-bold text-zinc-300 transition-colors hover:bg-white/15 hover:text-white"
        >
          ?
        </button>
        {inMini && (
          <button
            type="button"
            onClick={() => sdk.actions.addMiniApp().catch(() => {})}
            className="font-cond rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-white/15"
          >
            + Add
          </button>
        )}
      </div>

      {/* The why, in two lines */}
      <h1 className="font-serif shrink-0 text-[1.45rem] leading-[0.95] uppercase tracking-tight">
        Trade the teams you <span className="text-emerald-300">believe in</span>
      </h1>
      <p className="font-cond mt-1.5 shrink-0 text-sm leading-snug text-zinc-400">
        Every coin is one belief —{" "}
        <span className="font-semibold text-zinc-200">
          fees fill one pool, the champion&apos;s believers split it.
        </span>
      </p>

      {/* Belief markets switch — mirrors /coins on the site */}
      <div
        role="tablist"
        aria-label="Belief markets"
        className="mt-3 flex shrink-0 gap-1 rounded-full bg-white/5 p-1 ring-1 ring-white/10"
      >
        {(
          [
            { id: "champion", label: "Champion" },
            { id: "top-scorer", label: "Top Scorer", soon: true },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={market === t.id}
            onClick={() => setMarket(t.id)}
            className={`font-cond flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors ${
              market === t.id ? "bg-emerald-400 text-zinc-950" : "text-zinc-300"
            }`}
          >
            {t.label}
            {"soon" in t && t.soon && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold ${
                  market === t.id
                    ? "bg-zinc-950/20 text-zinc-900"
                    : "bg-amber-400/90 text-amber-950"
                }`}
              >
                Soon
              </span>
            )}
          </button>
        ))}
      </div>

      {market === "top-scorer" ? (
        /* Market 2 — teaser only: no coins, no reward mechanics invented. */
        <div className="mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain pb-6">
          <div className="rounded-xl bg-white/5 px-4 py-6 text-center ring-1 ring-white/10">
            <span className="font-cond inline-block rounded-full bg-amber-400/90 px-2.5 py-1 text-[10px] font-bold tracking-wide text-amber-950 uppercase">
              Coming soon
            </span>
            <h2 className="font-serif mt-3 text-lg leading-tight uppercase tracking-tight">
              Top Scorer market
            </h2>
            <p className="font-cond mt-2 text-sm leading-snug text-zinc-400">
              A second belief market. Every coin is one belief:{" "}
              <span className="font-semibold text-white">
                this player ends the World Cup as top scorer
              </span>{" "}
              — repricing with every goal.
            </p>
            {inMini ? (
              <button
                type="button"
                onClick={() => sdk.actions.addMiniApp().catch(() => {})}
                className="font-cond mt-4 rounded-full bg-emerald-400 px-5 py-2 text-xs font-bold tracking-wide text-zinc-950 uppercase transition-colors hover:bg-emerald-300"
              >
                + Add Sponsio to catch the launch
              </button>
            ) : (
              <a
                href="https://x.com/sponsio_world"
                target="_blank"
                rel="noopener noreferrer"
                className="font-cond mt-4 inline-block rounded-full bg-emerald-400 px-5 py-2 text-xs font-bold tracking-wide text-zinc-950 uppercase transition-colors hover:bg-emerald-300"
              >
                Follow for the launch
              </a>
            )}
          </div>
          {/* Skeleton hint of the player list to come — decorative only */}
          <div aria-hidden className="mt-2 space-y-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-3 py-2.5 ring-1 ring-white/5"
                style={{ opacity: 1 - i * 0.3 }}
              >
                <div className="h-6 w-6 rounded-full bg-white/10" />
                <div className="flex-1 space-y-1">
                  <div className="h-2.5 w-28 rounded bg-white/10" />
                  <div className="h-2 w-12 rounded bg-white/5" />
                </div>
                <div className="h-6 w-14 rounded-lg bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Market pulse: countdown until first kickoff, live count after */}
          <div className="font-cond mt-2 flex shrink-0 items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold tracking-wide text-zinc-300 uppercase ring-1 ring-white/10">
            {anyLive || (now !== null && now >= openerTs) ? (
              <>
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {liveCount} of {coins.length} coins live — coins launch at
                kickoff
              </>
            ) : (
              <>
                <span className="text-zinc-400">First coins in</span>
                <span className="ml-auto font-mono text-emerald-300 normal-case">
                  {now === null ? "—" : countdown(openerTs, now)}
                </span>
              </>
            )}
          </div>

          {/* Coin list — every team's belief, in launch order. min-h-0 is
              what makes this panel actually scroll inside the locked body
              (FC mobile webview included). */}
          <div className="mt-2 min-h-0 flex-1 space-y-1.5 overflow-y-auto overscroll-contain pb-6">
            {coins.map((c) => {
              const live = c.address !== ZERO;
              return (
                <div
                  key={c.code}
                  className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5 ring-1 ring-white/10"
                >
                  <span className="text-xl leading-none">{c.flag}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-cond truncate text-sm font-semibold text-white uppercase">
                      {c.name}
                    </div>
                    <div className="font-mono text-[10px] text-zinc-500">
                      ${c.ticker}
                      {!live && (
                        <span className="text-zinc-600">
                          {" "}
                          · kickoff <LocalTime iso={c.launch} mode="date" />
                        </span>
                      )}
                    </div>
                  </div>
                  {inMini && (
                    <button
                      type="button"
                      onClick={() => onShare(c)}
                      aria-label={`Cast your belief in ${c.name}`}
                      className="font-cond rounded-lg px-2 py-1.5 text-xs font-semibold tracking-wide text-zinc-400 uppercase transition-colors hover:text-white"
                    >
                      Cast
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onTrade(c)}
                    disabled={!live}
                    className={
                      live
                        ? "font-cond rounded-lg bg-emerald-400 px-3 py-1.5 text-xs font-bold tracking-wide text-zinc-950 uppercase transition-colors hover:bg-emerald-300"
                        : "font-cond cursor-not-allowed rounded-lg bg-white/5 px-3 py-1.5 text-xs font-bold tracking-wide text-zinc-600 uppercase ring-1 ring-white/10 select-none"
                    }
                  >
                    {live ? "Trade" : "Soon"}
                  </button>
                </div>
              );
            })}
            <a
              href="https://sponsio.world/rewards"
              target="_blank"
              rel="noopener noreferrer"
              className="font-cond block pt-1 pb-2 text-center text-xs font-semibold tracking-wide text-zinc-400 uppercase transition-colors hover:text-emerald-300"
            >
              How the pool is split →
            </a>
          </div>
        </>
      )}
    </main>
  );
}
