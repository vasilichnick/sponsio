"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { QRCodeSVG } from "qrcode.react";

/** Top up modal — the no-dead-end funding surface.
 *  Tab 1 (Deposit): address + QR, "ETH or USDC on Base only" — works with
 *  zero third-party setup, the Euphoria deposit pattern.
 *  Tab 2 (Buy with card): opens Privy's fiat on-ramp sheet; until funding
 *  methods are enabled in the Privy dashboard it says so honestly instead
 *  of silently doing nothing. */
export function TopUpButton({
  address,
  emphasized,
}: {
  address: string;
  emphasized?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          emphasized
            ? "font-cond shrink-0 rounded-full bg-emerald-400 px-4 py-1.5 text-xs font-bold tracking-wide text-zinc-950 uppercase transition-colors hover:bg-emerald-300"
            : "font-cond shrink-0 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-zinc-300 uppercase transition-colors hover:bg-white/15 hover:text-white"
        }
      >
        Top up
      </button>
      {open && <TopUpModal address={address} onClose={() => setOpen(false)} />}
    </>
  );
}

function TopUpModal({
  address,
  onClose,
}: {
  address: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Portal: fixed-position dialogs must escape backdrop-blur ancestors
  // (backdrop-filter creates a containing block that traps `fixed`).
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close top up"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Top up your wallet"
        className="relative w-full max-w-md rounded-t-2xl bg-zinc-950/95 px-5 pt-5 pb-6 ring-1 ring-white/15 backdrop-blur-xl sm:rounded-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-cond text-lg font-semibold text-white uppercase tracking-tight">
            Top up
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="font-mono rounded-full bg-white/10 px-2.5 py-1 text-sm text-zinc-300 transition-colors hover:bg-white/15 hover:text-white"
          >
            ×
          </button>
        </div>

        {/* Tabs — card on-ramp not integrated yet: visibly disabled */}
        <div className="mt-3 flex gap-1 rounded-full bg-white/5 p-1 ring-1 ring-white/10">
          <button
            type="button"
            className="font-cond flex-1 rounded-full bg-emerald-400 px-3 py-1.5 text-xs font-semibold tracking-wide text-zinc-950 uppercase"
          >
            Deposit
          </button>
          <button
            type="button"
            disabled
            className="font-cond flex-1 cursor-not-allowed rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide text-zinc-600 uppercase"
          >
            Buy with card · soon
          </button>
        </div>

        <div className="mt-4">
            <div className="mx-auto w-fit rounded-xl bg-white p-3">
              <QRCodeSVG value={address} size={148} marginSize={0} />
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(address);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="font-mono mt-3 block w-full truncate rounded-xl bg-white/5 px-3 py-2.5 text-center text-xs text-white ring-1 ring-white/10 transition-colors hover:bg-white/10"
              title="Copy address"
            >
              {address} {copied ? "✓" : ""}
            </button>
            <p className="font-cond mt-3 rounded-xl bg-amber-400/10 px-3 py-2 text-center text-xs font-semibold text-amber-300 ring-1 ring-amber-400/20 uppercase tracking-wide">
              Send ETH or USDC on Base only
            </p>
            <p className="mt-3 text-center text-xs leading-relaxed text-zinc-500">
              From an exchange: withdraw to this address and choose the{" "}
              <span className="text-zinc-300">Base</span> network. From
              another wallet: a normal send on Base.
            </p>
          </div>
      </div>
    </div>,
    document.body,
  );
}
