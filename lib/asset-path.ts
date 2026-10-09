// Base path for static assets. In dev (localhost:3002) the assets
// are served from the site root, so this is "". In production the
// site is served from /BugDoctor/ on GitHub Pages, so static assets
// need the /BugDoctor prefix in the URL.
//
// next/image with `images.unoptimized: true` (required for
// `output: "export"`) does not apply `basePath` to the rendered
// `src`, so any image that needs to resolve on every route —
// notably the Nav logo, which is rendered on /, /privacy/ and
// /terms/ — must build the path with this helper rather than rely
// on the relative-URL resolution that works for screenshots on
// the home page.
//
// Set NEXT_PUBLIC_BASE_PATH=/BugDoctor when building for
// production. The build script in package.json does this.

export function assetPath(p: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const path = p.startsWith("/") ? p : `/${p}`;
  return `${base}${path}`;
}
