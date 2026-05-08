import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Editorial Policy | HantaWorld',
  robots: { index: false },
};

export default function EditorialPolicyPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div className="container-main" style={{ padding: '4rem 1.5rem', maxWidth: 800 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2rem' }}>Editorial Policy</h1>
          
          <div style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              HantaWorld adheres to strict editorial guidelines to ensure the intelligence we publish is accurate, objective, and actionable. Our platform serves as a critical aggregation tool, not a tabloid news outlet.
            </p>

            <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>1. Primary Source Attribution</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              Every statistic, outbreak report, and travel advisory must be linked to a primary, authoritative source. Acceptable primary sources include the World Health Organization (WHO), Centers for Disease Control and Prevention (CDC), European Centre for Disease Prevention and Control (ECDC), and official national health ministries.
            </p>

            <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>2. Verification Standards</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              We utilize a strict verification badge system. Reports gathered from OSINT (Open Source Intelligence) or localized media are marked as <strong>UNVERIFIED</strong> or <strong>PENDING</strong> until corroborated by a primary health authority, at which point they are upgraded to <strong>VERIFIED</strong>.
            </p>

            <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>3. Neutral Tone and Clarity</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              Our content must remain objective and data-driven. We strictly prohibit sensationalism, fearmongering language, or speculative conclusions regarding transmission vectors or outbreak severity.
            </p>

            <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>4. Corrections</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              If epidemiological data is revised by health authorities (e.g., a suspected case is reclassified as negative), our records are immediately updated to reflect the correction, and the "Last Updated" timestamp is refreshed.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
