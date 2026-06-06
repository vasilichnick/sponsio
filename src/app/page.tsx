import fixturesData from "@/data/fixtures.json";
import tokensData from "@/data/tokens.json";
import { BgStrips } from "./bg-strips";
import { LocalTime } from "./local-time";

type Token = { name: string; flag: string; ticker: string; address: string };
type Fixture = {
  match: number;
  kickoffUtc: string;
  stage: string;
  group: string;
  city: string;
  home: string;
  away: string;
};

const tokens = tokensData.teams as Record<string, Token>;
const fixtures = fixturesData.matches as Fixture[];

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;
const uniswap = (a: string) =>
  `https://app.uniswap.org/swap?chain=base&outputCurrency=${a}`;
const basescan = (a: string) => `https://basescan.org/token/${a}`;

function TeamSide({ team, align }: { team: Token; align: "home" | "away" }) {
  const right = align === "home";
  const live = team.address !== ZERO_ADDRESS;
  return (
    <div className="min-w-0">
      <div className="flex items-center justify-center gap-2.5">
        {right && <span className="font-cond truncate font-semibold uppercase">{team.name}</span>}
        <span className="text-3xl leading-none">{team.flag}</span>
        {!right && <span className="font-cond truncate font-semibold uppercase">{team.name}</span>}
      </div>
      <div className="mt-1.5 flex flex-col items-center gap-1.5">
        <span
          className={`rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs ${live ? "text-zinc-600" : "text-zinc-400"}`}
        >
          ${team.ticker}
        </span>
        {live ? (
          <a
            href={basescan(team.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-zinc-400 transition-colors hover:text-zinc-700"
          >
            {short(team.address)}
          </a>
        ) : (
          <span className="font-mono text-xs text-zinc-400 select-none">
            {short(team.address)}
          </span>
        )}
        {live ? (
          <a
            href={uniswap(team.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-emerald-500/50 px-2.5 py-1 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-50"
          >
            Trade
          </a>
        ) : (
          <span className="cursor-not-allowed rounded-md border border-zinc-200 px-2.5 py-1 text-xs font-semibold text-zinc-300 select-none">
            Trade
          </span>
        )}
      </div>
    </div>
  );
}

function MatchCard({ fx }: { fx: Fixture }) {
  return (
    <div className="rounded-xl bg-white/85 px-5 py-4 text-zinc-900 shadow-lg shadow-black/25 ring-1 ring-black/5 backdrop-blur-md transition-shadow hover:shadow-xl">
      <div className="text-xs text-zinc-500">
        {fx.group} · Match {fx.match}
      </div>
      <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <TeamSide team={tokens[fx.home]} align="home" />
        <div className="font-cond px-2 text-center text-3xl font-semibold tabular-nums">
          <LocalTime iso={fx.kickoffUtc} mode="time" />
        </div>
        <TeamSide team={tokens[fx.away]} align="away" />
      </div>
      <div className="mt-2 text-center text-xs text-zinc-500">
        Launch on <LocalTime iso={fx.kickoffUtc} mode="date" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative isolate flex h-full flex-col">
      <BgStrips />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/25 to-black/60" />
      <header className="absolute inset-x-0 top-0 z-20 flex h-16 items-center justify-between bg-black/20 px-6 backdrop-blur-[10px] md:px-10">
        <div className="font-serif text-lg font-normal tracking-tight">
          SPONSIO<span className="text-emerald-400">.fun</span>
        </div>
        <button
          type="button"
          className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
        >
          Get the app
        </button>
      </header>

      <section className="shrink-0 px-6 pt-32 pb-6 text-center lg:pt-18">
        <h1 className="font-serif text-[clamp(2rem,8.5vmin,4.5rem)] leading-[0.9] font-normal uppercase tracking-tight drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)] [-webkit-text-stroke:0.5px_rgba(0,0,0,0.85)]">
          Trade the teams <br className="hidden lg:block" />
          you believe in
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base font-medium text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] md:text-lg">
          Every team is a token. The market prices belief — match by match,
          all tournament. Fees fill one pool. Champion holders share it.
        </p>
      </section>

      <main className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 md:px-10">
        <h2 className="mb-4 text-center font-serif text-2xl font-normal uppercase tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] [-webkit-text-stroke:0.35px_rgba(0,0,0,0.85)]">
          Group Stage — Token Launch Schedule
        </h2>
        <div className="mx-auto grid max-w-[378px] gap-3 md:max-w-3xl md:grid-cols-2">
          {fixtures.map((fx) => (
            <MatchCard key={fx.match} fx={fx} />
          ))}
        </div>
      </main>

      <footer className="flex h-12 shrink-0 items-center justify-between px-6 text-xs text-white md:px-10">
        <span className="flex items-center gap-4">
          <a
            href="#"
            className="drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] transition-colors hover:text-zinc-300"
          >
            Privacy
          </a>
          <a
            href="#"
            className="drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] transition-colors hover:text-zinc-300"
          >
            Terms
          </a>
        </span>
        <span className="flex items-center gap-4">
          <a
            href="#"
            className="drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] transition-colors hover:text-zinc-300"
          >
            Manifesto
          </a>
          <a href="#" aria-label="X" className="transition-colors hover:text-zinc-300">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </span>
      </footer>
    </div>
  );
}
