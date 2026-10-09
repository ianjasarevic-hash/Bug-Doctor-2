"use client";

/** Set up the in-page click handler.
 *
 *  When the user clicks any in-page link (nav, announcement bar, hero
 *  CTA, footer — anything with `href="#..."`):
 *
 *    t = 0     scroll — rAF-driven easeOutCubic slide-down to the
 *                      destination, leaving room for the fixed nav.
 *    t ≈ 750ms done
 *
 *  Why we own the scroll instead of the browser/Next.js:
 *  ───────────────────────────────────────────────────
 *  • The browser's native smooth scroll uses an implementation-defined
 *    curve that can overshoot the target on long distances and snap
 *    back.
 *  • Next.js's `<Link>` component intercepts hash clicks; its scroll
 *    handling for hash-only URLs isn't consistent across versions.
 *  • Owning the scroll guarantees identical behavior across `<Link>`,
 *    `<a>`, and any future wrapper.
 *
 *  Respect `prefers-reduced-motion: reduce` by jumping to the
 *  destination instantly.
 */

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Height of the fixed/sticky nav + a little breathing room. */
function navOffset(): number {
  if (typeof document === "undefined") return 0;
  const nav = document.querySelector("header");
  if (!nav) return 0;
  return nav.getBoundingClientRect().height + 16;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// Monotonic scroll id — if a new scroll starts while an old one is
// still running, the old rAF chain bails out. Without this, two
// concurrent scrolls fight over `window.scrollY` and the page jitters.
let activeScrollId = 0;

function smoothScrollTo(
  targetY: number,
  duration: number,
  myId: number,
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }
    if (myId !== activeScrollId) {
      resolve();
      return;
    }
    const startY = window.scrollY;
    const distance = targetY - startY;
    if (Math.abs(distance) < 1) {
      resolve();
      return;
    }
    const startTime = performance.now();
    const step = (now: number) => {
      if (myId !== activeScrollId) {
        resolve();
        return;
      }
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(t);
      // `behavior: "instant"` bypasses `html { scroll-behavior: smooth }`
      // — without it, the browser interprets each rAF's scrollTo as a
      // fresh smooth-scroll target and re-animates to it, so by the
      // time we reach the last frame the page is still chasing the
      // first frame's target. Force-jump the scroll position so the
      // JS animation drives end-to-end.
      window.scrollTo({ top: startY + distance * eased, behavior: "instant" });
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    };
    requestAnimationFrame(step);
  });
}

export function initSectionFocusTracker(): () => void {
  if (typeof window === "undefined") return () => {};

  const reduce = prefersReducedMotion();

  // Catch the click at the document level so it works for any
  // in-page link, no matter how deeply nested or which framework
  // component rendered it. `closest("a[href^='#']")` walks up the
  // DOM from the click target to find the link.
  const onClick = (e: MouseEvent) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const link = target.closest("a[href^='#']");
    if (!(link instanceof HTMLAnchorElement)) return;
    const href = link.getAttribute("href");
    if (!href || href === "#") return;

    const destEl = document.querySelector(href) as HTMLElement | null;
    if (!destEl) return;

    // The destination's document Y. Captured *before* we push the
    // hash (no layout change has happened yet), and used as the
    // scroll target. If the natural scroll target is small
    // (e.g. `#top`, where `<main>` sits a few dozen pixels below
    // the nav, so `destDocY - navOffset` ≈ 20), snap to 0 so the
    // logo click shows the very top of the page with the
    // announcement bar visible — not a partially-scrolled view.
    const destDocY = destEl.getBoundingClientRect().top + window.scrollY;
    const offset = navOffset();
    const targetY = destDocY - offset < 50 ? 0 : destDocY - offset;

    // We own the navigation: stop the browser / Next.js from doing
    // anything by default, push the hash, then run the smooth scroll
    // (or instant jump in reduced-motion mode).
    e.preventDefault();
    window.history.pushState(null, "", href);

    if (reduce) {
      window.scrollTo(0, targetY);
      return;
    }

    const myId = ++activeScrollId;
    void smoothScrollTo(targetY, 750, myId);
  };

  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}
