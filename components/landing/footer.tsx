import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/landing/container";

const cols = [
  {
    title: "Product",
    links: [
      { href: "#library", label: "Problems" },
      { href: "#how-it-works", label: "How it works" },
      { href: "#faq", label: "FAQ" },
    ],
  },
  {
    title: "Stay in touch",
    links: [
      { href: "#waitlist", label: "Join the waitlist" },
      { href: "#waitlist", label: "Updates" },
      { href: "mailto:hi@bug.dr", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/30">
      <Container>
        <div className="py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 md:col-span-3">
              <Image
                src="/logos/primary-lockup.png"
                alt="bug.dr"
                width={108}
                height={28}
                className="h-7 w-auto"
              />
              <p className="mt-4 text-sm text-muted leading-relaxed max-w-sm">
                bug.dr proves you can fix production bugs. Not puzzles. Prod.
              </p>
              <p className="mt-6 font-mono text-[11px] text-muted">
                pre-launch · joining the waitlist is free
              </p>
            </div>

            {cols.map((col) => (
              <div key={col.title}>
                <div className="font-mono text-xs uppercase tracking-widest text-muted">
                  {col.title}
                </div>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-muted hover:text-text transition-colors"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-14 pt-6 border-t border-border flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <p className="font-mono text-[11px] text-muted">
              © 2026 bug.dr · all rights reserved
            </p>
            <div className="flex gap-6 font-mono text-[11px] text-muted">
              <Link href="#terms" className="hover:text-text transition-colors">
                Terms
              </Link>
              <Link href="#privacy" className="hover:text-text transition-colors">
                Privacy
              </Link>
              <Link href="#status" className="hover:text-text transition-colors">
                Status
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}