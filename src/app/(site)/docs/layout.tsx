import type { Metadata } from "next";
import { DocsSidebar } from "./docs-sidebar";

export const metadata: Metadata = { title: "Docs — Sponsio" };

// Docs shell inside the viewport-locked site layout: a left link-tree rail and a
// scrollable content column (the docs are long, so they scroll internally — the
// rest of the site stays viewport-locked). Flat dark, same as /about. On mobile
// the rail collapses into a top bar.
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-0 flex-1 bg-[#0a0a0b]">
      <div className="mx-auto flex h-full max-w-[1080px] flex-col lg:flex-row">
        <DocsSidebar />
        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto pt-6 pb-24 lg:[padding-top:5rem]">
          <article className="mx-auto w-full max-w-[700px] px-5 sm:px-8">{children}</article>
        </div>
      </div>
    </main>
  );
}
