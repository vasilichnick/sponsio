import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Markets moved to real routes (2026-06-12). /coins lived in launch
      // tweets and early shares — keep it working forever.
      { source: "/coins", destination: "/markets/champion", permanent: true },
      { source: "/markets", destination: "/markets/champion", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        // Background photos are content-stable: replace = rename. Immutable
        // caching makes reloads paint the strips instantly from cache.
        source: "/bg/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
