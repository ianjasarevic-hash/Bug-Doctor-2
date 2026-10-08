"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/landing/container";
import { CodeBlock, type Line } from "@/components/landing/code-block";
import { Check } from "@/components/landing/icons";

const incidentStack: Line[] = [
  { tokens: [{ text: "Error: pool.query timeout after 30000ms", tone: "text" }] },
  { tokens: [{ text: "    at /services/checkout/pool.ts:42:18", tone: "muted" }] },
  { tokens: [{ text: "    at runMicrotasks", tone: "muted" }] },
  { tokens: [{ text: "    at processTicksAndRejections", tone: "muted" }] },
];

const poolOriginal: Line[] = [
  { tokens: [{ text: "  ", tone: "muted" }, { text: "const ", tone: "kw" }, { text: "client", tone: "fn" }, { text: " = ", tone: "muted" }, { text: "await", tone: "kw" }, { text: " ", tone: "muted" }, { text: "pool", tone: "fn" }, { text: ".connect();", tone: "punct" }] },
  { tokens: [{ text: "  ", tone: "muted" }, { text: "return ", tone: "kw" }, { text: "await", tone: "kw" }, { text: " ", tone: "muted" }, { text: "client", tone: "fn" }, { text: ".query(sql, params);", tone: "punct" }] },
];
const poolAdded: Line[] = [
  { tokens: [{ text: "  ", tone: "muted" }, { text: "try", tone: "kw" }, { text: " {", tone: "punct" }] },
  { tokens: [{ text: "    ", tone: "muted" }, { text: "return ", tone: "kw" }, { text: "await", tone: "kw" }, { text: " ", tone: "muted" }, { text: "client", tone: "fn" }, { text: ".query(sql, params);", tone: "punct" }] },
  { tokens: [{ text: "  } ", tone: "punct" }, { text: "finally", tone: "kw" }, { text: " {", tone: "punct" }] },
  { tokens: [{ text: "    ", tone: "muted" }, { text: "client", tone: "fn" }, { text: ".release();", tone: "punct" }] },
  { tokens: [{ text: "  }", tone: "punct" }] },
];

const dischargeChecks: { label: string; value: string }[] = [
  { label: "p99 latency < 300ms @ 500 rps", value: "142ms" },
  { label: "pool size never exceeds 20", value: "16 / 20" },
  { label: "no connection leak under load", value: "0 leaks / M" },
  { label: "test suite green", value: "14 / 14" },
];

const terminal: { text: string; tone?: "prompt" | "ok" | "muted" | "accent" | "text" }[] = [
  { text: "$ bugdr submit", tone: "prompt" },
  { text: "" },
  { text: "✓ p99 latency      142ms   (budget 300ms)", tone: "ok" },
  { text: "✓ pool size        16/20", tone: "ok" },
  { text: "✓ connection leaks 0", tone: "ok" },
  { text: "✓ test suite       14/14", tone: "ok" },
  { text: "base        hard           400", tone: "muted" },
  { text: "time        18:42 / 45:00  ×1.4", tone: "muted" },
  { text: "diff        +6 −2          ×1.2", tone: "muted" },
  { text: "─────────────────────────────", tone: "muted" },
  { text: "score                      672 XP", tone: "accent" },
  { text: "prod-ready                 94%   discharged", tone: "text" },
];

