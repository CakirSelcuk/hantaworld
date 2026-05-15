import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const PAGE_URL = 'https://www.hantaworld.com/hantavirus-symptoms';

export const metadata: Metadata = {
  title: 'Hantavirus Symptoms: Early Signs, Severe Disease and When to Seek Care',
  description:
    'Learn the verified early and severe symptoms associated with hantavirus infection, including respiratory warning signs and public health context.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Hantavirus Symptoms: Early Signs and Severe Disease',
    description: 'Verified English-language hantavirus symptom guide from HantaWorld.',
    url: PAGE_URL,
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MedicalWebPage',
  name: 'Hantavirus symptoms',
  url: PAGE_URL,
  description: 'A verified guide to early and severe symptoms associated with hantavirus infection.',
  publisher: {
    '@type': 'Organization',
    name: 'HantaWorld',
    url: 'https://www.hantaworld.com',
    logo: 'https://www.hantaworld.com/hantaLogo.png',
  },
  about: {
    '@type': 'MedicalCondition',
    name: 'Hantavirus infection',
    signOrSymptom: [
      'Fever',
      'Muscle aches',
      'Fatigue',
      'Cough',
      'Shortness of breath',
      'Gastrointestinal symptoms',
    ],
  },
  citation: [
    'https://www.cdc.gov/hantavirus/about/',
    'https://www.cdc.gov/hantavirus/hcp/clinical-overview/hps.html',
    'https://www.who.int/news-room/fact-sheets/detail/hantavirus',
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are early hantavirus symptoms?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Early symptoms can include fever, fatigue, muscle aches, headache, dizziness, chills, and gastrointestinal symptoms such as nausea, vomiting, diarrhea, or abdominal pain.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are severe hantavirus symptoms?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Severe illness may involve coughing, shortness of breath, chest tightness, fluid in the lungs, and respiratory distress that requires urgent medical care.',
      },
    },
  ],
};

export default function HantavirusSymptomsPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: '100vh' }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

        <section style={{ padding: '4rem 1.5rem 2rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="container-main" style={{ maxWidth: 900 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#93c5fd', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Hantavirus Symptoms
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', lineHeight: 1.1, marginTop: '1rem', marginBottom: '1rem' }}>
              Hantavirus symptoms: early signs and severe respiratory disease
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8, maxWidth: 760 }}>
              Hantavirus symptoms can begin with non-specific illness and may progress quickly in severe cases. This page summarizes verified public health guidance in plain English.
            </p>
          </div>
        </section>

        <section className="container-main" style={{ maxWidth: 900, padding: '3rem 1.5rem', display: 'grid', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', marginBottom: '0.75rem' }}>Early symptoms</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Early illness may include fever, fatigue, muscle aches, headache, dizziness, chills and gastrointestinal symptoms. These signs are not specific to hantavirus, which is why exposure history and clinical evaluation matter.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', marginBottom: '0.75rem' }}>Respiratory warning signs</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Severe disease can progress to cough, shortness of breath, chest discomfort and difficulty breathing. Anyone with possible exposure and respiratory symptoms should contact a healthcare professional or local public health authority.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', marginBottom: '0.75rem' }}>Medical disclaimer</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              HantaWorld is an outbreak intelligence and public information platform. This page is not a diagnosis tool and does not replace medical advice.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/hantavirus" style={{ color: 'var(--color-brand)', fontFamily: 'var(--font-ui)', fontWeight: 600, textDecoration: 'none' }}>
              What is hantavirus?
            </Link>
            <Link href="/andes-virus" style={{ color: 'var(--color-brand)', fontFamily: 'var(--font-ui)', fontWeight: 600, textDecoration: 'none' }}>
              Andes virus transmission
            </Link>
            <Link href="/news" style={{ color: 'var(--color-brand)', fontFamily: 'var(--font-ui)', fontWeight: 600, textDecoration: 'none' }}>
              Latest verified reports
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
