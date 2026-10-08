// Camera-zoom page transition.
//
// Click a button with `data-zoom-target="#section-id"` and the page
// "flies into" the button (1× → 15× scale, with the button as the
// transform-origin), the URL is pushed and the target section is
// scrolled into view at the peak, then the camera "flies out" to the
// target (15× → 1×, with the target as the origin). On browser back,
// the animation reverses — origin goes from the current target back
// to the original trigger button so the user's spatial context is
// preserved.
//
// Why a two-phase animation (scale up, swap, scale down) instead of
// one continuous scale?
// ───────────────────────────────────────────────────────────────
// At a single scale, you'd see the page at one magnification while
// the URL and scroll position change — the camera flies "through"
// the page and there's no way to hide the in-between state. Splitting
// it into "scale up to 15× (the old view fades out at the peak) →
// navigate while invisible → scale back down to 1× (the new view
// fades in at the target)" gives the eye a continuous motion arc
// with no jarring single-frame swap.
//
// Origin math
// ───────────
// getBoundingClientRect returns viewport coords. We need the origin
// in *document* coords (the wrapper is the full page, so its local
// coords match document coords). For the trigger:
//
//   ox = rect.left + rect.width  / 2 + window.scrollX
//   oy = rect.top  + rect.height / 2 + window.scrollY
//
// For the target at the start of phase 2 the page has already
// scrolled, so we recompute the rect (now relative to the new
// scroll) and use it directly — `scrollX`/`scrollY` are added in
// the helper to keep the call sites uniform.

"use client";

export type ZoomOptions = {
  /** Peak scale. 15× is dramatic; 8–12× is more subtle. */
  zoom?: number;
  /** Per-phase duration in ms. Total animation = phaseMs * 2. */
  phaseMs?: number;
  /** Cubic-bezier easing as a 4-tuple. Defaults to ease-in-out. */
  easing?: [number, number, number, number];
};

const DEFAULTS = {
  zoom: 15,
  phaseMs: 700,
  easing: [0.65, 0, 0.35, 1] as [number, number, number, number],
};

type TriggerInfo = {
  /** Selector that uniquely identifies the trigger button. */
  selector: string;
  /** Snapshot of the rect at the time of the click (viewport coords). */
  rect: { left: number; top: number; width: number; height: number };
  /** Scroll position at the time of the click. */
  scrollY: number;
  /** The href we pushed to (e.g. "#waitlist"). */
  targetHref: string;
  /** The element to focus when the zoom-out completes. */
  triggerEl: HTMLElement | null;
};

// Module state. A single global lock + the last trigger so popstate
// can find its way back. If you do two zoom-ins in a row, the second
// overwrites the first — that's fine, browser back only undoes the
// most recent.
let animating = false;
let lastTrigger: TriggerInfo | null = null;
/** The element that had focus before the zoom started, restored after. */
let focusRestore: HTMLElement | null = null;

