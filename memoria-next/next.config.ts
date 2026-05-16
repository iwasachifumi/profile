import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_SHA: process.env.BUILD_SHA ?? "dev",
  },
};

export default nextConfig;
