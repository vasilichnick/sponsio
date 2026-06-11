// Shared web3 constants — importable from server and client modules.
// NEXT_PUBLIC_* is inlined at build time, so this works in both worlds.

export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "";

/** Login/trading UI renders only when a Privy app id is configured —
 *  without it the site behaves exactly as before (graceful degrade). */
export const WEB3_ENABLED = PRIVY_APP_ID.length > 0;

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const uniswapUrl = (address: string) =>
  `https://app.uniswap.org/swap?chain=base&outputCurrency=${address}`;
