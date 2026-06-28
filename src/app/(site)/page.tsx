import { getDeckMatches } from "@/lib/deck-matches";
import { getCoinStats } from "@/lib/coin-stats";
import { EventDeck } from "./event-deck";
import { BgStrips } from "./bg-strips";

// Live-driven: regenerate every 60s on match days so the front card tracks the
// game being played now and finished matches drop promptly.
export const revalidate = 60;

// Home IS the event deck: the user lands straight on the coins to trade right
// now — the live knockout matches, two teams per card, swipeable in schedule
// order. The football photo-strip background lives here (only behind the deck);
// other routes use the flat dark backdrop. `isolate` keeps the strips behind
// the deck but above the layout backdrop.
export default async function Home() {
  const [matches, stats] = await Promise.all([getDeckMatches(), getCoinStats()]);
  return (
    <main className="relative min-h-0 flex-1">
      <BgStrips />
      <EventDeck matches={matches} stats={stats} />
    </main>
  );
}
