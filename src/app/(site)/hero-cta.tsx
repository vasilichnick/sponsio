"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { WEB3_ENABLED } from "@/lib/web3-config";

const PILL =
  "font-cond mt-1 flex h-12 items-center rounded-full bg-emerald-400 px-8 text-base font-bold uppercase tracking-wide text-zinc-950 shadow-lg shadow-black/40 transition-[background-color,transform] hover:scale-[1.04] hover:bg-emerald-300 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:scale-100 disabled:opacity-70";

/** The hero's single emerald action, Euphoria-style:
 *  logged out → LOG IN (Privy modal; on success you land in the markets);
 *  logged in  → TRADE BELIEF (straight to the app);
 *  Privy unconfigured → original Trade belief link (prod-safe fallback). */
export function HeroCta() {
  if (!WEB3_ENABLED) {
    return (
      <Link href="/coins" className={PILL}>
        Trade belief
      </Link>
    );
  }
  return <HeroCtaInner />;
}

function HeroCtaInner() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const { login } = useLogin({
    onComplete: () => router.push("/coins"),
  });

  if (ready && authenticated) {
    return (
      <Link href="/coins" className={PILL}>
        Trade belief
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => login()}
      disabled={!ready}
      className={PILL}
    >
      Log in
    </button>
  );
}
