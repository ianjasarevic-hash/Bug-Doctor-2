"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LinkButton } from "@/components/ui/button";
import { initSectionFocusTracker } from "@/lib/section-focus";

// Top navigation.
//
// Two variants:
//   - "home"  : on the marketing site. Primary section links use
//               in-page anchors (#library, #waitlist, #faq). Legal
//               links point to /privacy and /terms.
//   - "legal" : on the privacy and terms pages. Section links are
//               absolute so the browser navigates to / and scrolls
//               to the section.
//
// All five links — Problems, Waitlist, FAQ, Privacy, Terms — share
// the same component (NavLink), the same default class, the same
// hover state, and the same spacing. The only thing that varies is
// the active state, which is brighter (text-text) and carries an
// aria-current="page" for assistive tech. Active is determined by
// the current pathname:
//   - on /            : none of the five is active
//   - on /privacy/    : only Privacy is active
//   - on /terms/      : only Terms is active
// In-page anchors (#library, etc.) are never "active" because the
// user is already on the home page when they click them.

type NavLinkDef = { href: string; label: string };

const homeLinks: NavLinkDef[] = [
  { href: "#library", label: "Problems" },
  { href: "#waitlist", label: "Waitlist" },
  { href: "#faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

const legalLinks: NavLinkDef[] = [
  { href: "/#library", label: "Problems" },
  { href: "/#waitlist", label: "Waitlist" },
  { href: "/#faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

// Compare a link's path (without the hash) to the current pathname.
// In-page anchors and cross-page anchors are never active. Only same-
// page legal links (e.g. /privacy on the /privacy/ route) are active.
function isLinkActive(linkHref: string, pathname: string): boolean {
  if (linkHref.startsWith("#")) return false;
  const hashIdx = linkHref.indexOf("#");
  const linkPath = hashIdx === -1 ? linkHref : linkHref.slice(0, hashIdx);
  if (linkPath === "") return false; // bare "/" or in-page anchor
  // Normalise trailing slashes: "/privacy" and "/privacy/" both match.
  const norm = (p: string) => p.replace(/\/+$/, "") || "/";
  return norm(linkPath) === norm(pathname);
}

export function Nav({ variant = "home" }: { variant?: "home" | "legal" }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Start the hashchange -> section-spotlight pipeline. The same
  // tracker that handles in-page # links on the home page also
  // handles # links on the legal pages (ToC anchors), so it should
  // run everywhere the Nav mounts.
  useEffect(() => {
    return initSectionFocusTracker();
  }, []);

  const links = variant === "legal" ? legalLinks : homeLinks;
  const logoHref = variant === "legal" ? "/" : "#top";
  const ctaHref = variant === "legal" ? "/#waitlist" : "#waitlist";

  const headerClass = [
    "sticky top-0 z-50 transition-colors duration-200",
    scrolled
      ? "bg-bg/70 backdrop-blur-xl backdrop-saturate-150 border-b border-border/60 frosted"
      : "bg-transparent border-b border-transparent",
  ].join(" ");

  return (
    <header className={headerClass}>
      <div className="px-6 md:px-10">
        <div className="h-16 flex items-center justify-between gap-4">
          <div className="-ml-1">
            <Link
              href={logoHref}
              aria-label="bug.dr home"
              className="flex items-center gap-2 p-1"
            >
              {/* Relative path (no leading "/") so the logo resolves
                  from every route on the GitHub Pages site
                  (the home page, /privacy/, /terms/). Using next/image
                  so the basePath (set in production to "/BugDoctor")
                  is prepended automatically. With images.unoptimized
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
          </div>
          <nav
            aria-label="Primary"
            className="flex items-center gap-3 sm:gap-4 md:gap-6"
          >
            {links.map((l) => {
              const active = isLinkActive(l.href, pathname);
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "group relative text-[12.5px] sm:text-[13px] md:text-sm transition-colors",
                    active
                      ? "text-text"
                      : "text-muted hover:text-text",
                  ].join(" ")}
                >
                  {l.label}
                  <span
                    aria-hidden
                    className={[
                      "pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left bg-text/70 transition-transform duration-200",
                      active
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100",
                    ].join(" ")}
                  />
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-1">
            <LinkButton href={ctaHref} size="md">
              Join waitlist
            </LinkButton>
          </div>
        </div>
      </div>
    </header>
  );
}
