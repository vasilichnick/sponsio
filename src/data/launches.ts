import fixturesData from "./fixtures.json";
import tokensData from "./tokens.json";

export type Token = { name: string; flag: string; ticker: string; address: string };
type Fixture = { kickoffUtc: string; group?: string; home: string; away: string };

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const tokens = tokensData.teams as Record<string, Token>;
const fixtures = fixturesData.matches as Fixture[];

// Launch rule: a team's coin launches at the team's first match kickoff
// (verified against the official FWC26 schedule v17 — all 48 first matches
// fall on June 11–18, 2026). The full first fixture is kept so the board
// can show the opponent and group alongside the launch instant.
const firstFixture: Record<string, Fixture> = {};
for (const fx of fixtures) {
  for (const code of [fx.home, fx.away]) {
    if (!firstFixture[code] || fx.kickoffUtc < firstFixture[code].kickoffUtc) {
      firstFixture[code] = fx;
    }
  }
}

/** All 48 coins in launch order (ties broken alphabetically by code). */
export const coinLaunches = Object.keys(tokens)
  .map((code) => {
    const fx = firstFixture[code];
    const oppCode = fx.home === code ? fx.away : fx.home;
    return {
      code,
      team: tokens[code],
      launch: fx.kickoffUtc,
      group: fx.group,
      opponent: tokens[oppCode],
    };
  })
  .sort((a, b) =>
    a.launch === b.launch
      ? a.code.localeCompare(b.code)
      : a.launch < b.launch
        ? -1
        : 1,
  );
