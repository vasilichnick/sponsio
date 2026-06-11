// Swap adapter — the single seam between the trade UI and execution.
//
// Status today (pre-canary): coins either aren't deployed (zero address)
// or their v4 pool params aren't recorded yet (src/data/pools.ts). The
// panel renders real balances and an honest status; the confirm button
// only ever arms when a quote returns ok. Wiring the ok-path (v4 Quoter
// read + Universal Router execution through wagmi) happens against the
// canary coin the moment its pool params land — by design, not omission.

import { POOL_PARAMS } from "@/data/pools";
import { ZERO_ADDRESS } from "./web3-config";

export type Side = "buy" | "sell";

export type Quote =
  | { status: "not_launched" }
  | { status: "pool_pending" }
  | { status: "no_amount" }
  | {
      status: "ok";
      amountOutFormatted: string;
      // populated when the v4 quoter path is wired post-canary
    };

export function getQuote(opts: {
  code: string;
  address: string;
  side: Side;
  amount: string;
}): Quote {
  if (opts.address === ZERO_ADDRESS) return { status: "not_launched" };
  if (!POOL_PARAMS[opts.code]) return { status: "pool_pending" };
  if (!opts.amount || Number(opts.amount) <= 0) return { status: "no_amount" };
  // v4 quoter path lands here post-canary (POOL_PARAMS gate above keeps
  // this branch unreachable until the params are real).
  return { status: "pool_pending" };
}
