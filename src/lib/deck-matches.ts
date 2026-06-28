import { upcomingFixtures } from "./upcoming";
import { liveFixtures } from "./live-fixtures";
import { R32_SCHEDULE, type R32Match } from "@/data/r32-schedule";
import { coinLaunches } from "@/data/launches";

// Codes we actually have a Sponsio coin for — a match only enters the deck if
// BOTH its teams have a coin (so every half-card can show flag/ticker/CA).
const codes = new Set(coinLaunches.map((c) => c.code));
const bothHaveCoins = (m: R32Match) => codes.has(m.home) && codes.has(m.away);
const byKickoff = (a: R32Match, b: R32Match) =>
  a.kickoffUtc < b.kickoffUtc ? -1 : a.kickoffUtc > b.kickoffUtc ? 1 : 0;

/** The event-deck match list. LIVE-DRIVEN where API-Football is available:
 *  the match being PLAYED RIGHT NOW leads the deck, then the upcoming matches
 *  by kickoff. Finished games are absent from both feeds, so they drop on full
 *  time and the next match takes the front. Upcoming includes later knockout
 *  rounds (R16, QF, SF, Final) the moment API-Football sets them — and because
 *  the 2026 bracket is FIXED, those fixtures arrive already filled with the
 *  advancing winners, so the next-round cards populate themselves (no bracket
 *  logic here). Falls back to the static R32 schedule with no key (dev). */
export async function getDeckMatches(): Promise<R32Match[]> {
  let live: R32Match[] = [];
  let upcoming: R32Match[] = [];
  try {
    const [lf, uf] = await Promise.all([liveFixtures(), upcomingFixtures()]);
    const toMatch = (f: { home: string; away: string; kickoffUtc: string }) => ({
      home: f.home,
      away: f.away,
      kickoffUtc: f.kickoffUtc,
    });
    live = (lf ?? []).map(toMatch);
    upcoming = (uf ?? []).map(toMatch);
  } catch {
    /* fall through to the static fallback */
  }

  // Live path: in-play first, then upcoming by kickoff, deduped, coin-filtered.
  if (live.length || upcoming.length) {
    const seen = new Set<string>();
    const out: R32Match[] = [];
    for (const m of [...live, ...upcoming.sort(byKickoff)]) {
      const key = `${m.home}-${m.away}`;
      if (seen.has(key) || !bothHaveCoins(m)) continue;
      seen.add(key);
      out.push(m);
    }
    return out;
  }

  // Dev / no-key fallback: the static Round-of-32 schedule, nearest kickoff first.
  return [...R32_SCHEDULE].filter(bothHaveCoins).sort(byKickoff);
}
