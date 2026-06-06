"use client";

import { useEffect, useRef } from "react";

/** Background video. React omits the `muted` attribute from SSR markup, so the
 *  browser blocks autoplay (unmuted) and shows a play button — force-mute and
 *  kick play() on mount instead. */
export function BgVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      src="/bg.mp4"
      aria-hidden
      className="absolute inset-0 -z-10 h-full w-full object-cover"
    />
  );
}
