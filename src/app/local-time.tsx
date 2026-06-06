"use client";

import { useEffect, useState } from "react";

function fmt(iso: string, mode: "date" | "time", utc = false) {
  const d = new Date(iso);
  if (mode === "date") {
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      ...(utc ? { timeZone: "UTC" } : {}),
    });
  }
  return d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    ...(utc ? { timeZone: "UTC", hourCycle: "h23" as const } : {}),
  });
}

/** Kickoff in the viewer's local timezone (browser converts the UTC instant
 *  via the device's own tz setting). Server-rendered fallback shows the same
 *  instant in UTC, so slow-JS / no-JS visitors never see a blank — worst
 *  case is a correct time labeled UTC. */
export function LocalTime({
  iso,
  mode,
}: {
  iso: string;
  mode: "date" | "time";
}) {
  const [local, setLocal] = useState(false);

  useEffect(() => setLocal(true), []);

  if (local) return <span>{fmt(iso, mode)}</span>;
  return (
    <span>
      {fmt(iso, mode, true)}
      {mode === "time" ? " UTC" : ""}
    </span>
  );
}
