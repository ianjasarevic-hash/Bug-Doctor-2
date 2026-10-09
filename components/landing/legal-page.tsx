import Link from "next/link";
import { Container } from "@/components/landing/container";
import { Nav } from "@/components/landing/nav";
import { Footer } from "@/components/landing/footer";
import { OperatorLine } from "@/components/landing/operator-line";

// Shared layout for the legal pages (/privacy, /terms). Each page
// passes its own list of sections; this component renders the page
// shell, the table of contents, and the body sections in order.
//
// The anchor id on each section is the kebab-case of its `slug` field
// (e.g. "what-we-collect" → id="what-we-collect"). ToC links are
// plain <a href="#...">, so the in-page section-focus tracker
// (initialised by Nav) handles the smooth scroll.
//
// The "operated by ... Questions: ..." line is rendered by
// OperatorLine so the legal pages and the footer share the same
// single source of truth.

export type LegalSection = {
  slug: string;
  title: string;
  body: React.ReactNode;
};

export function LegalPage({
  title,
  lastUpdated,
  sections,
}: {
  title: string;
  // Short text shown above the ToC, e.g. "Last updated: October 9, 2026".
  lastUpdated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <Nav variant="legal" />
      <main>
        <section className="relative py-16 sm:py-24">
          <Container>
            <div className="max-w-3xl">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted hover:text-text transition-colors"
              >
                <span aria-hidden>←</span>
                <span>Back to bug.dr</span>
              </Link>

              <h1 className="mt-6 text-4xl sm:text-5xl font-semibold text-headline text-display">
                {title}
              </h1>
              <div className="mt-4 text-sm text-muted">
                <p className="font-mono text-[11px]">{lastUpdated}</p>
                <p className="mt-2">
                  <OperatorLine className="text-sm font-sans" />
                </p>
              </div>
            </div>

            <nav
              aria-label="Table of contents"
              className="mt-12 max-w-3xl rounded-xl border border-border bg-surface/60 p-6"
            >
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                Contents
              </p>
              <ol className="mt-3 space-y-1.5 text-sm">
                {sections.map((s, i) => (
                  <li key={s.slug}>
                    <a
                      href={`#${s.slug}`}
                      className="text-text/85 hover:text-text transition-colors"
                    >
                      <span className="font-mono text-muted mr-2">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mt-16 max-w-3xl space-y-16">
              {sections.map((s, i) => (
                <section
                  key={s.slug}
                  id={s.slug}
                  // Leave room for the sticky nav when the user clicks a
                  // ToC anchor. The global `section[id]` rule in
                  // globals.css already sets scroll-margin-top, but
                  // setting it here too makes the intent local.
                  style={{ scrollMarginTop: 80 }}
                >
                  <h2 className="text-2xl sm:text-3xl font-semibold text-headline">
                    <span className="font-mono text-action mr-3 text-base align-middle">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.title}
                  </h2>
                  <div className="mt-4 space-y-4 text-muted leading-relaxed [&_strong]:text-text [&_strong]:font-medium [&_a]:text-text [&_a]:underline [&_a]:decoration-text/30 [&_a]:underline-offset-2 hover:[&_a]:decoration-text">
                    {s.body}
                  </div>
                </section>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
