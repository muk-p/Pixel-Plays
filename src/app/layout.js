import ClientAppShell from './ClientAppShell';
import './globals.css';

// Fixed: Falls back to local localhost address if environment variable isn't set yet
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'PixelPlays | Buy PS5, Xbox & Nintendo in Kenya',
    template: '%s | PixelPlayss',
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
        url: '/og-image.png', // Best practice: OpenGraph images should be 1200x630 (not your tiny favicon)
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
    creator: '@gadgetfinds',
  },
  icons: {
    icon: '/2.png',
    shortcut: '/2.png',
    apple: '/2.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#4f46e5' }, // Matching your indigo brand theme color
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
