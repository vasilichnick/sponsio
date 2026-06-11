"use client";

import Link from "next/link";
import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { TopUpButton } from "../top-up";
import { TradeButton } from "../trade-button";
import { useCoinBalances } from "@/lib/use-coin-balances";
import { WEB3_ENABLED } from "@/lib/web3-config";

const PANEL =
  "mx-auto max-w-2xl rounded-2xl bg-zinc-950/75 px-6 py-6 shadow-lg shadow-black/40 ring-1 ring-white/10 backdrop-blur-md";

const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

export function ProfileClient() {
  if (!WEB3_ENABLED) {
    return (
      <div className={PANEL}>
        <p className="font-cond text-base font-semibold text-white uppercase">
          Login isn&apos;t configured on this build yet
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-zinc-400">
          Set <span className="font-mono text-zinc-200">NEXT_PUBLIC_PRIVY_APP_ID</span>{" "}
          in <span className="font-mono text-zinc-200">.env.local</span> (two
          minutes on dashboard.privy.io — steps in BACKLOG.md) and restart the
          dev server. The site works without it; trading stays on Uniswap
          links until then.
        </p>
      </div>
    );
  }
  return <ProfileInner />;
}

function ProfileInner() {
  const { ready, authenticated, login, logout, exportWallet, user } =
    usePrivy();
  const { address } = useAccount();
  const { ethFormatted, ethIsZero, usdcFormatted, held, isLoading } =
    useCoinBalances(address);
  const [copied, setCopied] = useState(false);

  if (!ready) {
    return (
      <div className={`${PANEL} animate-pulse`}>
        <div className="h-4 w-40 rounded bg-white/10" />
        <div className="mt-3 h-3 w-64 rounded bg-white/5" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className={`${PANEL} text-center`}>
        <p className="font-cond text-lg font-semibold text-white uppercase">
          Log in to see the beliefs you hold
        </p>
        <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-zinc-400">
          Email, Google, X, Farcaster, or passkey — a wallet is created for
          you on the spot. Already have one? Connect it instead.
        </p>
        <button
          type="button"
          onClick={login}
          className="font-cond mt-5 h-12 rounded-full bg-emerald-400 px-8 text-base font-bold tracking-wide text-zinc-950 uppercase transition-colors hover:bg-emerald-300"
        >
          Log in
        </button>
      </div>
    );
  }

  const isEmbedded = user?.wallet?.walletClientType === "privy";

  return (
    <div className="space-y-4">
      {/* Account card */}
      <div className={PANEL}>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="pulse-dot h-2 w-2 rounded-full bg-emerald-400" />
          <button
            type="button"
            onClick={() => {
              if (address) {
                navigator.clipboard?.writeText(address);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }
            }}
            className="font-mono text-sm text-white transition-colors hover:text-emerald-300"
            title="Copy address"
          >
            {address ? short(address) : "—"} {copied ? "✓" : ""}
          </button>
          {ethFormatted && (
            <span className="font-mono text-sm text-zinc-300">
              Ξ{Number(ethFormatted).toFixed(4)}
              {Number(usdcFormatted) > 0 && (
                <span className="text-zinc-500">
                  {" "}
                  · ${Number(usdcFormatted).toFixed(2)}
                </span>
              )}
            </span>
          )}
          <span className="ml-auto flex gap-2">
            {address && (
              <TopUpButton address={address} emphasized={ethIsZero} />
            )}
            {isEmbedded && (
              <button
                type="button"
                onClick={exportWallet}
                className="font-cond rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-white/15"
              >
                Export wallet
              </button>
            )}
            <button
              type="button"
              onClick={logout}
              className="font-cond rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-zinc-300 uppercase transition-colors hover:bg-white/15 hover:text-white"
            >
              Log out
            </button>
          </span>
        </div>
        <p className="font-cond mt-3 text-[11px] font-semibold tracking-[0.15em] text-zinc-500 uppercase">
          Non-custodial — Sponsio never holds your funds
        </p>
      </div>

      {/* Holdings */}
      <div className={`${PANEL} px-0 py-0 overflow-hidden`}>
        <div className="font-cond border-b border-white/10 px-6 py-3 text-[11px] font-semibold tracking-[0.15em] text-zinc-400 uppercase">
          Beliefs you hold
        </div>
        {isLoading ? (
          <div className="animate-pulse px-6 py-5">
            <div className="h-3 w-48 rounded bg-white/10" />
          </div>
        ) : held.length === 0 ? (
          <div className="px-6 py-6 text-center">
            <p className="text-[15px] leading-relaxed text-zinc-400">
              No beliefs held yet.
            </p>
            <Link
              href="/coins"
              className="font-cond mt-3 inline-block rounded-full bg-emerald-400 px-6 py-2 text-sm font-bold tracking-wide text-zinc-950 uppercase transition-colors hover:bg-emerald-300"
            >
              See the markets
            </Link>
          </div>
        ) : (
          held.map((b) => (
            <div
              key={b.code}
              className="flex items-center gap-3 border-b border-white/5 px-6 py-3 last:border-0"
            >
              <span className="text-2xl leading-none">{b.flag}</span>
              <div className="min-w-0 flex-1">
                <div className="font-cond truncate font-semibold text-white uppercase">
                  {b.name}
                </div>
                <div className="font-mono text-[11px] text-zinc-500">
                  ${b.ticker}
                </div>
              </div>
              <span className="font-mono text-sm text-zinc-200">
                {Number(b.formatted).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </span>
              <TradeButton
                coin={{
                  name: b.name,
                  flag: b.flag,
                  ticker: b.ticker,
                  address: b.address,
                }}
                code={b.code}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
