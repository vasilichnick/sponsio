// Live upcoming WC2026 fixtures from API-Football. The bundled
// @/data/fixtures.json is group-stage only (ends 2026-06-28, no knockouts),
// so the home page's "next match" card would run out of fixtures once the
// groups finish. This pulls the next batch of real fixtures — including
// knockouts — so the card lasts the whole tournament.
//
// Fully defensive, exactly like @/lib/belief: with no API_FOOTBALL_KEY it
// returns null (the card then falls back to the static group-stage JSON), and
// ANY error / non-ok response / empty-or-unmappable result also returns null.
// It must never throw. The live path activates on Vercel once the key is set;
// this repo's sandbox has no key, so it always returns null here.

import tokensData from "@/data/tokens.json";

type Token = { name: string };
type Fixture = {
  match: number;
  kickoffUtc: string;
  group: string;
  city: string;
  home: string;
  away: string;
};

const teams = tokensData.teams as Record<string, Token>;

const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");

// API-Football team labels → our codes for names that won't normalise-match.
// Mirrors the table in @/lib/belief (the providers share most edge cases:
// "United States", "South Korea", "Turkey/Türkiye", "Ivory Coast", etc.).
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

type ApiFixture = {
  fixture?: { id?: number; date?: string; venue?: { city?: string | null } };
  league?: { round?: string };
  teams?: { home?: { name?: string }; away?: { name?: string } };
};

/** Upcoming WC2026 fixtures (incl. knockouts) normalised to the Fixture shape
 *  next-launch.tsx uses. Returns null with no key, or on ANY failure / non-ok
 *  response / empty-or-unmappable result. Never throws. */
export async function upcomingFixtures(): Promise<Fixture[] | null> {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) return null;

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(
      "https://v3.football.api-sports.io/fixtures?league=1&season=2026&next=30",
      {
        headers: { "x-apisports-key": key },
        signal: ctrl.signal,
        next: { revalidate: 3600 }, // 1-hour cache; the schedule moves slowly
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
      if (!home || !away) continue; // skip fixtures we can't map to our codes

      const kickoffUtc = row?.fixture?.date;
      if (!kickoffUtc) continue;

      out.push({
        match: row?.fixture?.id ?? 0,
        kickoffUtc,
        group: row?.league?.round ?? "",
        city: row?.fixture?.venue?.city ?? "",
        home,
        away,
      });
    }

    return out.length > 0 ? out : null;
  } catch {
    return null;
  }
}
