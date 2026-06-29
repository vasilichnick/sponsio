import { redirect } from "next/navigation";
import { DOCS_PAGES } from "@/data/docs";

// /docs opens on the first chapter.
export default function DocsIndex() {
  redirect(`/docs/${DOCS_PAGES[0].slug}`);
}
