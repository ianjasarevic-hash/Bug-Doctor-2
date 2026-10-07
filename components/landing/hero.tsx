"use client";

import { motion } from "framer-motion";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/landing/container";
import { CodeBlock, type Line } from "@/components/landing/code-block";
import { ArrowRight, Check, Cross, Play } from "@/components/landing/icons";

// ── Hero IDE visual ──────────────────────────────────────────────────────
//
// Coherent pool-exhaustion case (matches How it works #3 incident).
//   buggy line:    const client = await pool.connect();
//   next:          return await client.query(sql, params);     ← no release
//   diff:          wrap both in try { ... } finally { client.release() }
//   checks:        2/4 failing → 4/4 passing

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
  { tokens: [{ text: "  ", tone: "muted" }, { text: "} ", tone: "punct" }, { text: "finally", tone: "kw" }, { text: " {", tone: "punct" }] },
  { tokens: [{ text: "    ", tone: "muted" }, { text: "client", tone: "fn" }, { text: ".release();", tone: "punct" }] },
  { tokens: [{ text: "  ", tone: "muted" }, { text: "}", tone: "punct" }] },
];

export function Hero() {
  return (
    <section className="relative pt-10 pb-16 sm:pt-12 sm:pb-20">
      {/* Background grid + radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[480px] w-[820px] max-w-[100vw] rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(closest-side, rgba(139,172,255,0.35), transparent 70%)",
        }}
      />

      <Container className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Copy */}
          <div className="lg:col-span-6 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]">
              AI can solve LeetCode.{" "}
              <span className="text-muted">It can&apos;t fix prod at 3am.</span>
            </h1>

            <p className="mt-6 text-lg text-muted leading-relaxed max-w-xl">
              bug.dr drops you into a real, broken production codebase. Read
              the incident, ship the fix in the browser, and pass automated
              checks. Your score proves you can be trusted with prod.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <LinkButton href="#waitlist" size="lg">
                Join the waitlist
                <ArrowRight size={16} />
              </LinkButton>
              <LinkButton href="#how-it-works" variant="secondary" size="lg">
                See how it works
              </LinkButton>
            </div>

            <div className="mt-6 flex items-center gap-6 text-xs text-muted font-mono">
              <span className="text-text">launching oct 20</span>
              <span aria-hidden className="h-3 w-px bg-border" />
              <span>no install</span>
              <span aria-hidden className="h-3 w-px bg-border" />
              <span>your first patient is waiting</span>
            </div>
          </div>

          {/* IDE visual */}
          <div className="lg:col-span-6">
            <HeroIDE />
          </div>
        </div>
      </Container>
    </section>
  );
}

function HeroIDE() {
  return (
    <div className="relative">
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
            <span className="inline-flex h-4 w-6 items-center justify-center rounded-sm bg-text text-action">
              <Cross size={11} />
            </span>
            <span>
              line <span className="text-text">9</span>:{" "}
              <span className="text-muted">client never released on error</span>
            </span>
          </div>
          <span className="text-action">→ ship the fix</span>
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