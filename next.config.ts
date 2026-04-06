import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['kuusbirjvjpryqlazloc.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kuusbirjvjpryqlazloc.supabase.co',
      },
    ],
  },
};

export default nextConfig;
