import type { NextConfig } from "next";

<<<<<<< HEAD
const nextConfig: NextConfig = {
  /* config options here */
  // Disable dev indicators (the dev tools in bottom left corner)
  // Note: This may require Next.js 13.4+ for full support
  reactStrictMode: true,
=======
const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Block clickjacking / iframe embedding
  { key: "X-Frame-Options", value: "DENY" },
  // Stop legacy XSS filter (modern browsers use CSP instead)
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Send origin only on same-origin requests
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable unnecessary browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(self)",
  },
  // DNS prefetch only for same-origin — avoids leaking domains to DNS
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // HSTS: enforce HTTPS for 1 year (only effective once deployed over HTTPS)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        // Apply to every route
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
>>>>>>> d4b4a93 (update code)
};

export default nextConfig;
