import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // スケルトン段階では ESLint はビルドに含めない。
  // React 移植が完了したら ignoreDuringBuilds: false に戻して整備する。
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
