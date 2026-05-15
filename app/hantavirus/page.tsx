import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const PAGE_URL = 'https://www.hantaworld.com/hantavirus';

export const metadata: Metadata = {
  title: 'Hantavirus: Symptoms, Transmission, Prevention and Outbreak Tracking',
  description:
    'A verified English-language guide to hantavirus, including symptoms, transmission, prevention, Andes virus context, and live outbreak intelligence.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Hantavirus: Symptoms, Transmission, Prevention and Outbreak Tracking',
    description: 'Verified hantavirus information and live outbreak intelligence from HantaWorld.',
    url: PAGE_URL,
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MedicalWebPage',
  name: 'Hantavirus',
  url: PAGE_URL,
  description:
    'Verified information about hantavirus symptoms, transmission, prevention, and outbreak monitoring.',
  publisher: {
    '@type': 'Organization',
    name: 'HantaWorld',
    url: 'https://www.hantaworld.com',
    logo: 'https://www.hantaworld.com/hantaLogo.png',
  },
  about: {
    '@type': 'MedicalCondition',
    name: 'Hantavirus infection',
  },
  reviewedBy: {
    '@type': 'Organization',
    name: 'HantaWorld Intelligence Team',
  },
  citation: [
    'https://www.cdc.gov/hantavirus/about/',
    'https://www.cdc.gov/hantavirus/prevention/',
    'https://www.who.int/news-room/fact-sheets/detail/hantavirus',
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is hantavirus?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Hantaviruses are a family of viruses carried by rodents that can cause serious disease in people, including hantavirus pulmonary syndrome and hemorrhagic fever with renal syndrome.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does hantavirus spread?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most hantavirus infections are linked to contact with urine, droppings, saliva, or contaminated materials from infected rodents. Andes virus is a notable hantavirus with documented limited person-to-person transmission.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a specific treatment for hantavirus?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'There is no specific antiviral treatment for hantavirus infection. Early medical evaluation and supportive care are important, especially when respiratory symptoms develop.',
      },
    },
  ],
};

export default function HantavirusPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: '100vh' }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

        <section style={{ padding: '4rem 1.5rem 2rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="container-main" style={{ maxWidth: 900 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#93c5fd', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Hantavirus Knowledge Base
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', lineHeight: 1.1, marginTop: '1rem', marginBottom: '1rem' }}>
              Hantavirus: verified symptoms, transmission and outbreak intelligence
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8, maxWidth: 760 }}>
              HantaWorld tracks verified hantavirus outbreak information and provides plain-English context for readers, researchers and public health observers.
            </p>
          </div>
        </section>

        <section className="container-main" style={{ maxWidth: 900, padding: '3rem 1.5rem', display: 'grid', gap: '2rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>What is hantavirus?</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Hantaviruses are rodent-borne viruses that can cause severe disease in humans. In the Americas, infection may lead to hantavirus pulmonary syndrome or hantavirus cardiopulmonary syndrome; in Europe and Asia, some hantaviruses are associated with hemorrhagic fever with renal syndrome.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>How hantavirus spreads</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Most human infections are linked to exposure to infected rodents or contaminated dust, surfaces, urine, droppings, or saliva. Andes virus, found in South America, is the main hantavirus known for documented limited person-to-person transmission through close contact.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>Symptoms and prevention</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Early symptoms can include fever, muscle aches, fatigue, headache and gastrointestinal symptoms. Severe disease may progress to cough, shortness of breath and respiratory distress. Prevention focuses on reducing contact with rodents and safely cleaning areas where rodent contamination may be present.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/hantavirus-symptoms" style={{ color: 'var(--color-brand)', fontFamily: 'var(--font-ui)', fontWeight: 600, textDecoration: 'none' }}>
              Hantavirus symptoms guide
            </Link>
            <Link href="/andes-virus" style={{ color: 'var(--color-brand)', fontFamily: 'var(--font-ui)', fontWeight: 600, textDecoration: 'none' }}>
              Andes virus explained
            </Link>
            <Link href="/map" style={{ color: 'var(--color-brand)', fontFamily: 'var(--font-ui)', fontWeight: 600, textDecoration: 'none' }}>
              Live hantavirus outbreak map
            </Link>
          </div>

          <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.7, borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
            Sources: <a href="https://www.cdc.gov/hantavirus/about/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>CDC Hantavirus</a>, <a href="https://www.cdc.gov/hantavirus/prevention/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>CDC Prevention</a>, <a href="https://www.who.int/news-room/fact-sheets/detail/hantavirus" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>WHO Hantavirus Fact Sheet</a>.
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
