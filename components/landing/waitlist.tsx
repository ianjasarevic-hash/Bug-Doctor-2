"use client";

import { useState } from "react";
import { Container } from "@/components/landing/container";
import { Button } from "@/components/ui/button";

// TODO: replace with real waitlist endpoint (e.g. Resend audience, ConvertKit,
// Airtable). The current submitter opens a prefilled mailto to the founding
// team's inbox so leads aren't dropped on the floor during pre-launch.
const WAITLIST_TO = "hi@bug.dr";
const WAITLIST_SUBJECT = "bug.dr · waitlist";

// TODO: replace with the live count once we have one. Until then the line
// below the form is hidden.
const WAITLIST_COUNT: number | null = null;

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubmitted(true);
    const body = encodeURIComponent(
      [
        "Hi bug.dr,",
        "",
        "Add me to the waitlist.",
        "",
        `Email: ${email}`,
        `Company: ${company || "(not provided)"}`,
        "",
        "Why I'd use it:",
        reason || "(not provided)",
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
      id="waitlist"
      aria-labelledby="waitlist-heading"
      className="relative py-24 sm:py-32 border-t border-border"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs uppercase tracking-widest text-action">
              Launching · October 20
            </p>
            <h2
              id="waitlist-heading"
              className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight leading-tight"
            >
              Be there day one.
            </h2>
            <p className="mt-4 text-muted text-lg leading-relaxed">
              bug.dr opens on October 20. The waitlist is how you get the link
              before everyone else — and a heads-up the night before. Tell us
              why you&apos;d use it; that&apos;s how we shape what we ship.
            </p>

            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {[
                "Engineer who's tired of algorithm interviews",
                "Hiring manager looking for real signal",
                "Curious, want to follow along",
                "Working on something adjacent",
              ].map((x) => (
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
            <form
              onSubmit={submit}
              className="rounded-xl border border-border bg-surface shadow-card p-6"
              aria-label="Join the bug.dr waitlist"
            >
              <div className="font-mono text-xs uppercase tracking-wider text-muted">
                Waitlist
              </div>
              <div className="mt-2 text-lg font-semibold tracking-tight">
                Three fields. Sixty seconds.
              </div>

              <div className="mt-6 space-y-4">
                <Field
                  label="Email"
                  required
                  htmlFor="wl-email"
                  input={
                    <input
                      id="wl-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@somewhere.com"
                      className={inputClass}
                    />
                  }
                />
                <Field
                  label="Company"
                  optional
                  htmlFor="wl-company"
                  input={
                    <input
                      id="wl-company"
                      type="text"
                      autoComplete="organization"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="optional"
                      className={inputClass}
                    />
                  }
                />
                <Field
                  label="Why would you use bug.dr?"
                  optional
                  htmlFor="wl-reason"
                  input={
                    <textarea
                      id="wl-reason"
                      rows={3}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="one line is fine"
                      className={`${inputClass} resize-y min-h-[72px]`}
                    />
                  }
                />
              </div>

              <Button type="submit" size="md" className="mt-6 w-full">
                Join the waitlist
              </Button>

              <div
                className="mt-3 font-mono text-[11px] text-muted"
                role="status"
              >
                {submitted
                  ? "thanks. we'll be in touch."
                  : "no spam. one email when we open."}
              </div>

              {/* Waitlist size — visible only when the count is real. */}
              {WAITLIST_COUNT !== null ? (
                <div className="mt-1 font-mono text-[11px] text-muted">
                  {WAITLIST_COUNT.toLocaleString()} engineers on the waitlist.
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}

const inputClass =
  "block w-full h-11 rounded-md border border-border bg-bg px-3 text-sm text-text placeholder:text-muted/70 focus:border-action focus:outline-none";

function Field({
  label,
  required,
  optional,
  htmlFor,
  input,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  htmlFor: string;
  input: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-muted"
      >
        <span>{label}</span>
        {required ? (
          <span className="text-action">required</span>
        ) : optional ? (
          <span>optional</span>
        ) : null}
      </label>
      <div className="mt-1.5">{input}</div>
    </div>
  );
}