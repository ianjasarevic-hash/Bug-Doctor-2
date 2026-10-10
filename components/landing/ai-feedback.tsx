"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Container } from "@/components/landing/container";

// "Know exactly what to improve" : the AI Feedback section.
//
// The example card uses a comparison-bar pattern: each metric row
// shows "You" vs "Top performers" on a shared horizontal scale, with
// a one-word delta chip on the right. Three status colors drive the
// whole card:
//
//   --good  (#7BD88F)  at or better than top performers
//   --warn  (#F2C14E)  up to 2× worse than top performers
//   --bad   (#FF6B6B)  over 2× worse than top performers
//   --accent (action)  the top-performers bar at 60% opacity
//
// The bar grows 0 → value on scroll-into-view, staggered 80ms per row,
// and the delta chip fades in after the bar finishes. prefers-reduced-
// motion lands the card in its final state immediately.
//
// The card itself is narrower than the rest of the section (~720px)
// and centered, so the comparison reads at a comfortable line length
// and the colored bars feel like a unit, not stretched across a
// 1200px canvas.

type Tone = "good" | "warn" | "bad";

type Row = {
  label: string;
  you: string;
  top: string;
  // "share" is the percentage of the shared scale that "you" occupies
  // (clamped to 100). "topShare" is the same for "top performers".
  share: number;
  topShare: number;
  // Verdict maps to one of the three status colors and the chip's
  // background/border tints.
  tone: Tone;
  // Short, plain-language delta chip.
  delta: string;
};

const rows: Row[] = [
  {
    label: "Prompts used",
    you: "12",
    top: "4",
    share: 100, // you are 3× top, so you fill the bar
    topShare: 33, // 4/12 ≈ 33% of your value
    tone: "bad",
    delta: "3× more",
  },
  {
    label: "Tokens used",
    you: "3,840",
    top: "1,200",
    share: 100, // 3840/3840
    topShare: 31, // 1200/3840 ≈ 31%
    tone: "bad",
    delta: "3.2× more",
  },
  {
    label: "First-run pass",
    you: "No",
    top: "68%",
    // For the boolean row we use a presence/absence pattern instead of
    // a numeric share: top is a wide tinted band, "you" is empty.
    share: 0,
    topShare: 68,
    tone: "warn",
    delta: "Missed",
  },
];

// Tailwind class lookup for the status colors. Keeping these inline
// (rather than in a `cn()` helper) means each row's tone lives in
// one place and is grep-able.
const toneText: Record<Tone, string> = {
  good: "text-good",
  warn: "text-warn",
  bad: "text-bad",
};

const toneBar: Record<Tone, string> = {
  good: "bg-good",
  warn: "bg-warn",
  bad: "bg-bad",
};

// 12% tint over surface for the delta chip background, 30% for the
// 1px border. Plain inline `style` so the tint stays tied to the
// actual hex value without a new Tailwind plugin.
const toneTint: Record<Tone, { bg: string; border: string }> = {
  good: {
    bg: "rgba(123, 216, 143, 0.12)",
    border: "rgba(123, 216, 143, 0.30)",
  },
  warn: {
    bg: "rgba(242, 193, 78, 0.12)",
    border: "rgba(242, 193, 78, 0.30)",
  },
  bad: {
    bg: "rgba(255, 107, 107, 0.12)",
    border: "rgba(255, 107, 107, 0.30)",
  },
};

const toneLabel: Record<Tone, string> = {
  good: "On track",
  warn: "Needs work",
  bad: "Needs work",
};

export function AIFeedback() {
  return (
    <section
      id="feedback"
      aria-labelledby="feedback-heading"
      className="relative py-24 sm:py-32 divider-top"
    >
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-action">
            AI feedback
          </p>
          <h2
            id="feedback-heading"
            className="mt-3 text-3xl sm:text-4xl font-semibold text-headline"
          >
            Know exactly what to improve
          </h2>
          <p className="mt-4 text-muted text-lg leading-relaxed">
            After every solve, get a personalized breakdown of your
            session compared to top performers on that problem.
          </p>
        </div>

        <FeedbackCard />

        <p className="mt-5 font-mono text-[11px] text-muted">
          Generated automatically after every solve. Free tier includes
          feedback on Easy solves.
        </p>
      </Container>
    </section>
  );
}

