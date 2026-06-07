/** Option C background: three photo strips drifting horizontally.
 *  Pure CSS animation — never subject to autoplay policy, no play button,
 *  identical in every browser. Each strip renders its photo set twice and
 *  translates by -50% for a seamless loop. */

const ROWS: string[][] = [
  ["/bg/14.jpg", "/bg/02.jpg", "/bg/15.jpg", "/bg/03.jpg", "/bg/17.jpg", "/bg/07.jpg", "/bg/04.jpg"],
  ["/bg/20.jpg", "/bg/05.jpg", "/bg/16.jpg", "/bg/08.jpg", "/bg/18.jpg", "/bg/19.jpg", "/bg/01.jpg"],
];

const ANIM = [
  "motion-safe:animate-[drift-left_90s_linear_infinite]",
  "motion-safe:animate-[drift-right_110s_linear_infinite]",
];

export function BgStrips() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      {ROWS.map((row, i) => (
        <div key={i} className="flex h-1/2 overflow-hidden">
          {/* 2 copies = seamless -50% loop (each 7-image sequence spans any
              viewport). More copies balloon the composited layer past mobile
              GPU texture limits → tile dropouts and re-raster flicker. */}
          <div className={`flex h-full w-max will-change-transform ${ANIM[i]}`}>
            {[...row, ...row].map((src, j) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={j}
                src={src}
                alt=""
                decoding="async"
                className="h-full w-auto max-w-none object-cover"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
