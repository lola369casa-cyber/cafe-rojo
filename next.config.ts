import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Product image uploads from the admin dashboard go through a server action.
  experimental: { serverActions: { bodySizeLimit: "8mb" } },
  images: {
    qualities: [75, 85],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
};

export default nextConfig;
