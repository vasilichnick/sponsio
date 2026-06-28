import type { Metadata } from "next";

export const metadata: Metadata = { title: "Coming soon — Sponsio" };

// Placeholder destination for Leaderboard and Docs until those ship. Plain
// dark page, matching the About canvas.
export default function ComingSoon() {
  return (
    <main className="relative min-h-0 flex-1 bg-[#0a0a0b]">
      <div className="flex h-full items-center justify-center px-6 text-center">
        <p className="font-cond text-sm font-semibold tracking-[0.25em] text-zinc-500 uppercase">
          coming soon
        </p>
      </div>
    </main>
  );
}
