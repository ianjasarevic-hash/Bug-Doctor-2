"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/landing/container";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@/components/landing/icons";

const WAITLIST_TO = "hi@bug.dr";
const WAITLIST_SUBJECT = "bug.dr · waitlist";

export function FinalCta() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const reduce = useReducedMotion();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSent(true);
    const body = encodeURIComponent(
      [
        "Hi bug.dr,",
        "",
        "Add me to the waitlist.",
        "",
        `Email: ${email}`,
        "",
        "—",
      ].join("\n"),
    );
    window.location.href = `mailto:${WAITLIST_TO}?subject=${encodeURIComponent(
      WAITLIST_SUBJECT,
    )}&body=${body}`;
  }

  return (
    <section
      aria-labelledby="final-cta-heading"
      className="relative py-20 sm:py-28"
    >
      <Container>
        <motion.div
          className="relative overflow-hidden rounded-2xl border border-action/30 bg-action text-bg px-6 py-16 sm:px-12 sm:py-20 shadow-glow"
          initial={{ opacity: 0, y: 80, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* faint grid overlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(21,22,24,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(21,22,24,0.3) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          {/* slow drifting glow inside the card */}
          {!reduce && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full blur-3xl opacity-40"
              style={{ background: "rgba(255,255,255,0.35)" }}
              animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          <div className="relative max-w-2xl">
            <motion.p
              className="font-mono text-xs uppercase tracking-widest text-bg/70"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              Launching · October 21
            </motion.p>
            <motion.h2
              id="final-cta-heading"
              className="mt-3 text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.05]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              Your first patient is waiting.
            </motion.h2>
            <motion.p
              className="mt-4 text-lg text-bg/80 leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              We open on October 21. Get the link the moment we go live — and
              a heads-up the night before.
            </motion.p>

            <motion.form
              onSubmit={submit}
              className="mt-8 flex flex-col sm:flex-row gap-2 max-w-md"
              aria-label="Join the bug.dr waitlist"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <label htmlFor="final-cta-email" className="sr-only">
                Email address
              </label>
              <input
                id="final-cta-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@somewhere.com"
                className="h-12 flex-1 rounded-md border border-bg/40 px-3 text-sm text-bg placeholder:text-bg/50 focus:outline-none focus:border-bg bg-bg/15"
              />
              <Button
                type="submit"
                size="lg"
                className="!bg-bg !text-action hover:!bg-surface"
              >
                {sent ? "thanks →" : "Join the waitlist"}
                <ArrowRight size={16} />
              </Button>
            </motion.form>
            <motion.p
              className="mt-3 font-mono text-[11px] text-bg/70"
              role="status"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {sent
                ? "opening your mail client — one field, no password."
                : "no spam. one email when we open."}
            </motion.p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
