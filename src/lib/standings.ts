// Live WC2026 group standings from API-Football. Each team's coin page shows
// the table for the group it belongs to — every team in the group with
// played / W / D / L / GF / GA / GD / points, in standing order.
//
// API-Football v3 /standings?league=1&season=2026 returns the group tables
// under response[0].league.standings — an ARRAY of group tables (one inner
// array per group), each row carrying the team and its all/goals stats.
//
// Fully defensive, exactly like @/lib/upcoming and @/lib/results: with no
// API_FOOTBALL_KEY it returns null, and ANY error / non-ok response /
// empty-or-unmappable result also returns null. It must never throw. The live
// path activates on Vercel once the key is set. This repo's sandbox has no key
// and no egress to api-sports.io, so for local review it falls back to a
// gitignored snapshot (src/data/standings.dev.json) — same dev-preview pattern
// as @/lib/coin-stats. Never runs the snapshot in production.

import tokensData from "@/data/tokens.json";

type Token = { name: string };

/** One team's row in a group table, normalised to our code. */
export type StandingRow = {
  code: string; // our FIFA code (resolved from the API team name)
  rank: number; // position within the group (1-based)
  played: number;
  win: number;
  draw: number;
  lose: number;
  gf: number; // goals for
  ga: number; // goals against
  gd: number; // goal difference
  points: number;
};

/** A single group's ordered table. */
export type GroupTable = {
  group: string; // e.g. "Group K" (best-effort label from the API)
  rows: StandingRow[];
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

const int = (v: unknown): number => {
  const n = typeof v === "number" ? v : typeof v === "string" ? parseInt(v, 10) : NaN;
  return Number.isFinite(n) ? n : 0;
};

type ApiStandingRow = {
  rank?: number;
  team?: { name?: string };
  points?: number;
  goalsDiff?: number;
  all?: {
    played?: number;
    win?: number;
    draw?: number;
    lose?: number;
    goals?: { for?: number; against?: number };
  };
};

/** Map one API row → our StandingRow, or null if its team won't resolve. */
function mapRow(raw: ApiStandingRow): StandingRow | null {
  const name = raw?.team?.name;
  if (!name) return null;
  const code = resolveCode(name);
  if (!code) return null;
  const all = raw?.all ?? {};
  const gf = int(all?.goals?.for);
  const ga = int(all?.goals?.against);
  return {
    code,
    rank: int(raw?.rank),
    played: int(all?.played),
    win: int(all?.win),
    draw: int(all?.draw),
    lose: int(all?.lose),
    gf,
    ga,
    gd: typeof raw?.goalsDiff === "number" ? raw.goalsDiff : gf - ga,
    points: int(raw?.points),
  };
}

/** All group tables for WC2026, normalised to our codes. Returns null with no
 *  key, or on ANY failure / non-ok response / empty-or-unmappable result.
 *  Never throws. */
export async function getStandings(): Promise<GroupTable[] | null> {
  const live = await fetchStandings();
  if (live) return live;

  // Dev preview only: this dev server's sandbox can't reach api-sports.io (same
  // as belief/coin-stats on localhost), so fall back to a gitignored snapshot
  // so the section still renders for review. Never runs in production.
  if (process.env.NODE_ENV !== "production") {
    try {
      const fs = await import("node:fs");
      const path = await import("node:path");
      const file = path.join(process.cwd(), "src/data/standings.dev.json");
      const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
      return Array.isArray(parsed) && parsed.length > 0 ? (parsed as GroupTable[]) : null;
    } catch {
      /* no snapshot present — the section simply omits */
    }
  }
  return null;
}

async function fetchStandings(): Promise<GroupTable[] | null> {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) return null;

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(
      "https://v3.football.api-sports.io/standings?league=1&season=2026",
      {
        headers: { "x-apisports-key": key },
        signal: ctrl.signal,
        next: { revalidate: 90 }, // short cache; standings move on match days
      },
    );
    clearTimeout(t);
    if (!res.ok) return null;

    const body = (await res.json()) as {
      response?: Array<{ league?: { standings?: unknown } }>;
    };
    const groups = body?.response?.[0]?.league?.standings;
    if (!Array.isArray(groups)) return null;

    const out: GroupTable[] = [];
    for (const table of groups as ApiStandingRow[][]) {
      if (!Array.isArray(table)) continue;
      const rows: StandingRow[] = [];
      for (const raw of table) {
        const row = mapRow(raw);
        if (row) rows.push(row);
      }
      if (rows.length === 0) continue;
      // Label the group from our own schedule via the first resolvable team,
      // so the heading reads "Group K" regardless of the API's group naming.
      const group = groupOf(rows[0].code) ?? "";
      out.push({ group, rows });
    }
    return out.length > 0 ? out : null;
  } catch {
    return null;
  }
}

// code → "Group X", derived from the bundled schedule. Lets us label and pick
// the right table without trusting the API's free-text group string.
import fixturesData from "@/data/fixtures.json";
type Fx = { group?: string; home: string; away: string };
const groupByCode: Record<string, string> = {};
for (const fx of fixturesData.matches as Fx[]) {
  if (!fx.group) continue;
  groupByCode[fx.home] = fx.group;
  groupByCode[fx.away] = fx.group;
}
function groupOf(code: string): string | undefined {
  return groupByCode[code];
}

/** Pick the table for the group the given team belongs to. Prefers a table
 *  that actually contains the team's code; falls back to matching the team's
 *  bundled-schedule group label. null if neither matches. */
export function tableForTeam(tables: GroupTable[] | null, code: string): GroupTable | null {
  if (!tables || tables.length === 0) return null;
  const byMember = tables.find((t) => t.rows.some((r) => r.code === code));
  if (byMember) return byMember;
  const myGroup = groupOf(code);
  return (myGroup && tables.find((t) => t.group === myGroup)) || null;
}
