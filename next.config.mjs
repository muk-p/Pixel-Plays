import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const BACKEND_HOSTNAME = process.env.NEXT_PUBLIC_API_HOSTNAME || 'localhost';

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname, 
  
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https', // Changed to https for your live server security
        hostname: BACKEND_HOSTNAME,
        pathname: '/**', 
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**', 
      },
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
