"use client";

import { useState } from "react";
import { Container } from "@/components/landing/container";
import { LinkButton } from "@/components/ui/button";
import { Check, Cross } from "@/components/landing/icons";

// "Simple pricing" : the Pricing section.
//
// Two cards side by side, centered, stacked on mobile. Free on the
// left, Pro on the right. The Pro card is highlighted with the
// accent border and a soft glow so it reads as the recommended
// option. Both cards use the same frame as the rest of the site
// (rounded-xl border border-border bg-surface shadow-card).
//
// Pro has a monthly/annual toggle (default annual). The toggle is
// a pair of pill buttons inside a rounded container; the active
// side is filled with the action tint so the state is obvious.
//
// The annual price is shown as its monthly equivalent (€8.25 /month)
// so the headline number reads small. A "Billed €99 yearly" caption
// sits underneath so the user knows the actual charge is the full
// year. The monthly selection stays as €12.99 /month, no caption
// needed. The "Save €57" badge only appears on annual.
//
// Both cards end with a "Join waitlist" button that jumps to the
// existing #waitlist section. No checkout, no card field, no form:
// the note under the cards says "Payments open after launch" so
// the user knows pricing is for display only right now.
//
// The "Included" and "Not included" lists use the same Check / Cross
// icon set as the comparison table, so the visual language is
// shared across the page.

type Plan = "free" | "pro";

type Item = {
  label: string;
  // true = check (included), false = cross (not included). The
  // same Item shape covers both lists, so the rendering code stays
  // the same.
  included: boolean;
  // Override the row text color. When included=false, the body
  // text is muted (so a non-feature doesn't read as a hard "no"),
  // but the Free card's "Not included" list uses `danger` to lean
  // into the fact that those features are paywalled. Right now
  // we render all "not included" rows in muted, so this is kept
  // simple.
};

const freeIncluded: Item[] = [
  { label: "All Easy problems", included: true },
  { label: "Basic AI assistant", included: true },
  { label: "Efficiency scoring", included: true },
  { label: "Public leaderboard", included: true },
  { label: "AI feedback on Easy solves", included: true },
];

const freeNotIncluded: Item[] = [
  { label: "Career paths", included: false },
  { label: "Medium, Hard and Get a job problems", included: false },
  { label: "Powerful AI model", included: false },
];

const proIncluded: Item[] = [
  { label: "Everything in Free", included: true },
  { label: "Career paths with efficiency gating", included: true },
  { label: "AI coaching after every solve", included: true },
  { label: "Powerful AI model included", included: true },
  { label: "Connect your own API key", included: true },
];

export function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="relative py-24 sm:py-32 divider-top"
    >
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-action">
            Pricing
          </p>
          <h2
            id="pricing-heading"
            className="mt-3 text-3xl sm:text-4xl font-semibold text-headline"
          >
            Simple pricing
          </h2>
          <p className="mt-4 text-muted text-lg leading-relaxed">
            Free to start. Pro when you&apos;re serious about getting hired.
          </p>
        </div>

        {/* Two cards side by side, centered as a group. The
            max-w-[640px] on the wrapper keeps them compact on
            wide screens so the visual weight of Pricing doesn't
            outweigh the rest of the page. */}
        <div className="mt-14 mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[640px] md:max-w-[820px]">
          <FreeCard />
          <ProCard annual={annual} onChange={setAnnual} />
        </div>

        <p className="mt-8 text-center text-muted text-sm">
          Payments open after launch.
        </p>
      </Container>
    </section>
  );
}

function FreeCard() {
  return (
    <article className="rounded-xl border border-border bg-surface shadow-card p-6 sm:p-8 flex flex-col">
      <div className="font-mono text-xs uppercase tracking-widest text-muted">
        Free
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold text-headline tracking-tight">
          €0
        </span>
        <span className="text-sm text-muted">/month</span>
      </div>

      <FeatureList heading="Included" items={freeIncluded} />
      <FeatureList heading="Not included" items={freeNotIncluded} muted />

      <LinkButton
        href="#waitlist"
        variant="secondary"
        size="md"
        className="mt-8 w-full"
      >
        Join waitlist
      </LinkButton>
    </article>
  );
}

