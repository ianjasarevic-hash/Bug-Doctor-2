"use client";

/** Set up the in-page "vacuum in, spit out" transition.
 *
 *  When the user clicks an in-page link (nav, announcement bar,
 *  hero CTA, footer — anything with `href="#..."`), the page
 *  content wrapper briefly scales up and settles back to 1.0 as
 *  the browser's smooth scroll lands at the destination. The
 *  particle burst (lib/particle-transition.ts) is a separate
 *  fixed-position layer on top — they don't conflict.
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
 *  Why a CSS class with the reflow trick, not Web Animations API?
 *  ──────────────────────────────────────────────────────────────
 *  Earlier versions called `element.animate(...)` directly. That
 *  worked in dev but failed silently in some browser/frame
 *  combinations (the animation never started, no error thrown).
 *  The CSS-class approach is more reliable:
 *    1. Define `@keyframes page-vacuum` in globals.css
 *    2. Toggle `is-vacuuming` on #page-content via JS
 *    3. To re-fire on every click, remove the class, force a
 *       reflow with `void target.offsetWidth`, then re-add it.
 *       The reflow commits the removal to the DOM before the
 *       re-add, so the browser treats it as a fresh animation
 *       rather than a no-op.
 *
 *  Mechanics
 *  ─────────
 *  The keyframe animates `transform: scale(1) → scale(1.4) →
 *  scale(1)` over 0.55s, with per-keyframe `animation-timing-
 *  function` for the two distinct phases:
 *    - 0% → 35% (vacuum): accelerating ease-in
 *    - 35% → 100% (spit): decelerating ease-out
 *
 *  The transform-origin is set via a CSS custom property
 *  (`--vacuum-origin-y`) to the current viewport center, so the
 *  scale always feels like it's pulling the screen toward what
 *  the user is currently looking at, not the geometric center
 *  of the page.
 *
 *  Respect `prefers-reduced-motion: reduce` by skipping the
 *  animation entirely (the global media query in globals.css
 *  also collapses all animation durations to 0.01ms, so even if
 *  the class is applied, the visual effect is a no-op).
 *
 *  Call once on the client. The Nav owns the call (it's the first
 *  client component to mount). Returns a cleanup that detaches
 *  the click listener.
 */
export function initSectionFocusTracker(): () => void {
  if (typeof window === "undefined") return () => {};

  const reduce = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const triggerVacuum = () => {
    if (reduce) return;

    const target = document.getElementById("page-content");
    if (!(target instanceof HTMLElement)) return;

    // Anchor the scale at the current viewport center via a CSS
    // custom property. We use a custom property (not inline
    // `transformOrigin`) so the residual inline style doesn't
    // linger on the element between clicks — the previous
    // approach kept `body.style.transformOrigin` set even after
    // the animation ended, which contributed to the intermittent
    // "buttons don't work" issue by keeping the page-content
    // wrapper in a transformed-state between clicks.
    const vh = window.innerHeight;
    const scrollY = window.scrollY;
    target.style.setProperty(
      "--vacuum-origin-y",
      `${scrollY + vh / 2}px`,
    );

    // Re-fire the animation: remove → reflow → add. The forced
    // reflow is the load-bearing step — without it, the browser
    // would batch the removal+add in the same frame and see no
    // change. With it, the removal commits before the add, so
    // the animation restarts cleanly.
    target.classList.remove("is-vacuuming");
    void target.offsetWidth;
    target.classList.add("is-vacuuming");
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
