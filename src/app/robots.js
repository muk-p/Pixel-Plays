export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pixelplays.co.ke';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
