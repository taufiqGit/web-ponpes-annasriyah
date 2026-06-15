import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseHostname = supabaseUrl
  .replace(/\/rest\/v1\/?$/i, "")
  .replace(/^https?:\/\//, "")
  .replace(/\/.*$/, "");

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-src 'self' https://www.google.com https://maps.google.com;",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
          },
        ]
      : [],
  },
};

export default nextConfig;
