import fixturesData from "@/data/fixtures.json";
import tokensData from "@/data/tokens.json";
import { BgVideo } from "./bg-video";
import { LocalTime } from "./local-time";

type Token = { name: string; flag: string; ticker: string; address: string };
type Fixture = {
  match: number;
  kickoffUtc: string;
  stage: string;
  group: string;
  venue: string;
  city: string;
  home: string;
  away: string;
};

const tokens = tokensData.teams as Record<string, Token>;
const fixtures = fixturesData.matches as Fixture[];

const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;
const uniswap = (a: string) =>
  `https://app.uniswap.org/swap?chain=base&outputCurrency=${a}`;
const basescan = (a: string) => `https://basescan.org/token/${a}`;

function TeamRow({ team }: { team: Token }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="text-xl leading-none">{team.flag}</span>
        <span className="truncate font-medium">{team.name}</span>
        <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-zinc-300">
          ${team.ticker}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <a
          href={basescan(team.address)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-zinc-500 transition-colors hover:text-zinc-300"
        >
          {short(team.address)}
        </a>
        <a
          href={uniswap(team.address)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-emerald-400/40 px-2.5 py-1 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-400/10"
        >
          Trade
        </a>
      </div>
    </div>
  );
}

function MatchCard({ fx }: { fx: Fixture }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-white/25">
      <div className="text-center text-xs text-zinc-500">
        <LocalTime iso={fx.kickoffUtc} mode="date" />
      </div>
      <TeamRow team={tokens[fx.home]} />
      <div className="py-1 text-center text-2xl font-semibold tabular-nums">
        <LocalTime iso={fx.kickoffUtc} mode="time" />
      </div>
      <TeamRow team={tokens[fx.away]} />
      <div className="mt-2 truncate text-center text-[11px] text-zinc-600">
        {fx.stage} · {fx.group} · {fx.venue} ({fx.city})
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative isolate flex h-full flex-col">
      <BgVideo />
      <div className="absolute inset-0 -z-10 bg-black/60" />
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-6 md:px-10">
        <div className="text-lg font-semibold tracking-tight">
          SPONSIO<span className="text-emerald-400">.fun</span>
        </div>
        <div className="text-xs text-zinc-500">
          World Cup 2026 · Jun 11 — Jul 19 ·{" "}
          <span className="text-zinc-300">Base</span>
        </div>
      </header>

      <section className="shrink-0 px-6 pt-8 pb-6 text-center md:pt-10">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Trade the teams you believe in.
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400 md:text-base">
          Every World Cup team is a token. The market prices belief — match by
          match, all tournament. Fees fill one pool; champion holders share it.
        </p>
        <p className="mt-2 text-xs text-zinc-500">
          Match time shown in your local time.
        </p>
      </section>

      <main className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-2 xl:grid-cols-3">
          {fixtures.map((fx) => (
            <MatchCard key={fx.match} fx={fx} />
          ))}
        </div>
      </main>

      <footer className="flex h-12 shrink-0 items-center justify-between border-t border-white/10 px-6 text-xs text-zinc-500 md:px-10">
        <span>Sponsio — football conviction, tradable.</span>
        <span>Built on Base · Trades on Uniswap · Fees → champion pool</span>
      </footer>
    </div>
  );
}
