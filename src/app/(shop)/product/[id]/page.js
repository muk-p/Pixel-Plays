import { notFound } from 'next/navigation';
import { API_BASE_URL } from '@/config/api';
import ProductPageClient from './ProductPageClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://4w26504b-3000.inc1.devtunnels.ms';

async function getProduct(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/shopping/products/${id}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Failed to load product for SEO:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found | GadgetFinds',
      description: 'The requested product could not be found.',
    };
  }

  const description =
    product.description || `Buy ${product.name} in Kenya from GadgetFinds with fast delivery.`;
  const imageUrl = product.image_url
    ? `${API_BASE_URL}${product.image_url}`
    : `${API_BASE_URL}/uploads/default-product.png`;

  return {
    title: `${product.name} | GadgetFinds`,
    description,
    keywords: [product.name, product.brand, 'gaming products kenya', 'gadgetfinds'],
    alternates: {
      canonical: `/product/${product.id}`,
    },
    openGraph: {
      title: `${product.name} | GadgetFinds`,
      description,
      type: 'website',
      url: `${siteUrl}/product/${product.id}`,
      images: [{ url: imageUrl, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | GadgetFinds`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image_url ? `${API_BASE_URL}${product.image_url}` : `${API_BASE_URL}/uploads/default-product.png`,
    description: product.description || `Shop ${product.name} at GadgetFinds in Kenya.`,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'GadgetFinds',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'KES',
      price: product.price || 0,
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/product/${product.id}`,
      seller: {
        '@type': 'Organization',
        name: 'GadgetFinds',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductPageClient product={product} />
    </>
  );
}
