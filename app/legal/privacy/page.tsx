import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | HantaWorld',
  robots: { index: false },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div className="container-main" style={{ padding: '4rem 1.5rem', maxWidth: 800 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2rem' }}>Privacy Policy</h1>
          <div style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
            <p style={{ marginBottom: '1.5rem' }}>Effective Date: May 2026</p>
            <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>1. Information We Collect</h2>
            <p style={{ marginBottom: '1.5rem' }}>We only collect email addresses when you explicitly opt-in to our alert service. We do not use third-party tracking cookies or sell your personal data.</p>
            <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>2. Data Usage</h2>
            <p style={{ marginBottom: '1.5rem' }}>Your email is used solely for delivering outbreak intelligence alerts based on your preferences. You may unsubscribe at any time.</p>
            <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>3. Security</h2>
            <p style={{ marginBottom: '1.5rem' }}>We employ strict security headers and encrypted connections to protect the integrity of the data and your privacy.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
