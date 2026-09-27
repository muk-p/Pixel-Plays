const stripHtml = (value, maxLength) => String(value ?? '')
  .replace(/<[^>]*>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, maxLength);

const escapeXml = (value) => String(value ?? '')
  .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const trimTrailingSlashes = (value) => value.replace(/\/+$/, '');

const absoluteUrl = (baseUrl, path) => {
  try {
    return new URL(String(path).replace(/^\/+/, ''), `${trimTrailingSlashes(baseUrl)}/`).toString();
  } catch {
    return null;
  }
};

export async function GET() {
  const backendUrl = process.env.PUBLIC_BACKEND_URL
    || process.env.BACKEND_URL
    || process.env.NEXT_PUBLIC_API_URL;

  if (!backendUrl) {
    return new Response('Product feed backend is not configured', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const siteUrl = trimTrailingSlashes(
    process.env.NEXT_PUBLIC_APP_URL || process.env.PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'https://pixelplays.co.ke'
  );

  try {
    const response = await fetch(new URL('/api/shopping/products/merchant-feed-data', backendUrl), {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Product service returned ${response.status}`);
    }

    const data = await response.json();
    const products = Array.isArray(data) ? data : data.products || [];
    const items = products.flatMap((product) => {
      const slug = String(product.slug ?? '').trim();
      const title = stripHtml(product.name, 150);
      const priceText = String(product.price ?? '').trim();
      const price = Number(priceText);
      const imageUrl = product.image_url ? absoluteUrl(backendUrl, product.image_url) : null;

      if (!slug || !title || !imageUrl || !priceText || !Number.isFinite(price) || price <= 0) {
        return [];
      }

      const link = `${siteUrl}/product/${encodeURIComponent(slug)}`;
      const description = stripHtml(product.description, 5000);
      const id = product.sku || product.id || slug;
      const brand = stripHtml(product.brand || 'Pixel-Plays', 150);
      const availability = Number(product.stock) > 0 ? 'in_stock' : 'out_of_stock';

      return [`    <item>
      <g:id>${escapeXml(id)}</g:id>
      <g:title>${escapeXml(title)}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:price>${price.toFixed(2)} KES</g:price>
      <g:condition>new</g:condition>
      <g:brand>${escapeXml(brand)}</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
    </item>`];
    }).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Pixel-Plays Products</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>Google Merchant Center Feed for Pixel-Plays</description>
${items}
  </channel>
</rss>`;

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Merchant product feed generation failed:', error);
    return new Response('Unable to generate product feed', {
      status: 502,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}