import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Nonaktifkan ESLint saat build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
