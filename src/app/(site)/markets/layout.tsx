import { MarketsChrome } from "./markets-chrome";

/** Shared chrome for every belief market (/markets/*): the page header and
 *  the market switcher. Each market page renders only its own board. The
 *  hero + switcher live in MarketsChrome (a client gate) so a single coin
 *  page (/markets/champion/[code]) can drop them and run content-first. */
export default function MarketsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MarketsChrome />
      {/* Data zone: solid #000 — the animated photo strips stop reading
          here (the layer is opaque and its ::after paints black behind the
          footer too, at negative z so footer text stays on top). The
          border is the table↔footer divider. */}
      <div className="relative min-h-0 flex-1 border-b border-white/15 bg-black after:absolute after:inset-x-0 after:top-full after:-z-[1] after:h-28 after:bg-black after:content-['']">
        <main className="flex h-full min-h-0 flex-col">{children}</main>
      </div>
    </>
  );
}
