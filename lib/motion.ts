// House motion constants — every framer-motion `transition` on the site
// routes through one of these. Single source of truth for the site's
// "feel" so that the spring character is consistent and any future
// tuning (slower settle, snappier pop) happens in one place.
//
// Naming maps directly to Apple's "damping + response" framing from
// *Designing Fluid Interfaces* (WWDC 2018):
//   - bounce  = 1 − damping   (0 = critically damped, 1 = full overshoot)
//   - duration ≈ "response" in seconds (how quickly the value settles)
//
// Spring values are a TypeScript `as const` so consumers can spread
// them into a `transition` object without TypeScript widening the
// object type to `{ duration: number }`.

/** House default. Critically damped, ~0.4s response. Use for most
 *  section reveals and any motion that doesn't carry momentum. */
export const SPRING = {
  type: "spring",
  bounce: 0,
  duration: 0.4,
} as const;

/** Soft, slight overshoot. For large `y` / `x` translations (30–50px)
 *  in the hero, nav, and announcement bar — overshoot on a big
 *  movement feels right; on a small one it feels like a glitch. */
export const SPRING_GENTLE = {
  type: "spring",
  bounce: 0.05,
  duration: 0.55,
} as const;

/** Snappy, no overshoot. For icon and badge pop-ins (check marks,
 *  bullet dots, terminal cursors). 0.25s is the lower bound where
 *  the motion still reads as intentional, not instant. */
export const SPRING_SNAPPY = {
  type: "spring",
  bounce: 0,
  duration: 0.25,
} as const;

/** Legacy ease curve. Kept exported because the four `repeat: Infinity`
 *  idle loops (waitlist button pulse, hero badge breathing, hero
 *  arrow nudge, profile flame flicker) still use it. Springs have
 *  no natural loop — `repeatType: "mirror"` on a spring bobs
 *  unnaturally because each repeat restarts from velocity=0 — so
 *  these decorative idles stay on a keyframe tween. */
export const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;

/** Helper for the `useReducedMotion` pattern that already exists in
 *  `reveal.tsx`. When `reduce` is true, return a short cross-fade
 *  instead of the spring. Otherwise return the spring as-is so
 *  callers can spread it: `transition={{ ...reducedTransition(SPRING, reduce), delay }}`.
 *
 *  The reduced branch uses a fixed `duration: 0.2` and `ease: "easeOut"`
 *  — short, non-vestibular, still readable as a transition. */
export function reducedTransition(
  base: { type: "spring"; bounce: number; duration: number },
  reduce: boolean | null,
): { type: "spring"; bounce: number; duration: number } | { duration: number; ease: "easeOut" } {
  if (reduce) return { duration: 0.2, ease: "easeOut" };
  return base;
}
