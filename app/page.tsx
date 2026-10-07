import { Nav } from "@/components/landing/nav";
import { AnnouncementBar } from "@/components/landing/announcement-bar";
import { Hero } from "@/components/landing/hero";
import { Comparison } from "@/components/landing/comparison";
import { HowItWorks } from "@/components/landing/how-it-works";
import { BrowserIDE } from "@/components/landing/browser-ide";
import { RolesAndProfile } from "@/components/landing/roles-and-profile";
import { ProblemLibrary } from "@/components/landing/problem-library";
import { Waitlist } from "@/components/landing/waitlist";
import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";

export default function Page() {
  return (
    <>
      <AnnouncementBar />
      <Nav />
      <main id="top">
        <Hero />
        <Comparison />
        <HowItWorks />
        <BrowserIDE />
        <RolesAndProfile />
        <ProblemLibrary />
        <Waitlist />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}