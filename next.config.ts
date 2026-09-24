import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Admin-entered product image URLs can point anywhere; the admin panel
    // is password-gated so this is a trusted-input surface, not public.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
