export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['/cart', '/checkout', '/api', '/manager', '/login', '/signup'],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://pixel-plays-iota.vercel.app' }/sitemap.xml`,
  };
}
