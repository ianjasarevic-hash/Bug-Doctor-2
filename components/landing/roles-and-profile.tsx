"use client";

import { Container } from "@/components/landing/container";
import { Flame } from "@/components/landing/icons";

// Merged "Roles & difficulty" + "Your track record" section.
//
// Layout:
//   - Top: one short headline + one body sentence
//   - Left (3×2 chips): role icon, name, count, example bug
//   - Right (profile card): handle / streak / level, no bordered sub-tiles inside
//
// Profile card stats at the bottom are flat text on the parent border — no
// bordered tiles inside the bordered card.

const roles = [
  {
    name: "Backend",
    icon: "BE",
    count: 412, // TODO: real count once library is locked pre-Oct-20
    example: "connection pool leak under load",
  },
  {
    name: "Frontend",
    icon: "FE",
    count: 286, // TODO
    example: "rerender storm from missing memo",
  },
  {
    name: "Full-stack",
    icon: "FS",
    count: 198, // TODO
    example: "race in the reservation flow",
  },
  {
    name: "Database",
    icon: "DB",
    count: 174, // TODO
    example: "N+1 on the orders dashboard",
  },
  {
    name: "AI / LLM",
    icon: "AI",
    count: 121, // TODO
    example: "context window blowup in summarizer",
  },
  {
    name: "DevOps / SRE",
    icon: "DO",
    count: 153, // TODO
    example: "pod OOM killed every Sunday 3am",
  },
];

// Mulberry32 seeded PRNG. Same as the heatmap in the prior Features mock.
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const ROWS = 7;
const COLS = 26; // ~26 weeks ≈ last 6 months

function buildHeatmap(): number[][] {
  const rng = mulberry32(0xBADC0FFE);
  const grid: number[][] = Array.from({ length: COLS }, () =>
    Array.from({ length: ROWS }, () => 0),
  );

  for (let c = 0; c < COLS; c++) {
    const recency = 0.35 + (c / COLS) * 0.65;
    const gapChance = 0.45 - (c / COLS) * 0.30;
    const streakBias = 0.45 + (c / COLS) * 0.45;

    for (let r = 0; r < ROWS; r++) {
      if (rng() < gapChance) {
        grid[c][r] = 0;
        continue;
      }
      const weekday = r < 5 ? 1 : 0.55;
      const sample = rng() * recency * streakBias * weekday;
      let level = 1;
      if (sample > 0.55) level = 4;
      else if (sample > 0.32) level = 3;
      else if (sample > 0.15) level = 2;
      grid[c][r] = level;
    }
  }
  return grid;
}

const HEATMAP_CLASS = [
  "bg-surface",
  "bg-action/15",
  "bg-action/30",
  "bg-action/55",
  "bg-action",
];

export function RolesAndProfile() {
  return (
    <section
      id="profile"
      aria-labelledby="profile-heading"
      className="relative py-24 sm:py-32 border-t border-border"
    >
      <Container>
        <div className="max-w-2xl">
          <h2
            id="profile-heading"
            className="text-2xl sm:text-3xl font-semibold tracking-tight"
          >
            Pick a role. Show your work.
          </h2>
          <p className="mt-3 text-muted text-lg leading-relaxed">
            Six roles, four levels. The number on the profile is your work, not
            a badge.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left: 3×2 role chips */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {roles.map((r) => (
              <div
                key={r.name}
                className="rounded-lg border border-border bg-surface p-4"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-action border border-action/40 bg-action/10 rounded px-1.5 py-0.5">
                    {r.icon}
                  </span>
                  <span className="text-sm font-medium">{r.name}</span>
                </div>
                <div className="mt-3 font-mono text-[11px] text-muted">
                  {r.count} problems
                </div>
                <div className="mt-1 text-[12px] text-text/90 leading-snug">
                  {r.example}
                </div>
              </div>
            ))}
          </div>

          {/* Right: profile card */}
          <ProfileCard />
        </div>
      </Container>
    </section>
  );
}

function ProfileCard() {
  const grid = buildHeatmap();
  return (
    <div className="lg:col-span-5 rounded-xl border border-border bg-surface shadow-card p-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-md bg-bg border border-border flex items-center justify-center font-mono text-action">
          B
        </div>
        <div className="min-w-0">
          <div className="font-mono text-sm truncate">@debug_riley</div>
          <div className="font-mono text-[11px] text-muted">
            level 12 · 4,820 XP
          </div>
        </div>
        <span className="ml-auto inline-flex h-6 items-center gap-1 rounded border border border-action/40 bg-action/10 px-2 font-mono text-[11px] text-action">
          <Flame size={12} /> 27-day streak
        </span>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between font-mono text-[11px] text-muted">
          <span>last 6 months</span>
          <span>less → more</span>
        </div>
        <div className="mt-2 grid grid-rows-7 grid-flow-col gap-1">
          {grid.flatMap((col, c) =>
            col.map((cell, r) => (
              <div
                key={`${r}-${c}`}
                className={`h-3 w-3 rounded-sm ${HEATMAP_CLASS[cell]}`}
              />
            )),
          )}
        </div>
      </div>

      {/* Flat stats — no bordered tiles inside the parent card. */}
      <div className="mt-6 pt-4 border-t border-border font-mono text-[12px] text-muted flex flex-wrap gap-x-5 gap-y-1">
        <span>
          <span className="text-text">184</span> solved
        </span>
        <span>
          <span className="text-text">87</span> avg score
        </span>
        <span>
          best role <span className="text-text">Backend</span>
        </span>
      </div>
    </div>
  );
}