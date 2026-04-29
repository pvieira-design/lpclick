import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  turbopack: {
    resolveAlias: {
      "../build/polyfills/polyfill-module": "./src/lib/noop.js",
      "next/dist/build/polyfills/polyfill-module": "./src/lib/noop.js",
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
    deviceSizes: [480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  headers: async () => [
    {
      source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
  ],
};

export default nextConfig;
