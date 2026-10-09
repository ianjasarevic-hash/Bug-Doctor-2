"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LinkButton } from "@/components/ui/button";
import { initSectionFocusTracker } from "@/lib/section-focus";
import { assetPath } from "@/lib/asset-path";
import { ArrowLeft, Close, Menu } from "@/components/landing/icons";

// Top navigation.
//
// Two variants:
//   - "home"  : on the marketing site. Shows the three section links
//               (Problems, Waitlist, FAQ) plus the "Join waitlist"
//               CTA on desktop. On mobile the section links and the
//               CTA collapse into a hamburger menu, which also
//               surfaces Privacy and Terms (the legal pages live in
//               the footer on desktop and the mobile menu on
//               small screens).
//   - "legal" : on the privacy and terms pages. Just the logo and a
//               "Home" link back to /; no section links, no menu.
//
// All three section links on the home variant share the same
// component (NavLink), the same default class, the same hover
// state, and the same spacing. The mobile-menu links reuse the
// same style, just stacked. The active state (text-text and a
// full underline, with aria-current="page") only applies on the
// legal pages; on the home page the in-page anchors (#library
// etc.) are never "active" because the user is already on the
// home page when they click them.

type NavLinkDef = { href: string; label: string };

const homeSectionLinks: NavLinkDef[] = [
  { href: "#library", label: "Problems" },
  { href: "#waitlist", label: "Waitlist" },
  { href: "#faq", label: "FAQ" },
];

// Privacy and Terms only appear in the mobile menu and the
// footer. They are reachable on desktop by scrolling down.
const mobileOnlyLinks: NavLinkDef[] = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

// Compare a link's path (without the hash) to the current
// pathname. Only same-page legal links (e.g. /privacy on the
// /privacy/ route) are active.
function isLinkActive(linkHref: string, pathname: string): boolean {
  if (linkHref.startsWith("#")) return false;
  const hashIdx = linkHref.indexOf("#");
  const linkPath = hashIdx === -1 ? linkHref : linkHref.slice(0, hashIdx);
  if (linkPath === "") return false;
  const norm = (p: string) => p.replace(/\/+$/, "") || "/";
  return norm(linkPath) === norm(pathname);
}

export function Nav({ variant = "home" }: { variant?: "home" | "legal" }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

  // Close the mobile menu whenever the route changes. Clicking an
  // in-page anchor does not change pathname, so the user can still
  // tap a section link from the open menu and see the menu stay
  // open if they want; we only auto-close on a real navigation.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const headerClass = [
    "sticky top-0 z-50 transition-colors duration-200",
    scrolled
      ? "bg-bg/70 backdrop-blur-xl backdrop-saturate-150 border-b border-border/60 frosted"
      : "bg-transparent border-b border-transparent",
  ].join(" ");

  if (variant === "legal") {
    return (
      <header className={headerClass}>
        <div className="px-6 md:px-10">
          <div className="h-16 flex items-center justify-between gap-4">
            <Link
              href="/"
              aria-label="bug.dr home"
              className="flex items-center gap-2 p-1"
            >
              <Image
                src={assetPath("/logos/primary-lockup.png")}
                alt="bug.dr"
                width={108}
                height={28}
                className="h-7 w-auto"
                priority
              />
            </Link>
            <Link
              href="/"
              className="group relative inline-flex items-center gap-1.5 text-[12.5px] sm:text-[13px] md:text-sm text-muted hover:text-text transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Home</span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={headerClass}>
      <div className="px-6 md:px-10">
        <div className="h-16 flex items-center justify-between gap-4">
          <div className="-ml-1">
            <Link
              href="#top"
              aria-label="bug.dr home"
              className="flex items-center gap-2 p-1"
            >
              <Image
                src={assetPath("/logos/primary-lockup.png")}
                alt="bug.dr"
                width={108}
                height={28}
                className="h-7 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop nav: three section links */}
          <nav
            aria-label="Primary"
            className="hidden sm:flex items-center gap-3 sm:gap-4 md:gap-6"
          >
            {homeSectionLinks.map((l) => {
              const active = isLinkActive(l.href, pathname);
              return (
                <NavLink key={l.label} link={l} active={active} />
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden sm:flex items-center gap-1">
            <LinkButton href="#waitlist" size="md">
              Join waitlist
            </LinkButton>
          </div>

          {/* Mobile: hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface/60 text-text hover:border-action transition-colors"
          >
            {menuOpen ? <Close size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel. Collapses the three section links and
          the CTA into a stacked panel under the header. Privacy
          and Terms (footer-only on desktop) are surfaced here so
          mobile users can still reach them. Plain HTML, no motion. */}
      {menuOpen && (
        <div
          id="mobile-nav-menu"
          className="sm:hidden border-t border-border bg-bg/95 backdrop-blur-xl"
        >
          <div className="px-6 py-4">
            <nav aria-label="Mobile primary" className="flex flex-col">
              {homeSectionLinks.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="py-3 text-[15px] text-text border-b border-border/60 last:border-b-0"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <nav
              aria-label="Mobile legal"
              className="mt-2 flex flex-col"
            >
              {mobileOnlyLinks.map((l) => {
                const active = isLinkActive(l.href, pathname);
                return (
                  <Link
                    key={l.label}
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "py-3 text-[15px] border-b border-border/60 last:border-b-0 transition-colors",
                      active ? "text-text" : "text-muted hover:text-text",
                    ].join(" ")}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>
            <LinkButton
              href="#waitlist"
              size="md"
              className="mt-4 w-full"
            >
              Join waitlist
            </LinkButton>
          </div>
        </div>
      )}
    </header>
  );
}

// Single desktop nav link. Same default class, hover, spacing, and
// underline animation across all three section links. Active is
// brighter (text-text) and gets a full underline + aria-current.
function NavLink({
  link,
  active,
}: {
  link: NavLinkDef;
  active: boolean;
}) {
  return (
    <Link
      href={link.href}
      aria-current={active ? "page" : undefined}
      className={[
        "group relative text-[12.5px] sm:text-[13px] md:text-sm transition-colors",
        active ? "text-text" : "text-muted hover:text-text",
      ].join(" ")}
    >
      {link.label}
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
}
