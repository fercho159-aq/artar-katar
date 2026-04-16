import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pulserasportalviviente.vercel.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.astar-katar.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'astar-katar.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    CLIP_API_KEY: process.env.CLIP_API_KEY,
  },
  // Ensure private-audio/* is bundled into the serverless function for the
  // activaciones audio streaming route (critical for Vercel deploy).
  outputFileTracingIncludes: {
    '/api/activaciones/audio/[slug]': ['./private-audio/**/*'],
  },
};

export default nextConfig;
