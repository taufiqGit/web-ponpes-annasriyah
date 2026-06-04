import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseHostname = supabaseUrl
  .replace(/\/rest\/v1\/?$/i, "")
  .replace(/^https?:\/\//, "")
  .replace(/\/.*$/, "");

const nextConfig: NextConfig = {
  reactCompiler: true,
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
