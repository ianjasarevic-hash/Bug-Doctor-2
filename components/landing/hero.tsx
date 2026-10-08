"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { LinkButton } from "@/components/ui/button";
import { CodeBlock, type Line } from "@/components/landing/code-block";
import { ArrowRight, Check, Cross, Play } from "@/components/landing/icons";

// ── Hero IDE visual ──────────────────────────────────────────────────────
//
// Coherent pool-exhaustion case (matches How it works #3 incident).
//   buggy line:    const client = await pool.connect();
//   next:          return await client.query(sql, params);     ← no release
//   diff:          wrap both in try { ... } finally { client.release() }
//   checks:        2/4 failing → 4/4 passing
//
// The hero is full-viewport: min-h-[calc(100svh-2.5rem)] on lg+ so the
// announcement bar (2.5rem) doesn't push it off the fold. The copy and IDE
// flex-center vertically. On small screens the section is just a tall
// normal-flow column — no `100vh` rule, otherwise the IDE would be cut.

const fileLines: Line[] = [
  { tokens: [{ text: "import ", tone: "kw" }, { text: "{ Pool }", tone: "punct" }, { text: " from ", tone: "kw" }, { text: '"pg"', tone: "str" }, { text: ";", tone: "punct" }] },
  { tokens: [] },
  { tokens: [{ text: "const ", tone: "kw" }, { text: "pool", tone: "fn" }, { text: " = ", tone: "muted" }, { text: "new", tone: "kw" }, { text: " ", tone: "muted" }, { text: "Pool", tone: "fn" }, { text: "({", tone: "punct" }] },
  { tokens: [{ text: "  ", tone: "muted" }, { text: "max", tone: "fn" }, { text: ": ", tone: "muted" }, { text: "20", tone: "num" }, { text: ",", tone: "punct" }] },
  { tokens: [{ text: "  ", tone: "muted" }, { text: "idleTimeoutMillis", tone: "fn" }, { text: ": ", tone: "muted" }, { text: "10000", tone: "num" }, { text: ",", tone: "punct" }] },
  { tokens: [{ text: "});", tone: "punct" }] },
  { tokens: [] },
  { tokens: [{ text: "export ", tone: "kw" }, { text: "async ", tone: "kw" }, { text: "function ", tone: "kw" }, { text: "query", tone: "fn" }, { text: "(sql, params) {", tone: "punct" }] },
  // Line 9 — buggy: leaks the client on error (no try/finally)
  { tokens: [{ text: "  ", tone: "muted" }, { text: "const ", tone: "kw" }, { text: "client", tone: "fn" }, { text: " = ", tone: "muted" }, { text: "await", tone: "kw" }, { text: " ", tone: "muted" }, { text: "pool", tone: "fn" }, { text: ".connect();", tone: "punct" }] },
  { tokens: [{ text: "  ", tone: "muted" }, { text: "return ", tone: "kw" }, { text: "await", tone: "kw" }, { text: " ", tone: "muted" }, { text: "client", tone: "fn" }, { text: ".query(sql, params);", tone: "punct" }] },
  { tokens: [{ text: "}", tone: "punct" }] },
];

// Diff of the fix — what the engineer ships.
const diffLines: Line[] = [
  { tokens: [{ text: "  ", tone: "muted" }, { text: "const ", tone: "kw" }, { text: "client", tone: "fn" }, { text: " = ", tone: "muted" }, { text: "await", tone: "kw" }, { text: " ", tone: "muted" }, { text: "pool", tone: "fn" }, { text: ".connect();", tone: "punct" }] },
  { tokens: [{ text: "  ", tone: "muted" }, { text: "try", tone: "kw" }, { text: " {", tone: "punct" }] },
  { tokens: [{ text: "    ", tone: "muted" }, { text: "return ", tone: "kw" }, { text: "await", tone: "kw" }, { text: " ", tone: "muted" }, { text: "client", tone: "fn" }, { text: ".query(sql, params);", tone: "punct" }] },
  { tokens: [{ text: "  } ", tone: "punct" }, { text: "finally", tone: "kw" }, { text: " {", tone: "punct" }] },
  { tokens: [{ text: "    ", tone: "muted" }, { text: "client", tone: "fn" }, { text: ".release();", tone: "punct" }] },
  { tokens: [{ text: "  }", tone: "punct" }] },
];

