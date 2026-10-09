"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { LinkButton } from "@/components/ui/button";
import { ArrowRight, Check } from "@/components/landing/icons";
import { type Line, TONE_CLASS } from "@/components/landing/code-block";
import { SPRING_GENTLE } from "@/lib/motion";

// ── Hero ──────────────────────────────────────────────────────────────────
//
// Frame: everyone uses AI now. Equal tools do not give equal results. bug.dr
// measures how well an engineer uses AI to investigate a codebase, fix a bug
// and verify it.
//
// Layout: text on the left (H1, subhead, buttons, meta, checklist) and the
// animated IDE card on the right, on the same row at desktop. At mobile
// widths the card drops below the CTAs and stacks under the text. The
// workspace.png screenshot no longer lives here.

const checklist = [
  "Production-style incidents",
  "AI assistant built into the workspace",
  "Acceptance checks before you submit",
];

// Real acceptance checks from the Payment retries problem. Exported so the
// static "How it works" step 3 card can reuse the same seven names without
// re-deriving the list.
export const acceptanceChecks: { label: string }[] = [
  { label: "Retry transient failures" },
  { label: "Prevent duplicate charges" },
  { label: "Back off between retries" },
  { label: "Existing tests still pass" },
  { label: "Preserve successful payments" },
  { label: "Keep the worker healthy" },
  { label: "Keep failed jobs visible in the queue" },
];

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative pt-8 pb-12 lg:pt-6 lg:pb-10">
      {/* Radial glow (the page-wide grid is in the layout root) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[480px] w-[820px] max-w-[100vw] rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(closest-side, rgba(139,172,255,0.35), transparent 70%)",
        }}
      />

      <div className="relative w-full px-6 md:px-10 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-5 max-w-3xl">
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-display"
              initial={reduce ? false : { opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={
                reduce
                  ? { duration: 0.2, ease: "easeOut" as const }
                  : { ...SPRING_GENTLE }
              }
            >
              Everyone has AI.{" "}
              <motion.span
                className="text-muted inline-block text-glow-pulse"
                data-glow="Not everyone ships the fix."
                initial={reduce ? false : { opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={
                  reduce
                    ? { duration: 0.2, ease: "easeOut" as const, delay: 0.15 }
                    : { delay: 0.15, ...SPRING_GENTLE }
                }
              >
                Not everyone ships the fix.
              </motion.span>
            </motion.h1>

            <motion.p
              className="mt-6 text-lg text-muted leading-relaxed max-w-2xl"
              initial={reduce ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reduce
                  ? { duration: 0.2, ease: "easeOut" as const, delay: 0.35 }
                  : { delay: 0.35, ...SPRING_GENTLE }
              }
            >
              bug.dr drops you into a real, broken production codebase with an AI
              assistant in your editor. You investigate, fix and verify.{" "}
              <span
                className="text-text font-medium"
                data-glow="We score how well you did it."
              >
                We score how well you did it.
              </span>
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col sm:flex-row gap-3"
              initial={reduce ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reduce
                  ? { duration: 0.2, ease: "easeOut" as const, delay: 0.5 }
                  : { delay: 0.5, ...SPRING_GENTLE }
              }
            >
              <LinkButton href="#waitlist" size="lg">
                Join the waitlist
                <ArrowRight size={16} />
              </LinkButton>
              <LinkButton
                href="#how-it-works"
                variant="secondary"
                size="lg"
              >
                See how it works
              </LinkButton>
            </motion.div>

            <motion.div
              className="mt-6 flex items-center gap-6 text-xs text-muted font-mono flex-wrap"
              initial={reduce ? false : { opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={
                reduce
                  ? { duration: 0.2, ease: "easeOut" as const, delay: 0.65 }
                  : { delay: 0.65, ...SPRING_GENTLE }
              }
            >
              <span className="text-text">launching oct 21</span>
              <span aria-hidden className="h-3 w-px bg-border" />
              <span>no install</span>
              <span aria-hidden className="h-3 w-px bg-border" />
              <span>your first patient is waiting</span>
            </motion.div>

            <motion.ul
              className="mt-8 space-y-2.5"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reduce
                  ? { duration: 0.2, ease: "easeOut" as const, delay: 0.8 }
                  : { delay: 0.8, ...SPRING_GENTLE }
              }
            >
              {checklist.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-[14px] text-text/90"
                >
                  <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-action/15 text-action ring-1 ring-action/40">
                    <Check size={11} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Right column on desktop, full-width below the text on mobile.
              The single animated card for the hero — also exported for any
              other section that wants the same visual. */}
          <div className="lg:col-span-7">
            <HeroIDE />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── HeroIDE ───────────────────────────────────────────────────────────────
