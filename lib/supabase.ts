// Tiny Supabase client — just the one endpoint we need.
//
// The form POSTs to the PostgREST `/rest/v1/waitlist` endpoint. We don't
// pull in @supabase/supabase-js for a single insert — that's ~30KB gzipped
// of client library for what is otherwise a 10-line call.
//
// The anon key below is the *publishable* key Supabase generates for the
// browser. It is designed to be public. Safety comes from the RLS policy
// on the `waitlist` table: anonymous visitors can only INSERT, never
// SELECT/UPDATE/DELETE. So even if someone scrapes the key from the
// bundle, they can only add a row — not read anyone else's email.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export type JoinWaitlistResult =
  | { ok: true; duplicate: boolean }
  | { ok: false };

export async function joinWaitlist(payload: {
  email: string;
  company: string | null;
  reason: string | null;
}): Promise<JoinWaitlistResult> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // Build misconfiguration. Build will warn too, but be defensive.
    if (typeof window !== "undefined") {
      console.error(
        "[supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.",
      );
    }
    return { ok: false };
  }

  let res: Response;
  try {
    res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    // Network error, CORS, offline, etc.
    return { ok: false };
  }

  if (res.ok) return { ok: true, duplicate: false };

  // 409 + Postgres code 23505 = unique violation on lower(email).
  // The user is already on the list — same acknowledgement as a fresh
  // signup, no need to make them feel like something went wrong.
  if (res.status === 409) {
    try {
      const body = (await res.json()) as { code?: string };
      if (body?.code === "23505") return { ok: true, duplicate: true };
    } catch {
      // Body wasn't JSON; fall through to generic error.
    }
  }

  return { ok: false };
}
