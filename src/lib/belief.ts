// "World belief" — the live, market-implied belief that each team wins
// WC2026, sourced from Polymarket's public gamma API (free, no key). On
// Sponsio this is framed as BELIEF, never odds: a prediction market's price
// IS the world's collective belief in an outcome.
//
// Server-side, cached. Fully defensive: any network/parse failure (or a
// team absent from the market) yields no value for that team, and the UI
// simply omits the belief chip — it never throws or blocks render. NOTE:
// the WC winner event slug is a best guess ("fifa-world-cup"); confirm it
// against Polymarket once and override via POLYMARKET_WC_SLUG if needed.
// (This repo's sandbox has no egress to Polymarket, so the value resolves
// live only where the server can reach gamma — e.g. Vercel.)

import tokensData from "@/data/tokens.json";

type Token = { name: string; ticker: string };
const teams = tokensData.teams as Record<string, Token>;

const GAMMA = "https://gamma-api.polymarket.com/events";
const SLUG = process.env.POLYMARKET_WC_SLUG || "fifa-world-cup";

const norm = (s: string) =>
  s.toLowerCase().replace(/[^a-z]/g, "");

// Polymarket labels → our codes for names that won't normalise-match.
const ALIASES: Record<string, string> = {
  unitedstates: "USA",
  usa: "USA",
  southkorea: "KOR",
  korearepublic: "KOR",
  czechrepublic: "CZE",
  czechia: "CZE",
  iran: "IRN",
  irian: "IRN",
  turkey: "TUR",
  turkiye: "TUR",
  ivorycoast: "CIV",
  cotedivoire: "CIV",
  capeverde: "CPV",
  caboverde: "CPV",
  drcongo: "COD",
  congodr: "COD",
  democraticrepublicofthecongo: "COD",
  bosniaandherzegovina: "BIH",
  bosniaherzegovina: "BIH",
  saudiarabia: "KSA",
  newzealand: "NZL",
  southafrica: "RSA",
};

// name → code resolver (normalised team name, then alias table)
const byName: Record<string, string> = {};
for (const [code, t] of Object.entries(teams)) byName[norm(t.name)] = code;

function resolveCode(label: string): string | undefined {
  const n = norm(label);
  return byName[n] ?? ALIASES[n];
}

/** Map of team code → integer belief percent (0–100). Empty on any failure. */
export async function getBeliefMap(): Promise<Record<string, number>> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(`${GAMMA}?slug=${SLUG}`, {
      signal: ctrl.signal,
      next: { revalidate: 300 }, // 5-min cache; the % updates from source
    });
    clearTimeout(t);
    if (!res.ok) return {};
    const events = (await res.json()) as unknown;
    const event = Array.isArray(events) ? events[0] : undefined;
    const markets = (event as { markets?: unknown[] })?.markets;
    if (!Array.isArray(markets)) return {};

    const out: Record<string, number> = {};
    for (const m of markets as Array<Record<string, unknown>>) {
      // Each per-team market exposes the team via groupItemTitle/question and
      // a "Yes" price in outcomePrices (a JSON-encoded string array).
      const label =
        (m.groupItemTitle as string) || (m.question as string) || "";
      const code = resolveCode(label);
      if (!code) continue;
      let prices: unknown = m.outcomePrices;
      if (typeof prices === "string") {
        try {
          prices = JSON.parse(prices);
        } catch {
          continue;
        }
      }
      const yes = Array.isArray(prices) ? Number(prices[0]) : NaN;
      if (!Number.isFinite(yes)) continue;
      out[code] = Math.round(yes * 100);
    }
    return out;
  } catch {
    return {};
  }
}
