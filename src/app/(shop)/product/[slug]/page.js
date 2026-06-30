import { notFound } from 'next/navigation';
import { API_BASE_URL } from '@/config/api';
import ProductPageClient from './ProductPageClient';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pixelplays.co.ke';

const getProductImage = (imageUrl) => 
  imageUrl ? `${API_BASE_URL}${imageUrl}` : `${API_BASE_URL}/uploads/default-product.png`;

// Updated function parameter and fetch path targeting the express slug route
async function getProduct(slug) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/shopping/products/${slug}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) return null;
    
    const data = await response.json();
    return data?.product || null;
  } catch (error) {
    console.error('Failed to load product:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  // Destructure slug instead of id
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Pixel Plays',
      description: 'The requested product could not be found.',
    };
  }

  const description = product.description || `Buy ${product.name} in Kenya from Pixel Plays with fast delivery.`;
  const imageUrl = getProductImage(product.image_url);

  return {
    title: `${product.name} | Pixel Plays`,
    description,
    keywords: [product.name, product.brand, 'gaming products kenya', 'pixel plays'],
    // Updated canonical links and URLs to use the unique product slug string
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: `${product.name} | Pixel Plays`,
      description,
      type: 'website',
      url: `${siteUrl}/product/${product.slug}`,
      images: [{ url: imageUrl, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Pixel Plays`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }) {
  // Destructure slug instead of id
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const imageUrl = getProductImage(product.image_url);
  const productUrl = `${siteUrl}/product/${product.slug}`;

  // Streamlined, fully accurate search engine schema layout updated to use slug paths
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: imageUrl,
    description: product.description || `Shop ${product.name} at Pixel Plays in Kenya.`,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Pixel Plays',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'KES',
      price: Number(product.price || 0),
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: productUrl,
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Pixel Plays',
      },
    },
  };

  return (
    <>
      <script
        id="product-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductPageClient product={product} />
    </>
  );
}
