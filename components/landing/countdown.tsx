"use client";

import { useEffect, useState } from "react";

// Launch target — fix when the launch date moves.
// Set to midnight UTC so the count is consistent in any timezone.
const LAUNCH_AT = Date.UTC(2026, 9, 21, 0, 0, 0); // Oct 21, 2026 00:00 UTC

function diffParts(target: number) {
  const now = Date.now();
  const ms = Math.max(0, target - now);
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  return { days, hours, minutes };
}

// Hydration-safe state shape. The first render (SSR + client's hydration
// pass before useEffect fires) reads from this, so the markup is byte-
// identical on both sides regardless of when the server stamped the HTML
// or when the client hydrated. Real values land after mount via useEffect.
type Parts = { days: string; hours: string; minutes: string } | null;

export function Countdown() {
  const [parts, setParts] = useState<Parts>(null);

  useEffect(() => {
    const update = () => {
      const p = diffParts(LAUNCH_AT);
      setParts({
        days: String(p.days),
        hours: String(p.hours).padStart(2, "0"),
        minutes: String(p.minutes).padStart(2, "0"),
      });
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  const days = parts?.days ?? "--";
  const hours = parts?.hours ?? "--";
  const minutes = parts?.minutes ?? "--";

  return (
    <span className="tabular-nums">
      <span className="text-text font-medium">{days}</span>
      <span className="text-muted"> days, </span>
      <span className="text-text font-medium">
        {hours}h
      </span>
      <span className="text-muted"> </span>
      <span className="text-text font-medium">
        {minutes}m
      </span>
    </span>
  );
}
