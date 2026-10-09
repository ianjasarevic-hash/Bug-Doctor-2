import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/landing/legal-page";
import { operator } from "@/lib/operator";
import { ContactEmail } from "@/components/landing/operator-line";

export const metadata: Metadata = {
  title: "Terms of Service · bug.dr",
  description:
    "The rules for using bug.dr. Eligibility, the AI assistant, scoring, acceptable use, contests, your content, liability and governing law.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "Last updated: October 9, 2026";

const sections: LegalSection[] = [
  {
    slug: "who-we-are-acceptance",
    title: "Who we are and acceptance of the terms",
    body: (
      <>
        <p>
          These terms govern your use of bug.dr, operated by{" "}
          <strong>{operator.name}</strong> (the "operator", "we", "us"),
          with a registered address of <strong>{operator.address}</strong>.
        </p>
        <p>
          By creating an account or using bug.dr, you agree to these
          terms and to our <a href="/privacy">Privacy Policy</a>. If you
          do not agree, do not use the service.
        </p>
      </>
    ),
  },
  {
    slug: "eligibility",
    title: "Eligibility and accounts",
    body: (
      <>
        <p>
          You must be at least 16 years old to use bug.dr. By using the
          service, you confirm that you are.
        </p>
        <p>
          Keep your account credentials safe. You are responsible for
          activity on your account. Tell us promptly at <ContactEmail />{" "}
          if you think someone else has used your account.
        </p>
      </>
    ),
  },
  {
    slug: "what-bugdr-is",
    title: "What bug.dr is",
    body: (
      <p>
        bug.dr is a practice environment for engineers. You work on
        production-style problems with an AI assistant in your editor,
        submit your work, and receive a score based on correctness,
        code quality, verification, time and AI efficiency. bug.dr is{" "}
        <strong>not a hiring service</strong>. We do not guarantee
        interviews, job offers, or any other outcome from your use of
        the platform.
      </p>
    ),
  },
  {
    slug: "scoring",
    title: "Scoring",
    body: (
      <>
        <p>
          Scores are calculated by bug.dr from your submission, the
          acceptance checks, and how you worked. The exact method may
          change over time as we improve the product.
        </p>
        <p>Each problem can be solved once for score.</p>
      </>
    ),
  },
  {
    slug: "ai-assistant",
    title: "AI assistant",
    body: (
      <>
        <p>
          The AI assistant in the workspace is a tool, not a source of
          truth. Its outputs can be wrong, incomplete, or out of date.
          You are responsible for what you submit and for the choices you
          make in the workspace.
        </p>
        <p>
          What we collect and why is explained in the{" "}
          <a href="/privacy/#what-we-collect">Privacy Policy</a>.
        </p>
      </>
    ),
  },
  {
    slug: "acceptable-use",
    title: "Acceptable use",
    body: (
      <>
        <p>When using bug.dr you must not:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            Do not publish or share solutions to problems anywhere
            outside the bug.dr discussion area. The discussion for a
            problem opens only after you have solved it.
          </li>
          <li>
            Cheat, share answers, or coordinate with other users in
            contests in a way that breaks the rules of the contest.
          </li>
          <li>
            Use bots, scripts or other automation to interact with the
            workspace, except for the in-product AI assistant.
          </li>
          <li>
            Create or operate multiple accounts to farm points, game
            streaks, or otherwise subvert scoring.
          </li>
          <li>
            Attack, probe, or attempt to disrupt the workspace
            infrastructure, including the editor, the terminal, the
            test runner and the AI assistant.
          </li>
          <li>
            Reverse engineer, decompile, or otherwise attempt to read
            the source of the acceptance checks, the test cases or the
            scoring engine.
          </li>
        </ul>
        <p>
          We may suspend or terminate accounts that violate these rules.
        </p>
      </>
    ),
  },
  {
    slug: "contests",
    title: "Contests",
    body: (
      <p>
        <strong>[CONTEST PRIZES: none or details]</strong>.
      </p>
    ),
  },
  {
    slug: "your-content",
    title: "Your content",
    body: (
      <>
        <p>
          You keep ownership of the code and solutions you write in
          bug.dr. We do not claim ownership of your work.
        </p>
        <p>
          You give us a limited licence to host, process, score and
          display your code, results and profile statistics as needed
          to run the service. How long we keep this data is explained
          in the{" "}
          <a href="/privacy/#how-long-we-keep-it">Privacy Policy</a>.
        </p>
      </>
    ),
  },
  {
    slug: "our-content",
    title: "Our content",
    body: (
      <p>
        The problems, the acceptance checks, the scoring engine, the
        UI, the brand and the platform itself are owned by bug.dr or
        our licensors. You may use them only as allowed by these
        terms.
      </p>
    ),
  },
  {
    slug: "availability",
    title: "Availability",
    body: (
      <p>
        bug.dr is new and under active development. We may add, change
        or remove features at any time. The service may be
        interrupted for maintenance, updates, or reasons outside our
        control. We aim to give notice for planned downtime, but we
        do not guarantee uninterrupted availability.
      </p>
    ),
  },
  {
    slug: "termination",
    title: "Termination",
    body: (
      <>
        <p>
          You can stop using bug.dr at any time and delete your account
          from your account settings [CONFIRM that this feature
          exists]. How long we keep your data after deletion is
          explained in the{" "}
          <a href="/privacy/#how-long-we-keep-it">Privacy Policy</a>.
        </p>
        <p>
          We may suspend or terminate your access if you break these
          terms, if your account is inactive for an extended period, or
          if we are required to do so by law. Where reasonable, we will
          give you notice first.
        </p>
      </>
    ),
  },
  {
    slug: "liability",
    title: "Liability",
    body: (
      <>
        <p>
          bug.dr is provided "as is" and "as available". To the fullest
          extent allowed by law, we exclude all warranties, conditions
          and terms, whether express or implied.
        </p>
        <p>
          We are not liable for indirect or consequential losses, loss
          of profit, loss of data, or loss of business opportunity
          arising from your use of the service. Where we cannot
          exclude liability by law, our total liability for any claim
          is limited to the amount you have paid us in the twelve
          months before the claim.
        </p>
        <p>
          Nothing in these terms removes or limits any consumer rights
          you have under the mandatory law of your country of
          residence.
        </p>
      </>
    ),
  },
  {
    slug: "governing-law",
    title: "Governing law",
    body: (
      <p>
        These terms are governed by the laws of{" "}
        <strong>[GOVERNING LAW AND COURT CITY]</strong>. Any dispute
        will be resolved by the courts of{" "}
        <strong>[GOVERNING LAW AND COURT CITY]</strong>, unless
        mandatory consumer law in your country of residence gives you
        the right to bring a claim in your local courts.
      </p>
    ),
  },
  {
    slug: "changes-to-these-terms",
    title: "Changes to these terms",
    body: (
      <p>
        We may update these terms. When we do, we will change the
        "Last updated" date at the top and, for material changes,
        email affected users or show a notice in the app. Continued
        use of bug.dr after a change means you accept the new terms.
        If you do not accept the new terms, you can stop using the
        service and delete your account.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated={LAST_UPDATED}
      sections={sections}
    />
  );
}
