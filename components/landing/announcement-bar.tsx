import Link from "next/link";
import { Container } from "@/components/landing/container";
import { Countdown } from "@/components/landing/countdown";

// The announcement bar — the second most-pinned surface on the site
// (under the nav). Earlier versions used framer-motion to slide it in
// from the top with a fade. On the static export the SSR HTML rendered
// the bar at `opacity:0; transform: translateY(-40px)`, and the
// animation only fired after hydration. The fix: render plain HTML.
// The bar is always visible.

export function AnnouncementBar() {
  return (
    <div
      role="region"
      aria-label="Launch announcement"
      className="relative z-40 bg-surface/60 backdrop-blur-md border-b border-border frosted"
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
    </div>
  );
}
