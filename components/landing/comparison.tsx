import { Check, Cross } from "@/components/landing/icons";
import { Container } from "@/components/landing/container";

// The "Interview vs bug.dr" comparison table.
//
// Earlier versions used framer-motion's `whileInView` to slide each row in
// from alternating sides. That looked nice interactively, but on the
// static export the SSR HTML rendered the rows at `opacity:0; transform:
// translateX(±50px)` and the IntersectionObserver only fired for rows that
// were actually in the viewport. Off-screen rows stayed invisible in
// fullPage screenshots, for crawlers, and for anyone printing the page.
//
// The fix is the same one used across the rest of the site: render plain
// HTML. The content is always visible. The rows are not animated.

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
    bugdr: "A broken production-style codebase.",
  },
  {
    label: "AI",
    interview: "Banned, or solved in seconds.",
    bugdr: "Built in. Use it like you would at work.",
    interviewTone: "danger",
    bugdrTone: "action",
  },
  {
    label: "What gets measured",
    interview: "Whether the output matches.",
    bugdr:
      "Correctness, code quality, verification, time and AI usage.",
  },
  {
    label: "How the fix is verified",
    interview: "Output equals the spec.",
    bugdr: "Acceptance checks, listed upfront.",
  },
  {
    label: "What it proves",
    interview: "You can do algebra under time pressure.",
    bugdr: "You can deliver a reliable fix with AI.",
    bugdrTone: "action",
  },
];

export function Comparison() {
  return (
    <section
      id="problems"
      aria-labelledby="comparison-heading"
      className="relative py-24 sm:py-32"
    >
      <Container>
        {/* Section header */}
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-action">
            The problem
          </p>
          <h2
            id="comparison-heading"
            className="mt-3 text-3xl sm:text-4xl font-semibold text-headline"
          >
            Interviews can&apos;t see how you work with AI.
          </h2>
          <p className="mt-4 text-muted text-lg leading-relaxed">
            An algorithm puzzle in 45 minutes tells you almost nothing about
            how someone uses AI on a real codebase. We test the work that
            matters.
          </p>
        </div>

        {/* Comparison table */}
        <div className="mt-12 rounded-xl border border-border bg-surface shadow-card overflow-hidden">
          {/* Header row */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 border-b border-border font-mono text-xs uppercase tracking-wider text-muted">
            <div className="col-span-4">Dimension</div>
            <div className="col-span-4">The interview</div>
            <div className="col-span-4 relative text-action">
              bug.dr
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 h-0.5 w-full bg-action/60"
              />
            </div>
          </div>

          {rows.map((row) => (
            <ComparisonRow key={row.label} row={row} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function ComparisonRow({ row }: { row: Row }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-5 border-b border-border last:border-b-0 relative">
      <div className="sm:col-span-4 font-mono text-xs uppercase tracking-wider text-muted">
        {row.label}
      </div>
      <div className="sm:col-span-4 text-muted flex items-start gap-2">
        <span
          aria-hidden
          className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-diffImpossible/10 text-diffImpossible ring-1 ring-diffImpossible/40"
        >
          <Cross size={11} />
        </span>
        <span className="text-[15px]">{row.interview}</span>
      </div>
      <div className="sm:col-span-4 flex items-start gap-2 relative">
        <span
          aria-hidden
          className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-action/15 text-action ring-1 ring-action/40"
        >
          <Check size={11} />
        </span>
        <span className="text-[15px] text-text">{row.bugdr}</span>
      </div>
    </div>
  );
}
