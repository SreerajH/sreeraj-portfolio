import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // The case study was first published under a misspelt slug.
      {
        source: "/work/healthyhub",
        destination: "/work/healthhub",
        permanent: true, // 308
      },
    ];
  },
};

export default nextConfig;
