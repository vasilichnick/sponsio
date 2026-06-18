// Recent finished WC2026 fixtures (with scores) from API-Football. The
// bundled @/data/fixtures.json is a schedule only — it carries kickoff times
// but no results — so a team's coin page needs this sibling to show actual
// scorelines for matches already played.
//
// Small sibling to @/lib/upcoming: same league-wide fetch + name→code mapping,
// just `last=` (finished) instead of `next=` (upcoming), and it keeps the
// goals. Fully defensive, exactly like upcoming/belief: with no
// API_FOOTBALL_KEY it returns null (the coin page then falls back to listing
// the team's past fixtures from the static JSON, without scores), and ANY
// error / non-ok response / empty-or-unmappable result also returns null. It
// must never throw. The live path activates on Vercel once the key is set;
// this repo's sandbox has no key, so it always returns null here.

import tokensData from "@/data/tokens.json";

type Token = { name: string };
export type Result = {
  match: number;
  kickoffUtc: string;
  group: string;
  home: string; // our code
  away: string; // our code
  homeGoals: number;
  awayGoals: number;
};

const teams = tokensData.teams as Record<string, Token>;

const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");

// API-Football team labels → our codes for names that won't normalise-match.
// Mirrors the table in @/lib/upcoming and @/lib/belief.
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

type ApiResult = {
  fixture?: { id?: number; date?: string; status?: { short?: string } };
  league?: { round?: string };
  teams?: { home?: { name?: string }; away?: { name?: string } };
  goals?: { home?: number | null; away?: number | null };
};

/** Recent finished WC2026 fixtures with scores, normalised to our codes.
 *  Returns null with no key, or on ANY failure / non-ok response /
 *  empty-or-unmappable result. Never throws. */
export async function recentResults(): Promise<Result[] | null> {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) return null;

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(
      "https://v3.football.api-sports.io/fixtures?league=1&season=2026&last=50",
      {
        headers: { "x-apisports-key": key },
        signal: ctrl.signal,
        next: { revalidate: 3600 }, // 1-hour cache; results settle once final
      },
    );
    clearTimeout(t);
    if (!res.ok) return null;

    const body = (await res.json()) as { response?: unknown };
    const rows = body?.response;
    if (!Array.isArray(rows)) return null;

    const out: Result[] = [];
    for (const row of rows as ApiResult[]) {
      // Only count finished matches with a real scoreline.
      const short = row?.fixture?.status?.short;
      if (short && !["FT", "AET", "PEN"].includes(short)) continue;
      const homeName = row?.teams?.home?.name;
      const awayName = row?.teams?.away?.name;
      if (!homeName || !awayName) continue;
      const home = resolveCode(homeName);
      const away = resolveCode(awayName);
      if (!home || !away) continue;

      const kickoffUtc = row?.fixture?.date;
      if (!kickoffUtc) continue;

      const hg = row?.goals?.home;
      const ag = row?.goals?.away;
      if (typeof hg !== "number" || typeof ag !== "number") continue;

      out.push({
        match: row?.fixture?.id ?? 0,
        kickoffUtc,
        group: row?.league?.round ?? "",
        home,
        away,
        homeGoals: hg,
        awayGoals: ag,
      });
    }

    return out.length > 0 ? out : null;
  } catch {
    return null;
  }
}
