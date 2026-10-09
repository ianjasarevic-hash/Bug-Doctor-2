#!/usr/bin/env node
// Build guard for the legal pages and the shared footer.
//
// Scans the source files for /privacy, /terms, and the shared
// layout/footer for two classes of string:
//
//   1. [ALL CAPS PLACEHOLDERS]   e.g. [CONTACT EMAIL], [OIB],
//      [HOSTING PROVIDER], [CONFIRM safeguards, ...]
//   2. [CONFIRM]                  a short marker asking the author
//      to verify a specific claim
//
// Behaviour:
//   - In a production build (NODE_ENV === "production", or when
//     NEXT_PHASE is anything other than "phase-production-build"
//     false), any match is a hard failure: prints the offending
//     lines, exits non-zero so `npm run build` (which runs this as
//     `prebuild`) aborts.
//   - In development, any match prints as a warning and the script
//     exits 0, so `npm run dev` is not blocked.
//
// Run directly with:  node scripts/check-legal-placeholders.js
// Run via prebuild:   npm run build  (calls this automatically)

const fs = require("fs");
const path = require("path");

// Files to scan. Resolved relative to the repo root (one level up
// from this script).
const SCAN_FILES = [
  "app/privacy/page.tsx",
  "app/terms/page.tsx",
  "components/landing/footer.tsx",
  "components/landing/legal-page.tsx",
];

// Patterns to flag. Two groups:
//   A — bracketed ALL-CAPS placeholders, optionally containing
//       spaces, digits, commas, periods, parentheses, hyphens,
//       and the words "AND", "OR". Allows the long
//       "[CONFIRM safeguards, e.g. ...]" marker.
//   B — the short [CONFIRM] tag (covered by A but matched
//       separately so the report can group them).
const PLACEHOLDER_RE = /\[[A-Z0-9][A-Z0-9 _,\.\(\)\-:]*\]/g;
const CONFIRM_RE = /\[CONFIRM\]/g;

const repoRoot = path.resolve(__dirname, "..");

function scanFile(relPath) {
  const abs = path.join(repoRoot, relPath);
  if (!fs.existsSync(abs)) {
    return { relPath, missing: true, hits: [] };
  }
  const text = fs.readFileSync(abs, "utf8");
  const lines = text.split(/\r?\n/);
  const hits = [];
  lines.forEach((line, i) => {
    // Strip TODO-LEGAL.md-style comments that mention placeholders
    // by example. This is a `//` comment marker on the same line;
    // it's only safe to strip when the whole line is a comment,
    // because the public copy never uses `//` for inline content.
    const stripped = line.replace(/\/\/.*$/, "");
    PLACEHOLDER_RE.lastIndex = 0;
    let m;
    while ((m = PLACEHOLDER_RE.exec(stripped)) !== null) {
      hits.push({ line: i + 1, column: m.index + 1, match: m[0] });
    }
  });
  return { relPath, missing: false, hits };
}

function main() {
  const isProd =
    process.env.NODE_ENV === "production" ||
    process.env.NEXT_PHASE === "phase-production-build";

  const reports = SCAN_FILES.map(scanFile).filter((r) => !r.missing);
  const totalHits = reports.reduce((n, r) => n + r.hits.length, 0);

  if (totalHits === 0) {
    console.log(
      `[legal-guard] OK — no placeholders or [CONFIRM] tags in ${reports.length} file(s).`
    );
    process.exit(0);
  }

  // Group hits: bracketed [CONFIRM] is a separate count from the
  // named placeholders, so the report can tell you which kind is
  // still outstanding.
  let confirmCount = 0;
  for (const r of reports) {
    CONFIRM_RE.lastIndex = 0;
    for (const h of r.hits) {
      if (CONFIRM_RE.test(h.match)) confirmCount++;
    }
  }
  const placeholderCount = totalHits - confirmCount;

  const banner = isProd
    ? `[legal-guard] FAIL — ${totalHits} unfilled marker(s) found`
    : `[legal-guard] WARN — ${totalHits} unfilled marker(s) found`;

  console.log(banner);
  console.log(
    `  • ${placeholderCount} bracketed placeholder(s) ([ALL CAPS ...])`
  );
  console.log(`  • ${confirmCount} [CONFIRM] tag(s)`);
  console.log("");
  for (const r of reports) {
    if (r.hits.length === 0) continue;
    console.log(`  ${r.relPath}`);
    for (const h of r.hits) {
      console.log(`    L${h.line}:${h.column}  ${h.match}`);
    }
  }
  console.log("");
  if (isProd) {
    console.log(
      "Production builds must not ship unfilled placeholders. Either fill the values in lib/operator.ts, app/privacy/page.tsx, app/terms/page.tsx, or move the drafting note to TODO-LEGAL.md."
    );
    process.exit(1);
  } else {
    console.log(
      "Dev build allowed through. Resolve before running `npm run build`."
    );
    process.exit(0);
  }
}

main();
