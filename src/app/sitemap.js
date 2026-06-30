import { API_BASE_URL } from '@/config/api';
import https from 'https'; // 1. Import Node's native HTTPS module

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pixelplays.co.ke';

  // 2. Create an agent that ignores invalid/self-signed SSL handshake blockages
  const agent = new https.Agent({
    rejectUnauthorized: false
  });

  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  let productRoutes = [];
  let gamingCodeRoutes = [];

  // Dynamic Fetch: Store Products
  try {
    const response = await fetch(`${API_BASE_URL}/api/shopping/products`, { 
      cache: 'no-store',
      agent: agent // 3. Inject the agent directly here
    }); // Use 'as any' only if you encounter a strict TypeScript compiler warning

    if (response.ok) {
      const data = await response.json();
      const products = Array.isArray(data) ? data : (data.products || []);

      productRoutes = products.map((product) => ({
        url: `${baseUrl}/product/${product.id}`,
        lastModified: new Date(product.updated_at || product.updatedAt || Date.now()),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    } else {
      console.error(`Product API bad status: ${response.status}`);
    }
  } catch (error) {
    console.error("Sitemap product fetch error:", error);
  }

  // Dynamic Fetch: Gaming Codes / Digital Keys
  try {
    const response = await fetch(`${API_BASE_URL}/api/shopping/gaming-codes`, { 
      cache: 'no-store',
      agent: agent // 4. Inject the agent here too
    });

    if (response.ok) {
      const data = await response.json();
      const codes = Array.isArray(data) ? data : (data.codes || []);

      gamingCodeRoutes = codes.map((item) => ({
        url: `${baseUrl}/gaming-code/${item.id}`,
        lastModified: new Date(item.updated_at || item.updatedAt || Date.now()),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    } else {
      console.error(`Gaming Codes API bad status: ${response.status}`);
    }
  } catch (error) {
    console.error("Sitemap gaming codes fetch error:", error);
  }

  return [...staticRoutes, ...productRoutes, ...gamingCodeRoutes];
}
