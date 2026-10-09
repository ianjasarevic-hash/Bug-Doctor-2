# Legal-page drafting notes

This file holds drafting guidance for `/privacy` and `/terms` that
should not appear in the public copy. Each section below maps to
exactly one section in the public pages.

The build guard at `scripts/check-legal-placeholders.js` fails the
production build if any bracketed `[ALL CAPS PLACEHOLDER]` or
`[CONFIRM]` marker is still in the legal pages or the footer. The
`TODO-LEGAL.md` file is excluded from that scan.

## Privacy Policy

### `Who we are`
Filled from `lib/operator.ts` (`name`, `address`, `email`).
Update those values; the section and the footer / legal-page intro
will pick them up. There is no longer an OIB line — drop OIB from
the section if it comes back during copy review.

### `What we collect`
- Onboarding: "your role, your years of experience with production
  code and your goal (get hired, improve skills or both)". Confirm
  this matches the actual onboarding form fields.
- AI usage: "Token and cost usage for the AI." Confirm the scoring
  system really consumes the per-session token count, and confirm
  whether the cost is a separate signal or derived from tokens.
- Public profile: "Anything you choose to put on a public profile."
  Confirm what is and isn't visible by default vs. behind a
  privacy toggle.

### `Why we use it and our legal basis`
- "Legitimate interests" balance: confirm that the listed
  interests (security, product improvement) clear the GDPR
  balancing test for the data categories in §2.

### `Who we share it with`
- The DPA-with-each-processor sentence ends with `[CONFIRM]`. Confirm
  every named processor below has a signed DPA before deleting the
  marker.
- Hosting provider: `[HOSTING PROVIDER]`. Replace.
- Email provider: `[EMAIL PROVIDER]`. Replace.
- AI provider: `[AI PROVIDER]`. Replace.
  - The "We do not send it your account email or your full
    workspace history, only what the assistant needs to answer your
    current question" sentence ends with `[CONFIRM]`. Verify against
    the actual API integration.
  - The "may keep a temporary record for safety and abuse
    monitoring" claim is hard to verify from the outside. Confirm
    with the provider's data-retention terms.
  - Whether the AI provider trains on prompts and code is a separate
    `[CONFIRM]`. If the provider trains, add a sentence about it; if
    not, add a "we do not train" sentence. (Do not invent either
    claim.)
- International transfers: replace
  `[CONFIRM safeguards, e.g. European Commission adequacy decision
  or Standard Contractual Clauses]` with the actual basis.
- Profile sharing: "You decide whether to share your profile. We do
  not send your profile or scores to employers or recruiters unless
  you share it or ask us to." The `[CONFIRM]` at the end is because
  the wording assumes a private-by-default profile — confirm the
  default is private and there is no opt-in recruiter channel.

