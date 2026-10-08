"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

// ── Reveal ───────────────────────────────────────────────────────────────
//
// One wrapper for every "this should animate into place" use on the page.
//
//   trigger="load"   → first-load choreography (no viewport gate)
//   trigger="inView" → scroll-triggered (default)
//
//   from="top|bottom|left|right|none"
//     Direction the element comes from. "none" still fades but doesn't slide.
//
// Children can be passed in directly. To stagger, wrap a parent in
// <RevealGroup> with `from` per child or use <RevealItem> inside.

type Direction = "top" | "bottom" | "left" | "right" | "none";

const offsets: Record<Direction, { x: number; y: number }> = {
  top: { x: 0, y: -40 },
  bottom: { x: 0, y: 40 },
  left: { x: -40, y: 0 },
  right: { x: 40, y: 0 },
  none: { x: 0, y: 0 },
};

// ease-out-quint — same easing the page uses elsewhere; punchy without overshoot.
const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  from = "bottom",
  delay = 0,
  duration = 0.65,
  amount = 0.2,
  className,
  trigger = "inView",
  once = true,
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
  const reduce = useReducedMotion();
  const off = offsets[from];

  // prefers-reduced-motion: just fade. No translation.
  const initial = reduce ? { opacity: 0 } : { opacity: 0, x: off.x, y: off.y };
  const show = reduce ? { opacity: 1 } : { opacity: 1, x: 0, y: 0 };
  const transition = { delay, duration: reduce ? duration * 0.5 : duration, ease: EASE };

  if (trigger === "load") {
    return (
      <motion.div
        className={className}
        initial={initial}
        animate={show}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={show}
      viewport={{ once, amount }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

// ── RevealGroup + RevealItem ────────────────────────────────────────────
//
// Parent that staggers its children. Each child sets its own `from` so the
// "puzzle" comes in from multiple sides.

export function RevealGroup({
  children,
  stagger = 0.09,
  delay = 0,
  className,
  trigger = "inView",
  amount = 0.2,
  once = true,
}: {
  children: ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
  trigger?: "inView" | "load";
  amount?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: delay },
    },
  };
  const animProps =
    trigger === "load"
      ? { initial: "hidden" as const, animate: "show" as const }
      : {
          initial: "hidden" as const,
          whileInView: "show" as const,
          viewport: { once, amount },
        };
  return (
    <motion.div className={className} variants={variants} {...animProps}>
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  from = "bottom",
  duration = 0.65,
  className,
}: {
  children: ReactNode;
  from?: Direction;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const off = offsets[from];
  const variants: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, x: off.x, y: off.y },
    show: reduce
      ? { opacity: 1, transition: { duration: duration * 0.5, ease: EASE } }
      : {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration, ease: EASE },
        },
  };
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
