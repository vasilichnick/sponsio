// Per-coin Uniswap v4 pool parameters — THE CANARY SEAM, now fed by chain
// truth (scripts/fetch-pools.ts reads Initialize events off the Base v4
// PoolManager 0x498581fF718922c3f8e6A244956aF099B2652b2b).
//
// fee 8388608 = 0x800000 is the v4 DYNAMIC_FEE flag: the BasedBid Fee
// Builder hook sets the actual fee per swap. currency0 is native ETH
// (0x0) on every pool; currency1 is the coin.
//
// Wave-1 coins (MEXICO, RSA, KOR, CZE — launched 2026-06-11/12) are
// deliberately absent: as of 2026-06-12 they have NO DEX pool (v4
// Initialize, Uniswap v3, PancakeSwap v3 and Aerodrome factories all
// checked over 150k blocks) and ZERO ERC-20 Transfer events since
// creation — their supply is virtual, trading only inside BasedBid's
// platform until graduation. The swap panel keeps them at pool_pending,
// which is the honest state.

export type PoolParams = {
  hooks: `0x${string}`;
  fee: number; // v4 fee field; 0x800000 = dynamic (hook-set per swap)
  tickSpacing: number;
};

export const POOL_PARAMS: Record<string, PoolParams> = {
  // Verified on-chain: PoolManager Initialize @ block 47250443 (CAN),
  // 47250342 (BIH), 2026-06-12.
  CAN: {
    hooks: "0x4D667e420bd4a42969cb27251a3f9a24661fD0CC",
    fee: 8388608,
    tickSpacing: 200,
  },
  BIH: {
    hooks: "0x4D667e420bd4a42969cb27251a3f9a24661fD0CC",
    fee: 8388608,
    tickSpacing: 200,
  },
};
