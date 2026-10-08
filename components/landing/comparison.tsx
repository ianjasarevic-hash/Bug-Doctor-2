"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, Cross } from "@/components/landing/icons";
import { Container } from "@/components/landing/container";

type Row = {
  label: string;
  interview: string;
  bugdr: string;
  interviewTone?: "muted" | "danger";
  bugdrTone?: "muted" | "action";
};

const rows: Row[] = [
  {
    label: "What it tests",
    interview: "An isolated algorithm puzzle.",
    bugdr: "A real, broken production codebase.",
  },
  {
    label: "Solvable by AI",
    interview: "Yes — in 30 seconds.",
    bugdr: "No. You need the actual prod system.",
    interviewTone: "danger",
    bugdrTone: "action",
  },
  {
    label: "Codebase size",
    interview: "1 function, ~20 lines.",
    bugdr: "1–50k lines of real code, with tests, infra, traces.",
  },
  {
    label: "Verifies your fix",
    interview: "Output equals the spec.",
    bugdr: "p99, pool size, leak rate, test suite green under load.",
  },
  {
    label: "What it proves",
    interview: "You can do algebra under timed conditions.",
    bugdr: "You can be trusted with prod at 3am.",
    bugdrTone: "action",
  },
];

// Per-row entry direction. Alternates sides so the rows "puzzle" into place
// from left, right, left, right, left as the user scrolls.
const rowFrom: ("left" | "right")[] = ["left", "right", "left", "right", "left"];

export function Comparison() {
  const reduce = useReducedMotion();

  return (
    <section
      id="problems"
      aria-labelledby="comparison-heading"
      className="relative py-24 sm:py-32"
    >
      <Container>
        {/* Section header — comes from top */}
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-xs uppercase tracking-widest text-action">
            The problem
          </p>
          <h2
            id="comparison-heading"
            className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-glow-pulse"
            data-glow="The interview tests the wrong thing."
          >
            The interview tests the wrong thing.
          </h2>
          <p className="mt-4 text-muted text-lg leading-relaxed">
            AI can pass it. The interview stopped measuring what matters —
            whether you can ship under pressure on a real codebase.
          </p>
        </motion.div>

        {/* Comparison table */}
        <motion.div
          className="mt-12 rounded-xl border border-border bg-surface shadow-card overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header row */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 border-b border-border font-mono text-xs uppercase tracking-wider text-muted">
            <div className="col-span-4">Dimension</div>
            <div className="col-span-4">The interview</div>
            <div className="col-span-4 relative text-action">
              bug.dr
              {/* subtle pulsing highlight under the bug.dr column header */}
              {!reduce && (
                <motion.span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-0.5 bg-action"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </div>
          </div>

          {rows.map((row, i) => (
            <ComparisonRow
              key={row.label}
              row={row}
              from={rowFrom[i]}
              delay={i * 0.09}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

function ComparisonRow({
  row,
  from,
  delay,
}: {
  row: Row;
  from: "left" | "right";
  delay: number;
}) {
  const reduce = useReducedMotion();
  const x = from === "left" ? -50 : 50;

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-5 border-b border-border last:border-b-0 relative"
      initial={{ opacity: 0, x: reduce ? 0 : x }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="sm:col-span-4 font-mono text-xs uppercase tracking-wider text-muted">
        {row.label}
      </div>
      <div className="sm:col-span-4 text-muted flex items-start gap-2">
        <motion.span
          className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-diffImpossible/10 text-diffImpossible ring-1 ring-diffImpossible/40"
          aria-hidden
          initial={{ scale: 0, rotate: -90 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, delay: delay + 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <Cross size={11} />
        </motion.span>
        <span className="text-[15px]">{row.interview}</span>
      </div>
      <div className="sm:col-span-4 flex items-start gap-2 relative">
        <motion.span
          className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-action/15 text-action ring-1 ring-action/40"
          aria-hidden
          initial={{ scale: 0, rotate: 90 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, delay: delay + 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <Check size={11} />
        </motion.span>
        <span className="text-[15px] text-text">{row.bugdr}</span>
      </div>
    </motion.div>
  );
}
