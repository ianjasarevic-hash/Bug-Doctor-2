"use client";

import { useState } from "react";
import { Container } from "@/components/landing/container";
import { ChevronDown } from "@/components/landing/icons";

// FAQ — accordion.
//
// Earlier versions used framer-motion's `whileInView` to slide each
// row in from alternating sides, and a `motion.p` for the open/close
// answer animation. On the static export the SSR HTML rendered the
// section header and rows at `opacity:0` with a translate, and the
// IntersectionObserver only fired for content that was actually in the
// viewport. Off-screen content stayed invisible in fullPage screenshots,
// for crawlers, and for anyone trying to print the page. The fix:
// render plain HTML for the section chrome and the row entries. The
// open/close answer uses a CSS grid-row transition (no framer-motion
// needed for that), so the accordion still feels smooth.

const faqs = [
  {
    q: "Is using AI allowed?",
    a: "It's the point. Everyone has AI now. We measure how well you use it: correctness first, then code quality, verification, time and AI efficiency. Fewer tokens or fewer lines do not automatically score higher.",
  },
  {
    q: "Where do the problems come from?",
    a: "Production-style scenarios drawn from common failure modes across web, data and infra stacks.",
  },
  {
    q: "What languages and stacks?",
    a: "Node.js, TypeScript, Python, Go, React, Next.js, PostgreSQL, Redis, JWT, WebSocket. More are on the way as the library grows.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. bug.dr runs in the browser. Editor, terminal, AI assistant, and the test suite are all in-tab. Nothing to install.",
  },
  {
    q: "How is the score calculated?",
    a: "Correctness and reliability weigh most, then code quality, verification, time and AI efficiency. Fewer tokens or fewer lines do not automatically score higher.",
  },
  {
    q: "When will bug.dr launch?",
    a: "October 21, 2026. Join the waitlist and we will email you the link the moment we go live, plus a heads-up the night before. If you are hiring and want early access for your team, mention that in the 'why you'd use it' field.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative py-24 sm:py-32 divider-top"
    >
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-action">
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="mt-3 text-3xl sm:text-4xl font-semibold text-headline"
          >
            Questions we get asked.
          </h2>
        </div>

        <div className="mt-10 max-w-3xl rounded-xl border border-border bg-surface shadow-card overflow-hidden">
          {faqs.map((item, i) => (
            <div
              key={item.q}
              className={i !== 0 ? "border-t border-border" : ""}
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-controls={`faq-panel-${i}`}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-surface/80 transition-colors"
              >
                <span className="text-[15px] font-medium">{item.q}</span>
                <ChevronDown
                  size={18}
                  className={[
                    "shrink-0 text-muted transition-transform duration-300",
                    open === i ? "rotate-180 text-action" : "",
                  ].join(" ")}
                />
              </button>
              <div
                id={`faq-panel-${i}`}
                role="region"
                className={[
                  "grid transition-[grid-template-rows] duration-300 ease-out",
                  open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                ].join(" ")}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-muted leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
