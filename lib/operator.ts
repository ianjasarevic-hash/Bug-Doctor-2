// Single source of truth for the operator identity. Used by the
// /privacy and /terms pages (their "Who we are" identity section)
// and by the shared footer / legal-page intro. All fields except
// `registrationId` are bracketed placeholders until the operator
// details are filled in.
//
// `isPlaceholder` returns true for any field that still has the
// "[ALL CAPS]" placeholder format. The footer uses this to render a
// plain-text email instead of a `mailto:` link while the value is
// a placeholder, so the user doesn't see a broken-looking
// `mailto:[CONTACT EMAIL]` in the meantime.
//
// `registrationId` is optional: leave it empty to omit the
// "registration no. {id}" clause everywhere it would otherwise
// appear. An empty string is not flagged by the build guard because
// the placeholder regex requires brackets — only literal
// `[REGISTRATION ID]` style placeholders in the legal pages are
// detected.

export const operator = {
  name: "[OPERATOR NAME]",
  address: "[ADDRESS]",
  email: "[CONTACT EMAIL]",
  registrationId: "",
} as const;

export function isPlaceholder(value: string): boolean {
  // Matches a bracketed token with at least one space- or
  // hyphen-separated all-caps word, e.g. "[CONTACT EMAIL]" or
  // "[GOVERNING LAW AND COURT CITY]". Used to detect fields that
  // haven't been filled in yet. An empty string is not a placeholder
  // — it means the field is intentionally unset (e.g. registration
  // id) and should not be rendered at all.
  return /^\[[A-Z0-9][A-Z0-9 _,-]*\]$/.test(value);
}
