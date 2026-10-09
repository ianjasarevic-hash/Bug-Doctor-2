import type { ReactNode } from "react";

// ── Reveal ───────────────────────────────────────────────────────────────
//
// Plain wrappers that render their children inside a <div>.
//
// Earlier versions of this file used framer-motion's `whileInView` to fade
// and slide each section in as the user scrolled. That looked great in
// interactive use, but it broke the static export in two ways:
//
//   1. React #418 hydration mismatches between the SSR-rendered
//      `style="opacity:0; transform: translateY(40px)"` and the
//      client's first render, which prevented framer-motion from
//      mounting and left the content invisible until manual scroll.
//   2. Even with hydration working, `whileInView` only fires for
//      sections that are actually in the viewport. Off-screen
//      sections stayed at `opacity:0` for fullPage screenshots, for
//      search-engine crawlers, for users with `prefers-reduced-motion`,
//      and for anyone trying to print or save the page.
//
// The fix is the simplest one: don't animate. The content is always
// visible. The hero (which sits above the fold and uses
// framer-motion's `animate` prop, not `whileInView`) keeps its own
// entrance choreography in `hero.tsx`. The rest of the page is
// content-first.
//
// The `Reveal` / `RevealGroup` / `RevealItem` API is preserved so the
// call sites in the section components don't have to change. They
// all just render a <div> now.

type Direction = "top" | "bottom" | "left" | "right" | "none";

export function Reveal({
  children,
  className,
  from: _from,
  delay: _delay,
  duration: _duration,
  amount: _amount,
  trigger: _trigger,
  once: _once,
}: {
  children: ReactNode;
  from?: Direction;
  delay?: number;
  duration?: number;
  amount?: number;
  className?: string;
  trigger?: "inView" | "load";
  once?: boolean;
}) {
  return <div className={className}>{children}</div>;
}

export function RevealGroup({
  children,
  className,
  stagger: _stagger,
  delay: _delay,
  trigger: _trigger,
  amount: _amount,
  once: _once,
}: {
  children: ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
  trigger?: "inView" | "load";
  amount?: number;
  once?: boolean;
}) {
  return <div className={className}>{children}</div>;
}

export function RevealItem({
  children,
  className,
  from: _from,
  duration: _duration,
}: {
  children: ReactNode;
  from?: Direction;
  duration?: number;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
