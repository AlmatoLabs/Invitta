import type { NextConfig } from "next";

// The browser only ever talks to server-admin. /api/* is proxied to server-app,
// so the session cookie is first-party and no CORS setup is needed.
const SERVER_APP_URL = process.env.SERVER_APP_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${SERVER_APP_URL}/api/:path*` }];
  },
};

export default nextConfig;
