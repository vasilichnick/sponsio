import type { Metadata } from "next";
import { coinLaunches } from "@/data/launches";
import { MiniApp } from "./mini-app";

// The Mini App embed lives in the root layout (every URL is castable); this
// page just declares its own title. Rendered bare — no site chrome — inside
// the Farcaster webview modal (424×695 on web, device-sized on mobile).
export const metadata: Metadata = {
  title: "Sponsio — Trade belief",
};

export default function MiniPage() {
  // Pass the launch schedule in from the server (same source as /coins):
  // code, name, flag, ticker, address, kickoff. Plain data only — the
  // client component owns the Farcaster SDK and all interactivity.
  const coins = coinLaunches.map((c) => ({
    code: c.code,
    name: c.team.name,
    flag: c.team.flag,
    ticker: c.team.ticker,
    address: c.team.address,
    launch: c.launch,
  }));
  const opener = coins.reduce((a, b) => (b.launch < a.launch ? b : a));
  return <MiniApp coins={coins} openerIso={opener.launch} />;
}
