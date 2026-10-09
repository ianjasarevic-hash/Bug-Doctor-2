// Production build wrapper. Sets NEXT_PUBLIC_BASE_PATH so the
// client components (via lib/asset-path.ts) emit URLs that
// include the /BugDoctor prefix, and GITHUB_PAGES so next.config
// applies the same basePath to <Link> hrefs and _next/ asset
// URLs. The dev server runs without these env vars, so the
// local experience stays at the site root.
//
// This wrapper also runs the legal-placeholder guard with
// NODE_ENV=production so an unfilled placeholder in
// lib/operator.ts, the legal pages, the footer or the legal-page
// intro fails the build (exits non-zero) before next build
// starts. The prebuild script in package.json still runs the
// guard in dev mode for a quick check, but the authoritative
// production-mode check is here so the npm run build contract
// is "guard passes under production rules" even when npm does
// not propagate NODE_ENV to the prebuild context.
//
// Usage: `npm run build` (which calls this script via package.json)
// or `node scripts/build.mjs` directly.

import { spawnSync } from "node:child_process";

const isWindows = process.platform === "win32";

function run(cmd, args, env) {
  return spawnSync(isWindows ? "npx.cmd" : "npx", [cmd, ...args], {
    stdio: "inherit",
    env,
    shell: isWindows,
  });
}

const baseEnv = {
  ...process.env,
  NEXT_PUBLIC_BASE_PATH: "/BugDoctor",
  GITHUB_PAGES: "1",
};

// 1) Run the legal-placeholder guard in production mode. The
//    guard's own `isProd` check is `NODE_ENV === "production" ||
//    NEXT_PHASE === "phase-production-build"`, so we set
//    NODE_ENV to make the dev override fall away and exit
//    non-zero on any unfilled placeholder.
const guard = run("node", ["scripts/check-legal-placeholders.js"], {
  ...baseEnv,
  NODE_ENV: "production",
});

if (guard.status !== 0) {
  process.exit(guard.status ?? 1);
}

// 2) Run the Next.js production build.
const build = run("next", ["build"], baseEnv);

process.exit(build.status ?? 1);
