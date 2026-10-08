"use client";

/** Set up the in-page "vacuum in, spit out" transition.
 *
 *  When the user clicks an in-page link (nav, announcement bar,
 *  hero CTA, footer — anything with `href="#..."`), the whole
 *  viewport briefly scales up and settles back to 1.0 as the
 *  browser's smooth scroll lands at the destination.
 *
 *  Why a `click` listener instead of `hashchange`?
 *  ─────────────────────────────────────────────
 *  Next.js's `<Link>` component uses the router to update the URL
 *  for hash-only links, and the router's history manipulation does
 *  not consistently fire the browser's `hashchange` event — so a
 *  `hashchange` listener misses most nav clicks. A `click` listener
 *  catches the intent at the source (before the router gets
 *  involved), so the animation fires for every in-page link
 *  regardless of whether it's a `<Link>`, a plain `<a>`, or a
 *  programmatic navigation.
 *
 *  Mechanics
 *  ─────────
 *  The effect is a single 0.5s scale animation applied to <body>
 *  via the Web Animations API. Each call to `body.animate()` starts
 *  a fresh animation, so consecutive clicks always re-fire the
 *  effect — no class-toggle / reflow trick required.
 *
 *  The scale anchors at the current viewport center (not the
 *  body's geometric center). Without this, a user clicking the nav
 *  at the top of the page would see the zoom pull from a point
 *  well below the viewport (the middle of the full page), which
 *  reads as "drift," not "vacuum." Anchoring at the viewport
 *  center makes the pull feel like it's grabbing the screen the
 *  user is looking at right now.
 *
 *  Respect `prefers-reduced-motion: reduce` by skipping the
 *  animation entirely; the browser's smooth scroll still lands
 *  the user at the destination, just without the visual effect.
 *
 *  Call once on the client. The Nav owns the call (it's the first
 *  client component to mount). Returns a cleanup that detaches
 *  the click listener.
 */
export function initSectionFocusTracker(): () => void {
  if (typeof window === "undefined") return () => {};

  // Captured once at mount. The OS pref rarely changes mid-session
  // and re-evaluating per click would force a layout query each
  // time; the cost of a stale `true` is a single missed animation
  // on a preference flip, which is acceptable.
  const reduce = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const triggerVacuum = () => {
    if (reduce) return;

    // Anchor the scale at the current viewport center so the zoom
    // feels like it's pulling the screen toward what the user is
    // looking at, not the geometric center of the page.
    const vh = window.innerHeight;
    const scrollY = window.scrollY;
    document.body.style.transformOrigin = `50% ${scrollY + vh / 2}px`;

    // Vacuum in (ease-in: slow start, accelerating pull toward the
    // user) → Spit out (ease-out: fast start, decelerating settle
    // at the destination). The 30% / 70% split gives the vacuum a
    // tight pull and the spit a longer, gentler landing.
    //
    // The smooth scroll to the destination happens in parallel via
    // the browser's `scroll-behavior: smooth`; the scale returns
    // to rest as the destination comes into view, so the "spit"
    // coincides with the user arriving.
    document.body.animate(
      [
        { transform: "scale(1)", offset: 0, easing: "ease-in" },
        { transform: "scale(1.3)", offset: 0.3, easing: "ease-out" },
        { transform: "scale(1)", offset: 1 },
      ],
      {
        duration: 500,
        // Don't hold the final frame — the body has no transform
        // at rest, and `fill: "none"` is the default but spelled
        // out for clarity.
        fill: "none",
      },
    );
  };

  // Catch the click at the document level so it works for any
  // in-page link, no matter how deeply nested or which framework
  // component rendered it. `closest("a[href^='#']")` walks up the
  // DOM from the click target to find the link (handles clicks
  // on child elements like icons or text spans).
  const onClick = (e: MouseEvent) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const link = target.closest("a[href^='#']");
    if (!(link instanceof HTMLAnchorElement)) return;
    const href = link.getAttribute("href");
    if (!href || href === "#") return;
    triggerVacuum();
  };

  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}
