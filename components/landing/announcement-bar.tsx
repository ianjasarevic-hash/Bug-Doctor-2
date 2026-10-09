"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/landing/container";
import { Countdown } from "@/components/landing/countdown";
import { SPRING_GENTLE } from "@/lib/motion";

export function AnnouncementBar() {
  // The announcement bar is the second most-pinned surface on the
  // site (under the nav). When the OS asks for less motion, skip the
  // slide-in and render the bar at its resting position.
  const reduce = useReducedMotion();
  return (
    <motion.div
      role="region"
      aria-label="Launch announcement"
      className="relative z-40 bg-surface/60 backdrop-blur-md border-b border-border frosted"
      initial={reduce ? false : { y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={
        reduce
          ? { duration: 0.2, ease: "easeOut" as const }
          : { delay: 0.05, ...SPRING_GENTLE }
      }
    >
      <Container>
        <Link
          href="#waitlist"
          className="block hover:bg-surface/60 transition-colors"
        >
          <div className="py-2 flex items-center justify-center gap-2 text-[12.5px] font-mono">
            <span
              aria-hidden
              className="inline-flex h-1.5 w-1.5 rounded-full bg-action animate-pulse shrink-0"
            />
            <span className="text-text">Launching October 21.</span>
            <span aria-hidden className="hidden sm:inline-block h-3 w-px bg-border" />
            <span className="hidden sm:inline text-muted">
              <Countdown />
            </span>
            <span aria-hidden className="hidden sm:inline text-muted">·</span>
            <span className="hidden sm:inline text-muted">
              join the waitlist
            </span>
            <span aria-hidden className="text-muted">→</span>
          </div>
        </Link>
      </Container>
    </motion.div>
  );
}
