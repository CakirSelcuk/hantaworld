import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://hantaworld.com'),
  title: {
    default: 'HantaWorld - Global Hantavirus Intelligence Platform',
    template: '%s | HantaWorld',
  },
  description:
    'Real-time global hantavirus outbreak tracking, verified intelligence feeds, interactive maps, and scientific data trusted by researchers and public health professionals worldwide.',
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
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'HantaWorld',
    title: 'HantaWorld - Global Hantavirus Intelligence Platform',
    description: 'Real-time global hantavirus outbreak tracking and verified intelligence.',
    url: 'https://hantaworld.com',
    images: [{ url: '/hantaLogo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HantaWorld - Global Hantavirus Intelligence',
    description: 'Real-time global hantavirus outbreak tracking.',
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
