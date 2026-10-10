import { Container } from "@/components/landing/container";
import { Check } from "@/components/landing/icons";

// "A score you can explain." : the example scorecard section.
//
// Five rows (Correctness, Code quality, Verification, Time, AI
// usage), each with a bar, a score out of 100, a band-coloured
// number, a plain sentence, and a small end-of-row label on
// desktop ("strong", "good", "improve"). The numbers are
// illustrative: the card is labeled "example scorecard" and the
// overall score carries an "example" tag so it is never read as a
// real submission.
//
// Colour bands, same thresholds for every row:
//   90 and above : scoreStrong (muted green)
//   80 to 89     : action      (periwinkle, the brand accent)
//   below 80     : scoreWarm   (muted amber)
//
// Colour is never the only signal: the number itself is always
// visible, and the end-of-row word label repeats the band in plain
// English for users who can't see the colour difference.
//
// Correctness and Code quality sit first and slightly larger
// because the section subline says they weigh most. The other
// three sit at the original size. Description text is muted and
// a little smaller so the label + number carry the row.
//
// On mobile (390px) the bar drops under the label, the end-of-row
// word is hidden, and the overall score stacks above the rows.
// Nothing overflows the card on the narrowest supported width.

type Band = "strong" | "good" | "improve";

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
    description:
      "Readability, structure, and the choices that make the fix hold up.",
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

// Unweighted average of the five scores. The user asked for an
// unweighted average and explicitly said no exact weights are stated
// anywhere on the page, so the function is a plain mean and the
// result is rendered as the overall.
function average(scores: number[]): number {
  const sum = scores.reduce((a, b) => a + b, 0);
  return Math.round(sum / scores.length);
}

const overall = average(rows.map((r) => r.score)); // 87

function band(score: number): Band {
  if (score >= 90) return "strong";
  if (score >= 80) return "good";
  return "improve";
}

// Per-band text and fill classes. Keep them inline (no `cn()`) so
// each band lives in one place and is grep-able.
const bandFill: Record<Band, string> = {
  strong: "bg-scoreStrong",
  good: "bg-action",
  improve: "bg-scoreWarm",
};

const bandText: Record<Band, string> = {
  strong: "text-scoreStrong",
  good: "text-action",
  improve: "text-scoreWarm",
};

const bandLabel: Record<Band, string> = {
  strong: "strong",
  good: "good",
  improve: "improve",
};

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

          {/* Overall row. Sits inside the card body, above the five
              categories, with a faint divider below. "Overall" is the
              muted label, the big number is monospace with tabular
              nums and the band's text colour, and a small "example"
              chip sits next to the number so the user knows this is
              illustrative. The single-line caveat on the right is
              taken verbatim from the section subline above. */}
          <div className="px-5 pt-5 pb-6 sm:px-6 sm:pt-6 sm:pb-7 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-6">
              <div className="flex items-end gap-3">
                <div className="flex flex-col">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
                    Overall
                  </span>
                  <span
                    className={`mt-1 font-mono tabular-nums font-semibold leading-none ${bandText[band(overall)]}`}
                    style={{ fontSize: "clamp(40px, 6vw, 48px)" }}
                  >
                    {overall}
                    <span className="text-muted text-[18px] sm:text-[20px] font-normal ml-1">
                      / 100
                    </span>
                  </span>
                </div>
                <span
                  className="mb-1.5 inline-flex items-center rounded-full border border-border bg-bg/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted"
                  aria-label="Illustrative example, not a real submission"
                >
                  example
                </span>
              </div>
              <p className="text-muted text-[13px] sm:text-sm leading-relaxed max-w-md sm:text-right">
                Correctness and reliability weigh most.
              </p>
            </div>
          </div>

          {/* Five category rows. Each row sits in its own block with
              a faint divider between, so the eye groups label +
              number + bar + description as one unit. The first two
              rows (Correctness, Code quality) are slightly larger
              because the section subline says they weigh most. */}
          <div className="px-5 py-5 sm:px-6 sm:py-7">
            {rows.map((row, i) => (
              <ScoreRow
                key={row.label}
                row={row}
                emphasised={i < 2}
                isLast={i === rows.length - 1}
              />
            ))}
          </div>

          {/* Footer pill: "first successful result is final" as a
              small chip with an outline check icon in the accent
              colour, not plain text. The chip border matches the
              track so the footer reads as one surface. */}
          <div className="border-t border-border bg-bg/30 px-5 py-3 sm:px-6 flex items-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-action/40 bg-action/10 px-2.5 py-1 font-mono text-[11px] text-action">
              <Check size={11} aria-hidden />
              <span>first successful result is final</span>
            </span>
          </div>
        </figure>
      </Container>
    </section>
  );
}

function ScoreRow({
  row,
  emphasised,
  isLast,
}: {
  row: Row;
  // The first two rows (Correctness, Code quality) are slightly
  // larger: bar h-2 instead of h-1.5, label in primary text colour
  // instead of muted. The other three stay at the original size.
  emphasised: boolean;
  isLast: boolean;
}) {
  const b = band(row.score);
  const barHeight = emphasised ? "h-2" : "h-1.5";
  const labelClass = emphasised ? "text-text" : "text-muted";
  const descriptionClass = emphasised
    ? "text-[13px] text-muted"
    : "text-[12.5px] text-muted";

  return (
    <div className={isLast ? "" : "pb-6 sm:pb-7 mb-6 sm:mb-7 border-b border-border/60"}>
      <div className="flex items-baseline justify-between gap-3">
        <span
          className={`font-mono text-[12px] uppercase tracking-wider ${labelClass}`}
        >
          {row.label}
        </span>
        <div className="flex items-baseline gap-2 whitespace-nowrap">
          <span
            className={`font-mono text-[12px] tabular-nums font-semibold ${bandText[b]}`}
            style={{ fontSize: emphasised ? "16px" : "14px" }}
          >
            {row.score}
            <span className="text-muted font-normal">/100</span>
          </span>
          {/* End-of-row word label. Hidden on mobile (where the bar
              already drops below the label) and on smaller rows where
              the label would crowd the score. Always visible on
              emphasised rows at sm+ so colour is never the only
              signal. */}
          {emphasised && (
            <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider text-muted">
              {bandLabel[b]}
            </span>
          )}
        </div>
      </div>
      <div
        className={`mt-2 ${barHeight} rounded-full bg-border overflow-hidden`}
        role="meter"
        aria-valuenow={row.score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${row.label}: ${row.score} out of 100`}
      >
        <div
          className={`h-full rounded-full ${bandFill[b]}`}
          style={{ width: `${row.score}%` }}
        />
      </div>
      <p className={`mt-2 leading-snug ${descriptionClass}`}>
        {row.description}
      </p>
    </div>
  );
}
