"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/landing/container";
import { ChevronDown } from "@/components/landing/icons";

const faqs = [
  {
    q: "Can't AI just solve these?",
    a: "AI can pass the algorithm interview in 30 seconds. It can't read your codebase, reproduce your bug, ship a fix you trust, and prove it under load. The score is the signal, not the solution.",
  },
  {
    q: "Where do the problems come from?",
    a: "Real GitHub bug reports (with the company's permission, anonymised) and generated scenarios that match real prod failure modes. New problems ship weekly.",
  },
  {
    q: "What languages and stacks?",
    a: "Node, Python, Go, Java, Postgres, MySQL, MongoDB, Redis, Kubernetes, Next.js, React. We're adding more as the library grows.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. bug.dr runs in the browser. Editor, terminal, live preview, and the test suite are all in-tab. Nothing to install.",
  },
  {
    q: "How is the score calculated?",
    a: "Score = difficulty × time × diff size. A prod-ready percentage tells you how your fix holds up under load. Faster, smaller diffs on Hard problems score more.",
  },
  {
    q: "When will bug.dr launch?",
    a: "October 20, 2026. Join the waitlist and we'll email you the link the moment we go live — plus a heads-up the night before. If you're hiring and want early access for your team, mention that in the 'why you'd use it' field.",
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
      className="relative py-24 sm:py-32 border-t border-border"
    >
      <Container>
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-xs uppercase tracking-widest text-action">
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight"
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
                transition={{
                  duration: 0.5,
                  delay: i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
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
                      transition={{ duration: 0.25, ease: "easeOut" }}
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
