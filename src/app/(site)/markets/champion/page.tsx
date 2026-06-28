import { redirect } from "next/navigation";
import { coinLaunches } from "@/data/launches";
import { orderByNextMatch } from "./deck-order";

// The Champion market IS the swipe deck now. The index sends you to the
// nearest-upcoming-match coin, where the full-screen CoinDeck takes over
// (each coin is its own deep-linkable URL from there).
export default function ChampionMarket() {
  const first = orderByNextMatch(Date.now())[0]?.code ?? coinLaunches[0].code;
  redirect(`/markets/champion/${first}`);
}
