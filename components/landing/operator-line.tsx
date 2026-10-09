import { isPlaceholder, operator } from "@/lib/operator";

// Shared "bug.dr is operated by ..." line, used in the footer and
// in the legal-page intro. Reads from `lib/operator.ts` so the
// two call sites stay in sync.
//
// Render rules:
//   - The contact email is rendered as a plain span while the value
//     is still the bracketed placeholder, so a `mailto:[CONTACT EMAIL]`
//     never ships in the public copy. Once the placeholder is
//     replaced, it becomes a real mailto link.
//   - The optional "registration no. {id}" clause is only rendered
//     when `operator.registrationId` is a non-empty string. Leave
//     the config field empty to omit the clause entirely.
//
// Class names default to a small mono style suited to the footer /
// legal-page intro; callers can override with `className` for
// different sizes.

// Inline contact-email helper for use inside section bodies (e.g.
// "If you have any questions... email us at {ContactEmail}"). Renders
// a plain span while the value is a placeholder, and a real
// `mailto:` link otherwise. OperatorLine already renders the full
// sentence in the footer / intro, so this is for paragraphs that
// mention the contact email on their own.
export function ContactEmail() {
  if (isPlaceholder(operator.email)) {
    return <span>{operator.email}</span>;
  }
  return (
    <a
      href={`mailto:${operator.email}`}
      className="text-text underline decoration-text/30 underline-offset-2 hover:decoration-text"
    >
      {operator.email}
    </a>
  );
}

export function OperatorLine({ className }: { className?: string }) {
  const base = `bug.dr is operated by ${operator.name}, ${operator.address}. Questions: ${operator.email}`;
  const full = operator.registrationId
    ? `${base}, registration no. ${operator.registrationId}.`
    : `${base}.`;

  const emailClass =
    "underline decoration-text/30 underline-offset-2 hover:decoration-text";

  return (
    <p className={className ?? "font-mono text-[11px] text-muted"}>
      bug.dr is operated by {operator.name}, {operator.address}. Questions:{" "}
      {isPlaceholder(operator.email) ? (
        <span>{operator.email}</span>
      ) : (
        <a href={`mailto:${operator.email}`} className={emailClass}>
          {operator.email}
        </a>
      )}
      {operator.registrationId ? (
        <>
          , registration no. <span>{operator.registrationId}</span>
        </>
      ) : null}
      .
    </p>
  );
}
