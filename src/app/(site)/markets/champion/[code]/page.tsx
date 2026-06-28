import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { coinLaunches } from "@/data/launches";
import { CoinDeck } from "../coin-deck";

type Entry = (typeof coinLaunches)[number];

const byCode = new Map(coinLaunches.map((e) => [e.code, e]));
const resolve = (raw: string): Entry | undefined => byCode.get(raw.toUpperCase());

// Prerender all 48 coin URLs so each coin is deep-linkable / shareable / SEO'd;
// the client deck swaps the URL (shallow) as you swipe between them.
export function generateStaticParams() {
  return coinLaunches.map((e) => ({ code: e.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const entry = resolve(code);
  if (!entry) return { title: "Coin not found — Sponsio" };
  const { team } = entry;
  return {
    title: `${team.name} — Belief Markets — Sponsio`,
    description: `One belief: ${team.name} becomes World Cup 2026 champion. Trade the $${team.ticker} coin on Base.`,
  };
}

// A single coin is one full-screen card in the swipe deck. This SSG page fixes
// the per-coin URL + metadata (deep-link / share / SEO) and starts the deck on
// this coin; the client CoinDeck handles swiping + URL sync from there.
export default async function CoinPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const entry = resolve(code);
  if (!entry) notFound();
  return <CoinDeck startCode={entry.code} />;
}