export function Hero() {
  return (
    <section className="relative pt-8 pb-12 lg:pt-10 lg:pb-10 lg:min-h-[calc(100svh-2.5rem)] lg:flex lg:items-center">
      {/* Radial glow (the page-wide grid is in the layout root) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[480px] w-[820px] max-w-[100vw] rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(closest-side, rgba(139,172,255,0.35), transparent 70%)",
        }}
      />

      {/* Full-bleed layout: copy on the far left, IDE on the far right.
          The Container (1200px max) is intentionally NOT used here — this
          section spans the whole viewport on lg+. Other sections keep the
          centered Container. */}
      <div className="relative w-full px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] gap-10 lg:gap-16 items-center">
          {/* Copy — first-load choreography: every element from a different side */}
          <div className="max-w-xl">
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Interviews test puzzles.{" "}
              <motion.span
                className="text-muted inline-block text-glow-pulse"
                data-glow="bug.dr tests the work that matters."
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                bug.dr tests the work that matters.
              </motion.span>
            </motion.h1>

            <motion.p
              className="mt-6 text-lg text-muted leading-relaxed"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              AI can pass the interview in 30 seconds. It can&apos;t read a
              stack trace, find the leak, and ship the fix at 3am. bug.dr drops
              you into a{" "}
              <span
                className="text-text font-medium text-glow-soft"
                data-glow="real, broken production codebase"
              >
                real, broken production codebase
              </span>
              . You fix it.{" "}
              <span
                className="text-text font-medium text-glow-soft"
                data-glow="Automated production checks prove you did."
              >
                Automated production checks prove you did.
              </span>
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <LinkButton href="#waitlist" size="lg">
                Join the waitlist
                <ArrowRight size={16} />
              </LinkButton>
              <LinkButton href="#how-it-works" variant="secondary" size="lg">
                See how it works
              </LinkButton>
            </motion.div>

            <motion.div
              className="mt-6 flex items-center gap-6 text-xs text-muted font-mono flex-wrap"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-text">launching oct 21</span>
              <span aria-hidden className="h-3 w-px bg-border" />
              <span>no install</span>
              <span aria-hidden className="h-3 w-px bg-border" />
              <span>your first patient is waiting</span>
            </motion.div>
          </div>

          {/* IDE visual — slides in from the right on first load, then
              responds to mouse on hover (existing 3D tilt). */}
          <motion.div
            className="w-full min-w-0"
            initial={{ opacity: 0, x: 80, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroIDE />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HeroIDE() {
  // Mouse-follow 3D tilt. The outer wrapper holds perspective; the inner
  // element rotates with the cursor. Resets to flat on mouse leave.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useTransform(mx, [-0.5, 0.5], [-5, 5]);
  const rotateX = useTransform(my, [-0.5, 0.5], [4, -4]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function onMouseLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div
      className="relative"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ perspective: 1200 }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          transition: "transform 0.15s ease-out",
        }}
        className="relative"
      >
        {/* soft glow */}
        <div
          aria-hidden
          className="absolute -inset-6 rounded-2xl blur-2xl opacity-40"
          style={{
            background:
              "radial-gradient(closest-side, rgba(139,172,255,0.25), transparent 70%)",
          }}
        />

        <div className="relative rounded-xl bg-surface overflow-hidden shadow-card">
          {/* Title bar */}
          <div className="flex items-center justify-between border-b border-border bg-bg/50 px-3 py-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
            </div>
            <div className="font-mono text-[11px] text-muted truncate px-2">
              pool.ts · oncall/checkout-pool
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted font-mono">
              <Play size={11} />
              <span>run</span>
            </div>
          </div>

          {/* File tabs */}
          <div className="flex items-center gap-1 border-b border-border bg-bg/40 px-2 py-1.5 text-[11px] font-mono">
            <span className="rounded px-2 py-1 bg-surface text-text border border-border">
              pool.ts
            </span>
            <span className="rounded px-2 py-1 text-muted">incident.md</span>
            <span className="rounded px-2 py-1 text-muted">checks.ts</span>
          </div>

          {/* Code editor — buggy pool.ts */}
          <div className="bg-bg px-4 py-3 text-[13px] leading-6 overflow-x-auto">
            <CodeBlock lines={fileLines} />
          </div>

          {/* Buggy line annotation */}
          <div className="flex items-center justify-between border-t border-border bg-[#1a1c20] px-4 py-2 text-[11px] font-mono">
            <div className="flex items-center gap-2 text-muted">
              <motion.span
                className="inline-flex h-4 w-6 items-center justify-center rounded-sm bg-text text-action"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Cross size={11} />
              </motion.span>
              <span>
                line <span className="text-text">9</span>:{" "}
                <span className="text-muted">client never released on error</span>
              </span>
            </div>
            <motion.span
              className="text-action"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              → ship the fix
            </motion.span>
          </div>

          {/* Diff — what gets shipped */}
          <div className="border-t border-border">
            <div className="flex items-center justify-between px-4 py-2 font-mono text-[11px] text-muted border-b border-border bg-bg/40">
              <span>diff · try/finally</span>
              <span className="text-diffEasy">+ 6</span>
            </div>
            <div className="bg-bg px-4 py-2 text-[12.5px] leading-5 overflow-x-auto">
              <DiffBlock lines={diffLines} />
            </div>
          </div>

          {/* Checks panel — animates 2/4 failing → 4/4 passing */}
          <ChecksPanel />
        </div>
      </motion.div>
    </div>
  );
}

function DiffBlock({ lines }: { lines: Line[] }) {
  return (
    <pre
      className="font-mono whitespace-pre"
      style={{
        fontVariantLigatures: "none",
        fontFeatureSettings: '"liga" 0, "calt" 0',
      }}
    >
      {lines.map((line, i) => (
        <div key={i} className="flex">
          <span className="select-none shrink-0 w-6 text-diffEasy pl-1">
            +
          </span>
          <span className="min-w-0">
            {line.tokens.length === 0 ? (
              <span> </span>
            ) : (
              line.tokens.map((tok, j) => (
                <span
                  key={j}
                  className={
                    tok.tone === "kw"
                      ? "text-diffEasy"
                      : tok.tone === "fn"
                        ? "text-text"
                        : tok.tone === "num"
                          ? "text-diffEasy"
                          : "text-text"
                  }
                >
                  {tok.text}
                </span>
              ))
            )}
          </span>
        </div>
      ))}
    </pre>
  );
}

function ChecksPanel() {
  // Before the fix: 2 of these would be failing (pool size, leak rate).
  // After the fix: all 4 pass. We animate the row glyphs in to convey
  // the flip; the header counter swaps from "2/4 passing" to "4/4 passing".
  const checks: { label: string; passAt: number }[] = [
    { label: "p99 latency < 300ms @ 500 rps", passAt: 0.6 },
    { label: "test suite green", passAt: 0.9 },
    { label: "pool size never exceeds 20", passAt: 1.5 },
    { label: "no connection leak under load", passAt: 1.8 },
  ];

  return (
    <div className="border-t border-border bg-surface px-4 py-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
          production checks
        </span>
        <ChecksCounter />
      </div>
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {checks.map((c) => (
          <CheckRow key={c.label} label={c.label} passAt={c.passAt} />
        ))}
      </div>
    </div>
  );
}

function ChecksCounter() {
  return (
    <span className="relative inline-block font-mono text-[11px] text-action min-w-[90px] text-right">
      <motion.span
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 1.4, duration: 0.3 }}
        className="absolute right-0 top-0"
      >
        2 / 4 passing
      </motion.span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.3 }}
      >
        4 / 4 passing
      </motion.span>
    </span>
  );
}

function CheckRow({ label, passAt }: { label: string; passAt: number }) {
  // Pass at the delay, otherwise stays failing.
  return (
    <motion.div
      initial={{ opacity: 0.4 }}
      animate={{ opacity: 1 }}
      transition={{ delay: passAt, duration: 0.3 }}
      className="flex items-center gap-2 rounded border border-border bg-bg/50 px-2.5 py-1.5 text-[12px] font-mono"
    >
      <motion.span
        initial={{ scale: 0.6, opacity: 0.4 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: passAt + 0.1, duration: 0.3 }}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-action/15 text-action ring-1 ring-action/40"
      >
        <Check size={11} />
      </motion.span>
      <span className="text-text truncate">{label}</span>
    </motion.div>
  );
}
