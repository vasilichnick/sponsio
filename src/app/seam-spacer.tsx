"use client";

import { useLayoutEffect, useState } from "react";

/** Mirrors the gap between the tagline and the photo-strip seam onto the
 *  other side of the seam, so the countdown starts as far below the divider
 *  as the tagline ends above it — symmetric on every viewport. The hero box
 *  bottom IS the seam (it spans exactly the top half), so the gap is
 *  hero.bottom − tagline.bottom, re-measured on resize and font load. */
export function SeamSpacer() {
  const [h, setH] = useState(0);
  useLayoutEffect(() => {
    const hero = document.getElementById("hero");
    const tagline = document.getElementById("tagline");
    if (!hero || !tagline) return;
    const measure = () =>
      setH(
        Math.max(
          0,
          hero.getBoundingClientRect().bottom -
            tagline.getBoundingClientRect().bottom,
        ),
      );
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(hero);
    ro.observe(tagline);
    ro.observe(document.documentElement);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, []);
  return <div aria-hidden className="shrink-0" style={{ height: h }} />;
}
