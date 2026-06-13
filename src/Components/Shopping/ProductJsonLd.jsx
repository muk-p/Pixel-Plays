import React from 'react';

export default function ProductJsonLd({ product, imageUrl, productUrl }) {
  if (!product) return null;

  const description = product.description || `${product.name} available from GadgetFinds in Kenya.`;
  const price = Number(product.price || 0);
  const stockStatus = product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: imageUrl,
    description,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'GadgetFinds',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'KES',
      price,
      availability: stockStatus,
      url: productUrl,
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <script
      id="product-json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
