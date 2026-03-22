import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "export",
  turbopack: {
    // Explicitly set the workspace root so Turbopack does not get confused
    // by the docs/ package living inside the same repository.
    root: path.resolve("."),
  },
  // Note: This feature is required to use the Next.js Image component in SSG mode.
  // See https://nextjs.org/docs/messages/export-image-api for different workarounds.
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sast-link-1309205610.cos.ap-shanghai.myqcloud.com",
      },
    ],
  },
};

export default nextConfig;
