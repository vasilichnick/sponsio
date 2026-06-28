"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/** Site header — clean modern dark, built to the locked design language.
 *  Bar (h-16, hairline bottom border, blur): logo mark + "SPONSIO" left; live
 *  Reward Pool pill + minimal burger right. The burger opens a right-side
 *  drawer (fixed 400px / max 90vw — no fragile min() width) on every viewport:
 *  a Markets link and a Sign in button, over a dim+blur overlay. Closes on the
 *  ×, the overlay, Esc, or selecting the link. */
export function SiteHeader({ poolLabel }: { poolLabel: string | null }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-30 h-16 border-b border-white/10 bg-[#0a0a0b]/80 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-4 sm:px-6 md:px-10">
          <Link
            href="/"
            aria-label="Sponsio — home"
            className="flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.png" alt="" className="h-7 w-7 object-contain" />
            <span className="font-serif truncate text-base font-normal tracking-tight text-white uppercase sm:text-lg">
              Sponsio
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2.5">
            {/* Reward Pool pill → /rewards */}
            <Link
              href="/rewards"
              aria-label={poolLabel ? `Reward Pool: ${poolLabel}` : "Reward Pool"}
              className="flex h-9 items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] pr-3.5 pl-4 transition-colors hover:bg-white/[0.06]"
            >
              <span className="hidden text-[13px] font-medium whitespace-nowrap text-zinc-300 sm:inline">
                Reward Pool
              </span>
              {poolLabel && (
                <>
                  <span aria-hidden className="hidden h-3.5 w-px bg-white/15 sm:block" />
                  <span className="flex items-center gap-1.5 font-mono text-[13px] font-semibold whitespace-nowrap text-emerald-300">
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full bg-emerald-400 [box-shadow:0_0_6px_rgba(52,211,153,0.6)]"
                    />
                    {poolLabel}
                  </span>
                </>
              )}
            </Link>

            {/* Burger */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] transition-colors hover:bg-white/[0.07]"
            >
              <span aria-hidden className="flex w-[18px] flex-col gap-[5px]">
                <span className="h-0.5 w-full rounded-full bg-zinc-200" />
                <span className="h-0.5 w-full rounded-full bg-zinc-200" />
                <span className="h-0.5 w-full rounded-full bg-zinc-200" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Right-side drawer ── */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* Explicit transform to hide/show — NOT Tailwind's translate-x-*, which
          composes via CSS vars and silently fails on Safari (the closed panel
          stayed on-screen). A self-contained `transform` works on every browser. */}
      <aside
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-[400px] max-w-[90vw] flex-col border-l border-white/10 bg-[#15151a] shadow-2xl shadow-black/60 transition-transform duration-200 ease-out ${
          open ? "[transform:translateX(0)]" : "[transform:translateX(100%)]"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-6">
          <span className="font-cond text-[11px] font-semibold tracking-[0.25em] text-zinc-500 uppercase">
            Menu
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col px-6">
          {[
            { href: "/about", label: "About" },
            { href: "/", label: "Markets" },
            { href: "/coming-soon", label: "Leaderboard" },
            { href: "/coming-soon", label: "Docs" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-white/[0.06] py-5 font-sans text-2xl font-semibold tracking-tight text-white transition-colors hover:text-emerald-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Log in — intentionally inert for now (nothing happens on click) */}
        <div className="mt-auto border-t border-white/10 p-6">
          <button
            type="button"
            className="font-cond flex h-12 w-full items-center justify-center rounded-full bg-emerald-400 text-[15px] font-bold tracking-wide text-zinc-950 uppercase transition-colors hover:bg-emerald-300"
          >
            Log in
          </button>
        </div>
      </aside>
    </>
  );
}