function ProCard({
  annual,
  onChange,
}: {
  annual: boolean;
  onChange: (v: boolean) => void;
}) {
  // Annual is displayed as the monthly equivalent (€99 / 12 = €8.25)
  // so the headline number reads small, with a "Billed €99 yearly"
  // caption underneath so the user knows the actual charge is the
  // full year. Monthly shows the raw price with no caption.
  const price = annual ? "€8.25" : "€12.99";
  const unit = "/month";
  const billedAnnually = annual ? "Billed €99 yearly" : null;

  return (
    <article
      className="relative rounded-xl border-2 border-action bg-surface shadow-glow p-6 sm:p-8 flex flex-col"
      aria-label="Pro plan, highlighted"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="font-mono text-xs uppercase tracking-widest text-action">
          Pro
        </div>
        {/* The "Save" badge only on annual, top-right of the card
            so it doesn't get covered by the toggle. Color matches
            the accent border so the Pro card reads as one
            highlight unit. */}
        {annual && (
          <span className="inline-flex items-center rounded-full bg-action/15 text-action px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider">
            Save €57
          </span>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold text-headline tracking-tight">
          {price}
        </span>
        <span className="text-sm text-muted">{unit}</span>
      </div>

      {/* When annual is selected, the small caption underneath
          tells the user the actual charge is the full year, not
          monthly. Hidden on the monthly selection so the card
          doesn't grow. */}
      <div className="mt-1.5 h-4 text-[12px] text-muted">
        {billedAnnually}
      </div>

      {/* Monthly / annual toggle. Two pill buttons inside a
          rounded container. The active side is filled with the
          action tint; the inactive side is muted text. aria-pressed
          tells assistive tech which side is currently active. */}
      <div
        role="group"
        aria-label="Billing period"
        className="mt-5 inline-flex items-center self-start rounded-full border border-border bg-bg/40 p-1 font-mono text-[11px] uppercase tracking-wider"
      >
        <button
          type="button"
          onClick={() => onChange(false)}
          aria-pressed={!annual}
          className={[
            "px-3 py-1 rounded-full transition-colors",
            !annual
              ? "bg-action/15 text-action"
              : "text-muted hover:text-text",
          ].join(" ")}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => onChange(true)}
          aria-pressed={annual}
          className={[
            "px-3 py-1 rounded-full transition-colors",
            annual
              ? "bg-action/15 text-action"
              : "text-muted hover:text-text",
          ].join(" ")}
        >
          Annual
        </button>
      </div>

      <FeatureList heading="Included" items={proIncluded} />

      <LinkButton
        href="#waitlist"
        variant="primary"
        size="md"
        className="mt-8 w-full"
      >
        Join waitlist
      </LinkButton>
    </article>
  );
}

function FeatureList({
  heading,
  items,
  muted,
}: {
  heading: string;
  items: Item[];
  // When true (e.g. the Free card's "Not included" list), render
  // the labels in muted color so the row reads as a non-feature
  // without a hard "no" treatment.
  muted?: boolean;
}) {
  return (
    <div className="mt-6">
      <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
        {heading}
      </p>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-start gap-2.5 text-[14px] leading-snug"
          >
            <span
              aria-hidden
              className={[
                "mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full ring-1",
                item.included
                  ? "bg-action/15 text-action ring-action/40"
                  : "bg-diffImpossible/10 text-diffImpossible ring-diffImpossible/40",
              ].join(" ")}
            >
              {item.included ? <Check size={11} /> : <Cross size={11} />}
            </span>
            <span className={muted && !item.included ? "text-muted" : "text-text"}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Plan type re-exported so a future "billing" component (e.g. an
// account-settings page) can reuse the same included/not-included
// shape without re-declaring it.
export type { Plan };
