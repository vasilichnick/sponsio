"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { BgStrips } from "./bg-strips";

/** Is the active route a single coin page (/markets/champion/[code])?
 *  The coin pages are content-first: their data fills the locked viewport,
 *  so they drop the animated photo strips for a clean static backdrop. */
function isCoinPage(segments: string[]): boolean {
  return (
    segments[0] === "markets" &&
    segments[1] === "champion" &&
    segments.length >= 3
  );
}

/** The site background. Every route gets the drifting photo strips + the
 *  match-day darkening gradient EXCEPT the per-coin pages, which render a
 *  clean static #050505 backdrop so the coin's data is the page — no half
 *  the viewport spent on imagery (BRANDING › page base #050505). */
export function SiteBackdrop() {
  const segments = useSelectedLayoutSegments();
  if (isCoinPage(segments)) {
    // Static, motion-free backdrop: the page base with a barely-there
    // top-down sheen so panels still read as layered surfaces, no photos.
    return (
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[#050505] bg-gradient-to-b from-white/[0.02] via-transparent to-black/40"
      />
    );
  }
  return (
    <>
      <BgStrips />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/65 via-black/25 to-black/60" />
    </>
  );
}
