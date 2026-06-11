"use client";

import Link from "next/link";
import { useState } from "react";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { WEB3_ENABLED } from "@/lib/web3-config";

const ITEMS = [
  { href: "/", label: "Home" },
  { href: "/coins", label: "Markets" },
  { href: "/rewards", label: "Reward Pool" },
  { href: "/manifesto", label: "Manifesto" },
];

export function Menu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="h-[42px] rounded-full bg-white px-5 text-sm font-semibold text-black transition-shadow hover:shadow-[0_0_40px_10px_rgba(255,255,255,0.6)]"
      >
        Menu
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <nav className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl bg-black/80 ring-1 ring-white/15 backdrop-blur-xl">
            {ITEMS.map((it) => (
              <Link
                key={it.label}
                href={it.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                {it.label}
              </Link>
            ))}
            {WEB3_ENABLED && <AuthItem close={() => setOpen(false)} />}
          </nav>
        </>
      )}
    </div>
  );
}

/** Auth-aware tail of the dropdown: Log in (logged out) or Your Beliefs
 *  (logged in). Separate component so Privy hooks only run when the
 *  provider is mounted. */
function AuthItem({ close }: { close: () => void }) {
  const { ready, authenticated } = usePrivy();
  const { login } = useLogin();

  if (!ready) return null;

  if (authenticated) {
    return (
      <Link
        href="/profile"
        onClick={close}
        className="block border-t border-white/10 px-4 py-2.5 text-sm font-medium text-emerald-300 transition-colors hover:bg-white/10"
      >
        Your Beliefs
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        close();
        login();
      }}
      className="block w-full border-t border-white/10 px-4 py-2.5 text-left text-sm font-medium text-emerald-300 transition-colors hover:bg-white/10"
    >
      Log in
    </button>
  );
}
