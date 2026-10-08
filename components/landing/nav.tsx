"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/landing/container";
import { LinkButton } from "@/components/ui/button";

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
    <motion.header
      className={[
        "sticky top-0 z-50 transition-colors duration-200",
        scrolled
          ? "bg-bg/75 backdrop-blur-md border-b border-border/80"
          : "bg-transparent border-b border-transparent",
      ].join(" ")}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Container>
        <div className="h-16 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/"
              aria-label="bug.dr home"
              className="flex items-center gap-2 -ml-1 p-1"
            >
              <img
                src="logos/primary-lockup.png"
                alt="bug.dr"
                width={108}
                height={28}
                className="h-7 w-auto"
              />
            </Link>
          </motion.div>

          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-8"
          >
            {links.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: 0.35 + i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={l.href}
                  className="text-sm text-muted hover:text-text transition-colors"
                >
                  {l.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          <motion.div
            className="flex items-center gap-1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <LinkButton href="#waitlist" size="md">
              Join waitlist
            </LinkButton>
          </motion.div>
        </div>
      </Container>
    </motion.header>
  );
}
