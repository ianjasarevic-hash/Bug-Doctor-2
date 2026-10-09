"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/landing/container";
import { ZoomableImage } from "@/components/ui/zoomable-image";
import { SPRING_GENTLE } from "@/lib/motion";

export function ProblemLibrary() {
  const reduce = useReducedMotion();
  return (
    <section
      id="library"
      aria-labelledby="library-heading"
      className="relative py-24 sm:py-32 divider-top"
    >
      <Container>
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={
            reduce
              ? { duration: 0.2, ease: "easeOut" as const }
              : { ...SPRING_GENTLE }
          }
        >
          <p className="font-mono text-xs uppercase tracking-widest text-action">
            Problem library
          </p>
          <h2
            id="library-heading"
            className="mt-3 text-3xl sm:text-4xl font-semibold text-headline"
          >
            What the problems look like.
          </h2>
          <p className="mt-4 text-muted text-lg leading-relaxed">
            A few examples of the kind of incidents you will see. Drawn from
            production-style scenarios across six roles. Problems are grouped
            by area and difficulty, with acceptance checks listed upfront so
            you know what passing looks like before you start.
          </p>
        </motion.div>

        <motion.figure
          className="mt-10 rounded-xl border border-border bg-surface shadow-card overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={
            reduce
              ? { duration: 0.2, ease: "easeOut" as const }
              : { ...SPRING_GENTLE }
          }
        >
          <ZoomableImage
            src="screenshots/problems.png"
            alt="bug.dr problems library with search and filters for role, difficulty, topic and status, showing a grid of problem cards."
            width={1600}
            height={1173}
            sizes="(min-width: 1024px) 1200px, 100vw"
            showEnlargeHint
          />
          <figcaption className="border-t border-border bg-bg/40 px-5 py-3 font-mono text-[12px] text-muted">
            The full library. Search by role, difficulty, topic and status.
          </figcaption>
        </motion.figure>
      </Container>
    </section>
  );
}
