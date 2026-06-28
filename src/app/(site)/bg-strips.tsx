import { preload } from "react-dom";

/** Photo-strip background: two photo rows drifting horizontally.
 *  Pure CSS animation — never subject to autoplay policy, no play button,
 *  identical in every browser.
 *
 *  Each photo is its own small compositor layer (absolute item, shared
 *  keyframes, staggered negative delay) instead of one giant translated
 *  track. A 16-photo track overflows the GPU tile cache, so its
 *  once-per-loop teleport landed on evicted tiles — the per-row blink at
 *  different timestamps (one per cycle: 90s/110s). Here the loop wrap only
 *  ever relocates a single off-screen image, and the 50cqh entry buffer
 *  (~10s of drift) lets the browser re-raster and re-decode it long before
 *  it enters the viewport.
 *
 *  Ordering ↔ what loads first on screen:
 *  - Row 0 (drifts left) shows indices 1–7 at t=0 (1 at the right edge,
 *    7 at the left; phones see 1–3); index 0 enters ~10s in.
 *  - Row 1 (reverse) plays backward: indices 9–15 visible at t=0 (9 left,
 *    15 right; phones see 13–15); index 8 enters next.
 *  Keep the brightest fan shots in row 0's FIRST half and row 1's LAST
 *  half — that's the first paint on every viewport, and those images get
 *  preloaded with fetchPriority=high while the rest load low. */

const ROWS: string[][] = [
  [
    // First-paint window (0–7): bright fan shots.
    "/bg/trophy-kid.jpg",
    "/bg/sa-fan.jpg",
    "/bg/brazil-girls.jpg",
    "/bg/ghana-fans.jpg",
    "/bg/fener-march.jpg",
    "/bg/argentina-couch.jpg",
    "/bg/guinea-trio.jpg",
    "/bg/fans-duo.jpg",
    // Late window (8–15).
    "/bg/rio-beach.jpg",
    "/bg/wc-glass.jpg",
    "/bg/morocco-kit.jpg",
    "/bg/alahly-night.jpg",
    "/bg/rabat-stands.jpg",
    "/bg/street-match.jpg",
    "/bg/brazil-flagman.jpg",
    "/bg/mexico-sky.jpg",
  ],
  [
    // Late window (0–7) — this row plays backward.
    "/bg/world-flags.jpg",
    "/bg/ball-signing.jpg",
    "/bg/morocco-ball.jpg",
    "/bg/wc-balls.jpg",
    "/bg/argentina-ball.jpg",
    "/bg/trabzon-smoke.jpg",
    "/bg/rabat-lineup.jpg",
    "/bg/pennants-bar.jpg",
    // First-paint window (8–15): bright fan shots.
    "/bg/flamengo-flags.jpg",
    "/bg/venezuela-hat.jpg",
    "/bg/mexico-freestyle.jpg",
    "/bg/bra-por-flags.jpg",
    "/bg/wembley.jpg",
    "/bg/turkiye-flags.jpg",
    "/bg/messi-car.jpg",
    "/bg/galata-flares.jpg",
  ],
];

// Seconds per full cycle — keeps the previous px/s drift speed at 16 photos.
const DUR = [205, 250];

// Visible at t=0 (plus the next entrant): row 0 front half, row 1 back half.
const firstPaint = (row: number, i: number) =>
  row === 0 ? i <= 7 : i >= 8;

export function BgStrips() {
  ROWS.forEach((row, r) =>
    row.forEach((src, i) => {
      if (firstPaint(r, i)) {
        preload(src, { as: "image", fetchPriority: "high" });
      }
    }),
  );
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {ROWS.map((row, r) => (
        <div
          key={r}
          className="relative h-1/2 overflow-hidden [container-type:size]"
          style={
            {
              "--len": `calc(${row.length} * 200cqh / 3)`,
            } as React.CSSProperties
          }
        >
          {/* Photos are 800×1200 (2:3), so each slot is 2/3 row height wide.
              The extra 1px (object-cover absorbs it) overlaps neighbours and
              prevents sub-pixel hairline seams between layers. */}
          {row.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt=""
              decoding="async"
              fetchPriority={firstPaint(r, i) ? "high" : "low"}
              className="bg-strip-img absolute top-0 left-0 h-full w-[calc(200cqh/3+1px)] max-w-none object-cover"
              style={{
                animation: `strip-drift ${DUR[r]}s linear ${(-i * DUR[r]) / row.length}s infinite${r % 2 ? " reverse" : ""}`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
