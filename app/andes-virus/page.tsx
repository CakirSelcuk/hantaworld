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

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can Andes virus spread from person to person?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Andes virus is the hantavirus known for documented person-to-person transmission, usually among people with close or prolonged contact with a sick person.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long should exposed people be monitored?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CDC guidance for Andes virus uses a 4 to 42 day symptom window after exposure, and public health monitoring may cover that full incubation period.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Andes virus the same as all hantavirus infections?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Andes virus is one hantavirus type. It is important because it can cause hantavirus pulmonary syndrome and has documented limited person-to-person spread, unlike most hantaviruses.',
      },
    },
  ],
};

export default function AndesVirusPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: '100vh' }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

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
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', marginBottom: '0.75rem' }}>Incubation and monitoring window</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              CDC guidance lists signs and symptoms of HPS due to Andes virus as appearing 4 to 42 days after exposure. This long window is why public health teams may monitor exposed passengers, household contacts or close contacts for several weeks after the last possible exposure.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', marginBottom: '0.75rem' }}>How person-to-person spread is understood</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Public health agencies describe Andes virus person-to-person transmission as limited and usually connected with close contact, prolonged time in shared enclosed spaces, direct physical contact, or exposure to body fluids from a symptomatic patient. It is not treated the same way as highly transmissible respiratory viruses.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', marginBottom: '0.75rem' }}>Public health response</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Response work focuses on rapid case confirmation, isolation and care for symptomatic patients, contact tracing, exposure classification, and active monitoring of people who shared high-risk travel, cabin, household or care settings with confirmed or probable cases.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', marginBottom: '0.75rem' }}>Outbreak monitoring</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              HantaWorld tracks verified Andes virus reports alongside other hantavirus intelligence, separating confirmed cases from monitored contacts and suspected reports.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', marginBottom: '0.75rem' }}>How HantaWorld classifies Andes virus events</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              We separate laboratory-confirmed cases, probable cases, suspected cases, inconclusive findings, deaths, monitored contacts and repatriated passengers. This prevents maps and dashboards from counting every monitored person as an infection while still showing where public health follow-up is active.
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
