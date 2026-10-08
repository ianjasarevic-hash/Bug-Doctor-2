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
  // Serve from /BugDoctor/ when the repo is the project site root.
  // (No basePath locally; only needed for production URLs that aren't
  // hosted at the apex of the domain.)
  basePath: process.env.GITHUB_PAGES ? "/BugDoctor" : "",
  trailingSlash: true,
};

export default nextConfig;