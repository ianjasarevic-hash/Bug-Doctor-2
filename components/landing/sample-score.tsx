import { Container } from "@/components/landing/container";

// "A score you can explain." — the example scorecard section.
//
// Five rows (Correctness, Code quality, Verification, Time, AI
// usage), each with a bar, a score out of 100 and one plain
// sentence. The numbers are illustrative: the card is labeled
// "example scorecard" so it is never read as a real submission.
// The weighting is described in prose in the subline (correctness
// and reliability weigh most). We do not show weight percentages.
//
// On mobile (390px) the bar is full-width under the label, the
// score sits on the right of the label, and the sentence wraps
// below the bar. Nothing in the row overflows the card on the
// narrowest supported width.

type Row = {
  label: string;
  score: number;
  description: string;
};

const rows: Row[] = [
  {
    label: "Correctness",
    score: 95,
    description: "Whether your code passes the acceptance checks.",
  },
  {
    label: "Code quality",
    score: 88,
    description: "Readability, structure, and the choices that make the fix hold up.",
  },
  {
    label: "Verification",
    score: 90,
    description: "Whether you actually ran the tests before you submitted.",
  },
  {
    label: "Time",
    score: 78,
    description: "How long it took from Start to a passing submission.",
  },
  {
    label: "AI usage",
    score: 82,
    description: "How well you used the assistant without overusing it.",
  },
];

export function SampleScore() {
  return (
    <section
      id="score"
      aria-labelledby="score-heading"
      className="relative py-24 sm:py-32 divider-top"
    >
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-action">
            How you are scored
          </p>
          <h2
            id="score-heading"
            className="mt-3 text-3xl sm:text-4xl font-semibold text-headline"
          >
            A score you can explain.
          </h2>
          <p className="mt-4 text-muted text-lg leading-relaxed">
            Every submission is graded on the same five things, so your
            result means the same thing on every problem. Correctness and
            reliability weigh most, then the rest.
          </p>
        </div>

        <figure className="mt-12 rounded-xl border border-border bg-surface shadow-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border bg-bg/40 px-5 py-3 font-mono text-[11px] uppercase tracking-wider text-muted">
            <span>example scorecard</span>
            <span className="text-muted/80 normal-case tracking-normal">
              Payment retries
            </span>
          </div>

          <div className="px-5 py-5 sm:px-6 sm:py-6 space-y-5 sm:space-y-6">
            {rows.map((row) => (
              <ScoreRow key={row.label} row={row} />
            ))}
          </div>

          <div className="border-t border-border bg-bg/30 px-5 py-3 font-mono text-[11px] text-muted sm:px-6">
            first successful result is final
          </div>
        </figure>
      </Container>
    </section>
  );
}

function ScoreRow({ row }: { row: Row }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-[12px] uppercase tracking-wider text-text">
          {row.label}
        </span>
        <span className="font-mono text-[12px] text-text whitespace-nowrap">
          <span className="text-text">{row.score}</span>
          <span className="text-muted">/100</span>
        </span>
      </div>
      <div
        className="mt-2 h-1.5 rounded-full bg-border overflow-hidden"
        role="progressbar"
        aria-valuenow={row.score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${row.label} score`}
      >
        <div
          className="h-full bg-action rounded-full"
          style={{ width: `${row.score}%` }}
        />
      </div>
      <p className="mt-2 text-[14px] text-muted leading-snug">
        {row.description}
      </p>
    </div>
  );
}
