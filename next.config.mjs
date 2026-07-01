import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://railway.app';
const rawHostname = process.env.NEXT_PUBLIC_API_HOSTNAME || 'backend-production-9c30.up.railway.app';

const BACKEND_URL = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;
const BACKEND_HOSTNAME = rawHostname.replace(/^https?:\/\//, '').split('/')[0];

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname, 
  
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      // 1. Dynamic server production image pattern
      {
        protocol: 'https',
        hostname: BACKEND_HOSTNAME,
        pathname: '/**', 
      },
      // 2. Local development asset loading backup
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**', 
      },
      // 3. CATCH-ALL FOR SCRAPED EXTERNAL IMAGES (HTTPS)
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
      // 4. CATCH-ALL FOR SCRAPED EXTERNAL IMAGES (HTTP)
      {
        protocol: 'http',
        hostname: '**',
        pathname: '/**',
      }
    ],
  },
  
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;