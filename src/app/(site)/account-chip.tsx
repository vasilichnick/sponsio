"use client";

import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { formatEther } from "viem";
import { useAccount, useBalance } from "wagmi";
import { WEB3_ENABLED } from "@/lib/web3-config";

const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

/** Header login/account pill. Hooks live in the inner component so they
 *  only run when the Privy provider is actually mounted (WEB3_ENABLED). */
export function AccountChip() {
  if (!WEB3_ENABLED) return null; // pre-setup: header looks exactly as before
  return <ChipInner />;
}

function ChipInner() {
  const { ready, authenticated, login } = usePrivy();
  const { address } = useAccount();
  const eth = useBalance({ address, query: { enabled: !!address } });

  if (!ready) {
    return (
      <span className="h-[42px] w-24 animate-pulse rounded-full bg-white/10 backdrop-blur" />
    );
  }

  if (!authenticated) {
    return (
      <button
        type="button"
        onClick={login}
        className="font-cond flex h-[42px] items-center rounded-full bg-emerald-400 px-5 text-sm font-bold tracking-wide text-zinc-950 uppercase transition-colors hover:bg-emerald-300"
      >
        Log in
      </button>
    );
  }

  return (
    <Link
      href="/profile"
      className="flex h-[42px] items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/5"
    >
      <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
      <span className="font-mono text-xs">
        {address ? short(address) : "account"}
      </span>
      {eth.data && (
        <span className="font-mono text-xs text-zinc-300">
          Ξ{Number(formatEther(eth.data.value)).toFixed(3)}
        </span>
      )}
    </Link>
  );
}
