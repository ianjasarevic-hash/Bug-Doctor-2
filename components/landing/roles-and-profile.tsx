"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/landing/container";
import { ZoomableImage } from "@/components/ui/zoomable-image";
import { SPRING_GENTLE } from "@/lib/motion";

const roles = [
  {
    name: "Backend",
    icon: "BE",
    example: "connection pool leak under load",
  },
  {
    name: "Frontend",
    icon: "FE",
    example: "rerender storm from missing memo",
  },
  {
    name: "Full-stack",
    icon: "FS",
    example: "race in the reservation flow",
  },
  {
    name: "Database",
    icon: "DB",
    example: "N+1 on the orders dashboard",
  },
  {
    name: "AI / LLM",
    icon: "AI",
    example: "context window blowup in summarizer",
  },
  {
    name: "DevOps / SRE",
    icon: "DO",
    example: "pod OOM killed every Sunday 3am",
  },
];

// Per-chip entry direction so the 3x2 grid "puzzles" into place from
// every side as the section scrolls into view.
const chipFrom: ("left" | "right" | "top" | "bottom")[] = [
  "left",
  "top",
  "right",
  "left",
  "right",
  "bottom",
];

export function RolesAndProfile() {
  const reduce = useReducedMotion();
  return (
    <section
      id="profile"
      aria-labelledby="profile-heading"
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
          <h2
            id="profile-heading"
            className="text-2xl sm:text-3xl font-semibold text-headline"
          >
            Pick a role. Show your work.
          </h2>
          <p className="mt-3 text-muted text-lg leading-relaxed">
            Six roles, four levels. Every problem is graded against the same
            acceptance checks, so your score means the same thing across roles.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left: 3×2 role chips */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {roles.map((r, i) => (
              <RoleChip
                key={r.name}
                role={r}
                from={chipFrom[i]}
                delay={i * 0.07}
              />
            ))}
          </div>

          {/* Right: profile screenshot */}
          <ProfileShot />
        </div>
      </Container>
    </section>
  );
}

function RoleChip({
  role,
  from,
  delay,
}: {
  role: (typeof roles)[number];
  from: "left" | "right" | "top" | "bottom";
  delay: number;
}) {
  const reduce = useReducedMotion();
  const off =
    from === "left"
      ? { x: -40, y: 0 }
      : from === "right"
        ? { x: 40, y: 0 }
        : from === "top"
          ? { x: 0, y: -30 }
          : { x: 0, y: 30 };
  return (
    <motion.div
      className="rounded-lg border border-border bg-surface p-4"
      initial={{ opacity: 0, x: reduce ? 0 : off.x, y: reduce ? 0 : off.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={
        reduce
          ? { duration: 0.2, ease: "easeOut" as const, delay }
          : { delay, ...SPRING_GENTLE }
      }
    >
      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] text-action border border-action/40 bg-action/10 rounded px-1.5 py-0.5">
          {role.icon}
        </span>
        <span className="text-sm font-medium">{role.name}</span>
      </div>
      <div className="mt-2 text-[12px] text-text/90 leading-snug">
        {role.example}
      </div>
    </motion.div>
  );
}

function ProfileShot() {
  // Real product screenshot for the profile feature: points, level,
  // streak, twelve-month activity grid, solved problems. The numbers in
  // the image (Max, 147, 12,840, 18 days) are sample data; we do not
  // repeat them in the site copy.
  const reduce = useReducedMotion();
  return (
    <motion.figure
      className="lg:col-span-5 rounded-xl border border-border bg-surface shadow-card overflow-hidden"
      initial={reduce ? false : { opacity: 0, x: 60, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={
        reduce
          ? { duration: 0.2, ease: "easeOut" as const }
          : { ...SPRING_GENTLE }
      }
    >
      <ZoomableImage
        src="screenshots/profile.png"
        alt="bug.dr profile page showing points, current level, current streak, a twelve-month activity grid and a list of solved problems."
        width={1600}
        height={1329}
        sizes="(min-width: 1024px) 500px, 100vw"
      />
      <figcaption className="border-t border-border bg-bg/40 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-muted">
        Sample profile
      </figcaption>
    </motion.figure>
  );
}
