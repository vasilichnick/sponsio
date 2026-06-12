// @ts-nocheck — ops script, run with bun (bun run scripts/fetch-pools.ts);
// uses BigInt literals beyond the app tsconfig target.
// One-shot: read the Initialize events for our live coins off Base and
// print the PoolKey params for src/data/pools.ts.
import { createPublicClient, http, parseAbiItem } from "viem";
import { base } from "viem/chains";

const POOL_MANAGER = "0x498581fF718922c3f8e6A244956aF099B2652b2b" as const;
const COINS: Record<string, `0x${string}`> = {
  MEXICO: "0x8eEd92C8C4404CBFBdA8E33002ebECF666aE3b1d",
  RSA: "0x98C70C581F2D94F20BEb7E66ac174B2aaA095b1d",
  KOR: "0x7b0a0434b4051ec4756593be3679185cab35eb1d",
  CZE: "0xd683f3925b45b310f489490e85d63f9099e0db1d",
  CAN: "0xfda05233d3c91f64c891ff2c64b0a1b82c85db1d",
  BIH: "0xdaad43cdd5a5da0dbe793198629814f2c1d42b1d",
};

const ev = parseAbiItem(
  "event Initialize(bytes32 indexed id, address indexed currency0, address indexed currency1, uint24 fee, int24 tickSpacing, address hooks, uint160 sqrtPriceX96, int24 tick)",
);

const client = createPublicClient({ chain: base, transport: http("https://base-rpc.publicnode.com") });

const latest = await client.getBlockNumber();
const SPAN = 100_000n; // launches began ~1.2 days ago (~53k blocks); 100k = safe margin
const STEP = 10_000n;
const addrs = Object.values(COINS).map((a) => a.toLowerCase() as `0x${string}`);
const found: Record<string, { hooks: string; fee: number; tickSpacing: number; currency0: string; id: string; block: bigint }> = {};

for (let from = latest - SPAN; from < latest; from += STEP) {
  const to = from + STEP - 1n > latest ? latest : from + STEP - 1n;
  const logs = await client.getLogs({ address: POOL_MANAGER, event: ev, args: { currency1: addrs }, fromBlock: from, toBlock: to });
  for (const log of logs) {
    const code = Object.entries(COINS).find(([, a]) => a.toLowerCase() === log.args.currency1!.toLowerCase())?.[0];
    if (!code) continue;
    found[code] = {
      hooks: log.args.hooks!,
      fee: Number(log.args.fee!),
      tickSpacing: Number(log.args.tickSpacing!),
      currency0: log.args.currency0!,
      id: log.args.id!,
      block: log.blockNumber!,
    };
  }
}

for (const [code, p] of Object.entries(found)) {
  console.log(`${code}: hooks=${p.hooks} fee=${p.fee} tickSpacing=${p.tickSpacing} currency0=${p.currency0} block=${p.block}`);
  console.log(`  poolId=${p.id}`);
}
const missing = Object.keys(COINS).filter((c) => !found[c]);
console.log(missing.length ? `MISSING: ${missing.join(", ")}` : "ALL 6 POOLS FOUND");