//
// One animated card. Story: open a file → spot the line that's broken →
// ask the AI for a fix → see the diff → watch the acceptance checks tick
// in. Each section enters with a small stagger so the card reads top to
// bottom rather than appearing all at once.
//
// 3D mouse-follow tilt: the card tilts toward the cursor as the user moves
// it across the surface, then springs back to flat when the cursor leaves.
// Honors prefers-reduced-motion (no tilt, all entrance animations become
// short opacity fades).

// payment-retry.ts — 11 lines, line 5 flagged (the for-loop that retries
// without an idempotency key or backoff).
const originalCode: Line[] = [
  // 1: import { charge } from "./gateway";
  {
    tokens: [
      { text: "import", tone: "kw" },
      { text: " { ", tone: "muted" },
      { text: "charge", tone: "fn" },
      { text: " } ", tone: "muted" },
      { text: "from", tone: "kw" },
      { text: " ", tone: "muted" },
      { text: '"./gateway"', tone: "str" },
      { text: ";", tone: "punct" },
    ],
  },
  // 2: import { sleep } from "./utils";
  {
    tokens: [
      { text: "import", tone: "kw" },
      { text: " { ", tone: "muted" },
      { text: "sleep", tone: "fn" },
      { text: " } ", tone: "muted" },
      { text: "from", tone: "kw" },
      { text: " ", tone: "muted" },
      { text: '"./utils"', tone: "str" },
      { text: ";", tone: "punct" },
    ],
  },
  // 3: empty
  { tokens: [{ text: "", tone: "muted" }] },
  // 4: export async function processOrder(order) {
  {
    tokens: [
      { text: "export", tone: "kw" },
      { text: " ", tone: "muted" },
      { text: "async", tone: "kw" },
      { text: " ", tone: "muted" },
      { text: "function", tone: "kw" },
      { text: " ", tone: "muted" },
      { text: "processOrder", tone: "fn" },
      { text: "(", tone: "punct" },
      { text: "order", tone: "fn" },
      { text: ") {", tone: "punct" },
    ],
  },
  // 5:   for (let i = 0; i < 3; i++) {  ← FLAGGED
  {
    tokens: [
      { text: "  ", tone: "muted" },
      { text: "for", tone: "kw" },
      { text: " (", tone: "muted" },
      { text: "let", tone: "kw" },
      { text: " ", tone: "muted" },
      { text: "i", tone: "fn" },
      { text: " = ", tone: "muted" },
      { text: "0", tone: "num" },
      { text: "; ", tone: "punct" },
      { text: "i", tone: "fn" },
      { text: " < ", tone: "muted" },
      { text: "3", tone: "num" },
      { text: "; ", tone: "punct" },
      { text: "i", tone: "fn" },
      { text: "++) {", tone: "punct" },
    ],
  },
  // 6:     const result = await charge(order);
  {
    tokens: [
      { text: "    ", tone: "muted" },
      { text: "const", tone: "kw" },
      { text: " ", tone: "muted" },
      { text: "result", tone: "fn" },
      { text: " = ", tone: "muted" },
      { text: "await", tone: "kw" },
      { text: " ", tone: "muted" },
      { text: "charge", tone: "fn" },
      { text: "(", tone: "punct" },
      { text: "order", tone: "fn" },
      { text: ");", tone: "punct" },
    ],
  },
  // 7:     if (result.ok) return result;
  {
    tokens: [
      { text: "    ", tone: "muted" },
      { text: "if", tone: "kw" },
      { text: " (", tone: "muted" },
      { text: "result", tone: "fn" },
      { text: ".", tone: "punct" },
      { text: "ok", tone: "fn" },
      { text: ") ", tone: "muted" },
      { text: "return", tone: "kw" },
      { text: " ", tone: "muted" },
      { text: "result", tone: "fn" },
      { text: ";", tone: "punct" },
    ],
  },
  // 8:   }
  { tokens: [{ text: "  }", tone: "punct" }] },
  // 9:   throw new Error("payment failed");
  {
    tokens: [
      { text: "  ", tone: "muted" },
      { text: "throw", tone: "kw" },
      { text: " ", tone: "muted" },
      { text: "new", tone: "kw" },
      { text: " ", tone: "muted" },
      { text: "Error", tone: "fn" },
      { text: "(", tone: "punct" },
      { text: '"payment failed"', tone: "str" },
      { text: ");", tone: "punct" },
    ],
  },
  // 10: }
  { tokens: [{ text: "}", tone: "punct" }] },
  // 11: empty
  { tokens: [{ text: "", tone: "muted" }] },
];

