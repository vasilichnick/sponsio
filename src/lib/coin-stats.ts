// Live on-chain stats for our coin cards, sourced from the based.bid
// launchpad — where Sponsio's coins trade on a Uniswap-V4 bonding curve
// before any DEX listing. (DexScreener/GeckoTerminal are empty for these
// pre-graduation tokens; GMGN's data API is gated — so based.bid's own
// indexer is the only working source. The Trade button still deep-links
// to GMGN; this is data only.)
//
// based.bid has no documented API; its dashboard reads via a Next.js Server
// Action ("fetchTokens"), same-origin, no auth. We call it server-side and
// scope it to Sponsio's board. Fully defensive like lib/belief.ts: any
// failure yields {} and the cards simply omit stats — never throw.
//
// CAVEAT: the Next-Action id is build-specific and rotates on based.bid
// deploys. If it rotates, the call fails and stats disappear gracefully
// (cards render as before) until the id below is refreshed.

const BASED_BID = "https://www.based.bid/";
const BOARD = process.env.BASED_BID_BOARD || "mq9llr7m-uwglybx7";
const ACTION_ID =
  process.env.BASED_BID_ACTION_ID ||
  "708b5358e37d5b0800f6544a3bea7e355aed602766";
const MAX_PAGES = 8; // 12 tokens/page; safety cap well above our roster.

export type CoinStat = {
  athPct: number | null; // all-time-high as % of launch price (athPrice/initPrice×100)
  txns24: number; // 24h trade count
  vol24Usd: number; // 24h volume, USD
  spark: number[]; // recent price series (oldest→newest) for the sparkline
};

type RawToken = {
  address?: string;
  initPrice?: string | number;
  athPrice?: string | number;
  volume24h?: string | number;
  totalTransaction24h?: number;
  recentPrices?: number[];
};

const num = (v: unknown): number => {
  const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) ? n : 0;
};

async function fetchPage(page: number): Promise<{ nextPage: number | null; data: RawToken[] } | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 6000);
  try {
    const res = await fetch(BASED_BID, {
      method: "POST",
      headers: {
        "Next-Action": ACTION_ID,
        "Content-Type": "application/json",
        accept: "text/x-component",
      },
      body: JSON.stringify([{ filter: "top", tokenType: "all" }, page, BOARD]),
      signal: ctrl.signal,
      // POST isn't stored in Next's data cache; the /markets/champion route's
      // ISR (revalidate) controls how often this actually runs.
    });
    if (!res.ok) return null;
    const text = await res.text();
    // RSC stream: the payload we want is the line beginning "1:".
    const line = text.split("\n").find((l) => l.startsWith("1:"));
    if (!line) return null;
    const obj = JSON.parse(line.slice(2)) as { nextPage: number | null; data: RawToken[] };
    if (!Array.isArray(obj.data)) return null;
    return obj;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

/** Map of lowercased Base token address → live stats. {} on any failure. */
export async function getCoinStats(): Promise<Record<string, CoinStat>> {
  const out: Record<string, CoinStat> = {};
  try {
    let page = 0;
    while (page < MAX_PAGES) {
      const res = await fetchPage(page);
      if (!res) break;
      for (const tk of res.data) {
        const addr = typeof tk.address === "string" ? tk.address.toLowerCase() : null;
        if (!addr) continue;
        const init = num(tk.initPrice);
        const ath = num(tk.athPrice);
        out[addr] = {
          athPct: init > 0 && ath > 0 ? (ath / init) * 100 : null,
          txns24: typeof tk.totalTransaction24h === "number" ? tk.totalTransaction24h : 0,
          vol24Usd: num(tk.volume24h),
          spark: Array.isArray(tk.recentPrices) ? tk.recentPrices.filter((n) => Number.isFinite(n)) : [],
        };
      }
      if (res.nextPage == null) break;
      page = res.nextPage;
    }
  } catch {
    /* return whatever we accumulated */
  }
  // Dev preview only: this dev server's sandbox can't reach based.bid (same as
  // the belief feed on localhost), so fall back to a gitignored snapshot
  // pre-fetched with egress. Never runs in production, where the live fetch works.
  if (Object.keys(out).length === 0 && process.env.NODE_ENV !== "production") {
    try {
      const fs = await import("node:fs");
      const path = await import("node:path");
      const file = path.join(process.cwd(), "src/data/coin-stats.dev.json");
      return JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, CoinStat>;
    } catch {
      /* no snapshot present — cards simply omit stats */
    }
  }
  return out;
}

/** Compact USD volume: "$6", "$269", "$2.8k", "$1.2M" — matches based.bid. */
export function formatVolUsd(v: number): string {
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(1)}k`;
  return `$${Math.round(v)}`;
}
