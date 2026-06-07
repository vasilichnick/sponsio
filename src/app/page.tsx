export default function Home() {
  return (
    <>
      <section className="shrink-0 px-6 pt-32 pb-6 text-center lg:pt-18">
        {/* Edge treatment: tight dark shadow defines glyph edges over bright
            photo areas; the wide soft one seats the block on busy ones. */}
        <h1 className="font-serif text-[clamp(2rem,8.5vmin,4.5rem)] leading-[0.9] font-normal uppercase tracking-tight [-webkit-text-stroke:0.75px_rgba(0,0,0,0.9)] [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.95))_drop-shadow(0_10px_28px_rgba(0,0,0,0.55))]">
          <span className="block">Trade the teams</span>
          <span className="block">
            you <span className="text-emerald-400">believe in</span>
          </span>
          {/* Visible gap between caps rows ≈ 0.9em leading − ~0.71em cap
              height ≈ 0.19em. 3× that gap → add 2×0.19em ≈ 0.38em. */}
          <span className="mt-[0.38em] block">win the pool</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base font-medium text-white [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.95))_drop-shadow(0_4px_14px_rgba(0,0,0,0.7))] md:text-lg">
          Every team is a token. The market prices belief — match by match,
          all tournament. Fees fill one pool. Champion believers share it.
        </p>
      </section>

      {/* Spacer keeps the footer pinned to the viewport bottom. */}
      <div className="min-h-0 flex-1" />
    </>
  );
}
