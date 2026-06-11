"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { AssetIcon } from "../asset-icon";
import { TopUpButton } from "../top-up";
import { TradeButton } from "../trade-button";
import { useCoinBalances } from "@/lib/use-coin-balances";
import { WEB3_ENABLED } from "@/lib/web3-config";

const CARD =
  "rounded-2xl bg-zinc-950/80 ring-1 ring-white/10 shadow-lg shadow-black/40";

const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;
const emptySubscribe = () => () => {};

/** Dev-only design preview (`/profile?preview=1`): renders the logged-in
 *  layout with mock data so the design is reviewable without a session.
 *  Compiled out of production builds. */
function usePreview() {
  return useSyncExternalStore(
    emptySubscribe,
    () =>
      process.env.NODE_ENV === "development" &&
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("preview"),
    () => false,
  );
}

export function ProfileClient() {
  const preview = usePreview();
  if (preview) return <ProfileView {...MOCK} />;
  if (!WEB3_ENABLED) {
    return (
      <div className={`${CARD} mx-auto max-w-xl px-6 py-6`}>
        <p className="font-cond text-base font-semibold text-white uppercase">
          Login isn&apos;t configured on this build yet
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-zinc-400">
          Set{" "}
          <span className="font-mono text-zinc-200">
            NEXT_PUBLIC_PRIVY_APP_ID
          </span>{" "}
          in <span className="font-mono text-zinc-200">.env.local</span> and
          restart the dev server.
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

  if (!ready) {
    return (
      <div className={`${CARD} mx-auto max-w-xl animate-pulse px-6 py-6`}>
        <div className="h-4 w-40 rounded bg-white/10" />
        <div className="mt-3 h-3 w-64 rounded bg-white/5" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className={`${CARD} mx-auto max-w-xl px-6 py-8 text-center`}>
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

  // Identity from the linked login, best-first: Farcaster → X → Google → email.
  const name =
    user?.farcaster?.username ??
    user?.twitter?.username ??
    user?.google?.name ??
    user?.email?.address?.split("@")[0] ??
    "believer";
  const pfp = user?.farcaster?.pfp ?? user?.twitter?.profilePictureUrl ?? null;
  const isEmbedded = user?.wallet?.walletClientType === "privy";

  return (
    <ProfileView
      name={name}
      pfp={pfp}
      address={address ?? null}
      ethFormatted={ethFormatted}
      ethIsZero={ethIsZero}
      usdcFormatted={usdcFormatted}
      held={held}
      isLoading={isLoading}
      isEmbedded={isEmbedded}
      onLogout={logout}
      onExport={exportWallet}
    />
  );
}

type Holding = {
  code: string;
  name: string;
  flag: string;
  ticker: string;
  address: string;
  formatted: string;
};

function ProfileView({
  name,
  pfp,
  address,
  ethFormatted,
  ethIsZero,
  usdcFormatted,
  held,
  isLoading,
  isEmbedded,
  onLogout,
  onExport,
}: {
  name: string;
  pfp: string | null;
  address: string | null;
  ethFormatted: string | null;
  ethIsZero: boolean;
  usdcFormatted: string;
  held: Holding[];
  isLoading: boolean;
  isEmbedded: boolean;
  onLogout: () => void;
  onExport: () => void;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="mx-auto max-w-xl space-y-4">
      {/* Identity — the user is the page title */}
      <div className="relative pt-2 text-center">
        <button
          type="button"
          onClick={onLogout}
          title="Log out"
          aria-label="Log out"
          className="absolute top-2 right-0 rounded-full bg-white/10 p-2 text-zinc-400 transition-colors hover:bg-white/15 hover:text-white"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
        </button>
        {pfp ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pfp}
            alt=""
            className="mx-auto h-20 w-20 rounded-full object-cover ring-2 ring-emerald-400/70"
          />
        ) : (
          <div className="font-serif mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/15 text-3xl text-emerald-300 uppercase ring-2 ring-emerald-400/70">
            {name.slice(0, 1)}
          </div>
        )}
        <h1 className="font-cond mt-3 text-xl font-semibold text-white">
          {name}
        </h1>
        {address && (
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(address);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="font-mono mt-1 text-xs text-zinc-500 transition-colors hover:text-emerald-300"
            title="Copy address"
          >
            {short(address)} {copied ? "✓" : "⧉"}
          </button>
        )}
      </div>

      {/* Wallet — one hero number, one primary action */}
      <div className={`${CARD} px-6 py-5`}>
        <div className="flex items-center justify-between">
          <span className="font-cond text-[11px] font-semibold tracking-[0.2em] text-zinc-400 uppercase">
            Wallet
          </span>
          {address && (
            <a
              href={`https://basescan.org/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-cond text-[11px] font-semibold tracking-wide text-zinc-500 uppercase transition-colors hover:text-emerald-300"
            >
              History ↗
            </a>
          )}
        </div>
        <p className="mt-2 flex items-center gap-3">
          <AssetIcon asset="eth" size={34} />
          <span className="font-serif text-5xl tracking-tight text-white">
            {ethFormatted ? Number(ethFormatted).toFixed(4) : "0.0000"}
          </span>
          <span className="font-cond self-end pb-1 text-sm font-semibold tracking-[0.15em] text-zinc-500 uppercase">
            ETH
          </span>
        </p>
        <p className="font-mono mt-2.5 flex items-center gap-2 text-sm text-zinc-400">
          <AssetIcon asset="usdc" size={16} />
          {Number(usdcFormatted).toFixed(2)} USDC
        </p>
        <div className="mt-4 flex gap-2">
          {address && <TopUpButtonBig address={address} primary={ethIsZero} />}
          {isEmbedded && (
            <button
              type="button"
              onClick={onExport}
              className="font-cond h-11 flex-1 rounded-full bg-white/10 text-sm font-semibold tracking-wide text-zinc-300 uppercase transition-colors hover:bg-white/15 hover:text-white"
            >
              Export wallet
            </button>
          )}
        </div>
        <p className="font-cond mt-3 text-center text-[10px] font-semibold tracking-[0.15em] text-zinc-600 uppercase">
          Non-custodial — Sponsio never holds your funds
        </p>
      </div>

      {/* Beliefs */}
      <div className={`${CARD} overflow-hidden`}>
        <div className="font-cond border-b border-white/10 px-6 py-3 text-[11px] font-semibold tracking-[0.2em] text-zinc-400 uppercase">
          Beliefs you hold
        </div>
        {isLoading ? (
          <div className="animate-pulse px-6 py-5">
            <div className="h-3 w-48 rounded bg-white/10" />
          </div>
        ) : held.length === 0 ? (
          <div className="px-6 py-7 text-center">
            <p className="text-[15px] leading-relaxed text-zinc-400">
              No beliefs held yet — pick a team and back it through its match
              days.
            </p>
            <Link
              href="/coins"
              className="font-cond mt-4 inline-block rounded-full bg-emerald-400 px-6 py-2.5 text-sm font-bold tracking-wide text-zinc-950 uppercase transition-colors hover:bg-emerald-300"
            >
              See the markets
            </Link>
          </div>
        ) : (
          held.map((b) => (
            <div
              key={b.code}
              className="flex items-center gap-3 border-b border-white/5 px-6 py-3.5 last:border-0"
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

/** Full-width wallet-card variant of the Top up entry. */
function TopUpButtonBig({
  address,
  primary,
}: {
  address: string;
  primary: boolean;
}) {
  return (
    <span className={`flex-1 ${primary ? "" : ""} [&>button]:h-11 [&>button]:w-full [&>button]:rounded-full [&>button]:text-sm`}>
      <TopUpButton address={address} emphasized />
    </span>
  );
}

// Mock data for the dev-only design preview (`?preview=1`).
const MOCK = {
  name: "nickvasilich",
  pfp: null,
  address: "0x2dfb000000000000000000000000000000006a4d",
  ethFormatted: "0.0421",
  ethIsZero: false,
  usdcFormatted: "125.00",
  held: [
    {
      code: "MEX",
      name: "Mexico",
      flag: "🇲🇽",
      ticker: "MEX",
      address: "0x2dfb000000000000000000000000000000006a4d",
      formatted: "12400",
    },
    {
      code: "ARG",
      name: "Argentina",
      flag: "🇦🇷",
      ticker: "ARG",
      address: "0x2dfb000000000000000000000000000000006a4d",
      formatted: "8100",
    },
  ],
  isLoading: false,
  isEmbedded: true,
  onLogout: () => {},
  onExport: () => {},
} satisfies Parameters<typeof ProfileView>[0];
