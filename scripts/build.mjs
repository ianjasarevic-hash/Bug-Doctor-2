// Production build wrapper. Sets NEXT_PUBLIC_BASE_PATH so the
// client components (via lib/asset-path.ts) emit URLs that
// include the base prefix, and GITHUB_PAGES so next.config
// applies the same basePath to <Link> hrefs and _next/ asset
// URLs. The dev server runs without these env vars, so the
// local experience stays at the site root.
//
// BASE_PATH overrides the per-build URL prefix. Defaults to
// /BugDoctor so the original site deploys unchanged. Use
// `BASE_PATH=/Bug-Doctor-2 npm run build` to deploy to the
// second repo. Both NEXT_PUBLIC_BASE_PATH (for the client
// helper) and GITHUB_PAGES (for next.config) are set from the
// same value so the client and server agree.
//
// The prebuild legal-placeholder guard runs via package.json's
// `prebuild` script (dev mode, warn-only), so unfilled
// placeholders show up in the build log but do not fail the
// build — matching the contract used by the original repo
// before the strict-guard experiment.

import { spawnSync } from "node:child_process";

const isWindows = process.platform === "win32";

const basePath = process.env.BASE_PATH || "/BugDoctor";

const env = {
  ...process.env,
  BASE_PATH: basePath,
  NEXT_PUBLIC_BASE_PATH: basePath,
  GITHUB_PAGES: "1",
};

const result = spawnSync(
  isWindows ? "npx.cmd" : "npx",
  ["next", "build"],
  { stdio: "inherit", env, shell: isWindows },
);

process.exit(result.status ?? 1);
