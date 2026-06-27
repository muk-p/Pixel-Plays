export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pixelplays.co.ke';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/cart', 
          '/checkout', 
          '/api', 
          '/manager', 
          '/login', 
          '/signup'
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