function FeedbackCard() {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  // Trigger the bar-grow once when the card scrolls into the viewport.
  // `margin: "-15% 0px"` so the bars start animating a beat before the
  // card fully enters, the same pattern the rest of the page uses.
  const inView = useInView(cardRef, {
    once: true,
    margin: "0px 0px -15% 0px",
  });

  // For reduced motion we skip the inView gate and just render the
  // final state. Otherwise the bar still waits for the scroll-into-
  // view trigger so off-screen renders (print, crawler, screenshot)
// don't get a half-grown bar.
  const animate = reduce ? true : inView;

  // Worst tone in the card sets the header verdict badge color.
  // For this sample all three are bad/warn, so the verdict is warn
  // (Needs work).
  const verdictTone: Tone = "warn";

  return (
    <figure
      ref={cardRef}
      className="mt-12 mx-auto max-w-[720px] rounded-xl border border-border bg-surface shadow-card overflow-hidden"
    >
      {/* Header strip: "Example feedback" on the left in sentence-case
          sans (not the all-caps mono the other cards use), so the new
          header language signals this is a redesigned card. On the
          right, a small "Payment retries" chip + a one-word verdict
          badge in the verdict tone. */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border bg-bg/40 px-5 py-3 text-[14px] text-muted">
        <span>Example feedback</span>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-border bg-bg/60 px-2 py-0.5 text-[12px] text-text/90">
            Payment retries
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-medium ${toneText[verdictTone]}`}
            style={{
              backgroundColor: toneTint[verdictTone].bg,
              border: `1px solid ${toneTint[verdictTone].border}`,
            }}
          >
            {toneLabel[verdictTone]}
          </span>
        </div>
      </div>

      {/* The three comparison rows. Each row stacks on mobile and
          sits inline on sm+. The bar fills the available width and
          the markers + values are anchored to the right of the bar
          in a fixed-width column so they line up across rows. */}
      <div className="px-5 py-5 sm:px-6 sm:py-6 space-y-6">
        {rows.map((row, i) => (
          <FeedbackRow
            key={row.label}
            row={row}
            index={i}
            animate={animate}
            reduce={!!reduce}
          />
        ))}
      </div>

      {/* Divider + the feedback prose. Two blocks separated by a
          hairline so "What happened" reads as the diagnosis and
          "Try next time" reads as the prescription. Body text 15-16px,
          line-height 1.6, max 65ch on the prose blocks. */}
      <div className="border-t border-border bg-bg/30 px-5 py-5 sm:px-6 sm:py-6 space-y-5 text-[15px] sm:text-base text-text/85 leading-relaxed">
        <div className="max-w-[65ch]">
          <p className="font-medium text-text">What happened</p>
          <p className="mt-1.5">
            You ran tests{" "}
            <span
              className={`font-mono tabular-nums ${toneText[rows[0].tone]}`}
            >
              8 times
            </span>{" "}
            before your first passing run.
          </p>
        </div>
        <div className="max-w-[65ch]">
          <p
            className="font-medium text-action"
            style={{ color: "#8BACFF" }}
          >
            Try next time
          </p>
          <ol
            className="mt-1.5 space-y-1.5 rounded-md px-4 py-3 text-[14px] sm:text-[15px]"
            style={{
              backgroundColor: "rgba(139, 172, 255, 0.08)",
              borderLeft: "2px solid #8BACFF",
            }}
          >
            <li>1. Read the full stack trace first.</li>
            <li>2. Find the likely failure point.</li>
            <li>3. Write one targeted prompt.</li>
          </ol>
        </div>
      </div>
    </figure>
  );
}

function FeedbackRow({
  row,
  index,
  animate,
  reduce,
}: {
  row: Row;
  index: number;
  animate: boolean;
  reduce: boolean;
}) {
  // `topShare` is rendered as a thin tinted band on the same axis so
  // "you" and "top" can be compared at a glance. On the first-run
  // pass row the "you" share is 0 (you didn't pass on the first run),
  // so the bar is empty and the value sits at the left edge.

  // Per-row entrance animation. The bar grows 0 → value on scroll-
  // into-view at 400ms, the delta chip fades in 200ms after each
  // bar finishes. `staggerChildren` on the card itself would also
  // work, but per-row delays keep the math simple and each row
  // independently gated.

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[15px] text-text/90">
          {row.label}
        </span>
        <DeltaChip text={row.delta} tone={row.tone} index={index} animate={animate} reduce={reduce} />
      </div>
      <div className="mt-2 flex items-center gap-3">
        {/* The shared scale. Background rail at ~6% white, the top-
            performers band in --accent at 60% opacity, the "you" bar
            in the row's tone. Both bars are absolutely placed so they
            share the same axis; the row's tone wins visually because
            it sits on top. */}
        <div className="relative flex-1 min-w-0 h-2 rounded-full bg-white/[0.06] overflow-hidden">
          {/* Top-performers band */}
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-action/60"
            initial={reduce ? { width: `${row.topShare}%` } : { width: 0 }}
            animate={animate ? { width: `${row.topShare}%` } : { width: 0 }}
            transition={{
              duration: 0.4,
              delay: reduce ? 0 : index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            aria-hidden
          />
          {/* "You" bar (sits above the top band when both overlap) */}
          <motion.div
            className={`absolute inset-y-0 left-0 rounded-full ${toneBar[row.tone]}`}
            initial={reduce ? { width: `${row.share}%` } : { width: 0 }}
            animate={animate ? { width: `${row.share}%` } : { width: 0 }}
            transition={{
              duration: 0.4,
              delay: reduce ? 0 : index * 0.08 + 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            aria-hidden
          />
        </div>
        {/* Marker column. Anchors "we" and "top performers" to fixed
            widths so the values line up across rows. On mobile we
            stack the markers below the bar instead. */}
      </div>
      <div className="mt-2 flex flex-col gap-1.5 sm:hidden">
        <Marker label="You" value={row.you} valueClass={toneText[row.tone]} />
        <Marker label="Top performers" value={row.top} valueClass="text-muted" />
      </div>
      <div className="mt-2 hidden sm:flex items-center justify-between gap-3 text-[14px]">
        <Marker label="You" value={row.you} valueClass={toneText[row.tone]} />
        <Marker label="Top performers" value={row.top} valueClass="text-muted" />
      </div>
    </div>
  );
}

function DeltaChip({
  text,
  tone,
  index,
  animate,
  reduce,
}: {
  text: string;
  tone: Tone;
  index: number;
  animate: boolean;
  reduce: boolean;
}) {
  return (
    <motion.span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 font-mono tabular-nums text-[12px] sm:text-[13px] ${toneText[tone]}`}
      style={{
        backgroundColor: toneTint[tone].bg,
        border: `1px solid ${toneTint[tone].border}`,
      }}
      initial={reduce ? { opacity: 1 } : { opacity: 0 }}
      animate={animate ? { opacity: 1 } : { opacity: 0 }}
      transition={{
        duration: 0.25,
        delay: reduce ? 0 : index * 0.08 + 0.5,
        ease: "easeOut",
      }}
    >
      {text}
    </motion.span>
  );
}

function Marker({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass: string;
}) {
  return (
    <span className="inline-flex items-baseline gap-2 min-w-0">
      <span className="text-muted text-[13px]">{label}</span>
      <span className={`font-mono tabular-nums text-[16px] sm:text-[17px] ${valueClass}`}>
        {value}
      </span>
    </span>
  );
}