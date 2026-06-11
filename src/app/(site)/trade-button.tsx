"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { getQuote, type Side } from "@/lib/swap";
import { TopUpButton } from "./top-up";
import { useCoinBalances } from "@/lib/use-coin-balances";
import { uniswapUrl, WEB3_ENABLED } from "@/lib/web3-config";

type Coin = { name: string; flag: string; ticker: string; address: string };

/** In-app trade entry: the emerald row button opens a slide-over swap
 *  panel (buy/sell ETH↔coin, balances, quote seam). When Privy isn't
 *  configured, falls back to the original Uniswap link so the public
 *  site behaves exactly as before. */
export function TradeButton({ coin, code }: { coin: Coin; code: string }) {
  const [open, setOpen] = useState(false);

  if (!WEB3_ENABLED) {
    return (
      <a
        href={uniswapUrl(coin.address)}
        target="_blank"
        rel="noopener noreferrer"
        className="font-cond inline-block rounded-lg bg-emerald-400 px-5 py-2 text-sm font-bold text-zinc-950 uppercase transition-colors hover:bg-emerald-300"
      >
        Trade
      </a>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-cond inline-block rounded-lg bg-emerald-400 px-5 py-2 text-sm font-bold text-zinc-950 uppercase transition-colors hover:bg-emerald-300"
      >
        Trade
      </button>
      {open && <SwapPanel coin={coin} code={code} onClose={() => setOpen(false)} />}
    </>
  );
}

function SwapPanel({
  coin,
  code,
  onClose,
}: {
  coin: Coin;
  code: string;
  onClose: () => void;
}) {
  const { authenticated, login } = usePrivy();
  const { address } = useAccount();
  const { ethFormatted, ethIsZero, usdcFormatted, balances } =
    useCoinBalances(address);
  const [side, setSide] = useState<Side>("buy");
  const [amount, setAmount] = useState("");

  const held = balances.find((b) => b.code === code);
  const quote = getQuote({ code, address: coin.address, side, amount });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Portal: escape backdrop-blur ancestors (they trap `fixed` children).
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close trade panel"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Trade ${coin.name}`}
        className="relative w-full max-w-md rounded-t-2xl bg-zinc-950/95 px-5 pt-5 pb-6 ring-1 ring-white/15 backdrop-blur-xl sm:rounded-2xl"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl leading-none">{coin.flag}</span>
          <div className="min-w-0 flex-1">
            <div className="font-cond truncate font-semibold text-white uppercase">
              {coin.name}
            </div>
            <div className="font-mono text-[11px] text-zinc-500">
              ${coin.ticker}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="font-mono rounded-full bg-white/10 px-2.5 py-1 text-sm text-zinc-300 transition-colors hover:bg-white/15 hover:text-white"
          >
            ×
          </button>
        </div>

        {/* Buy / Sell toggle */}
        <div className="mt-4 flex gap-1 rounded-full bg-white/5 p-1 ring-1 ring-white/10">
          {(["buy", "sell"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSide(s)}
              className={`font-cond flex-1 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors ${
                side === s ? "bg-emerald-400 text-zinc-950" : "text-zinc-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 ring-1 ring-white/10">
          <input
            inputMode="decimal"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            className="font-mono w-full bg-transparent text-lg text-white outline-none placeholder:text-zinc-600"
            aria-label={side === "buy" ? "Amount in ETH" : `Amount in ${coin.ticker}`}
          />
          <span className="font-mono shrink-0 text-sm text-zinc-400">
            {side === "buy" ? "ETH" : `$${coin.ticker}`}
          </span>
        </div>

        {/* Balances — Top up is emphasized exactly when the wallet is empty */}
        <div className="font-mono mt-2 flex items-center gap-2 text-[11px] text-zinc-500">
          <span className="min-w-0 truncate">
            You hold: {held ? Number(held.formatted).toLocaleString() : "0"} $
            {coin.ticker}
            {ethFormatted && <> · Ξ{Number(ethFormatted).toFixed(4)}</>}
            {Number(usdcFormatted) > 0 && (
              <> · ${Number(usdcFormatted).toFixed(2)} USDC</>
            )}
          </span>
          {authenticated && address && (
            <span className="ml-auto">
              <TopUpButton address={address} emphasized={ethIsZero} />
            </span>
          )}
        </div>

        {/* Quote / status */}
        <div className="font-cond mt-3 rounded-xl bg-white/5 px-3 py-2.5 text-sm text-zinc-300 ring-1 ring-white/10">
          {quote.status === "not_launched" &&
            "This coin launches at its team's first kickoff."}
          {quote.status === "pool_pending" &&
            "Trading opens here once the pool parameters land (post-kickoff canary). Until then, the Uniswap link below works the moment the coin is live."}
          {quote.status === "no_amount" && "Enter an amount to see a quote."}
          {quote.status === "ok" && `≈ ${quote.amountOutFormatted}`}
        </div>

        {/* CTA */}
        {!authenticated ? (
          <button
            type="button"
            onClick={login}
            className="font-cond mt-4 h-12 w-full rounded-full bg-emerald-400 text-base font-bold tracking-wide text-zinc-950 uppercase transition-colors hover:bg-emerald-300"
          >
            Log in to trade
          </button>
        ) : (
          <button
            type="button"
            disabled={quote.status !== "ok"}
            className="font-cond mt-4 h-12 w-full rounded-full bg-emerald-400 text-base font-bold tracking-wide text-zinc-950 uppercase transition-colors hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-zinc-600 disabled:ring-1 disabled:ring-white/10"
          >
            Confirm trade
          </button>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="font-cond text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
            No app fees — the coin&apos;s fee fills the Reward Pool
          </span>
          <a
            href={uniswapUrl(coin.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-cond shrink-0 text-[11px] font-semibold tracking-wide text-zinc-400 uppercase transition-colors hover:text-emerald-300"
          >
            Uniswap ↗
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}
