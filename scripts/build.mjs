// Production build wrapper. Sets NEXT_PUBLIC_BASE_PATH so the
// client components (via lib/asset-path.ts) emit URLs that
// include the /BugDoctor prefix, and GITHUB_PAGES so next.config
// applies the same basePath to <Link> hrefs and _next/ asset
// URLs. The dev server runs without these env vars, so the
// local experience stays at the site root.
//
// Usage: `npm run build` (which calls this script via package.json)
// or `node scripts/build.mjs` directly.
//
// The prebuild legal-placeholder guard still runs first via
// package.json's `prebuild` script, so unfilled placeholders
// are caught before this wrapper executes.

import { spawnSync } from "node:child_process";

const isWindows = process.platform === "win32";
const env = {
  ...process.env,
  NEXT_PUBLIC_BASE_PATH: "/BugDoctor",
  GITHUB_PAGES: "1",
};

const result = spawnSync(
  isWindows ? "npx.cmd" : "npx",
  ["next", "build"],
  { stdio: "inherit", env, shell: isWindows },
);

process.exit(result.status ?? 1);
