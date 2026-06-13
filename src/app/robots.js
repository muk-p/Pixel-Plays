export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['/cart', '/checkout', '/api', '/manager', '/login', '/signup'],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://4w26504b-3000.inc1.devtunnels.ms'}/sitemap.xml`,
  };
}
