import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the workspace root to THIS folder so Next.js stops warning about a
  // stray package-lock.json in a parent directory (e.g. C:\Users\moise).
  outputFileTracingRoot: path.join(__dirname),

  // Reference data (team logos, prospect headshots) is loaded from remote URLs.
  // Add the hosts you actually pull images from here as you wire up seeding.
  images: {
    remotePatterns: [
      // { protocol: "https", hostname: "a.espncdn.com" },
    ],
  },
};

export default nextConfig;
