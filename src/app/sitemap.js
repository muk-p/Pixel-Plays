import { API_BASE_URL } from '@/config/api';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pixelplays.co.ke';

  // 1. Only your true public homepage (excluding private /manager dashboards)
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

  // 2. Dynamic Fetch: Store Products
  try {
    const response = await fetch(`${API_BASE_URL}/api/shopping/products`, { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      const products = Array.isArray(data) ? data : (data.products || []);

      productRoutes = products.map((product) => ({
        url: `${baseUrl}/product/${product.id}`,
        lastModified: new Date(product.updated_at || product.updatedAt || Date.now()),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error("Sitemap product fetch error:", error);
  }

  // 3. Dynamic Fetch: Gaming Codes / Digital Keys
  try {
    // Syncs with your /gaming-code/[id] route folder layout
    const response = await fetch(`${API_BASE_URL}/api/shopping/gaming-codes`, { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      const codes = Array.isArray(data) ? data : (data.codes || []);

      gamingCodeRoutes = codes.map((item) => ({
        url: `${baseUrl}/gaming-code/${item.id}`,
        lastModified: new Date(item.updated_at || item.updatedAt || Date.now()),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error("Sitemap gaming codes fetch error:", error);
  }

  // Combine only public pages for search visibility
  return [...staticRoutes, ...productRoutes, ...gamingCodeRoutes];
}
