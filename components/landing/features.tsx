import { Container } from "@/components/landing/container";
import { ZoomableImage } from "@/components/ui/zoomable-image";

// "Contests and your dashboard" — full-width slot section for the two
// product shots that don't otherwise have a home on the page. profile.png
// lives in the RolesAndProfile section to the right of the role chips.
// Cards stack full width, one per row, so the screenshots are readable
// at their natural size. Same frame pattern (`rounded-xl border
// border-border bg-surface shadow-card overflow-hidden`) as the other
// slots.
//
// Earlier versions used framer-motion's `whileInView` to slide the
// section header and each card in from alternating sides. On the static
// export the SSR HTML rendered them at `opacity:0` with a translate, and
// the IntersectionObserver only fired for content that was actually in
// the viewport. Off-screen content stayed invisible in fullPage
// screenshots, for crawlers, and for anyone trying to print the page.
// The fix: render plain HTML. The content is always visible.

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
    src: "screenshots/contests.png",
    alt: "Contests page showing live daily, weekly and monthly incidents with countdowns and a contest history table.",
    width: 1600,
    height: 1327,
  },
  {
    label: "Dashboard",
    title: "Pick up where you left off.",
    body:
      "The moment you sign in: live contests, the problem you were last in, recommended for you, and your progress at a glance.",
    src: "screenshots/dashboard.png",
    alt: "Dashboard greeting the user by name, surfacing live contests, a recommended-for-you problem list and a progress sidebar.",
    width: 1600,
    height: 817,
  },
];

export function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="relative py-24 sm:py-32 divider-top"
    >
      <Container>
        <div className="max-w-2xl">
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
        </div>

        <div className="mt-14 flex flex-col gap-10">
          {features.map((f) => (
            <FeatureCard key={f.src} feature={f} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <figure className="rounded-xl border border-border bg-surface shadow-card overflow-hidden">
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
    </figure>
  );
}
