// Per-coin Uniswap v4 pool parameters — THE CANARY SEAM.
//
// BasedBid flash tokens land on Uniswap v4 with a fee-builder hook. The
// exact pool key (hooks address, fee tier, tick spacing) is only knowable
// once the first coin deploys (launch day). Quoting/swapping in-app stays
// disabled per coin until its entry lands here; until then the swap panel
// shows an honest "pool pending" state and the Uniswap escape link.
//
// Fill from the canary coin: inspect its PoolKey on Basescan (Initialize
// event on the v4 PoolManager) and record it below — identical for all 48
// if the launch config is uniform (it is, by design).

export type PoolParams = {
  hooks: `0x${string}`;
  fee: number; // v4 fee, in hundredths of a bip (e.g. 30000 = 3%)
  tickSpacing: number;
};

export const POOL_PARAMS: Record<string, PoolParams> = {
  // "MEX": { hooks: "0x…", fee: 30000, tickSpacing: 60 },
};
