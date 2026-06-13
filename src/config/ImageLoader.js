// config/imageLoader.js
export default function localImageLoader({ src, width, quality }) {
  // If the image path is already a full absolute URL, return it directly
  if (src.startsWith('http')) {
    return src;
  }
  
  // Otherwise, point it explicitly to your local Node backend port
  const backendBase = 'http://localhost:5000';
  return `${backendBase}${src.startsWith('/') ? src : '/' + src}`;
}
