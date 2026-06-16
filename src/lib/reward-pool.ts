// The live Reward Pool size, read from chain. A wallet on Base accrues the
// launch + trading fees that fund the pool; the displayed pool is 0.8 × that
// wallet's ETH balance (the remaining 0.2 is reserved for operations).
//
// Server-side, fully defensive — exactly like lib/belief.ts: any network or
// parse failure (or an unset address) yields null, and the header simply
// omits the figure. It never throws, blocks render, or shows NaN/0.
//
// This is a JSON-RPC eth_getBalance call, which is a POST — Next's data cache
// is GET-only, so it does NOT cache here. The refresh cadence comes from the
// (site) layout's `export const revalidate = 300`: the route regenerates at
// most every 5 minutes and this runs once per regeneration.

// Address is public (believers verify the pool on-chain), so a hardcoded
// default is fine; REWARD_POOL_WALLET overrides it (e.g. on Vercel).
const WALLET =
  process.env.REWARD_POOL_WALLET ||
  "0xe82720d6C7f401BE3F957380038093E6208d83a3";
const RPC = process.env.BASE_RPC_URL || "https://base.publicnode.com";

// Share of the wallet balance that counts as the pool (the rest is reserved).
const POOL_SHARE = 0.8;

/** Reward pool in ETH (= POOL_SHARE × wallet balance), or null on any
 *  failure / unset address. Null → the UI omits the figure entirely. */
export async function getRewardPool(): Promise<number | null> {
  if (!WALLET) return null;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(RPC, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBalance",
        params: [WALLET, "latest"],
      }),
      signal: ctrl.signal,
    });
    clearTimeout(t);
    if (!res.ok) return null;
    const json = (await res.json()) as { result?: string };
    const hex = json.result;
    if (typeof hex !== "string" || !hex.startsWith("0x")) return null;
    const eth = Number(BigInt(hex)) / 1e18;
    if (!Number.isFinite(eth)) return null;
    return POOL_SHARE * eth;
  } catch {
    return null;
  }
}

/** Compact ETH label: "0.16 ETH", "12.4 ETH", "1,240 ETH". */
export function formatEth(eth: number): string {
  const digits = eth >= 100 ? 0 : eth >= 10 ? 1 : 2;
  const n = eth.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  return `${n} ETH`;
}
