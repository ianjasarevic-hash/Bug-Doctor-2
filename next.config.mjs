/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export so the site can be served by GitHub Pages.
  // `next build` produces an `out/` directory we push to the gh-pages branch.
  output: "export",
  // next/image needs the optimization server in static export — disable it
  // and let the browser pick the right file.
  images: {
    unoptimized: true,
  },
  // Serve from the configured base path when the site is hosted on
  // GitHub Pages under a project URL (e.g. /BugDoctor or
  // /Bug-Doctor-2). Override with the BASE_PATH env var per build;
  // defaults to /BugDoctor when GITHUB_PAGES=1 is set without an
  // explicit BASE_PATH. Empty in dev so /logos/foo.png resolves to
  // the local server root.
  basePath:
    process.env.BASE_PATH ||
    (process.env.GITHUB_PAGES ? "/BugDoctor" : ""),
  trailingSlash: true,
};

export default nextConfig;