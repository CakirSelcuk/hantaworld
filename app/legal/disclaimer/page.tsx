import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Medical Disclaimer | HantaWorld',
  robots: { index: false },
};

export default function DisclaimerPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div className="container-main" style={{ padding: '4rem 1.5rem', maxWidth: 800 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <AlertCircle size={32} color="#ef4444" />
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Medical Disclaimer</h1>
          </div>
          
          <div style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
            <p style={{ marginBottom: '1.5rem', fontWeight: 500, color: 'var(--text-primary)' }}>
              The information provided on HantaWorld is for intelligence, research, and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.
            </p>
            <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>No Medical Advice</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this platform.
            </p>
            <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>Data Accuracy</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              While we strive to provide accurate and up-to-date intelligence sourced from official health ministries and organizations (such as the WHO and CDC), epidemiological data is subject to rapid change. We do not guarantee the absolute accuracy, completeness, or timeliness of the information.
            </p>
            <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>Emergency Situations</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              If you think you may have a medical emergency or have been exposed to a hantavirus, call your doctor or local emergency services immediately.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
