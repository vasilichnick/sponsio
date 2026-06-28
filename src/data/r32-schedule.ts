// Static Round-of-32 schedule — the fallback the event deck uses in dev and
// whenever API-Football is unavailable (lib/upcoming.upcomingFixtures returns
// null without API_FOOTBALL_KEY). Team codes are verified against tokens.json;
// kickoff times are UTC (US Eastern + 4h). The live API-Football path
// supersedes this on Vercel, so this only needs to keep the deck populated.
export type R32Match = { home: string; away: string; kickoffUtc: string };

export const R32_SCHEDULE: R32Match[] = [
  { home: "RSA", away: "CAN", kickoffUtc: "2026-06-28T19:00:00Z" },
  { home: "BRA", away: "JPN", kickoffUtc: "2026-06-29T17:00:00Z" },
  { home: "GER", away: "PAR", kickoffUtc: "2026-06-29T20:30:00Z" },
  { home: "NED", away: "MAR", kickoffUtc: "2026-06-30T01:00:00Z" },
  { home: "CIV", away: "NOR", kickoffUtc: "2026-06-30T17:00:00Z" },
  { home: "FRA", away: "SWE", kickoffUtc: "2026-06-30T21:00:00Z" },
  { home: "MEX", away: "ECU", kickoffUtc: "2026-07-01T01:00:00Z" },
  { home: "ENG", away: "COD", kickoffUtc: "2026-07-01T16:00:00Z" },
  { home: "BEL", away: "SEN", kickoffUtc: "2026-07-01T20:00:00Z" },
  { home: "USA", away: "BIH", kickoffUtc: "2026-07-02T00:00:00Z" },
  { home: "ESP", away: "AUT", kickoffUtc: "2026-07-02T19:00:00Z" },
  { home: "POR", away: "CRO", kickoffUtc: "2026-07-02T23:00:00Z" },
  { home: "SUI", away: "ALG", kickoffUtc: "2026-07-03T03:00:00Z" },
  { home: "AUS", away: "EGY", kickoffUtc: "2026-07-03T18:00:00Z" },
  { home: "ARG", away: "CPV", kickoffUtc: "2026-07-03T22:00:00Z" },
  { home: "COL", away: "GHA", kickoffUtc: "2026-07-04T01:30:00Z" },
];
