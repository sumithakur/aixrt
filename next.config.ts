import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  devIndicators: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve?.fallback,
          fs: false,
          path: false,
        },
      };
    }
    return config;
  },
  images: {
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Roundtable addresses that were published before the 20 October line-up.
  // They appear in social posts and sales material already in circulation, so
  // they are kept working rather than left to 404.
  async redirects() {
    return [
      { source: "/roundtables/investment-in-ai", destination: "/roundtables/ai-in-finance", permanent: true },
      { source: "/roundtables/ai-security-and-governance", destination: "/roundtables/sovereign-ai-and-security", permanent: true },
      { source: "/roundtables/ai-infrastructure-and-sovereign-ai", destination: "/roundtables/sovereign-ai-and-security", permanent: true },
      { source: "/roundtables/ai-and-sustainability", destination: "/roundtables", permanent: true },
    ];
  },
};

export default nextConfig;
