"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/landing/container";
import { LinkButton } from "@/components/ui/button";

// "Problems" now goes to the problem library section (id="library") instead
// of the comparison section, which used to share the #problems anchor.
const links = [
  { href: "#library", label: "Problems" },
  { href: "#waitlist", label: "Waitlist" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-50 transition-colors duration-200",
        scrolled
          ? "bg-bg/75 backdrop-blur-md border-b border-border/80"
          : "bg-transparent border-b border-transparent",
      ].join(" ")}
    >
      <Container>
        <div className="h-16 flex items-center justify-between">
          <Link
            href="/"
            aria-label="bug.dr home"
            className="flex items-center gap-2 -ml-1 p-1"
          >
            <Image
              src="/logos/primary-lockup.png"
              alt="bug.dr"
              width={108}
              height={28}
              priority
              className="h-7 w-auto"
            />
          </Link>

          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-8"
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-muted hover:text-text transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <LinkButton href="#waitlist" size="md">
              Join waitlist
            </LinkButton>
          </div>
        </div>
      </Container>
    </header>
  );
}