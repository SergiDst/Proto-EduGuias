import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.builder.io',
        port: '',
      },
    ],
  },
  allowedDevOrigins: ['3000-firebase-proto-eduguiasgit-1773867159815.cluster-gizzoza7hzhfyxzo5d76y3flkw.cloudworkstations.dev'],
};

export default nextConfig;
