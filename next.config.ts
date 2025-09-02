import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "three",
      "@react-three/fiber",
      "@react-three/drei",
      "katex",
      "mathjs",
    ],
  },
  transpilePackages: ["three"],
};

export default nextConfig;
