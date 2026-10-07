import { Check, Cross } from "@/components/landing/icons";
import { Container } from "@/components/landing/container";

type Row = {
  label: string;
  leetcode: string;
  bugdr: string;
  leetcodeTone?: "muted" | "danger";
  bugdrTone?: "muted" | "action";
};

// "Hiring signal" LeetCode column updated to "I've memorized 300 puzzles."
// — sharper than the abstract "I can do algebra under timed conditions."
const rows: Row[] = [
  {
    label: "What it tests",
    leetcode: "Can you solve an isolated algorithm puzzle?",
    bugdr: "Can you read a 50k-line codebase and ship a change under pressure?",
  },
  {
    label: "Solvable by pasting into AI",
    leetcode: "Yes. Every problem has a known solution.",
    bugdr: "No. You need context, judgement, and the actual prod system.",
    leetcodeTone: "danger",
    bugdrTone: "action",
  },
  {
    label: "Codebase size",
    leetcode: "1 function, ~20 lines.",
    bugdr: "1–50k lines of real code, with tests, infra, and traces.",
  },
  {
    label: "Verifies your fix",
    leetcode: "Output equals the spec.",
    bugdr: "p99, pool size, leak rate, test suite green under load.",
  },
  {
    label: "Hiring signal",
    leetcode: "I've memorized 300 puzzles.",
    bugdr: "I can be trusted with prod at 3am.",
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
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-action">
            The problem
          </p>
          <h2
            id="comparison-heading"
            className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight"
          >
            LeetCode stopped being signal.
          </h2>
          <p className="mt-4 text-muted text-lg leading-relaxed">
            The algorithm puzzle had its run. Today it answers a different
            question: can you solve a known problem with AI in 30 seconds? Not
            the one your hiring manager is trying to ask.
          </p>
        </div>

        {/* Comparison table */}
        <div className="mt-12 rounded-xl border border-border bg-surface shadow-card">
          {/* Header row */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 border-b border-border font-mono text-xs uppercase tracking-wider text-muted">
            <div className="col-span-4">Dimension</div>
            <div className="col-span-4">LeetCode</div>
            <div className="col-span-4 text-action">bug.dr</div>
          </div>

          {rows.map((row, i) => (
            <div
              key={row.label}
              className={[
                "grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-5",
                i !== rows.length - 1 ? "border-b border-border" : "",
              ].join(" ")}
            >
              <div className="sm:col-span-4 font-mono text-xs uppercase tracking-wider text-muted">
                {row.label}
              </div>
              <div className="sm:col-span-4 text-muted flex items-start gap-2">
                <span
                  className={[
                    "mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full ring-1",
                    row.leetcodeTone === "danger"
                      ? "text-danger bg-surface ring-danger/40"
                      : "text-muted bg-surface ring-border",
                  ].join(" ")}
                  aria-hidden
                >
                  <Cross size={11} />
                </span>
                <span className="text-[15px]">{row.leetcode}</span>
              </div>
              <div className="sm:col-span-4 flex items-start gap-2">
                <span
                  className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-action/15 text-action ring-1 ring-action/40"
                  aria-hidden
                >
                  <Check size={11} />
                </span>
                <span className="text-[15px] text-text">{row.bugdr}</span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}