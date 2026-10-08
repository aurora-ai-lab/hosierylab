import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  experimental: { cpus: 2 },
};

export default nextConfig;