### `How long we keep it`
- Waitlist grace period: `[CONFIRM]`. Pick a number (e.g. "30 days
  after launch emails are sent" or "delete immediately after the
  emails go out").
- Account-deletion window: `[CONFIRM]`. Pick a number (30 or 60
  days is typical).
- Backup retention: `[CONFIRM]`. Pick a number of days or months.

### `Cookies and analytics`
The public section is one line: `[ANALYTICS: none or provider]`.
Choose one:
- `none` — replace the whole line with "We do not use analytics."
  Also remove the "strictly necessary cookies" claim from
  TODO-LEGAL below; either keep it (if the sign-in flow sets any)
  or drop it.
- A provider (e.g. Plausible, PostHog self-hosted, Fathom) — fill
  in the line and expand the section with: what it tracks,
  whether it's set only with consent, and where to opt out.

Drafting notes that go WITH the filled-in section (not the
placeholder):
- Strictly necessary cookies: confirm what's set for sign-in and
  session state. List the cookie name, purpose, and lifetime.
- Any marketing or third-party cookies: list and link to opt-out.

### `Your rights under GDPR`
- The two named authorities (Croatian AZOP, Slovenian Information
  Commissioner) assume a Croatian or Slovenian operator. If the
  operator is in another jurisdiction, replace with the local
  supervisory authority and a one-line pointer to the EU/EEA
  list for cross-border complaints.

### `Security`
Every specific measure ends with `[CONFIRM]`. Confirm each before
deleting:
- encryption in transit (TLS)
- encryption at rest
- access controls on operator accounts
- audit logs for sensitive actions
- regular review of our processors

If any of these is not true, delete that clause entirely (don't
leave a `[CONFIRM]` in the public copy).

### `Children`
One sentence plus the deletion promise. Confirm the deletion
contact path is the same `operator.email` used everywhere else.

## Terms of Service

### `Who we are and acceptance of the terms`
Filled from `lib/operator.ts`. Same source as Privacy.

### `Eligibility and accounts`
- "You must be at least 16 years old." Confirm against the actual
  sign-up flow. If the sign-up blocks under-16s, this is fine. If
  it doesn't, add a note that age verification is not performed
  and the user is responsible for being 16+.

### `AI assistant`
The public section is now lean (output can be wrong; user is
responsible; see Privacy Policy for collection). Confirm that the
"tracked for scoring" detail is fully covered by the Privacy
Policy §2 ("Token and cost usage for the AI") so the cross-link
is accurate. If scoring uses anything not listed in the Privacy
Policy, add it there.

### `Acceptable use`
- The "do not publish solutions outside the bug.dr discussion
  area" rule assumes the discussion area opens only after the
  user has solved the problem. Confirm that the product
  implements this gate.
- "Use bots... except for the in-product AI assistant" — confirm
  the AI assistant is the only automation in scope. If you
  later ship a CLI or a CI helper, decide whether it's covered.

### `Contests`
The public section is one line: `[CONTEST PRIZES: none or
details]`. Choose one:
- `none` — replace the line with "Contests do not have monetary
  prizes." (or similar).
- A real prize structure — fill in: which contests pay, the
  prize (cash, swag, account credits), eligibility, payout
  schedule, and whether ties are broken or split.

Drafting notes that go WITH the filled-in section:
- Tax and KYC obligations on prize winners: confirm whether the
  operator needs to collect tax info, who reports the prize,
  and what jurisdictions are excluded.
- Disqualification conditions: tie back to the Acceptable Use
  section rather than restating.

### `Your content`
The retention sentence now points to the Privacy Policy. Confirm
the linked section (`/privacy/#how-long-we-keep-it`) covers:
- what happens to a deleted user's code and profile stats
- what stays public after account deletion (e.g. contest
  leaderboards, public profile snapshots)
- what is kept for legal-hold reasons

If any of those is not in the Privacy Policy, add it there
before the link goes live.

### `Termination`
"delete your account from your account settings [CONFIRM that
this feature exists]." Verify the user-settings page has an
account-deletion flow. If it doesn't, either build it or change
the wording to "by emailing us to request deletion".

### `Governing law`
Replace `[GOVERNING LAW AND COURT CITY]` with the actual
jurisdiction. Two instances in the same sentence.

### `Contact`
Removed in pass 5. The contact path is the closing paragraph of
the relevant policy / terms page wherever it appears. If you add
a new policy later, decide whether it needs a Contact section or
can rely on the footer email.

## Footer & legal-page intro

Both surfaces render the same shared line from
`components/landing/operator-line.tsx`, which reads from
`lib/operator.ts`. While the email is the bracketed `[CONTACT EMAIL]`
placeholder it renders as a plain `<span>` (so a broken
`mailto:[CONTACT EMAIL]` never ships). Once the placeholder is
replaced, the same line becomes a real `mailto:` link.

The shared sentence is:

> bug.dr is operated by {operator.name}, {operator.address}.
> Questions: {operator.email}.

with `, registration no. {operator.registrationId}.` appended only
when `operator.registrationId` is a non-empty string.

`registrationId` is optional. The default in `lib/operator.ts` is
the empty string, which means:
- nothing is rendered for the registration-id clause, and
- the build guard does not flag it (an empty string doesn't match
  the bracketed-placeholder regex, so it naturally passes).

If you add a real id later, set it directly in the config (e.g.
`registrationId: "12345678"`). Do NOT set it to a bracketed
`[REGISTRATION ID]` placeholder — the build guard will fail the
production build on a bracketed value.
