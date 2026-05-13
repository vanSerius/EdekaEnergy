import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Static export for GitHub Pages
  output: "export",
  // basePath matches the repo name so asset URLs work on Pages
  basePath: isProd ? "/EdekaEnergy" : "",
  assetPrefix: isProd ? "/EdekaEnergy/" : "",
  // next/image optimisation doesn't work with static export
  images: { unoptimized: true },
  // Trailing slash ensures index.html is generated for every route
  trailingSlash: true,
};

export default nextConfig;
