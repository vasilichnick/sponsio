"use client";

import { useState } from "react";

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" aria-hidden>
      <rect x="9" y="9" width="11" height="11" rx="2.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M5 15V5a2 2 0 0 1 2-2h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" aria-hidden>
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** A coin's contract address — truncated, click-to-copy. Copies the FULL
 *  address; shows a brief "Copied" confirmation. Mono per BRANDING. */
export function CopyAddress({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  const short = `${address.slice(0, 6)}…${address.slice(-4)}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Contract address copied" : `Copy contract address ${address}`}
      className={`font-mono inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] tracking-wide ring-1 transition-colors ${
        copied
          ? "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30"
          : "bg-white/5 text-zinc-400 ring-white/10 hover:bg-white/10 hover:text-zinc-200"
      }`}
    >
      {copied ? (
        <>
          <CheckIcon />
          Copied
        </>
      ) : (
        <>
          {short}
          <CopyIcon />
        </>
      )}
    </button>
  );
}
