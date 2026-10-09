"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { LinkButton } from "@/components/ui/button";
import { SPRING, SPRING_GENTLE } from "@/lib/motion";
import { initSectionFocusTracker } from "@/lib/section-focus";

// Two nav variants.
//
//   "home"  – the marketing site. Links use in-page anchors (#library,
//             #waitlist, #faq). The logo links to "#top" (the <main>
//             wrapper, which scrolls the page back to the very top).
//
//   "legal" – the privacy and terms pages. They share the same nav
//             look but every link points back to the home page, because
//             the legal pages don't have those sections of their own.
//             Links are absolute ("/#library") so the browser navigates
//             to / and scrolls to the section.
//
// Privacy and Terms appear in the same list as the other nav links
// (after FAQ) but in a slightly muted style so they don't compete
// with the primary page anchors. They always use absolute paths
// because the legal pages are the only place a user can be on
// /privacy or /terms.

const homeLinks = [
  { href: "#library", label: "Problems" },
  { href: "#waitlist", label: "Waitlist" },
  { href: "#faq", label: "FAQ" },
];

const legalLinks = [
  { href: "/#problems", label: "Problems" },
  { href: "/#waitlist", label: "Waitlist" },
  { href: "/#faq", label: "FAQ" },
];

// Legal-only links. Always absolute, always muted.
const secondaryLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function Nav({ variant = "home" }: { variant?: "home" | "legal" }) {
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Start the hashchange → section-spotlight pipeline. The same
  // tracker that handles in-page # links on the home page also
  // handles # links on the legal pages (ToC anchors), so it should
  // run everywhere the Nav mounts.
  useEffect(() => {
    return initSectionFocusTracker();
  }, []);

  const links = variant === "legal" ? legalLinks : homeLinks;
  const logoHref = variant === "legal" ? "/" : "#top";
  const ctaHref = variant === "legal" ? "/#waitlist" : "#waitlist";

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
              href={logoHref}
              aria-label="bug.dr home"
              className="flex items-center gap-2 p-1"
            >
              {/* Absolute path with leading "/" so the logo resolves
                  from every route (the home page, /privacy/, /terms/).
                  Using next/image rather than a plain <img> so the
                  basePath (set in production to "/BugDoctor") is
                  prepended automatically. With images.unoptimized
                  (set in next.config.mjs for the static export) this
                  just renders a regular <img> at build time. */}
              <Image
                src="logos/primary-lockup.png"
                alt="bug.dr"
                width={108}
                height={28}
                className="h-7 w-auto"
                priority
              />
            </Link>
          </motion.div>

          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-6"
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
            {/* Secondary links — Privacy and Terms. Slightly smaller and
                more muted than the primary links so they don't compete
                with the page anchors. Always absolute paths so they
                work from both home and legal pages. */}
            {secondaryLinks.map((l, i) => (
              <motion.div
                key={l.href}
                initial={reduce ? false : { opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reduce
                    ? { duration: 0.2, ease: "easeOut" as const }
                    : { delay: 0.6 + i * 0.08, ...SPRING }
                }
              >
                <Link
                  href={l.href}
                  className="text-[12.5px] text-muted/70 hover:text-muted transition-colors"
                >
                  {l.label}
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
            <LinkButton href={ctaHref} size="md">
              Join waitlist
            </LinkButton>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
