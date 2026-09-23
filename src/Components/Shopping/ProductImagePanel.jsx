import React from 'react';
import Image from 'next/image';
import { getImageUrl } from '../../config/api';
import { isRemoteImageSource } from '../../config/ImageLoader';

const ProductImagePanel = ({ image, images = [], alt }) => {
  const gallery = images.length ? images : [image].filter(Boolean);
  const resolvedImages = gallery.map(getImageUrl);
  const [selectedImage, setSelectedImage] = React.useState(0);
  const touchStartX = React.useRef(null);
  const activeImageIndex = Math.min(selectedImage, Math.max(resolvedImages.length - 1, 0));
  const resolvedImage = resolvedImages[activeImageIndex] || getImageUrl(null);
  const useUnoptimizedImage = isRemoteImageSource(resolvedImage);

  const showPreviousImage = () => {
    setSelectedImage(current => (activeImageIndex === 0 ? resolvedImages.length - 1 : current - 1));
  };

  const showNextImage = () => {
    setSelectedImage(current => (current + 1) % resolvedImages.length);
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null || resolvedImages.length < 2) return;

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const distance = touchEndX - touchStartX.current;
    if (Math.abs(distance) > 40) {
      if (distance < 0) showNextImage();
      else showPreviousImage();
    }
    touchStartX.current = null;
  };

  return (
    <div className="w-full">
      <div
        className="relative w-full h-[400px] lg:h-[550px] min-h-[300px] overflow-hidden rounded-[2.5rem] bg-(--surface-alt) border border-(--border) group shadow-sm touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={resolvedImage}
          alt={alt || 'Product Image'}
          fill
          sizes="(max-w-7xl) 50vw, 100vw"
          priority
          unoptimized={useUnoptimizedImage}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-60 pointer-events-none" />
        {resolvedImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPreviousImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/45 text-white text-2xl leading-none opacity-80 transition-opacity hover:opacity-100"
              aria-label="Show previous product image"
            >
              &#8249;
            </button>
            <button
              type="button"
              onClick={showNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/45 text-white text-2xl leading-none opacity-80 transition-opacity hover:opacity-100"
              aria-label="Show next product image"
            >
              &#8250;
            </button>
          </>
        )}
      </div>

      {resolvedImages.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 touch-pan-x" aria-label="Product image previews">
          {resolvedImages.map((thumbnail, index) => (
            <button
              key={`${thumbnail}-${index}`}
              type="button"
              onClick={() => setSelectedImage(index)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-white ${activeImageIndex === index ? 'border-indigo-500' : 'border-(--border)'}`}
              aria-label={`View product image ${index + 1}`}
            >
              <Image src={thumbnail} alt="" fill sizes="56px" className="object-cover" unoptimized={isRemoteImageSource(thumbnail)} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImagePanel;
