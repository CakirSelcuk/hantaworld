import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

const adsenseClientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;
const shouldLoadAdsense = process.env.NODE_ENV === 'production' && Boolean(adsenseClientId);

export const metadata: Metadata = {
  metadataBase: new URL('https://www.hantaworld.com'),
  title: {
    default: 'HantaWorld - Global Hantavirus Intelligence Platform',
    template: '%s | HantaWorld',
  },
  description:
    'Source-attributed global hantavirus outbreak tracking, intelligence feeds, interactive maps, and public health data for researchers and public health professionals.',
  keywords: [
    'hantavirus',
    'outbreak tracking',
    'global health intelligence',
    'disease surveillance',
    'public health',
    'epidemiology',
  ],
  authors: [{ name: 'HantaWorld Intelligence Team' }],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.hantaworld.com' },
  openGraph: {
    type: 'website',
    siteName: 'HantaWorld',
    title: 'HantaWorld - Global Hantavirus Intelligence Platform',
    description: 'Source-attributed global hantavirus outbreak tracking and public health intelligence.',
    url: 'https://www.hantaworld.com',
    images: [{ url: '/hantaLogo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HantaWorld - Global Hantavirus Intelligence',
    description: 'Source-attributed global hantavirus outbreak tracking.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="pyY1SlYkOScmKbeeS8Ny0mPpJlUoC4rJLff15vHFV3Y" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-YWFWWGVBX0" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YWFWWGVBX0');
          `}
        </Script>
        {shouldLoadAdsense && (
          <Script
            id="google-adsense-auto-ads"
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'HantaWorld',
              url: 'https://hantaworld.com',
              description: 'Global hantavirus outbreak intelligence platform',
              logo: 'https://hantaworld.com/hantaLogo.png',
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
