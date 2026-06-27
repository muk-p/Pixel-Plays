import ClientAppShell from './ClientAppShell';
import './globals.css';

// Streamlined: Safe production fallback mirroring your individual page variables
const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pixelplays.co.ke';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'PixelPlays | Buy PS5, Xbox & Nintendo in Kenya',
    template: '%s | PixelPlays',
  },
  description:
    'Shop authentic PlayStation, Xbox, and Nintendo consoles plus gaming accessories in Kenya with fast door-to-door delivery and secure M-Pesa checkout.',
  keywords: [
    'gaming consoles kenya',
    'ps5 kenya',
    'xbox kenya',
    'nintendo switch kenya',
    'gaming accessories kenya',
    'controllers kenya',
    'phones kenya',
    'smart tvs nairobi'
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: siteUrl,
    siteName: 'PixelPlays',
    title: 'PixelPlays | Buy PS5, Xbox & Nintendo in Kenya',
    description:
      'Authentic consoles, accessories, and gaming gear in Kenya with fast door-to-door delivery and M-Pesa checkout.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PixelPlays gaming consoles and accessories in Kenya',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PixelPlays | Buy PS5, Xbox & Nintendo in Kenya',
    description:
      'Shop authentic consoles and accessories in Kenya with fast delivery and secure payments.',
    images: ['/og-image.png'],
    creator: '@pixelplays',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#4f46e5' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        <ClientAppShell>{children}</ClientAppShell>
      </body>
    </html>
  );
}
