import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Backend only: no pages are served, just /api/* route handlers.
  poweredByHeader: false,
  serverExternalPackages: ["postgres", "bcryptjs"],
};

export default nextConfig;