export function HowItWorks() {
  const items = [
    {
      n: "01",
      label: "Diagnose",
      title: "Read the incident.",
      body:
        "Open the case file. A real bug report, a stack trace, the production error. The timer starts on Start. Nobody can leak the fix in comments until you solve it.",
      visual: <IncidentMock />,
      copyFrom: "left" as const,
      visualFrom: "right" as const,
    },
    {
      n: "02",
      label: "Treat",
      title: "Fix it in the browser.",
      body:
        "Open the codebase in the browser IDE. Editor, terminal, live preview. Trace the bug. Ship a real diff. Use any tool you would on a real prod incident.",
      visual: <IdeMock />,
      copyFrom: "right" as const,
      visualFrom: "left" as const,
    },
    {
      n: "03",
      label: "Discharge",
      title: "Pass the checks.",
      body:
        "Automated production checks run against your fix. p99 under load, pool size, leak rate, test suite. When all four pass, the system is discharged healthy and your score is locked.",
      visual: <DischargeMock />,
      copyFrom: "left" as const,
      visualFrom: "right" as const,
    },
  ];

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="relative py-24 sm:py-32 border-t border-border"
    >
      <Container>
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-xs uppercase tracking-widest text-action">
            How it works
          </p>
          <h2
            id="how-heading"
            className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-glow-pulse"
            data-glow="Diagnose. Treat. Discharge."
          >
            Diagnose. Treat. Discharge.
          </h2>
          <p className="mt-4 text-muted text-lg leading-relaxed">
            Every case follows the same three steps. Read the incident, ship
            the fix, prove it under load.
          </p>
        </motion.div>

        <ol className="mt-14 space-y-16">
          {items.map((item) => (
            <li
              key={item.n}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              <HowCopy
                n={item.n}
                label={item.label}
                title={item.title}
                body={item.body}
                from={item.copyFrom}
              />
              <HowVisual from={item.visualFrom}>{item.visual}</HowVisual>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

function HowCopy({
  n,
  label,
  title,
  body,
  from,
}: {
  n: string;
  label: string;
  title: string;
  body: string;
  from: "left" | "right";
}) {
  const reduce = useReducedMotion();
  const x = from === "left" ? -60 : 60;
  return (
    <motion.div
      className="lg:col-span-5"
      initial={{ opacity: 0, x: reduce ? 0 : x, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="font-mono text-sm text-muted">
        <span className="text-action">{n}</span>
        <span aria-hidden> · </span>
        <span className="uppercase tracking-wider">{label}</span>
      </div>
      <h3 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">
        {title}
      </h3>
      <p className="mt-3 text-muted text-lg leading-relaxed">{body}</p>
    </motion.div>
  );
}

function HowVisual({
  from,
  children,
}: {
  from: "left" | "right" | "top" | "bottom";
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const off =
    from === "left"
      ? { x: -60, y: 0 }
      : from === "right"
        ? { x: 60, y: 0 }
        : from === "top"
          ? { x: 0, y: -40 }
          : { x: 0, y: 40 };
  return (
    <motion.div
      className="lg:col-span-7"
      initial={{ opacity: 0, x: reduce ? 0 : off.x, y: reduce ? 0 : off.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function IncidentMock() {
  // Stagger: header → title → body → stack
  const reduce = useReducedMotion();
  const fade = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.4, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <div className="rounded-xl border border-border bg-surface shadow-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-bg/50 px-4 py-2 font-mono text-[11px]">
        <span className="text-muted">incident.md</span>
        <span className="text-muted">checkout · prod-east-1</span>
      </div>
      <div className="p-5 font-mono text-[13px] leading-6">
        <motion.div className="text-text" {...fade(0)}>
          # 2026-09-30 · checkout pool p99 spikes to 4.2s
        </motion.div>
        <motion.div className="text-muted mt-2" {...fade(1)}>
          Started 18:11 UTC. 4xx rate on POST /checkout climbed from 0.4%
          to 8.1%. Page fires.
        </motion.div>
        <motion.div className="mt-3 text-text" {...fade(2)}>
          stack:
        </motion.div>
        <motion.div
          className="mt-2 bg-bg rounded-md p-3 overflow-x-auto"
          {...fade(3)}
        >
          <CodeBlock lines={incidentStack} showLineNumbers={false} />
        </motion.div>
      </div>
    </div>
  );
}

function IdeMock() {
  // Diff animation: the "removed" lines slide out to the left, the "added"
  // lines slide in from the right. Done with the same per-line RevealItem
  // pattern but explicit so we can target each side.
  const reduce = useReducedMotion();

  return (
    <div className="rounded-xl border border-border bg-surface shadow-card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border bg-bg/50 px-3 py-2 font-mono text-[11px]">
        <span className="h-2 w-2 rounded-full bg-border" />
        <span className="h-2 w-2 rounded-full bg-border" />
        <span className="h-2 w-2 rounded-full bg-border" />
        <span className="ml-2 text-muted">pool.ts · diff</span>
      </div>
      <div className="bg-bg px-4 py-3 text-[13px] leading-6 overflow-x-auto">
        {poolOriginal.map((line, i) => (
          <motion.div
            key={`r-${i}`}
            className="flex"
            initial={{ opacity: 0, x: reduce ? 0 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.4,
              delay: 0.2 + i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span className="shrink-0 select-none w-6 text-diffImpossible/80 pr-6">
              −
            </span>
            <span className="min-w-0 text-diffImpossible/80 line-through">
              {line.tokens.map((tok, j) => (
                <span key={j}>{tok.text}</span>
              ))}
            </span>
          </motion.div>
        ))}
        {poolAdded.map((line, i) => (
          <motion.div
            key={`a-${i}`}
            className="flex"
            initial={{ opacity: 0, x: reduce ? 0 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.4,
              delay: 0.45 + i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span className="shrink-0 select-none w-6 text-diffEasy pr-6">
              +
            </span>
            <span className="min-w-0 text-text">
              {line.tokens.map((tok, j) => (
                <span
                  key={j}
                  className={
                    tok.tone === "kw" ? "text-diffEasy" : "text-text"
                  }
                >
                  {tok.text}
                </span>
              ))}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-border bg-bg/60 px-4 py-2 font-mono text-[11px] text-muted">
        <span>
          <span className="text-diffImpossible">− 2</span>
          <span className="mx-2 text-border">·</span>
          <span className="text-diffEasy">+ 5</span>
        </span>
        <span className="text-action">commit → run checks</span>
      </div>
    </div>
  );
}

function DischargeMock() {
  const reduce = useReducedMotion();

  // Per-line reveal animation: each line fades in 80ms after the previous.
  // Respects prefers-reduced-motion by skipping the stagger.
  const lineVariants = {
    hidden: { opacity: 0 },
    show: (i: number) => ({
      opacity: 1,
      transition: {
        delay: reduce ? 0 : 0.3 + i * 0.08,
        duration: 0.18,
      },
    }),
  };

  // Check rows: stagger in from the right.
  const checkVariants = (i: number) => ({
    initial: { opacity: 0, x: reduce ? 0 : 30 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: {
      duration: 0.45,
      delay: 0.15 + i * 0.08,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  });

  return (
    <div className="rounded-xl border border-border bg-surface shadow-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-bg/50 px-4 py-2 font-mono text-[11px]">
        <span className="text-muted uppercase tracking-wider">
          production checks
        </span>
        <span className="text-action">4 / 4 passing</span>
      </div>

      {/* Check rows (no inner boxes — just rows) */}
      <div className="px-5 py-4 space-y-1.5 font-mono text-[13px]">
        {dischargeChecks.map((c, i) => (
          <motion.div
            key={c.label}
            className="flex items-center gap-3"
            {...checkVariants(i)}
          >
            <span className="text-success">✓</span>
            <span className="text-text flex-1">{c.label}</span>
            <span className="text-muted">{c.value}</span>
          </motion.div>
        ))}
      </div>

      {/* Terminal output. */}
      <div className="border-t border-border bg-bg px-5 py-4 overflow-x-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="font-mono text-[12.5px] leading-[1.7]"
        >
          {terminal.map((line, i) => (
            <motion.div
              key={i}
              variants={lineVariants}
              custom={i}
              className={
                line.tone === "accent"
                  ? "text-action font-medium"
                  : line.tone === "ok"
                    ? "text-success"
                    : line.tone === "text"
                      ? "text-text"
                      : "text-muted"
              }
            >
              {line.text === "" ? " " : line.text}
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="flex items-center justify-between border-t border-border bg-bg/60 px-4 py-3 font-mono text-[12px]">
        <span className="inline-flex h-6 items-center gap-1.5 rounded border border-action/40 bg-action/10 px-2 text-action">
          <Check size={12} />
          discharged
        </span>
        <span className="text-muted">18:42 · 14 lines changed</span>
      </div>
    </div>
  );
}
