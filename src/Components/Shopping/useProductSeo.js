import { useEffect } from 'react';
import { getImageUrl } from '../../config/api';

const createOrUpdateMeta = (attr, name, content) => {
  if (!content) return null;
  let element = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
  return element;
};

export const useProductSeo = (product) => {
  useEffect(() => {
    if (!product) return undefined;

    const prevTitle = document.title;
    const displayImage = getImageUrl(product.image_url);
    document.title = `${product.name} — ${product.brand} | GadgetFinds`;

    const description = (product.description || '').split('\n')[0]?.slice(0, 160);
    const metaDescription = createOrUpdateMeta('name', 'description', description);
    const metaOgTitle = createOrUpdateMeta('property', 'og:title', `${product.name} — ${product.brand}`);
    const metaOgDesc = createOrUpdateMeta('property', 'og:description', description);
    const metaOgType = createOrUpdateMeta('property', 'og:type', 'product');
    const metaOgImage = createOrUpdateMeta('property', 'og:image', displayImage);
    const metaTwitterCard = createOrUpdateMeta('name', 'twitter:card', 'summary_large_image');

    let canonicalLink = document.head.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', `${window.location.origin}/product/${product.id}`);

    const jsonLd = document.createElement('script');
    jsonLd.type = 'application/ld+json';
    jsonLd.setAttribute('data-generated', 'product-json-ld');
    jsonLd.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: displayImage,
      description: product.description || '',
      brand: { '@type': 'Brand', name: product.brand || '' },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'KES',
        price: Number(product.price),
        availability:
          product.stock > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        url: `${window.location.origin}/product/${product.id}`,
      },
    });
    document.head.appendChild(jsonLd);

    return () => {
      document.title = prevTitle;
      if (metaDescription) metaDescription.remove();
      if (metaOgTitle) metaOgTitle.remove();
      if (metaOgDesc) metaOgDesc.remove();
      if (metaOgType) metaOgType.remove();
      if (metaOgImage) metaOgImage.remove();
      if (metaTwitterCard) metaTwitterCard.remove();
      if (jsonLd) jsonLd.remove();
    };
  }, [product]);
};
