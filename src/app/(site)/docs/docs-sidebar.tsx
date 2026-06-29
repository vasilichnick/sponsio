"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DOCS_SECTIONS } from "@/data/docs";

/** The docs link tree — sections (Part I / Part II) with their pages. Renders
 *  twice via CSS: a collapsible top bar on mobile, a fixed left rail on desktop.
 *  Both are emitted as siblings so the layout's flex (col → row) places them. */

function Tree({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-7">
      {DOCS_SECTIONS.map((section) => (
        <div key={section.title}>
          <div className="mb-2.5 flex items-center gap-2">
            <span className="font-cond text-[11px] font-semibold tracking-[0.2em] text-zinc-500 uppercase">
              {section.title}
            </span>
            {section.comingSoon && (
              <span className="rounded-full border border-white/10 px-1.5 py-0.5 text-[8px] font-bold tracking-[0.15em] text-zinc-600 uppercase">
                soon
              </span>
            )}
          </div>
          {section.comingSoon ? (
            <p className="font-cond pl-3 text-[13px] text-zinc-600">Coming soon</p>
          ) : (
            <ul className="flex flex-col gap-0.5">
              {section.pages.map((p) => {
                const active = pathname === `/docs/${p.slug}`;
                return (
                  <li key={p.slug}>
                    <Link
                      href={`/docs/${p.slug}`}
                      onClick={onNavigate}
                      className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                        active
                          ? "bg-emerald-400/10 font-semibold text-emerald-300"
                          : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      {p.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
    </nav>
  );
}

export function DocsSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile: collapsible top bar (clears the fixed header) */}
      <div className="shrink-0 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="font-cond flex w-full items-center justify-between border-b border-white/10 px-5 pb-3 text-[12px] font-semibold tracking-[0.2em] text-zinc-300 uppercase [padding-top:max(4.5rem,calc(env(safe-area-inset-top)+4rem))]"
        >
          Documentation
          <span aria-hidden className="text-lg leading-none text-zinc-500">
            {open ? "−" : "+"}
          </span>
        </button>
        {open && (
          <div className="border-b border-white/10 px-5 py-6">
            <Tree pathname={pathname} onNavigate={() => setOpen(false)} />
          </div>
        )}
      </div>

      {/* Desktop: fixed left rail */}
      <aside className="hidden h-full w-60 shrink-0 overflow-y-auto border-r border-white/10 px-5 pb-12 lg:block lg:[padding-top:5rem]">
        <Tree pathname={pathname} />
      </aside>
    </>
  );
}
