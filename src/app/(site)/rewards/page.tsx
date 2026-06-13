import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reward Pool — Sponsio",
  description:
    "Every trade pays a small fee. Those fees fill one Reward Pool that grows across the whole tournament — and when the World Cup is won, the champion's believers share it.",
};

const P = "mt-4 text-[15px] leading-relaxed text-zinc-400";

export default function Rewards() {
  return (
    <>
      <section className="shrink-0 px-6 pt-28 pb-5 text-center lg:pt-24">
        <h1 className="font-serif text-[clamp(2rem,8.5vmin,4.5rem)] leading-[0.9] font-normal uppercase tracking-tight [-webkit-text-stroke:0.75px_rgba(0,0,0,0.9)] [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.95))_drop-shadow(0_10px_28px_rgba(0,0,0,0.55))]">
          Split the Pool
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base font-medium text-white [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.95))_drop-shadow(0_4px_14px_rgba(0,0,0,0.7))] md:text-lg">
          One pool. One champion. Split among the believers who called it.
        </p>
      </section>

      <main className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 md:px-10">
        <div className="mx-auto max-w-2xl rounded-2xl bg-zinc-950/75 px-6 py-6 shadow-lg shadow-black/40 ring-1 ring-white/10 backdrop-blur-md md:px-8">
          <p className="text-lg font-semibold leading-snug text-white md:text-xl">
            Every trade pays a small fee.
          </p>
          <p className={P}>
            Those fees collect into one Reward Pool that grows across the whole
            tournament.
          </p>
          <p className={P}>
            When the World Cup is won, the champion&apos;s believers share the
            pool.
          </p>
        </div>
      </main>
    </>
  );
}