// The diff — the two changes the user ships to fix the flagged line.
//   - Pass an idempotency key derived from order.id so retries can't
//     double-charge.
//   - Sleep with exponential backoff (2 ** i * 100 ms) after a failed
//     attempt before the next try.
// Both lines are placed inside the for-loop on line 5, after the success
// check on line 7, so `i` is already in scope and `order` is the function
// parameter. Nothing resets between calls because the fix relies on
// server-side idempotency (the `idempotencyKey` argument) rather than
// in-process state like a `Set`.
const addedCode: Line[] = [
  // + const result = await charge(order, { idempotencyKey: order.id });
  {
    tokens: [
      { text: "const", tone: "kw" },
      { text: " ", tone: "muted" },
      { text: "result", tone: "fn" },
      { text: " = ", tone: "muted" },
      { text: "await", tone: "kw" },
      { text: " ", tone: "muted" },
      { text: "charge", tone: "fn" },
      { text: "(", tone: "punct" },
      { text: "order", tone: "fn" },
      { text: ", ", tone: "punct" },
      { text: "{", tone: "punct" },
      { text: " ", tone: "muted" },
      { text: "idempotencyKey", tone: "fn" },
      { text: ": ", tone: "punct" },
      { text: "order", tone: "fn" },
      { text: ".", tone: "punct" },
      { text: "id", tone: "fn" },
      { text: " });", tone: "punct" },
    ],
  },
  // + await sleep(2 ** i * 100);
  {
    tokens: [
      { text: "await", tone: "kw" },
      { text: " ", tone: "muted" },
      { text: "sleep", tone: "fn" },
      { text: "(", tone: "punct" },
      { text: "2", tone: "num" },
      { text: " ** ", tone: "muted" },
      { text: "i", tone: "fn" },
      { text: " * ", tone: "muted" },
      { text: "100", tone: "num" },
      { text: ");", tone: "punct" },
    ],
  },
];

// Helper: token tone -> Tailwind class. Falls back to body text.
function cls(tone: Line["tokens"][number]["tone"]): string {
  return TONE_CLASS[tone ?? "muted"] ?? "text-text";
}

