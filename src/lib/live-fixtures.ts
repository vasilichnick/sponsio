// Live (in-play) WC2026 fixtures from API-Football — the match (or matches)
// being played right now. The event deck pins these to the FRONT (the card a
// user lands on is the live game); when a match finishes it leaves this feed,
// so the next upcoming match takes the front automatically.
//
// Fully defensive, exactly like @/lib/upcoming: with no API_FOOTBALL_KEY it
// returns null, and ANY error / non-ok response / empty-or-unmappable result
// also returns null. Never throws. Live only activates where the key is set
// (Vercel); this repo's sandbox has no key, so it always returns null here.

import tokensData from "@/data/tokens.json";

type Token = { name: string };
type Fixture = {
  match: number;
  kickoffUtc: string;
  group: string;
  home: string;
  away: string;
};

const teams = tokensData.teams as Record<string, Token>;
const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");

// API-Football team labels → our codes (mirrors @/lib/upcoming / @/lib/belief).
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

const byName: Record<string, string> = {};
for (const [code, t] of Object.entries(teams)) byName[norm(t.name)] = code;

function resolveCode(label: string): string | undefined {
  const n = norm(label);
  return byName[n] ?? ALIASES[n];
}

type ApiFixture = {
  fixture?: { id?: number; date?: string };
  league?: { round?: string };
  teams?: { home?: { name?: string }; away?: { name?: string } };
};

/** Live (in-play) WC2026 fixtures, normalised to codes. `live=all` returns only
 *  matches in progress, so every row here is a current game. null with no key,
 *  or on ANY failure / empty / unmappable result. Never throws. */
export async function liveFixtures(): Promise<Fixture[] | null> {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) return null;

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(
      "https://v3.football.api-sports.io/fixtures?league=1&season=2026&live=all",
      {
        headers: { "x-apisports-key": key },
        signal: ctrl.signal,
        next: { revalidate: 30 }, // live moves fast — short cache
      },
    );
    clearTimeout(t);
    if (!res.ok) return null;

    const body = (await res.json()) as { response?: unknown };
    const rows = body?.response;
    if (!Array.isArray(rows)) return null;

    const out: Fixture[] = [];
    for (const row of rows as ApiFixture[]) {
      const homeName = row?.teams?.home?.name;
      const awayName = row?.teams?.away?.name;
      if (!homeName || !awayName) continue;
      const home = resolveCode(homeName);
      const away = resolveCode(awayName);
      if (!home || !away) continue; // skip teams without a Sponsio coin
      const kickoffUtc = row?.fixture?.date;
      if (!kickoffUtc) continue;

      out.push({
        match: row?.fixture?.id ?? 0,
        kickoffUtc,
        group: row?.league?.round ?? "",
        home,
        away,
      });
    }

    return out.length > 0 ? out : null;
  } catch {
    return null;
  }
}
