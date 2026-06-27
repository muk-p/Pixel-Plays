import React from 'react';
import Image from 'next/image';

const ProductImagePanel = ({ image, alt }) => {
  return (
    <div className="relative w-full h-[400px] lg:h-[550px] min-h-[300px] overflow-hidden rounded-[2.5rem] bg-(--surface-alt) border border-(--border) group shadow-sm">
      <Image
        src={image}
        alt={alt || 'Product Image'}
        fill
        sizes="(max-w-7xl) 50vw, 100vw"
        priority
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-60 pointer-events-none" />
    </div>
  );
};

export default ProductImagePanel;
