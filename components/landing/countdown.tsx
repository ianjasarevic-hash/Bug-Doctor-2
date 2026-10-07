"use client";

import { useEffect, useState } from "react";

// Launch target — fix when the launch date moves.
// Set to midnight UTC so the count is consistent in any timezone.
const LAUNCH_AT = Date.UTC(2026, 9, 20, 0, 0, 0); // Oct 20, 2026 00:00 UTC

function diffParts(target: number) {
  const now = Date.now();
  const ms = Math.max(0, target - now);
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  return { days, hours, minutes };
}

export function Countdown() {
  const [{ days, hours, minutes }, setT] = useState(() => diffParts(LAUNCH_AT));

  useEffect(() => {
    const id = setInterval(() => setT(diffParts(LAUNCH_AT)), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="tabular-nums">
      <span className="text-text font-medium">{days}</span>
      <span className="text-muted"> days, </span>
      <span className="text-text font-medium">
        {String(hours).padStart(2, "0")}h
      </span>
      <span className="text-muted"> </span>
      <span className="text-text font-medium">
        {String(minutes).padStart(2, "0")}m
      </span>
    </span>
  );
}