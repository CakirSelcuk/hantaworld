import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const PAGE_URL = 'https://www.hantaworld.com/andes-virus';

export const metadata: Metadata = {
  title: 'Andes Virus: Person-to-Person Hantavirus Transmission and Outbreak Context',
  description:
    'Verified English-language overview of Andes virus, the hantavirus known for documented limited person-to-person transmission.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Andes Virus: Person-to-Person Hantavirus Transmission',
    description: 'Verified Andes virus overview and outbreak context from HantaWorld.',
    url: PAGE_URL,
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MedicalWebPage',
  name: 'Andes virus',
  url: PAGE_URL,
  description:
    'A verified overview of Andes virus, a hantavirus associated with severe respiratory disease and documented limited person-to-person transmission.',
  publisher: {
    '@type': 'Organization',
    name: 'HantaWorld',
    url: 'https://www.hantaworld.com',
    logo: 'https://www.hantaworld.com/hantaLogo.png',
  },
  about: {
    '@type': 'MedicalCondition',
    name: 'Andes virus infection',
  },
  citation: [
    'https://www.cdc.gov/hantavirus/about/andesvirus.html',
    'https://www.cdc.gov/hantavirus/php/emergency-guidance/index.html',
    'https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON600',
  ],
};

export default function AndesVirusPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: '100vh' }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <section style={{ padding: '4rem 1.5rem 2rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="container-main" style={{ maxWidth: 900 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#93c5fd', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Andes Virus
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', lineHeight: 1.1, marginTop: '1rem', marginBottom: '1rem' }}>
              Andes virus: the hantavirus known for limited person-to-person spread
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8, maxWidth: 760 }}>
              Andes virus is a hantavirus found in South America. It is important in outbreak intelligence because it is the hantavirus with documented person-to-person transmission under close-contact conditions.
            </p>
          </div>
        </section>

        <section className="container-main" style={{ maxWidth: 900, padding: '3rem 1.5rem', display: 'grid', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', marginBottom: '0.75rem' }}>Why Andes virus matters</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Most hantaviruses are not known to spread from person to person. Andes virus is the key exception cited by public health authorities, making confirmed Andes virus events especially important for contact tracing and monitoring.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', marginBottom: '0.75rem' }}>Transmission context</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Rodent exposure remains central to hantavirus prevention, but Andes virus events require additional attention to close contacts, shared environments and travel-linked exposure histories.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', marginBottom: '0.75rem' }}>Outbreak monitoring</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              HantaWorld tracks verified Andes virus reports alongside other hantavirus intelligence, separating confirmed cases from monitored contacts and suspected reports.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/hantavirus" style={{ color: 'var(--color-brand)', fontFamily: 'var(--font-ui)', fontWeight: 600, textDecoration: 'none' }}>
              Hantavirus overview
            </Link>
            <Link href="/hantavirus-symptoms" style={{ color: 'var(--color-brand)', fontFamily: 'var(--font-ui)', fontWeight: 600, textDecoration: 'none' }}>
              Hantavirus symptoms
            </Link>
            <Link href="/map" style={{ color: 'var(--color-brand)', fontFamily: 'var(--font-ui)', fontWeight: 600, textDecoration: 'none' }}>
              Live outbreak map
            </Link>
          </div>

          <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.7, borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
            Sources: <a href="https://www.cdc.gov/hantavirus/about/andesvirus.html" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>CDC Andes Virus</a>, <a href="https://www.cdc.gov/hantavirus/php/emergency-guidance/index.html" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>CDC Andes Virus Guidance</a>, <a href="https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON600" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>WHO Disease Outbreak News</a>.
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
