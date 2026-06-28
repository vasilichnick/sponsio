import { coinLaunches } from "@/data/launches";
import fixturesData from "@/data/fixtures.json";

// One entry in the deck = one coin (a team's championship belief).
export type DeckEntry = (typeof coinLaunches)[number];

type Fx = { kickoffUtc: string; home: string; away: string };
const FIX = fixturesData.matches as Fx[];

/** Soonest FUTURE kickoff for a team (Infinity if it has no upcoming fixture). */
function nextKickoff(code: string, now: number): number {
  let best = Infinity;
  for (const f of FIX) {
    if (f.home === code || f.away === code) {
      const k = Date.parse(f.kickoffUtc);
      if (k > now && k < best) best = k;
    }
  }
  return best;
}

/** THE DECK ORDER — coins of the nearest upcoming match first (the two teams
 *  of the soonest kickoff lead), then by next kickoff; teams with no upcoming
 *  fixture fall to the end. This is the ONLY place ordering lives: swap this
 *  for category / volume / reward-pool / new-launch decks later WITHOUT
 *  touching the slider component. */
export function orderByNextMatch(now: number): DeckEntry[] {
  return [...coinLaunches].sort((a, b) => {
    const ka = nextKickoff(a.code, now);
    const kb = nextKickoff(b.code, now);
    if (ka !== kb) return ka - kb;
    return Date.parse(a.launch) - Date.parse(b.launch);
  });
}
