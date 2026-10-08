"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { LinkButton } from "@/components/ui/button";
import { SPRING, SPRING_GENTLE } from "@/lib/motion";
import { initSectionFocusTracker } from "@/lib/section-focus";

const links = [
  { href: "#library", label: "Problems" },
  { href: "#waitlist", label: "Waitlist" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  // All four entry animations on the nav (header, logo, links, CTA)
  // are skipped when the OS asks for less motion.
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Start the hashchange → section-spotlight pipeline. Nav is the
  // first client component to mount, so it owns the single global
  // listener for the page. The cleanup detaches it on unmount (which
  // won't happen in this app, but the contract is right).
  useEffect(() => {
    return initSectionFocusTracker();
  }, []);

  return (
    <motion.header
      className={[
        "sticky top-0 z-50 transition-colors duration-200",
        scrolled
          ? "bg-bg/70 backdrop-blur-xl backdrop-saturate-150 border-b border-border/60 frosted"
          : "bg-transparent border-b border-transparent",
      ].join(" ")}
      initial={reduce ? false : { y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={
        reduce
          ? { duration: 0.2, ease: "easeOut" as const }
          : { delay: 0.1, ...SPRING_GENTLE }
      }
    >
      <div className="px-6 md:px-10">
        <div className="h-16 flex items-center justify-between gap-4">
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={
              reduce
                ? { duration: 0.2, ease: "easeOut" as const }
                : { delay: 0.25, ...SPRING }
            }
            className="-ml-1"
          >
            <Link
              href="/"
              aria-label="bug.dr home"
              className="flex items-center gap-2 p-1"
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
                initial={reduce ? false : { opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reduce
                    ? { duration: 0.2, ease: "easeOut" as const }
                    : { delay: 0.35 + i * 0.08, ...SPRING }
                }
              >
                <Link
                  href={l.href}
                  className="group relative text-sm text-muted hover:text-text transition-colors"
                >
                  {l.label}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-text/70 transition-transform duration-200 group-hover:scale-x-100"
                  />
                </Link>
              </motion.div>
            ))}
          </nav>

          <motion.div
            className="flex items-center gap-1"
            initial={reduce ? false : { opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={
              reduce
                ? { duration: 0.2, ease: "easeOut" as const }
                : { delay: 0.55, ...SPRING }
            }
          >
            <LinkButton href="#waitlist" size="md" data-zoom-target="#waitlist">
              Join waitlist
            </LinkButton>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
