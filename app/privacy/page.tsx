import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/landing/legal-page";
import { operator } from "@/lib/operator";
import { ContactEmail } from "@/components/landing/operator-line";

export const metadata: Metadata = {
  title: "Privacy Policy · bug.dr",
  description:
    "How bug.dr collects, uses, stores and shares personal data. What you give us, why we need it, who else sees it, and your rights under GDPR.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "Last updated: October 9, 2026";

// "Who we are" reads from `lib/operator.ts` (name, address, email).
// ContactEmail flips between a plain span and a real `mailto:` link
// once the placeholder is replaced.
const sections: LegalSection[] = [
  {
    slug: "who-we-are",
    title: "Who we are",
    body: (
      <>
        <p>
          bug.dr is a service for practicing how to fix production bugs with
          an AI assistant. It is operated by{" "}
          <strong>{operator.name}</strong> (the "operator"), trading as
          bug.dr. The operator's registered address is{" "}
          <strong>{operator.address}</strong>.
        </p>
        <p>
          If you have any questions about this policy or your data, email
          us at <ContactEmail />. We aim to reply within a few working days.
        </p>
      </>
    ),
  },
  {
    slug: "what-we-collect",
    title: "What we collect",
    body: (
      <>
        <p>
          <strong>When you join the waitlist.</strong> Your email address
          (required). Your company name (optional). A short free-text reason
          for joining (optional). We collect exactly what you type into the
          form and nothing else at this stage.
        </p>
        <p>
          <strong>After launch, when you create an account.</strong> Your
          account details (name, email, password hash, sign-in provider if
          you use one). Your onboarding answers: your role, your years of
          experience with production code and your goal (get hired,
          improve skills or both).
        </p>
        <p>
          <strong>When you solve problems.</strong> Which problems you
          opened, started and solved. Time-on-task. The code and files you
          write in the workspace. Terminal commands and test runs. Prompts
          you send to the AI assistant and the responses the assistant
          returns. Token and cost usage for the AI. Your scores and
          streaks. Your contest history. Anything you choose to put on a
          public profile.
        </p>
        <p>
          <strong>Operational data.</strong> Standard server logs (IP
          address, user agent, request timestamps). Cookies and similar
          storage as described in the{" "}
          <a href="#cookies-and-analytics">Cookies and analytics</a>{" "}
          section.
        </p>
      </>
    ),
  },
  {
    slug: "why-we-use-it",
    title: "Why we use it and our legal basis",
    body: (
      <>
        <p>
          We process your personal data on the following legal bases under
          the GDPR.
        </p>
        <p>
          <strong>Consent.</strong> For the waitlist. By submitting your
          email you consent to us storing it and contacting you about the
          launch. You can withdraw this consent at any time and we will
          delete your entry.
        </p>
        <p>
          <strong>Contract.</strong> After launch, to provide the service
          you signed up for: account access, the workspace, scoring, your
          profile, contest results, support replies.
        </p>
        <p>
          <strong>Legitimate interests.</strong> To keep the service secure
          (logs, abuse detection, account integrity) and to improve the
          problems and the product. We balance these interests against
          your rights and only keep the minimum data needed.
        </p>
      </>
    ),
  },
  {
    slug: "who-we-share-with",
    title: "Who we share it with",
    body: (
      <>
        <p>
          We use a small number of processors to run bug.dr. Each one
          receives only the data it needs to do its job, under a written
          data-processing agreement.
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>Railway</strong> hosts the application and your
            workspace data.
          </li>
          <li>
            <strong>Anthropic and OpenAI</strong> receive your prompts and
            the code context sent to the assistant. They return a response
            and may keep a temporary record for safety and abuse
            monitoring. We do not send them your account email or your
            full workspace history, only what the assistant needs to
            answer your current question. Neither Anthropic nor OpenAI
            trains on API prompts by default.
          </li>
        </ul>
        <p>
          <strong>International transfers.</strong> Some of these
          processors may store or process data outside the European
          Economic Area. Where that happens, we rely on{" "}
          <strong>Standard Contractual Clauses (SCCs)</strong> to protect
          your data.
        </p>
        <p>
          You decide whether to share your profile. We do not send your
          profile or scores to employers or recruiters unless you share it
          or ask us to.
        </p>
      </>
    ),
  },
  {
    slug: "how-long-we-keep-it",
    title: "How long we keep it",
    body: (
      <>
        <p>
          <strong>Waitlist.</strong> Until we have sent the launch emails,
          plus a short grace period of <strong>30 days after launch emails
          are sent</strong>, or until you ask us to delete your entry,
          whichever comes first.
        </p>
        <p>
          <strong>Account and workspace data.</strong> For as long as your
          account is active. When you delete your account, we delete
          personal data within <strong>30 days</strong>, except where we
          have to keep certain records for tax, accounting, or legal-hold
          reasons.
        </p>
        <p>
          <strong>Backups.</strong> Encrypted backups are kept for{" "}
          <strong>30 days</strong> and then rotated out.
        </p>
      </>
    ),
  },
  {
    slug: "cookies-and-analytics",
    title: "Cookies and analytics",
    body: (
      <p>
        <strong>We do not use third-party analytics.</strong>
      </p>
    ),
  },
  {
    slug: "your-rights",
    title: "Your rights under GDPR",
    body: (
      <>
        <p>
          If you are in the European Economic Area, the United Kingdom or
          Switzerland, you have the right to:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Access the personal data we hold about you.</li>
          <li>Correct inaccurate or incomplete data.</li>
          <li>Delete your data ("right to be forgotten").</li>
          <li>
            Restrict or object to certain processing, including direct
            marketing.
          </li>
          <li>
            Receive your data in a portable, machine-readable format.
          </li>
          <li>
            Withdraw consent at any time, where processing is based on
            consent.
          </li>
          <li>
            Complain to your data protection authority. In Croatia, the
            supervisory authority is the{" "}
            <strong>Personal Data Protection Agency (AZOP)</strong>. In
            Slovenia, it is the <strong>Information Commissioner</strong>.
            You can also complain to the authority in your country of
            residence.
          </li>
        </ul>
        <p>
          To exercise any of these rights, email <ContactEmail />. We will
          reply within one month.
        </p>
      </>
    ),
  },
  {
    slug: "security",
    title: "Security",
    body: (
      <>
        <p>
          We protect your data with reasonable technical and
          organisational measures: encryption in transit (TLS), encryption
          at rest, access controls on operator accounts, audit logs for
          sensitive actions, and regular review of our processors. No
          system is perfectly secure, but we work to keep your data safe.
        </p>
        <p>
          If we become aware of a personal data breach that is likely
          to affect you, we will notify you and the relevant authority
          as required by law.
        </p>
      </>
    ),
  },
  {
    slug: "children",
    title: "Children",
    body: (
      <p>
        bug.dr is not for people under 16. If you believe a child has
        signed up, we will delete the account.
      </p>
    ),
  },
  {
    slug: "changes-to-this-policy",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy. When we do, we will change the "Last
        updated" date at the top and, for material changes, email
        affected users or show a notice in the app. Older versions are
        available on request.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated={LAST_UPDATED}
      sections={sections}
    />
  );
}
