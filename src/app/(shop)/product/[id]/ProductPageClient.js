"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/Context/CartContext';
import { getImageUrl } from '@/config/api';
import { formatCurrency } from '@/Components/Shopping/productHelpers';
import ProductImagePanel from '@/Components/Shopping/ProductImagePanel';
import ProductOverview from '@/Components/Shopping/ProductOverview';
import ProductSpecsBlock from '@/Components/Shopping/ProductSpecsBlock';

export default function ProductPageClient({ product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const displayImage = product ? getImageUrl(product.image_url) : '';
  const features =
    typeof product?.features === 'string'
      ? JSON.parse(product.features || '[]')
      : product?.features || [];
  const specs =
    typeof product?.specs === 'string'
      ? JSON.parse(product.specs || '{}')
      : product?.specs || {};

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-indigo-600">
          Store
        </Link>{' '}/
        <span className="ml-2 text-gray-900 font-semibold">{product.brand}</span>
      </div>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 pb-20">
        <ProductImagePanel image={displayImage} alt={product.name} />

        <div className="flex flex-col">
          <ProductOverview
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
            handleAddToCart={handleAddToCart}
            formatCurrency={formatCurrency}
          />

          <ProductSpecsBlock features={features} specs={specs} />
        </div>
      </main>
    </div>
  );
}
