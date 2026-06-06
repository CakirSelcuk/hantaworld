import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

const adsenseClientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;
const shouldLoadAdsense = process.env.NODE_ENV === 'production' && Boolean(adsenseClientId);

export const metadata: Metadata = {
  metadataBase: new URL('https://www.hantaworld.com'),
  title: {
    default: 'HantaWorld | Global Outbreak & Virus Intelligence',
    template: '%s | HantaWorld',
  },
  description:
    'Verified outbreak updates, pathogen profiles, source-attributed reports, and global public health intelligence from trusted official sources.',
  keywords: [
    'outbreak intelligence',
    'virus intelligence',
    'pathogen profiles',
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
    title: 'HantaWorld | Global Outbreak & Virus Intelligence',
    description: 'Verified outbreak updates, pathogen profiles, source-attributed reports, and global public health intelligence from trusted official sources.',
    url: 'https://www.hantaworld.com',
    images: [{ url: '/hantaLogo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HantaWorld | Global Outbreak & Virus Intelligence',
    description: 'Verified outbreak updates, pathogen profiles, and source-attributed public health intelligence.',
    images: ['/hantaLogo.png'],
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
              url: 'https://www.hantaworld.com',
              description: 'Global outbreak and virus intelligence platform with source-attributed public health updates.',
              logo: 'https://www.hantaworld.com/hantaLogo.png',
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
