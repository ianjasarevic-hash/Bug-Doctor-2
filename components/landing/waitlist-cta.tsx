import { Container } from "@/components/landing/container";
import { LinkButton } from "@/components/ui/button";
import { ArrowRight } from "@/components/landing/icons";

// Small CTA strip used twice on the home page: once after the
// example scorecard and once after the problem library +
// dashboard. One short line of supporting text (no new heading),
// then a "Join the waitlist" button in the same style as the
// hero (primary, size lg, with the arrow icon). Both buttons
// jump to the existing #waitlist section.
//
// The strip is intentionally light: a single line + one button,
// centered, with vertical padding that lets it breathe against
// the adjacent sections. No background, no card.

type Props = {
  // The single line shown above the button. One short sentence
  // that connects the section above to the waitlist signup.
  line: string;
};

export function WaitlistCta({ line }: Props) {
  return (
    <div className="relative py-16 sm:py-20 divider-top">
      <Container>
        <div className="flex flex-col items-center text-center">
          <p className="text-muted text-[15px] sm:text-base leading-relaxed max-w-md">
            {line}
          </p>
          <LinkButton href="#waitlist" size="lg" className="mt-5">
            Join the waitlist
            <ArrowRight size={16} />
          </LinkButton>
        </div>
      </Container>
    </div>
  );
}
