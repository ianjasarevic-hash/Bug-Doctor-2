"use client";

import { useState } from "react";
import { Container } from "@/components/landing/container";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@/components/landing/icons";

// TODO: replace with real waitlist endpoint. For pre-launch this opens the
// user's mail client with a prefilled body to hi@bug.dr so leads aren't
// dropped on the floor.
const WAITLIST_TO = "hi@bug.dr";
const WAITLIST_SUBJECT = "bug.dr · waitlist";

export function FinalCta() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

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
        <div className="relative overflow-hidden rounded-2xl border border-action/30 bg-action text-bg px-6 py-16 sm:px-12 sm:py-20 shadow-glow">
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
          <div className="relative max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-widest text-bg/70">
              Launching · October 20
            </p>
            <h2
              id="final-cta-heading"
              className="mt-3 text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.05]"
            >
              Your first patient is waiting.
            </h2>
            <p className="mt-4 text-lg text-bg/80 leading-relaxed max-w-xl">
              We open on October 20. Get the link the moment we go live — and
              a heads-up the night before.
            </p>

            {/* Inline email + submit. Same handler as the main waitlist form. */}
            <form
              onSubmit={submit}
              className="mt-8 flex flex-col sm:flex-row gap-2 max-w-md"
              aria-label="Join the bug.dr waitlist"
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
            </form>
            <p
              className="mt-3 font-mono text-[11px] text-bg/70"
              role="status"
            >
              {sent
                ? "opening your mail client — one field, no password."
                : "no spam. one email when we open."}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}