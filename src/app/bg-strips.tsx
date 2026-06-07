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
 *  it enters the viewport. */

const ROWS: string[][] = [
  [
    "/bg/fener-march.jpg",
    "/bg/sa-fan.jpg",
    "/bg/alahly-night.jpg",
    "/bg/rio-beach.jpg",
    "/bg/brazil-girls.jpg",
    "/bg/wembley.jpg",
    "/bg/turkiye-flags.jpg",
    "/bg/mexico-freestyle.jpg",
    "/bg/argentina-couch.jpg",
    "/bg/wc-glass.jpg",
    "/bg/guinea-trio.jpg",
    "/bg/morocco-kit.jpg",
    "/bg/flamengo-flags.jpg",
    "/bg/brazil-flagman.jpg",
    "/bg/rabat-stands.jpg",
    "/bg/venezuela-hat.jpg",
  ],
  [
    "/bg/galata-flares.jpg",
    "/bg/morocco-ball.jpg",
    "/bg/pennants-bar.jpg",
    "/bg/trophy-kid.jpg",
    "/bg/ghana-fans.jpg",
    "/bg/argentina-ball.jpg",
    "/bg/trabzon-smoke.jpg",
    "/bg/rabat-lineup.jpg",
    "/bg/fans-duo.jpg",
    "/bg/mexico-sky.jpg",
    "/bg/messi-car.jpg",
    "/bg/world-flags.jpg",
    "/bg/bra-por-flags.jpg",
    "/bg/street-match.jpg",
    "/bg/wc-balls.jpg",
    "/bg/ball-signing.jpg",
  ],
];

// Seconds per full cycle — keeps the previous px/s drift speed at 16 photos.
const DUR = [205, 250];

export function BgStrips() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
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
