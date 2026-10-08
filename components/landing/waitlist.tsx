"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/landing/container";
import { Button } from "@/components/ui/button";
import { joinWaitlist } from "@/lib/supabase";

const WAITLIST_COUNT: number | null = null;

const reasons = [
  "Engineer who's tired of algorithm interviews",
  "Hiring manager looking for real signal",
  "Curious, want to follow along",
  "Working on something adjacent",
];

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">(
    "idle",
  );
  const reduce = useReducedMotion();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setStatus("sending");

    const result = await joinWaitlist({
      // Normalize so the unique index on lower(email) catches dupes.
      email: email.trim().toLowerCase(),
      company: company.trim() || null,
      reason: reason.trim() || null,
    });

    setStatus(result.ok ? "ok" : "err");
  }

  return (
    <section
      id="waitlist"
      aria-labelledby="waitlist-heading"
      className="relative py-24 sm:py-32 divider-top cv-auto"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, x: reduce ? 0 : -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-mono text-xs uppercase tracking-widest text-action">
              Launching · October 21
            </p>
            <h2
              id="waitlist-heading"
              className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight leading-tight"
            >
              Be there day one.
            </h2>
            <p className="mt-4 text-muted text-lg leading-relaxed">
              bug.dr opens on October 21. The waitlist is how you get the link
              before everyone else — and a heads-up the night before. Tell us
              why you&apos;d use it; that&apos;s how we shape what we ship.
            </p>

            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {reasons.map((x, i) => {
                const xDir = i % 2 === 0 ? -20 : 20;
                return (
                  <motion.li
                    key={x}
                    className="flex items-start gap-2 font-mono text-[13px] text-muted"
                    initial={{ opacity: 0, x: reduce ? 0 : xDir }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.2 + i * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <motion.span
                      aria-hidden
                      className="mt-2 h-1.5 w-1.5 rounded-full bg-action shrink-0"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.3 + i * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                    <span>{x}</span>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>

          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: reduce ? 0 : 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Bright blue card — same look the old FinalCta had, now
                doing real work (writing to Supabase). Faint grid overlay
                sits behind the form for texture, like the FinalCta did. */}
            <form
              onSubmit={submit}
              className="relative overflow-hidden rounded-2xl border border-action/30 bg-action text-bg shadow-glow p-8 sm:p-10"
              aria-label="Join the bug.dr waitlist"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(21,22,24,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(21,22,24,0.3) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              <div className="relative">
                <div className="font-mono text-xs uppercase tracking-wider text-bg/70">
                  Waitlist
                </div>
                <div className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-bg">
                  Three fields. Sixty seconds.
                </div>

                <div className="mt-6 space-y-4">
                  <Field
                    tone="light"
                    label="Email"
                    required
                    htmlFor="wl-email"
                    input={
                      <input
                        id="wl-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@somewhere.com"
                        disabled={status === "sending" || status === "ok"}
                        className={inputClassLight}
                      />
                    }
                  />
                  <Field
                    tone="light"
                    label="Company"
                    optional
                    htmlFor="wl-company"
                    input={
                      <input
                        id="wl-company"
                        name="company"
                        type="text"
                        autoComplete="organization"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="optional"
                        disabled={status === "sending" || status === "ok"}
                        className={inputClassLight}
                      />
                    }
                  />
                  <Field
                    tone="light"
                    label="Why would you use bug.dr?"
                    optional
                    htmlFor="wl-reason"
                    input={
                      <textarea
                        id="wl-reason"
                        name="reason"
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="one line is fine"
                        disabled={status === "sending" || status === "ok"}
                        className={`${inputClassLight} resize-y min-h-[72px]`}
                      />
                    }
                  />
                </div>

                <Button
                  type="submit"
                  size="md"
                  className="mt-6 w-full !bg-bg !text-action hover:!bg-surface"
                  disabled={status === "sending" || status === "ok"}
                >
                  {status === "sending"
                    ? "Sending…"
                    : status === "ok"
                      ? "You're on the list"
                      : "Join the waitlist"}
                </Button>

                <div
                  className={
                    "mt-3 font-mono text-[11px] " +
                    (status === "err" ? "text-bg" : "text-bg/70")
                  }
                  role="status"
                >
                  {status === "ok"
                    ? "thanks. we'll be in touch."
                    : status === "err"
                      ? "something went wrong. try again in a moment."
                      : "no spam. one email when we open."}
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

// Input style for use INSIDE the bright blue card. Dark text on a slightly
// transparent dark fill, with a translucent border.
const inputClassLight =
  "block w-full h-11 rounded-md border border-bg/40 bg-bg/15 px-3 text-sm text-bg placeholder:text-bg/50 focus:border-bg focus:outline-none disabled:opacity-60";

function Field({
  label,
  required,
  optional,
  htmlFor,
  input,
  tone = "dark",
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  htmlFor: string;
  input: React.ReactNode;
  tone?: "dark" | "light";
}) {
  // Two label colorways: "dark" for forms on the page background (muted
  // gray label, blue "required" pill) and "light" for forms inside the
  // bright blue card (faded dark label, full-dark "required" pill).
  const labelClass = tone === "light" ? "text-bg/70" : "text-muted";
  const requiredClass = tone === "light" ? "text-bg" : "text-action";
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className={`flex items-center justify-between font-mono text-[11px] uppercase tracking-wider ${labelClass}`}
      >
        <span>{label}</span>
        {required ? (
          <span className={requiredClass}>required</span>
        ) : optional ? (
          <span>optional</span>
        ) : null}
      </label>
      <div className="mt-1.5">{input}</div>
    </div>
  );
}