export function HeroIDE() {
  const reduce = useReducedMotion();
  // Test id so the verification script can find this card without parsing
  // its content. Not user-facing.
  const testId = "hero-ide-card";

  // Shared spring used everywhere; reduced-motion gets a plain fade.
  const spring = (delay: number, extra?: object) =>
    reduce
      ? { duration: 0.2, ease: "easeOut" as const, delay }
      : { delay, ...SPRING_GENTLE, ...extra };

  // ── 3D mouse-follow tilt ───────────────────────────────────────────────
  // Track the cursor as a fraction of the card (-1…1 on each axis), feed
  // it through a soft spring so the motion feels like the card is being
  // physically pushed, and map to a small rotation (±8°). The card is the
  // outer motion.div; the inner content does its own entrance animations
  // in the card's local frame, so the tilt composes cleanly with them.
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  // Soft spring — quick enough to feel responsive, smooth enough to
  // avoid jitter when the mouse is moved fast across the card.
  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20, mass: 0.5 });
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20, mass: 0.5 });
  const rotateY = useTransform(smoothX, [-1, 1], [-8, 8]);
  const rotateX = useTransform(smoothY, [-1, 1], [8, -8]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Normalise to -1…1 with the card centre at 0.
    mouseX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  }
  function onMouseLeave() {
    // Snap back to flat when the cursor leaves the card.
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div style={{ perspective: 1000 }} data-testid={testId}>
      <motion.div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="rounded-xl border border-border bg-surface shadow-card overflow-hidden"
        style={{
          rotateX: reduce ? 0 : rotateX,
          rotateY: reduce ? 0 : rotateY,
          willChange: "transform",
        }}
      >
        {/* Window chrome: 3 traffic-light dots, "example incident" in the
            centre, "▶ run" affordance on the right. */}
        <motion.div
          className="flex items-center justify-between border-b border-border bg-bg/50 px-3 py-2 font-mono text-[11px]"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={spring(0)}
        >
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-border" />
            <span className="h-2 w-2 rounded-full bg-border" />
            <span className="h-2 w-2 rounded-full bg-border" />
          </div>
          <span className="text-muted">example incident</span>
          <span className="text-action">▶ run</span>
        </motion.div>

        {/* File tabs. Active tab is raised; the other two are flat. */}
        <motion.div
          className="flex items-center gap-1 border-b border-border bg-bg/30 px-3 py-1.5 font-mono text-[11px]"
          initial={reduce ? false : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring(0.1)}
        >
          <span className="rounded bg-surface px-2.5 py-0.5 text-text">
            payment-retry.ts
          </span>
          <span className="px-2.5 py-0.5 text-muted">incident.md</span>
          <span className="px-2.5 py-0.5 text-muted">ai</span>
        </motion.div>

        {/* Code editor: 11 lines with line numbers, line 5 highlighted as
            the offending line. Lines slide in from the left with a small
            stagger so the file "loads" line by line. */}
        <div className="bg-bg px-4 py-2.5 font-mono text-[12px] leading-[1.65] overflow-x-auto">
          {originalCode.map((line, i) => {
            const isFlagged = i === 4; // 0-indexed → line 5
            return (
              <motion.div
                key={`o-${i}`}
                className={
                  isFlagged
                    ? "flex -mx-4 px-4 bg-[#1a1c20] border-l-2 border-text"
                    : "flex"
                }
                initial={reduce ? false : { opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={spring(0.2 + i * 0.04)}
              >
                <span className="w-7 shrink-0 select-none text-right pr-3 text-muted/40">
                  {i + 1}
                </span>
                <span className="min-w-0 whitespace-pre">
                  {line.tokens.map((tok, j) => (
                    <span key={j} className={cls(tok.tone)}>
                      {tok.text}
                    </span>
                  ))}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Error annotation: "× line 5: no idempotency key, retry can
            double-charge" on the left, "→ ship the fix" on the right. */}
        <motion.div
          className="flex items-center justify-between gap-3 border-t border-border bg-bg/60 px-4 py-2 font-mono text-[11px]"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={spring(0.7)}
        >
          <span className="flex items-center gap-2 min-w-0">
            <span className="text-diffImpossible shrink-0">×</span>
            <span className="text-muted truncate">
              line 5: no idempotency key, retry can double-charge
            </span>
          </span>
          <span className="text-action shrink-0">→ ship the fix</span>
        </motion.div>

        {/* AI prompt line — the user asked the assistant for a fix. Sits
            above the diff so the diff reads as the AI's answer. */}
        <motion.div
          className="flex items-center justify-between gap-3 border-t border-border bg-bg/40 px-4 py-2 font-mono text-[11px]"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={spring(0.85)}
        >
          <span className="flex items-center gap-2 min-w-0">
            <span className="text-action shrink-0">ask ai</span>
            <span className="text-muted/70" aria-hidden>·</span>
            <span className="text-text/90 truncate">
              fix duplicate charge on retry, add backoff
            </span>
          </span>
          <span className="text-muted shrink-0">↩</span>
        </motion.div>

        {/* Diff header: "diff · retry loop" on the left, line counter
            ("+ 2") on the right. */}
        <motion.div
          className="flex items-center justify-between border-t border-border bg-bg/40 px-4 py-2 font-mono text-[11px]"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={spring(1.0)}
        >
          <span className="text-muted">diff · retry loop</span>
          <span className="text-diffEasy">+ 2</span>
        </motion.div>

        {/* Diff body: 2 added lines. They drop into the for-loop on line 5
            after the success check on line 7, so `i` is in scope and
            `order` is the function parameter. */}
        <div className="bg-bg px-4 py-2.5 font-mono text-[12px] leading-[1.65] overflow-x-auto">
          {addedCode.map((line, i) => (
            <motion.div
              key={`a-${i}`}
              className="flex"
              initial={reduce ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={spring(1.1 + i * 0.05)}
            >
              <span className="w-5 shrink-0 select-none pr-2 text-diffEasy">
                +
              </span>
              <span className="min-w-0 whitespace-pre">
                {line.tokens.map((tok, j) => (
                  <span key={j} className={cls(tok.tone)}>
                    {tok.text}
                  </span>
                ))}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Acceptance checks panel. The 7 rows slide in one by one (the
            "ticking" effect) and the "7 / 7 passing" counter appears once
            the last row has settled. */}
        <motion.div
          className="border-t border-border bg-bg/30 px-4 py-3"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={spring(1.4)}
        >
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="uppercase tracking-wider text-muted">
              acceptance checks
            </span>
            <motion.span
              className="text-action"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={spring(1.5 + acceptanceChecks.length * 0.08)}
            >
              7 / 7 passing
            </motion.span>
          </div>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-[11px]">
            {acceptanceChecks.map((check, i) => (
              <motion.div
                key={check.label}
                className="flex items-center gap-2 rounded border border-border bg-surface/60 px-2 py-1.5 min-w-0"
                initial={reduce ? false : { opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={spring(1.5 + i * 0.08)}
              >
                <span className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-action/15 text-action ring-1 ring-action/40">
                  <Check size={9} />
                </span>
                <span className="text-text/85 min-w-0 break-words">
                  {check.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
