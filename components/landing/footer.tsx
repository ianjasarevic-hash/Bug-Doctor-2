import Link from "next/link";
import { Container } from "@/components/landing/container";
import { OperatorLine } from "@/components/landing/operator-line";

// Minimal footer. The operator / contact line is rendered by
// OperatorLine (which also handles the mailto link and the
// optional registration id). Copyright and Privacy / Terms links
// sit on a second row. Used on the home page and on the legal
// pages — on mobile the nav links collapse, so this footer is the
// only way users reach Privacy and Terms.

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/30">
      <Container>
        <div className="py-10 flex flex-col gap-4">
          <OperatorLine />
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <p className="font-mono text-[11px] text-muted">
              © 2026 bug.dr · all rights reserved
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] text-muted">
              {legalLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="hover:text-text transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
