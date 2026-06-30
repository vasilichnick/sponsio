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
// SELF-HEALING: the Next-Action id is build-specific and rotates on based.bid
// deploys. We try the active id; if it returns nothing (stale), we scrape
// based.bid's JS bundle for the current id, retry, and cache it for this
// instance. The hardcoded id below is only the last-resort fallback.

const BASED_BID = "https://www.based.bid/";
const BOARD = process.env.BASED_BID_BOARD || "mq9llr7m-uwglybx7";
// Fallback only — the live id is auto-discovered (see discoverActionId / getCoinStats).
const ACTION_ID =
  process.env.BASED_BID_ACTION_ID ||
  "70f41975008a788c01b6241e596f32fc9f8a9b3c67";
const MAX_PAGES = 8; // 12 tokens/page; safety cap well above our roster.

// The fetchTokens server action as it appears in based.bid's client bundle:
//   ("<40-42 hex id>", X.callServer, void 0, X.findSourceMapURL, "fetchTokens")
const ID_RE = /"([0-9a-f]{38,44})",[A-Za-z0-9_$]+\.callServer,void 0,[^,]+,"fetchTokens"/;
// Per-instance cache of a self-healed id (survives warm requests; re-discovered
// after a cold start if the fallback is still stale).
let healedId: string | null = null;
const activeId = (): string => healedId ?? ACTION_ID;

export type CoinStat = {
  athPct: number | null; // all-time-high as % of launch price (athPrice/initPrice×100)
  txns24: number; // 24h trade count
  vol24Usd: number; // 24h volume, USD
  spark: number[]; // recent price series (oldest→newest) for the sparkline
  marketCapUsd: number | null; // live market cap, USD = price × supply (null for untraded coins)
};

type RawToken = {
  address?: string;
  initPrice?: string | number;
  athPrice?: string | number;
  volume24h?: string | number;
  totalTransaction24h?: number;
  recentPrices?: number[];
  marketCap?: string | number; // based.bid market cap — usually "0" for pre-graduation tokens
  currentPrice?: string | number; // live USD price per token
  totalSupply?: string | number; // token supply, human units (not raw/decimals)
};

const num = (v: unknown): number => {
  const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) ? n : 0;
};

/** GET/POST a URL to text with an abort timeout. null on any failure. */
async function fetchText(url: string, init: RequestInit, ms: number): Promise<string | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal, cache: "no-store" });
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function fetchPage(
  page: number,
  actionId: string,
): Promise<{ nextPage: number | null; data: RawToken[] } | null> {
  const text = await fetchText(
    BASED_BID,
    {
      method: "POST",
      headers: { "Next-Action": actionId, "Content-Type": "application/json", accept: "text/x-component" },
      body: JSON.stringify([{ filter: "top", tokenType: "all" }, page, BOARD]),
    },
    6000,
  );
  if (!text) return null;
  // RSC stream: the payload we want is the line beginning "1:".
  const line = text.split("\n").find((l) => l.startsWith("1:"));
  if (!line) return null;
  try {
    const obj = JSON.parse(line.slice(2)) as { nextPage: number | null; data: RawToken[] };
    return Array.isArray(obj.data) ? obj : null;
  } catch {
    return null;
  }
}

/** Scrape based.bid's bundle for the current fetchTokens action id, or null.
 *  Fetches the homepage's JS chunks in parallel; first match wins. Never throws. */
async function discoverActionId(): Promise<string | null> {
  const html = await fetchText(BASED_BID, {}, 6000);
  if (!html) return null;
  const chunks = Array.from(
    new Set(html.match(/\/_next\/static\/chunks\/[^"\\]+\.js/g) ?? []),
  ).slice(0, 80);
  if (chunks.length === 0) return null;
  const base = BASED_BID.replace(/\/$/, "");
  const texts = await Promise.allSettled(chunks.map((c) => fetchText(base + c, {}, 8000)));
  for (const res of texts) {
    if (res.status === "fulfilled" && res.value) {
      const m = ID_RE.exec(res.value);
      if (m) return m[1];
    }
  }
  return null;
}

/** Page through the board with one action id into {address → stats}. */
async function collect(actionId: string): Promise<Record<string, CoinStat>> {
  const out: Record<string, CoinStat> = {};
  let page = 0;
  while (page < MAX_PAGES) {
    const res = await fetchPage(page, actionId);
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
        marketCapUsd: num(tk.marketCap) || num(tk.currentPrice) * num(tk.totalSupply) || null,
      };
    }
    if (res.nextPage == null) break;
    page = res.nextPage;
  }
  return out;
}

/** Map of lowercased Base token address → live stats. {} on any failure. Self-heals a
 *  rotated based.bid action id: tries the active id, and if it returns nothing,
 *  discovers the fresh id from the bundle, retries, and caches it for this instance. */
export async function getCoinStats(): Promise<Record<string, CoinStat>> {
  let out = await collect(activeId()).catch(() => ({}) as Record<string, CoinStat>);

  if (Object.keys(out).length === 0) {
    // Active id is stale (or based.bid is down) — try to discover the fresh id.
    const fresh = await discoverActionId();
    if (fresh && fresh !== activeId()) {
      const healed = await collect(fresh).catch(() => ({}) as Record<string, CoinStat>);
      if (Object.keys(healed).length > 0) {
        healedId = fresh; // remember the working id for this instance
        out = healed;
      }
    }
  }

  // Dev preview only: this dev server's sandbox can't reach based.bid, so fall
  // back to a gitignored snapshot pre-fetched with egress. Never runs in prod.
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
