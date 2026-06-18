// Live next-fixture + match prediction for a single team's coin page, from
// API-Football. Shows the team's NEXT WC2026 match (opponent, kickoff, round)
// and the market/model PREDICTION for it — home/draw/away win probability and
// the provider's one-line "advice" — plus each side's recent form when the
// prediction payload carries it.
//
// Two API calls, both cached short for match-day freshness:
//   1. /fixtures?league=1&season=2026&next=50 → the league's upcoming matches;
//      we pick the first one involving this team and read its fixture id. (Same
//      league-wide pull @/lib/upcoming uses — no per-team id table needed.)
//   2. /predictions?fixture=<id> → predictions.percent {home,draw,away} +
//      predictions.advice, and teams.home/away form.
//
// Fully defensive, exactly like @/lib/upcoming / @/lib/results / @/lib/belief:
// with no API_FOOTBALL_KEY it returns null, and ANY error / non-ok response /
// empty-or-unmappable result also returns null — the section then simply omits.
// It must never throw. The live path activates on Vercel once the key is set.
// This repo's sandbox has no egress to api-sports.io, so for local review it
// falls back to a gitignored snapshot (src/data/team-live.dev.json, keyed by
// team code) — the same dev-preview pattern as @/lib/coin-stats. The snapshot
// never runs in production.

import tokensData from "@/data/tokens.json";

type Token = { name: string };

/** The team's next match, normalised to our codes. */
export type NextMatch = {
  fixtureId: number;
  kickoffUtc: string;
  round: string; // e.g. "Group Stage - 2"
  homeCode: string; // our code for the home side
  awayCode: string; // our code for the away side
};

/** Win-probability split for the next match (integer %, summing ~100). */
export type MatchPrediction = {
  homePct: number;
  drawPct: number;
  awayPct: number;
  advice: string | null; // provider's one-liner, e.g. "Double chance: Portugal or draw"
};

export type TeamLive = {
  next: NextMatch | null;
  prediction: MatchPrediction | null;
  homeForm: string | null; // recent form like "WWDLW" for the home side
  awayForm: string | null;
};

const teams = tokensData.teams as Record<string, Token>;

const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");

// API-Football team labels → our codes for names that won't normalise-match.
// Mirrors the table in @/lib/upcoming / @/lib/results / @/lib/belief.
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

/** "45%" | "45" | 45 → 45 (clamped 0–100); NaN-ish → null. */
function pct(v: unknown): number | null {
  const s = typeof v === "string" ? v.replace("%", "") : v;
  const n = typeof s === "string" ? parseFloat(s) : typeof s === "number" ? s : NaN;
  if (!Number.isFinite(n)) return null;
  return Math.max(0, Math.min(100, Math.round(n)));
}

type ApiFixture = {
  fixture?: { id?: number; date?: string };
  league?: { round?: string };
  teams?: { home?: { name?: string }; away?: { name?: string } };
};

/** The team's next match (incl. knockouts) from the league-wide upcoming feed,
 *  or null. Never throws. */
async function fetchNextMatch(key: string, code: string): Promise<NextMatch | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(
      "https://v3.football.api-sports.io/fixtures?league=1&season=2026&next=50",
      {
        headers: { "x-apisports-key": key },
        signal: ctrl.signal,
        next: { revalidate: 90 },
      },
    );
    clearTimeout(t);
    if (!res.ok) return null;

    const body = (await res.json()) as { response?: unknown };
    const rows = body?.response;
    if (!Array.isArray(rows)) return null;

    // Feed is already next-sorted; take the first match involving this team.
    for (const row of rows as ApiFixture[]) {
      const home = resolveCode(row?.teams?.home?.name ?? "");
      const away = resolveCode(row?.teams?.away?.name ?? "");
      if (home !== code && away !== code) continue;
      if (!home || !away) continue;
      const id = row?.fixture?.id;
      const date = row?.fixture?.date;
      if (typeof id !== "number" || !date) continue;
      return {
        fixtureId: id,
        kickoffUtc: date,
        round: row?.league?.round ?? "",
        homeCode: home,
        awayCode: away,
      };
    }
    return null;
  } catch {
    return null;
  }
}

type ApiPrediction = {
  predictions?: {
    percent?: { home?: unknown; draw?: unknown; away?: unknown };
    advice?: unknown;
  };
  teams?: {
    home?: { last_5?: { form?: unknown }; league?: { form?: unknown } };
    away?: { last_5?: { form?: unknown }; league?: { form?: unknown } };
  };
};

function readForm(side?: { last_5?: { form?: unknown }; league?: { form?: unknown } }): string | null {
  const f = side?.last_5?.form ?? side?.league?.form;
  if (typeof f !== "string") return null;
  const cleaned = f.replace(/[^WDL]/gi, "").toUpperCase().slice(-5);
  return cleaned.length > 0 ? cleaned : null;
}

/** Prediction + both sides' form for a fixture, or null. Never throws. */
async function fetchPrediction(
  key: string,
  fixtureId: number,
): Promise<{ prediction: MatchPrediction; homeForm: string | null; awayForm: string | null } | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(
      `https://v3.football.api-sports.io/predictions?fixture=${fixtureId}`,
      {
        headers: { "x-apisports-key": key },
        signal: ctrl.signal,
        next: { revalidate: 90 },
      },
    );
    clearTimeout(t);
    if (!res.ok) return null;

    const body = (await res.json()) as { response?: ApiPrediction[] };
    const p = body?.response?.[0];
    if (!p) return null;

    const homePct = pct(p?.predictions?.percent?.home);
    const drawPct = pct(p?.predictions?.percent?.draw);
    const awayPct = pct(p?.predictions?.percent?.away);
    if (homePct == null || drawPct == null || awayPct == null) return null;

    const adviceRaw = p?.predictions?.advice;
    return {
      prediction: {
        homePct,
        drawPct,
        awayPct,
        advice: typeof adviceRaw === "string" && adviceRaw.trim() ? adviceRaw.trim() : null,
      },
      homeForm: readForm(p?.teams?.home),
      awayForm: readForm(p?.teams?.away),
    };
  } catch {
    return null;
  }
}

/** The team's next match + its prediction. Returns null with no key, or on ANY
 *  failure. On localhost (no egress) falls back to a gitignored dev snapshot so
 *  the section renders for review; the snapshot never runs in production. */
export async function getTeamLive(code: string): Promise<TeamLive | null> {
  const key = process.env.API_FOOTBALL_KEY;
  if (key) {
    const next = await fetchNextMatch(key, code);
    if (next) {
      const pred = await fetchPrediction(key, next.fixtureId);
      return {
        next,
        prediction: pred?.prediction ?? null,
        homeForm: pred?.homeForm ?? null,
        awayForm: pred?.awayForm ?? null,
      };
    }
    // Had a key but no upcoming match resolved (e.g. team eliminated): nothing
    // live to show. Don't fall through to the dev snapshot in production.
    if (process.env.NODE_ENV === "production") return null;
  }

  // Dev preview only: sandbox can't reach api-sports.io, so fall back to a
  // gitignored snapshot keyed by team code. Never runs in production.
  if (process.env.NODE_ENV !== "production") {
    try {
      const fs = await import("node:fs");
      const path = await import("node:path");
      const file = path.join(process.cwd(), "src/data/team-live.dev.json");
      const all = JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, TeamLive>;
      return all[code] ?? null;
    } catch {
      /* no snapshot present — the section simply omits */
    }
  }
  return null;
}
