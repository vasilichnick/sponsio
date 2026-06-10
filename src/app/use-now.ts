"use client";

import { useSyncExternalStore } from "react";

/** One shared 1s interval for every live element on a page (countdown,
 *  launch badges, next-launch chip) — subscribers register here instead of
 *  each owning a timer. Returns null during SSR so the statically
 *  prerendered HTML shows placeholders instead of values frozen at build
 *  time (same contract as the original Countdown hook). */
const subs = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(cb: () => void) {
  subs.add(cb);
  if (!timer) timer = setInterval(() => subs.forEach((s) => s()), 1000);
  return () => {
    subs.delete(cb);
    if (subs.size === 0) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

export function useNowSec() {
  return useSyncExternalStore<number | null>(
    subscribe,
    () => Math.floor(Date.now() / 1000),
    () => null,
  );
}
