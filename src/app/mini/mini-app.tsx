"use client";

import { useEffect, useMemo, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { useNowSec } from "../use-now";

const ZERO = "0x0000000000000000000000000000000000000000";
// Base mainnet, CAIP-19 native-token id used by sdk.actions.swapToken.
const BASE_ETH = "eip155:8453/native";
const uniswap = (a: string) =>
  `https://app.uniswap.org/swap?chain=base&outputCurrency=${a}`;
const pad = (n: number) => String(n).padStart(2, "0");

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
  return `${Math.floor(d / 86400)}d ${pad(Math.floor((d % 86400) / 3600))}h ${pad(Math.floor((d % 3600) / 60))}m ${pad(d % 60)}s`;
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

  // Hide the Farcaster splash once mounted. Calling ready() is mandatory —
  // without it the user is stuck on an infinite splash (the #1 Mini App bug).
  // Outside a Farcaster host (plain browser visit) the SDK no-ops; we track
  // that so actions degrade to normal links.
  useEffect(() => {
    sdk.isInMiniApp().then(setInMini).catch(() => {});
    sdk.actions.ready().catch(() => {});
  }, []);

  const liveCount = useMemo(
    () => coins.filter((c) => c.address !== ZERO).length,
    [coins],
  );

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
    <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col bg-[#050505] px-4 pb-6 text-white">
      {/* Header */}
      <div className="flex items-center gap-2 pt-5 pb-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-mark.png" alt="" className="h-7 w-7 object-contain" />
        <span className="font-serif text-lg tracking-tight">SPONSIO</span>
        {inMini && (
          <button
            type="button"
            onClick={() => sdk.actions.addMiniApp().catch(() => {})}
            className="font-cond ml-auto rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-white/15"
          >
            + Add
          </button>
        )}
      </div>

      {/* Pitch */}
      <h1 className="font-serif text-[1.6rem] leading-[0.95] uppercase tracking-tight">
        Trade the teams you{" "}
        <span className="text-emerald-300">believe in</span>
      </h1>
      <p className="font-cond mt-2 text-sm leading-snug text-zinc-300">
        Every coin is one belief: this team becomes champion. The market prices
        it match by match — fees fill one pool, and the champion&apos;s
        believers split it.
      </p>

      {/* Live status / countdown */}
      <div className="font-cond mt-3 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold tracking-wide text-zinc-300 uppercase ring-1 ring-white/10">
        {now !== null && now >= openerTs ? (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" />
            {liveCount} of {coins.length} coins live
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

      {/* Coin list */}
      <div className="mt-3 flex-1 space-y-1.5 overflow-y-auto">
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
      </div>

      <a
        href="https://sponsio.world/rewards"
        target="_blank"
        rel="noopener noreferrer"
        className="font-cond mt-3 shrink-0 text-center text-xs font-semibold tracking-wide text-zinc-400 uppercase transition-colors hover:text-emerald-300"
      >
        How the pool is split →
      </a>
    </main>
  );
}
