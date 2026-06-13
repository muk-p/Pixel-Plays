import React from 'react';

const ProductImagePanel = ({ image, alt }) => {
  return (
    <div className="relative w-full h-[400px] lg:h-full min-h-[300px] overflow-hidden rounded-[2.5rem] bg-(--surface-alt) border border-(--border) group">
      <img
        src={image}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60 pointer-events-none" />
    </div>
  );
};

export default ProductImagePanel;
