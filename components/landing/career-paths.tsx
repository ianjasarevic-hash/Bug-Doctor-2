import { Container } from "@/components/landing/container";

// "Your path to getting hired" — the Career Paths section.
//
// Four steps in a row, Easy, Medium, Hard, Get a job. Each step is a
// small card with its number in mono, the tier label, and a one-line
// example of what that level feels like. The cards are visually linked
// by a thin top border in the difficulty color, so the row reads as a
// progression rather than four separate tiles. The "Get a job" step is
// highlighted in the action color so the goal stands out from the
// difficulty scale.
//
// Below the row, three points ("Role-specific", "Efficiency gated",
// "Interview ready") in a 3-column grid. Each is a small prose block:
// bold lead-in, muted body. Same pattern as the section above, so the
// page keeps a consistent rhythm.

type Step = {
  n: string;
  label: string;
  // The token name in tailwind.config.ts that paints the top border of
  // this card. diffEasy/Medium/Hard are the existing difficulty colors;
  // action is the brand blue, used for the "Get a job" goal step.
  tone: "diffEasy" | "diffMedium" | "diffHard" | "action";
  // One short line under the label so each step is a concrete example,
  // not just a tier name. Kept to the same difficulty scale the rest
  // of the site uses (Easy = small focused fix, etc.).
  example: string;
};

const steps: Step[] = [
  { n: "01", label: "Easy", tone: "diffEasy", example: "small focused fixes" },
  { n: "02", label: "Medium", tone: "diffMedium", example: "multi-file features" },
  { n: "03", label: "Hard", tone: "diffHard", example: "production incidents" },
  { n: "04", label: "Get a job", tone: "action", example: "interview-ready" },
];

type Point = { title: string; body: string };

const points: Point[] = [
  {
    title: "Role-specific",
    body: "AI Engineer, Backend, Frontend, Full Stack, Database. Each path covers the full skill surface of that role.",
  },
  {
    title: "Efficiency gated",
    body: "Each stage unlocks only when your metrics prove you're ready. Not a paywall, a proof of skill.",
  },
  {
    title: "Interview ready",
    body: "By the time you reach Get a job difficulty, you're not just prepared, you have data proving it.",
  },
];

// Tailwind class for the top-border accent on each step. Set via
// inline style (not class) because the color is one of four tokens
// chosen at runtime, not a fixed design token.
const toneBorder: Record<Step["tone"], string> = {
  diffEasy: "var(--color-diffEasy, #88C9A1)",
  diffMedium: "var(--color-diffMedium, #E0B265)",
  diffHard: "var(--color-diffHard, #E58958)",
  action: "var(--color-action, #8BACFF)",
};

export function CareerPaths() {
  return (
    <section
      id="paths"
      aria-labelledby="paths-heading"
      className="relative py-24 sm:py-32 divider-top"
    >
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-action">
            Career paths
          </p>
          <h2
            id="paths-heading"
            className="mt-3 text-3xl sm:text-4xl font-semibold text-headline"
          >
            Your path to getting hired
          </h2>
          <p className="mt-4 text-muted text-lg leading-relaxed">
            Not just problems. A structured progression that mirrors what
            your target role actually requires, including the adjacent
            skills interviewers always probe for.
          </p>
        </div>

        {/* Progression path. Four cards, colored top border ties the
            row together visually. The example line below each label
            turns each tier into a concrete task size rather than a
            vague "Easy/Medium/Hard". */}
        <ol className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {steps.map((step) => (
            <li
              key={step.label}
              className="rounded-xl border border-border bg-surface p-4 sm:p-5"
              style={{ borderTopWidth: "2px", borderTopColor: toneBorder[step.tone] }}
            >
              <div className="font-mono text-[11px] uppercase tracking-wider text-muted">
                {step.n}
              </div>
              <div className="mt-3 text-base sm:text-lg font-medium text-text">
                {step.label}
              </div>
              <div className="mt-1 text-[12px] text-muted leading-snug">
                {step.example}
              </div>
            </li>
          ))}
        </ol>

        {/* Three points. Each is a bold lead-in and a muted body. Same
            3-column grid the rest of the site uses, stacks on mobile. */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {points.map((p) => (
            <div key={p.title}>
              <div className="text-[15px] font-medium text-text">{p.title}</div>
              <p className="mt-2 text-[14px] text-muted leading-relaxed">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
