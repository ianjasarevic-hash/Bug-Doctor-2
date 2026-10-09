"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/landing/container";
import { ZoomableImage } from "@/components/ui/zoomable-image";
import { SPRING_GENTLE } from "@/lib/motion";

// Full-width slot section for the two product shots that don't otherwise
// have a home on the page: contests and dashboard. profile.png lives in
// the RolesAndProfile section to the right of the role chips. Cards stack
// full width, one per row, so the screenshots are readable at their
// natural size. Same frame pattern (`rounded-xl border border-border
// bg-surface shadow-card overflow-hidden`) as the other slots.

type Feature = {
  label: string;
  title: string;
  body: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

const features: Feature[] = [
  {
    label: "Contests",
    title: "Compete on a shared clock.",
    body:
      "Daily, weekly and monthly incidents with countdowns and a history of what you shipped.",
    src: "/screenshots/contests.png",
    alt: "Contests page showing live daily, weekly and monthly incidents with countdowns and a contest history table.",
    width: 1600,
    height: 1327,
  },
  {
    label: "Dashboard",
    title: "Pick up where you left off.",
    body:
      "The moment you sign in: live contests, the problem you were last in, recommended for you, and your progress at a glance.",
    src: "/screenshots/dashboard.png",
    alt: "Dashboard greeting the user by name, surfacing live contests, a recommended-for-you problem list and a progress sidebar.",
    width: 1600,
    height: 817,
  },
];

export function Features() {
  const reduce = useReducedMotion();
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
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
            More from the app
          </p>
          <h2
            id="features-heading"
            className="mt-3 text-3xl sm:text-4xl font-semibold text-headline"
          >
            Contests and your dashboard.
          </h2>
          <p className="mt-4 text-muted text-lg leading-relaxed">
            Two more screens. The clock you compete on, and the screen that
            greets you when you sign in.
          </p>
        </motion.div>

        <div className="mt-14 flex flex-col gap-10">
          {features.map((f, i) => (
            <FeatureCard key={f.src} feature={f} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) {
  const reduce = useReducedMotion();
  const from = index % 2 === 0 ? "left" : "right";
  const x = from === "left" ? -40 : 40;
  return (
    <motion.figure
      initial={{ opacity: 0, x: reduce ? 0 : x, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={
        reduce
          ? { duration: 0.2, ease: "easeOut" as const }
          : { ...SPRING_GENTLE }
      }
      className="rounded-xl border border-border bg-surface shadow-card overflow-hidden"
    >
      <div className="p-6 border-b border-border">
        <p className="font-mono text-xs uppercase tracking-widest text-action">
          {feature.label}
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-headline">
          {feature.title}
        </h3>
        <p className="mt-2 text-muted text-[15px] leading-relaxed">
          {feature.body}
        </p>
      </div>
      <ZoomableImage
        src={feature.src}
        alt={feature.alt}
        width={feature.width}
        height={feature.height}
        sizes="(min-width: 1024px) 1200px, 100vw"
        // Library and dashboard cards are the ones the user is most
        // likely to want to read at full size; show the tap-to-enlarge
        // badge on those. The contests card is smaller and the badge
        // would just be visual noise.
        showEnlargeHint={feature.label === "Dashboard"}
      />
    </motion.figure>
  );
}
