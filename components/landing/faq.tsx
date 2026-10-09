"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/landing/container";
import { ChevronDown } from "@/components/landing/icons";
import { SPRING, SPRING_GENTLE } from "@/lib/motion";

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

// Alternate entry direction per row so the FAQ list "puzzles" in from both
// sides. With 6 items, that means L/R/L/R/L/R.
const rowFrom: ("left" | "right")[] = ["left", "right", "left", "right", "left", "right"];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative py-24 sm:py-32 divider-top"
    >
      <Container>
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={
            reduce
              ? { duration: 0.2, ease: "easeOut" as const }
              : { ...SPRING_GENTLE }
          }
        >
          <p className="font-mono text-xs uppercase tracking-widest text-action">
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="mt-3 text-3xl sm:text-4xl font-semibold text-headline"
          >
            Questions we get asked.
          </h2>
        </motion.div>

        <div className="mt-10 max-w-3xl rounded-xl border border-border bg-surface shadow-card overflow-hidden">
          {faqs.map((item, i) => {
            const x = rowFrom[i] === "left" ? -40 : 40;
            return (
              <motion.div
                key={item.q}
                className={i !== 0 ? "border-t border-border" : ""}
                initial={{ opacity: 0, x: reduce ? 0 : x }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={
                  reduce
                    ? { duration: 0.2, ease: "easeOut" as const, delay: i * 0.06 }
                    : { delay: i * 0.06, ...SPRING_GENTLE }
                }
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
                    <motion.p
                      className="px-6 pb-6 text-muted leading-relaxed"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: open === i ? 1 : 0, y: open === i ? 0 : 6 }}
                      transition={
                        reduce
                          ? { duration: 0.2, ease: "easeOut" as const }
                          : { ...SPRING }
                      }
                    >
                      {item.a}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
