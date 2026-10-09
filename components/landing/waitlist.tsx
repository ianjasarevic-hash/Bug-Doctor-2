"use client";

import { useState } from "react";
import { Container } from "@/components/landing/container";
import { Button } from "@/components/ui/button";
import { joinWaitlist } from "@/lib/supabase";

// "Be there day one" — the waitlist section.
//
// Earlier versions used framer-motion's `whileInView` to slide the
// copy block and the form card in from opposite sides, and a continuous
// "pop" animation on the submit button. On the static export the SSR
// HTML rendered them at `opacity:0` with a translate, and the
// IntersectionObserver only fired for content that was actually in the
// viewport. Off-screen content stayed invisible in fullPage screenshots,
// for crawlers, and for anyone trying to print the page. The fix:
// render plain HTML. The content is always visible.

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
      className="relative py-24 sm:py-32 divider-top"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs uppercase tracking-widest text-action">
              Launching · October 21
            </p>
            <h2
              id="waitlist-heading"
              className="mt-3 text-3xl sm:text-4xl font-semibold text-headline"
            >
              Be there day one.
            </h2>
            <p className="mt-4 text-muted text-lg leading-relaxed">
              bug.dr opens on October 21. The waitlist is how you get the link
              before everyone else, plus a heads-up the night before. Tell us
              why you&apos;d use it; that&apos;s how we shape what we ship.
            </p>

            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {reasons.map((x) => (
                <li
                  key={x}
                  className="flex items-start gap-2 font-mono text-[13px] text-muted"
                >
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 rounded-full bg-action shrink-0"
                  />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
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
                <div className="font-mono text-xs uppercase tracking-wider text-bg">
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
                    (status === "err" ? "text-bg" : "text-bg/80")
                  }
                  role="status"
                >
                  {status === "ok"
                    ? "thanks. we'll be in touch."
                    : status === "err"
                      ? "something went wrong. try again in a moment."
                      : "no spam. one email the night before, one when we open."}
                </div>

                {/* Privacy agreement. Plain text + inline link. Sits
                    just under the submit button so it reads as the
                    consent attached to the action, not a separate
                    section. */}
                <p className="mt-2 font-mono text-[11px] text-bg/80">
                  By joining you agree to our{" "}
                  <a
                    href="/privacy"
                    className="text-bg underline underline-offset-2 decoration-bg/40 hover:decoration-bg"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}

// Input style for use INSIDE the bright blue card. Solid dark fill, light
// text for readability on the dark surface, with a subtle light border
// that defines the box against the blue.
const inputClassLight =
  "block w-full h-11 rounded-md border border-white/10 bg-bg/90 px-3 text-sm text-text placeholder:text-muted focus:border-white/40 focus:outline-none disabled:opacity-60";

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
  // bright blue card (full-dark label and "required" pill for max
  // contrast against the blue).
  const labelClass = tone === "light" ? "text-bg" : "text-muted";
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
