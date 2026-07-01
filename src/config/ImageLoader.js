// config/imageLoader.js
export const isRemoteImageSource = (src) => {
  if (!src || typeof src !== 'string') return false;
  return /^(https?:)?\/\//i.test(src) || src.startsWith('blob:') || src.startsWith('data:');
};

export const resolveImageSrc = (src) => {
  if (!src || typeof src !== 'string') {
    return 'https://placehold.co/600x400?text=No+Image';
  }

  if (isRemoteImageSource(src)) {
    return src;
  }

  const backendBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  return `${backendBase}${src.startsWith('/') ? src : '/' + src}`;
};

export default function localImageLoader({ src }) {
  return resolveImageSrc(src);
}
