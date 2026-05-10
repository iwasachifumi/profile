import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // スケルトン段階では ESLint・TypeScript チェックはビルドに含めない。
  // React 移植が完了したら両方 false に戻して整備する。
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
