import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DOCS_PAGES, pageBySlug } from "@/data/docs";
import { Markdown } from "../markdown";

// Prerender every docs page so each chapter is its own deep-linkable URL.
export function generateStaticParams() {
  return DOCS_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = pageBySlug(slug);
  return { title: page ? `${page.title} — Sponsio Docs` : "Sponsio Docs" };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = pageBySlug(slug);
  if (!page) notFound();

  const idx = DOCS_PAGES.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? DOCS_PAGES[idx - 1] : null;
  const next = idx < DOCS_PAGES.length - 1 ? DOCS_PAGES[idx + 1] : null;

  return (
    <>
      <p className="font-cond mb-2 text-[11px] font-semibold tracking-[0.2em] text-emerald-400/80 uppercase">
        The Belief Economy
      </p>
      <h1 className="font-serif mb-6 text-3xl leading-tight font-normal tracking-tight text-white sm:text-4xl">
        {page.title}
      </h1>

      <Markdown source={page.body} />

      <nav className="mt-14 flex items-stretch justify-between gap-3 border-t border-white/10 pt-6">
        {prev ? (
          <Link
            href={`/docs/${prev.slug}`}
            className="group flex flex-1 flex-col rounded-xl border border-white/10 px-4 py-3 transition-colors hover:border-emerald-400/40 hover:bg-white/[0.03]"
          >
            <span className="font-cond text-[10px] tracking-[0.2em] text-zinc-600 uppercase">Previous</span>
            <span className="mt-0.5 text-sm font-semibold text-zinc-300 group-hover:text-emerald-300">{prev.title}</span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
        {next ? (
          <Link
            href={`/docs/${next.slug}`}
            className="group flex flex-1 flex-col items-end rounded-xl border border-white/10 px-4 py-3 text-right transition-colors hover:border-emerald-400/40 hover:bg-white/[0.03]"
          >
            <span className="font-cond text-[10px] tracking-[0.2em] text-zinc-600 uppercase">Next</span>
            <span className="mt-0.5 text-sm font-semibold text-zinc-300 group-hover:text-emerald-300">{next.title}</span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
      </nav>
    </>
  );
}
