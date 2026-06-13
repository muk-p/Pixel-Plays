import { API_BASE_URL } from '@/config/api';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://4w26504b-3000.inc1.devtunnels.ms';

async function getProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/shopping/products?limit=100`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) return [];

    const data = await response.json();
    return Array.isArray(data.products) ? data.products : [];
  } catch (error) {
    console.error('Sitemap fetch failed:', error);
    return [];
  }
}

export default async function sitemap() {
  const products = await getProducts();

  const productEntries = products.map((product) => ({
    url: `${siteUrl}/product/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...productEntries,
  ];
}
