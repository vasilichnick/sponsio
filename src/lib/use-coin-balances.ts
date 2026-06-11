"use client";

import { erc20Abi, formatEther, formatUnits } from "viem";
import { useBalance, useReadContracts } from "wagmi";
import { coinLaunches } from "@/data/launches";
import { ZERO_ADDRESS } from "./web3-config";

// Flash-token coins are standard 18-decimal ERC-20s (launch config);
// balances are read in one multicall across every live coin.
const DECIMALS = 18;

// Native USDC on Base (6 decimals) — shown as a deposit/balance asset;
// the trade input itself stays ETH in v1.
export const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const;

const liveCoins = () =>
  coinLaunches.filter((c) => c.team.address !== ZERO_ADDRESS);

export type CoinBalance = {
  code: string;
  name: string;
  flag: string;
  ticker: string;
  address: string;
  raw: bigint;
  formatted: string;
};

export function useCoinBalances(address?: `0x${string}`) {
  const coins = liveCoins();
  const eth = useBalance({ address, query: { enabled: !!address } });
  const usdc = useReadContracts({
    contracts: [
      {
        address: USDC_BASE,
        abi: erc20Abi,
        functionName: "balanceOf" as const,
        args: [address ?? ZERO_ADDRESS] as const,
      },
    ],
    query: { enabled: !!address },
  });
  const reads = useReadContracts({
    contracts: coins.map((c) => ({
      address: c.team.address as `0x${string}`,
      abi: erc20Abi,
      functionName: "balanceOf" as const,
      args: [address ?? ZERO_ADDRESS] as const,
    })),
    query: { enabled: !!address && coins.length > 0 },
  });

  const balances: CoinBalance[] = coins.map((c, i) => {
    const raw = (reads.data?.[i]?.result as bigint | undefined) ?? BigInt(0);
    return {
      code: c.code,
      name: c.team.name,
      flag: c.team.flag,
      ticker: c.team.ticker,
      address: c.team.address,
      raw,
      formatted: formatUnits(raw, DECIMALS),
    };
  });

  const usdcRaw = (usdc.data?.[0]?.result as bigint | undefined) ?? BigInt(0);

  return {
    ethFormatted: eth.data ? formatEther(eth.data.value) : null,
    ethIsZero: eth.data ? eth.data.value === BigInt(0) : true,
    usdcFormatted: formatUnits(usdcRaw, 6),
    balances,
    held: balances.filter((b) => b.raw > BigInt(0)),
    isLoading: eth.isLoading || reads.isLoading,
  };
}