function getWrapper(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  return document.getElementById("page-content");
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Center of `el` in document coordinates (px from the page origin). */
function docOrigin(el: HTMLElement): { x: number; y: number } {
  const r = el.getBoundingClientRect();
  return {
    x: r.left + r.width / 2 + window.scrollX,
    y: r.top + r.height / 2 + window.scrollY,
  };
}

/** Build a selector unique enough to find the element again on pop. */
function makeSelector(el: HTMLElement): string {
  if (el.id) return `#${CSS.escape(el.id)}`;
  // Fall back to a data-attribute fingerprint. We mark the element
  // with a transient `data-zoom-id` that we can read back later.
  const stamp = `zid_${Math.random().toString(36).slice(2, 9)}`;
  el.setAttribute("data-zoom-id", stamp);
  return `[data-zoom-id="${stamp}"]`;
}

function setOrigin(wrapper: HTMLElement, x: number, y: number) {
  wrapper.style.transformOrigin = `${x}px ${y}px`;
  wrapper.style.transform = "scale(1)";
  wrapper.style.opacity = "1";
}

function clearInline(wrapper: HTMLElement) {
  wrapper.style.transformOrigin = "";
  wrapper.style.transform = "";
  wrapper.style.opacity = "";
  wrapper.style.willChange = "";
}

/** Run a single keyframe span on the wrapper. Resolves on finish. */
function runSpan(
  wrapper: HTMLElement,
  fromScale: number,
  toScale: number,
  fromOpacity: number,
  toOpacity: number,
  duration: number,
  easing: [number, number, number, number],
): Promise<void> {
  return new Promise((resolve) => {
    const anim = wrapper.animate(
      [
        { transform: `scale(${fromScale})`, opacity: fromOpacity },
        { transform: `scale(${toScale})`, opacity: toOpacity },
      ],
      { duration, easing: `cubic-bezier(${easing.join(",")})`, fill: "forwards" },
    );
    anim.onfinish = () => resolve();
    anim.oncancel = () => resolve();
  });
}

/** Animate a plain crossfade (no scale) for reduced-motion users. */
function runCrossfade(
  wrapper: HTMLElement,
  duration: number,
): Promise<void> {
  return new Promise((resolve) => {
    const anim = wrapper.animate(
      [
        { opacity: 1 },
        { opacity: 0, offset: 0.5 },
        { opacity: 1 },
      ],
      { duration, easing: "ease-in-out", fill: "forwards" },
    );
    anim.onfinish = () => resolve();
    anim.oncancel = () => resolve();
  });
}

/**
 * Trigger the zoom-in. Call from a click handler on the trigger
 * element. The click's default action is NOT prevented — call
 * `e.preventDefault()` yourself if the element is a hash link.
 */
export async function zoomIn(
  triggerEl: HTMLElement,
  targetSelector: string,
  options: ZoomOptions = {},
): Promise<void> {
  if (animating) return;
  const wrapper = getWrapper();
  if (!wrapper) return;

  const target = document.querySelector(targetSelector) as HTMLElement | null;
  if (!target) {
    console.warn(`[zoom-transition] target not found: ${targetSelector}`);
    return;
  }

  const { zoom, phaseMs, easing } = { ...DEFAULTS, ...options };

  // Snapshot trigger info for the back navigation.
  const r = triggerEl.getBoundingClientRect();
  lastTrigger = {
    selector: makeSelector(triggerEl),
    rect: { left: r.left, top: r.top, width: r.width, height: r.height },
    scrollY: window.scrollY,
    targetHref: targetSelector,
    triggerEl,
  };
  focusRestore = (document.activeElement as HTMLElement | null) ?? null;

  animating = true;
  document.documentElement.style.overflow = "hidden"; // suppress scrollbar flash

  try {
    if (prefersReducedMotion()) {
      // Plain crossfade + scroll, no scale. Same overall shape so
      // the back action still works the same way.
      wrapper.style.willChange = "opacity";
      await runCrossfade(wrapper, phaseMs);
      window.history.pushState({ zoom: 1 }, "", targetSelector);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.setAttribute("tabindex", "-1");
      (target as HTMLElement).focus({ preventScroll: true });
      return;
    }

    wrapper.style.willChange = "transform, opacity";

    // Phase 1: scale up from trigger, fade out.
    setOrigin(wrapper, docOrigin(triggerEl).x, docOrigin(triggerEl).y);
    await runSpan(wrapper, 1, zoom, 1, 0, phaseMs, easing);

    // Midpoint: push state and scroll to target while the wrapper
    // is invisible (opacity 0). The scroll must be instant — the
    // page is at scale 15 and invisible, so a smooth scroll would
    // play out during phase 2 (the zoom-out / fade-in), making the
    // new view appear to slide in instead of being revealed all
    // at once. We force "auto" by temporarily overriding the
    // html-level `scroll-behavior: smooth` from globals.css.
    window.history.pushState({ zoom: 1 }, "", targetSelector);
    const html = document.documentElement;
    const prevScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    target.scrollIntoView({ block: "start" });
    html.style.scrollBehavior = prevScrollBehavior;

    // Phase 2: scale down to target, fade in. Recompute the
    // target's origin now that the page has scrolled.
    const t2 = docOrigin(target);
    setOrigin(wrapper, t2.x, t2.y);
    await runSpan(wrapper, zoom, 1, 0, 1, phaseMs, easing);

    // Hand focus to the new view.
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  } finally {
    clearInline(wrapper);
    document.documentElement.style.overflow = "";
    animating = false;
  }
}

/**
 * Trigger the zoom-out. Called from the popstate listener. Uses the
 * trigger info stored by the most recent zoomIn.
 */
export async function zoomOut(options: ZoomOptions = {}): Promise<void> {
  if (animating || !lastTrigger) return;
  const wrapper = getWrapper();
  if (!wrapper) return;

  // The trigger button may have been removed from the DOM (e.g. by
  // a re-render). Fall back to a crossfade with no target focus.
  const triggerEl =
    (document.querySelector(lastTrigger.selector) as HTMLElement | null) ??
    lastTrigger.triggerEl;

  // The "current" target is whatever section is in the URL hash.
  const currentHash = window.location.hash || lastTrigger.targetHref;
  const currentTarget = document.querySelector(currentHash) as HTMLElement | null;

  const { zoom, phaseMs, easing } = { ...DEFAULTS, ...options };

  animating = true;
  document.documentElement.style.overflow = "hidden";

  try {
    if (prefersReducedMotion()) {
      if (currentTarget) {
        wrapper.style.willChange = "opacity";
        await runCrossfade(wrapper, phaseMs);
      }
      window.scrollTo({ top: lastTrigger.scrollY, behavior: "smooth" });
      if (focusRestore) focusRestore.focus({ preventScroll: true });
      return;
    }

    wrapper.style.willChange = "transform, opacity";

    if (currentTarget) {
      // Phase 1: scale up from current target, fade out.
      const t1 = docOrigin(currentTarget);
      setOrigin(wrapper, t1.x, t1.y);
      await runSpan(wrapper, 1, zoom, 1, 0, phaseMs, easing);
    } else {
      // No current target — just fade out.
      setOrigin(wrapper, 0, 0);
      await runSpan(wrapper, 1, 1, 1, 0, phaseMs, easing);
    }

    // Midpoint: scroll back to the trigger's original position.
    // Force instant scroll for the same reason as zoomIn — we want
    // the zoom-out to reveal the trigger, not a still-scrolling view.
    const html = document.documentElement;
    const prevScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo({ top: lastTrigger.scrollY });
    html.style.scrollBehavior = prevScrollBehavior;

    // Phase 2: scale down to trigger, fade in. Origin is in document
    // coords (the trigger's saved rect + saved scrollY) so the
    // camera lands on the same spot regardless of current scroll.
    const ox = lastTrigger.rect.left + lastTrigger.rect.width / 2;
    const oy = lastTrigger.rect.top + lastTrigger.rect.height / 2 + lastTrigger.scrollY;
    setOrigin(wrapper, ox, oy);
    await runSpan(wrapper, zoom, 1, 0, 1, phaseMs, easing);

    // Restore focus to the trigger.
    if (triggerEl) {
      triggerEl.setAttribute("tabindex", "-1");
      triggerEl.focus({ preventScroll: true });
    } else if (focusRestore) {
      focusRestore.focus({ preventScroll: true });
    }
  } finally {
    clearInline(wrapper);
    document.documentElement.style.overflow = "";
    animating = false;
    lastTrigger = null;
    focusRestore = null;
  }
}

/** True while the animation is in flight. The boundary uses this to
 *  know whether to start a new transition or ignore the click. */
export function isZooming(): boolean {
  return animating;
}

/** Install the global click + popstate listeners. Idempotent. */
let installed = false;
export function installZoomListeners(): void {
  if (installed || typeof document === "undefined") return;
  installed = true;

  // ── Click delegation ────────────────────────────────────────────
  // Catch clicks on anything with [data-zoom-target] (button, a,
  // Link-rendered <a>). `closest()` walks up so child clicks count.
  document.addEventListener("click", (e) => {
    if (animating) return;
    const target = e.target;
    if (!(target instanceof Element)) return;
    const trigger = target.closest<HTMLElement>("[data-zoom-target]");
    if (!trigger) return;
    const dest = trigger.getAttribute("data-zoom-target");
    if (!dest) return;

    e.preventDefault();
    e.stopPropagation();
    void zoomIn(trigger, dest);
  });

  // ── Popstate (browser back/forward) ─────────────────────────────
  window.addEventListener("popstate", () => {
    if (animating) return;
    if (!lastTrigger) return;
    void zoomOut();
  });
}
