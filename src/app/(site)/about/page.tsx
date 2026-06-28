import type { Metadata } from "next";

export const metadata: Metadata = { title: "About — Sponsio" };

// The future main/about page — a blank dark canvas for now, built block by
// block. Opaque background so the flat site backdrop reads as plain black here
// (no photo strips — those live only on the home deck).
export default function About() {
  return (
    <main className="relative min-h-0 flex-1 bg-[#0a0a0b]">
      <div className="flex h-full items-center justify-center px-6 text-center">
        <p className="font-cond text-sm font-semibold tracking-[0.25em] text-zinc-600 uppercase">
          building block by block
        </p>
      </div>
    </main>
  );
}
