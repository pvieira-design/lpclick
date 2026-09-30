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
    deviceSizes: [400, 480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    qualities: [75, 95],
  },
  // Carteirinha do paciente (BFF do click-app): a página do QR e o link da Apple Wallet
  // ficam neste domínio, mas quem responde é o BFF. Fora do middleware (ver o matcher).
  rewrites: async () => ({
    beforeFiles: [
      { source: "/c/:token", destination: "https://click-app-pos.runveloz.com/c/:token" },
      {
        source: "/api/wallet/:path*",
        destination: "https://click-app-pos.runveloz.com/api/wallet/:path*",
      },
    ],
    afterFiles: [],
    fallback: [],
  }),
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
