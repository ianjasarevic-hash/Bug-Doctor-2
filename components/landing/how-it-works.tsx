import { Container } from "@/components/landing/container";
import { type Line, TONE_CLASS } from "@/components/landing/code-block";
import { Check } from "@/components/landing/icons";
import { ZoomableImage } from "@/components/ui/zoomable-image";

// How it works — three steps: Diagnose. Treat. Submit.
//
// Earlier versions used framer-motion's `whileInView` to slide each step
// in from alternating sides. On the static export the SSR HTML rendered
// each step at `opacity:0` with a translate, and the IntersectionObserver
// only fired for steps that were actually in the viewport. Off-screen
// steps stayed invisible in fullPage screenshots, for crawlers, and for
// anyone trying to print the page. The fix: render plain HTML. The
// content is always visible.

// Real acceptance checks from the Payment retries problem (problem-detail.png).
// Used by step 03 (the static checks card). HeroIDE exports its own copy so
// the two visuals can live independently; the labels here are the source of
// truth for the rest of the page.
const acceptanceChecks: { label: string }[] = [
  { label: "Retry transient failures" },
  { label: "Prevent duplicate charges" },
  { label: "Back off between retries" },
  { label: "Existing tests still pass" },
  { label: "Preserve successful payments" },
  { label: "Keep the worker healthy" },
  { label: "Keep failed jobs visible in the queue" },
];

export function HowItWorks() {
  const items = [
    {
      n: "01",
      label: "Diagnose",
      title: "Read the incident.",
      body:
        "Open the case file. A real bug report, a stack trace, the production error. The timer starts on Start. Nobody can leak the fix in comments until you solve it.",
      visual: <ProblemDetailShot />,
    },
    {
      n: "02",
      label: "Treat",
      title: "Fix it in the browser.",
      body:
        "Open the codebase in the browser. Editor, terminal and an AI assistant in one workspace. Trace the bug, ask the AI for a fix, ship a real diff. Your prompts, tokens and runs are tracked as you work.",
      visual: <StaticDiffCard />,
    },
    {
      n: "03",
      label: "Submit and get scored",
      title: "Pass the checks.",
      body:
        "Submit and the acceptance checks run one by one. Pass them all and the problem is solved. Correctness and reliability weigh most, then code quality, verification, time and AI efficiency. Your first successful result is final.",
      visual: <StaticChecksCard />,
    },
  ];

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="relative py-24 sm:py-32 divider-top"
    >
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-action">
            How it works
          </p>
          <h2
            id="how-heading"
            className="mt-3 text-3xl sm:text-4xl font-semibold text-headline"
          >
            Diagnose. Treat. Submit.
          </h2>
          <p className="mt-4 text-muted text-lg leading-relaxed">
            Every case follows the same three steps. Read the incident, ship
            the fix, prove it on the acceptance checks.
          </p>
        </div>

        <ol className="mt-14 space-y-16">
          {items.map((item) => (
            <li
              key={item.n}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              <div className="lg:col-span-5">
                <div className="font-mono text-sm text-muted">
                  <span className="text-action">{item.n}</span>
                  <span aria-hidden> · </span>
                  <span className="uppercase tracking-wider">{item.label}</span>
                </div>
                <h3 className="mt-2 text-2xl sm:text-3xl font-semibold text-headline">
                  {item.title}
                </h3>
                <p className="mt-3 text-muted text-lg leading-relaxed">
                  {item.body}
                </p>
              </div>
              <div className="lg:col-span-7">{item.visual}</div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

function ProblemDetailShot() {
  // Real product screenshot for step 01 ("Read the incident"). The visitor
  // sees the real assignment, incident log and acceptance checks, not a
  // mock. Wrapped in ZoomableImage so the user can open it fullscreen to
  // read the assignment.
  return (
    <div className="rounded-xl border border-border bg-surface shadow-card overflow-hidden">
      <ZoomableImage
        src="screenshots/problem-detail.png"
        alt="Payment retries problem page showing the assignment, incident log and acceptance checks."
        width={1570}
        height={1600}
        sizes="(min-width: 1024px) 700px, 100vw"
      />
    </div>
  );
}

// ── StaticDiffCard (step 02) ──────────────────────────────────────────────
//
// Small static card that shows the same two-line diff the user sees
// animated in the hero, without the editor chrome or the ask-ai line.
// Just the diff header and the two added lines that fix the retry loop
// (idempotency key on charge, exponential backoff after a failed attempt).
//
// The two lines are kept in lock-step with the hero's `addedCode` in
// `components/landing/hero.tsx`. If one is edited, the other must be too.

// Helper: token tone -> Tailwind class. Falls back to body text.
function cls(tone: Line["tokens"][number]["tone"]): string {
  return TONE_CLASS[tone ?? "muted"] ?? "text-text";
}

const diffLines: Line[] = [
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

function StaticDiffCard() {
  return (
    <div
      className="rounded-xl border border-border bg-surface shadow-card overflow-hidden max-w-xl"
      data-testid="static-diff-card"
    >
      {/* Diff header. Matches the hero card's header so the two visuals
          read as the same diff at two different sizes. */}
      <div className="flex items-center justify-between border-b border-border bg-bg/40 px-4 py-2 font-mono text-[11px]">
        <span className="text-muted">diff · retry loop</span>
        <span className="text-diffEasy">+ 2</span>
      </div>
      <div className="bg-bg px-4 py-2.5 font-mono text-[12px] leading-[1.65] overflow-x-auto">
        {diffLines.map((line, i) => (
          <div key={i} className="flex">
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
          </div>
        ))}
      </div>
    </div>
  );
}

// ── StaticChecksCard (step 03) ────────────────────────────────────────────
//
// Static acceptance-checks card. Lists the 7 real names from
// `acceptanceChecks` and shows the "first successful result is final" note
// at the bottom. No animation, no score-locked pill — the hero already
// shows the live "ticking in" version; this is the after-the-fact summary.

function StaticChecksCard() {
  return (
    <div
      className="rounded-xl border border-border bg-surface shadow-card overflow-hidden max-w-xl"
      data-testid="static-checks-card"
    >
      <div className="border-b border-border bg-bg/30 px-4 py-3">
        <div className="flex items-center justify-between font-mono text-[11px]">
          <span className="uppercase tracking-wider text-muted">
            acceptance checks
          </span>
          <span className="text-action">7 / 7 passing</span>
        </div>
      </div>
      <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-[11px]">
        {acceptanceChecks.map((c) => (
          <div
            key={c.label}
            className="flex items-center gap-2 rounded border border-border bg-surface/60 px-2 py-1.5 min-w-0"
          >
            <span className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-action/15 text-action ring-1 ring-action/40">
              <Check size={9} />
            </span>
            <span className="text-text/85 min-w-0 break-words">{c.label}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-border px-4 py-2.5 font-mono text-[12px] text-muted">
        first successful result is final
      </div>
    </div>
  );
}
