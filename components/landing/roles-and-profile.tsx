import { Container } from "@/components/landing/container";
import { ZoomableImage } from "@/components/ui/zoomable-image";

// "Pick a role. Show your work." section.
//
// Six role chips on the left, profile screenshot on the right. Earlier
// versions used framer-motion's `whileInView` to slide each chip in from
// a different side. On the static export the SSR HTML rendered the
// chips at `opacity:0` with a translate, and the IntersectionObserver
// only fired for chips that were actually in the viewport. Off-screen
// chips stayed invisible in fullPage screenshots, for crawlers, and for
// anyone trying to print the page. The fix: render plain HTML. The
// content is always visible.

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

export function RolesAndProfile() {
  return (
    <section
      id="profile"
      aria-labelledby="profile-heading"
      className="relative py-24 sm:py-32 divider-top"
    >
      <Container>
        <div className="max-w-2xl">
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
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left: 3x2 role chips */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {roles.map((r) => (
              <div
                key={r.name}
                className="rounded-lg border border-border bg-surface p-4"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-action border border-action/40 bg-action/10 rounded px-1.5 py-0.5">
                    {r.icon}
                  </span>
                  <span className="text-sm font-medium">{r.name}</span>
                </div>
                <div className="mt-2 text-[12px] text-text/90 leading-snug">
                  {r.example}
                </div>
              </div>
            ))}
          </div>

          {/* Right: profile screenshot */}
          <ProfileShot />
        </div>
      </Container>
    </section>
  );
}

function ProfileShot() {
  // Real product screenshot for the profile feature: points, level,
  // streak, twelve-month activity grid, solved problems. The numbers in
  // the image (Max, 147, 12,840, 18 days) are sample data; we do not
  // repeat them in the site copy.
  return (
    <figure className="lg:col-span-5 rounded-xl border border-border bg-surface shadow-card overflow-hidden">
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
    </figure>
  );
}
