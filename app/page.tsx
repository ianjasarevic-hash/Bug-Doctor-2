import { Nav } from "@/components/landing/nav";
import { AnnouncementBar } from "@/components/landing/announcement-bar";
import { Hero } from "@/components/landing/hero";
import { Comparison } from "@/components/landing/comparison";
import { HowItWorks } from "@/components/landing/how-it-works";
import { RolesAndProfile } from "@/components/landing/roles-and-profile";
import { ProblemLibrary } from "@/components/landing/problem-library";
import { Features } from "@/components/landing/features";
import { Waitlist } from "@/components/landing/waitlist";
import { Faq } from "@/components/landing/faq";
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
        <RolesAndProfile />
        <ProblemLibrary />
        <Features />
        <Waitlist />
        <Faq />
      </main>
      <Footer />
    </>
  );
}