import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Get raw environment variables with hardcoded safe production fallbacks
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://railway.app';
const rawHostname = process.env.NEXT_PUBLIC_API_HOSTNAME || 'backend-production-9c30.up.railway.app';

// 2. SANITIZATION LAYER: Safely strips trailing slashes to prevent broken double slashes (//api) in your code
const BACKEND_URL = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;
const BACKEND_HOSTNAME = rawHostname.replace(/^https?:\/\//, '').split('/')[0];

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname, 
  
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      // Clean, dynamic server production image pattern
      {
        protocol: 'https',
        hostname: BACKEND_HOSTNAME,
        pathname: '/**', 
      },
      // Local development asset loading backup
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**', 
      },
    ],
  },
  
  // Proxies frontend request traffic safely from /api over to your true Railway database server
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
