import { Container } from "@/components/landing/container";
import { ZoomableImage } from "@/components/ui/zoomable-image";

// "What the problems look like" section.
//
// Earlier versions used framer-motion's `whileInView` to fade and slide
// the section header and the screenshot in as the user scrolled. On the
// static export the SSR HTML rendered them at `opacity:0` with a
// translate, and the IntersectionObserver only fired for content that
// was actually in the viewport. Off-screen content stayed invisible in
// fullPage screenshots, for crawlers, and for anyone trying to print the
// page. The fix: render plain HTML. The content is always visible.

export function ProblemLibrary() {
  return (
    <section
      id="library"
      aria-labelledby="library-heading"
      className="relative py-24 sm:py-32 divider-top"
    >
      <Container>
        <div className="max-w-2xl">
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
        </div>

        <figure className="mt-10 rounded-xl border border-border bg-surface shadow-card overflow-hidden">
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
        </figure>
      </Container>
    </section>
  );
}
