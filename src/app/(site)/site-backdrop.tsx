/** Site background — clean modern dark (design-language canvas).
 *  Near-black #0a0a0b base with a barely-there top-down sheen so layered
 *  panels still read as surfaces. Static, motion-free, every route. */
export function SiteBackdrop() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 -z-10 bg-[#0a0a0b] bg-gradient-to-b from-white/[0.015] via-transparent to-black/30"
    />
  );
}
