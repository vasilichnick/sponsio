"use client";

import { useEffect, useState } from "react";

/** Renders a UTC kickoff in the viewer's local timezone (client-side only). */
export function LocalTime({
  iso,
  mode,
}: {
  iso: string;
  mode: "date" | "time";
}) {
  const [text, setText] = useState("");

  useEffect(() => {
    const d = new Date(iso);
    setText(
      mode === "date"
        ? d.toLocaleDateString(undefined, {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
    );
  }, [iso, mode]);

  return <span suppressHydrationWarning>{text}</span>;
}
