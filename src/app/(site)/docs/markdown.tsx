import { Fragment } from "react";

/** Render the small markdown subset used in docs content (see @/data/docs):
 *  blank-line paragraphs, `- ` bullet lists, a `> ` blockquote, and inline
 *  **bold**. Input is our own controlled content, and we build React nodes
 *  (never raw HTML), so there is nothing to sanitize. */

function inline(text: string) {
  // odd indices are the captured **bold** segments
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-white">
        {part}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export function Markdown({ source }: { source: string }) {
  const blocks = source.trim().split(/\n\s*\n/);
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split("\n");

        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="my-5 flex flex-col gap-2.5">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-3 text-[15px] leading-7 text-zinc-300 sm:text-base">
                  <span aria-hidden className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-emerald-400/70" />
                  <span>{inline(l.slice(2))}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.startsWith("> ")) {
          const quote = lines.map((l) => l.replace(/^>\s?/, "")).join(" ");
          return (
            <blockquote
              key={i}
              className="my-7 rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.04] px-6 py-5 text-lg leading-relaxed font-medium text-zinc-100"
            >
              {inline(quote)}
            </blockquote>
          );
        }

        return (
          <p key={i} className="my-4 text-[15px] leading-7 text-zinc-300 sm:text-base sm:leading-8">
            {inline(block)}
          </p>
        );
      })}
    </>
  );
}
