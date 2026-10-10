import { Nav } from "@/components/landing/nav";
import { AnnouncementBar } from "@/components/landing/announcement-bar";
import { Hero } from "@/components/landing/hero";
import { Comparison } from "@/components/landing/comparison";
import { HowItWorks } from "@/components/landing/how-it-works";
import { SampleScore } from "@/components/landing/sample-score";
import { CareerPaths } from "@/components/landing/career-paths";
import { AIFeedback } from "@/components/landing/ai-feedback";
import { WaitlistCta } from "@/components/landing/waitlist-cta";
import { RolesAndProfile } from "@/components/landing/roles-and-profile";
import { ProblemLibrary } from "@/components/landing/problem-library";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { Waitlist } from "@/components/landing/waitlist";
import { Faq } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

// Home page section order.
//
// Hero, How it works, then the example scorecard and a CTA
// before Career Paths and AI Feedback, then the role chips
// and the problem library + dashboard, then Pricing and
// another CTA, then the waitlist form and the FAQ, then
// the footer. The two CTAs are spread out so the user has
// multiple chances to convert without a sticky banner.
export default function Page() {
  return (
    <>
      <AnnouncementBar />
      <Nav />
      <main id="top">
        <Hero />
        <Comparison />
        <HowItWorks />
        <SampleScore />
        <WaitlistCta line="Get the link in your inbox the day we open." />
        <CareerPaths />
        <AIFeedback />
        <RolesAndProfile />
        <ProblemLibrary />
        <Features />
        <Pricing />
        <WaitlistCta line="Be the first to pick a problem when the library opens." />
        <Waitlist />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
