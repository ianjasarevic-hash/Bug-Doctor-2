"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/landing/container";
import { Flame } from "@/components/landing/icons";

const roles = [
  {
    name: "Backend",
    icon: "BE",
    count: 412,
    example: "connection pool leak under load",
  },
  {
    name: "Frontend",
    icon: "FE",
    count: 286,
    example: "rerender storm from missing memo",
  },
  {
    name: "Full-stack",
    icon: "FS",
    count: 198,
    example: "race in the reservation flow",
  },
  {
    name: "Database",
    icon: "DB",
    count: 174,
    example: "N+1 on the orders dashboard",
  },
  {
    name: "AI / LLM",
    icon: "AI",
    count: 121,
    example: "context window blowup in summarizer",
  },
  {
    name: "DevOps / SRE",
    icon: "DO",
    count: 153,
    example: "pod OOM killed every Sunday 3am",
  },
];

// Mulberry32 seeded PRNG.
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
const COLS = 26;

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

// Per-chip entry direction so the 3x2 grid "puzzles" into place from
// every side as the section scrolls into view.
const chipFrom: ("left" | "right" | "top" | "bottom")[] = [
  "left",
  "top",
  "right",
  "left",
  "right",
  "bottom",
];

export function RolesAndProfile() {
  return (
    <section
      id="profile"
      aria-labelledby="profile-heading"
      className="relative py-24 sm:py-32 border-t border-border cv-auto"
    >
      <Container>
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
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
        </motion.div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left: 3×2 role chips */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {roles.map((r, i) => (
              <RoleChip
                key={r.name}
                role={r}
                from={chipFrom[i]}
                delay={i * 0.07}
              />
            ))}
          </div>

          {/* Right: profile card */}
          <ProfileCard />
        </div>
      </Container>
    </section>
  );
}

function RoleChip({
  role,
  from,
  delay,
}: {
  role: (typeof roles)[number];
  from: "left" | "right" | "top" | "bottom";
  delay: number;
}) {
  const reduce = useReducedMotion();
  const off =
    from === "left"
      ? { x: -40, y: 0 }
      : from === "right"
        ? { x: 40, y: 0 }
        : from === "top"
          ? { x: 0, y: -30 }
          : { x: 0, y: 30 };
  return (
    <motion.div
      className="rounded-lg border border-border bg-surface p-4"
      initial={{ opacity: 0, x: reduce ? 0 : off.x, y: reduce ? 0 : off.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] text-action border border-action/40 bg-action/10 rounded px-1.5 py-0.5">
          {role.icon}
        </span>
        <span className="text-sm font-medium">{role.name}</span>
      </div>
      <div className="mt-3 font-mono text-[11px] text-muted">
        <CountUp to={role.count} className="text-text" /> problems
      </div>
      <div className="mt-1 text-[12px] text-text/90 leading-snug">
        {role.example}
      </div>
    </motion.div>
  );
}

// CountUp: animates an integer from 0 → `to` over ~1s when the element
// scrolls into view. Uses IntersectionObserver to start the animation.
function CountUp({
  to,
  className,
  duration = 1.1,
}: {
  to: number;
  className?: string;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current || started) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    if (reduce) {
      setValue(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / (duration * 1000));
      // ease-out-quint
      const eased = 1 - Math.pow(1 - p, 5);
      setValue(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, to, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString()}
    </span>
  );
}

function ProfileCard() {
  const grid = buildHeatmap();
  return (
    <motion.div
      className="lg:col-span-5 rounded-xl border border-border bg-surface shadow-card p-6"
      initial={{ opacity: 0, x: 60, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          className="h-10 w-10 rounded-md bg-bg border border-border flex items-center justify-center font-mono text-action"
          initial={{ scale: 0.6, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          B
        </motion.div>
        <div className="min-w-0">
          <div className="font-mono text-sm truncate">@debug_riley</div>
          <div className="font-mono text-[11px] text-muted">
            level <CountUp to={12} className="text-text" /> ·{" "}
            <CountUp to={4820} className="text-text" /> XP
          </div>
        </div>
        <motion.span
          className="ml-auto inline-flex h-6 items-center gap-1 rounded border border-action/40 bg-action/10 px-2 font-mono text-[11px] text-action"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            animate={{ scale: [1, 1.15, 1], rotate: [0, -4, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex"
          >
            <Flame size={12} />
          </motion.span>
          <CountUp to={27} />-day streak
        </motion.span>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between font-mono text-[11px] text-muted">
          <span>last 6 months</span>
          <span>less → more</span>
        </div>
        <motion.div
          className="mt-2 origin-bottom"
          initial={{ opacity: 0, y: 8, rotateX: 0 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 28 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ perspective: 500, transformStyle: "preserve-3d" }}
        >
          <div className="grid grid-rows-7 grid-flow-col gap-1">
            {grid.flatMap((col, c) =>
              col.map((cell, r) => (
                <div
                  key={`${r}-${c}`}
                  className={`h-3 w-3 rounded-sm ${HEATMAP_CLASS[cell]}`}
                  style={{
                    transform: `translateZ(${cell * 4}px)`,
                    transformStyle: "preserve-3d",
                  }}
                />
              )),
            )}
          </div>
        </motion.div>
      </div>

      {/* Flat stats — count-up + fade-in stagger. */}
      <div className="mt-6 pt-4 border-t border-border font-mono text-[12px] text-muted flex flex-wrap gap-x-5 gap-y-1">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <CountUp to={184} className="text-text" /> solved
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <CountUp to={87} className="text-text" /> avg score
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          best role <span className="text-text">Backend</span>
        </motion.span>
      </div>
    </motion.div>
  );
}
