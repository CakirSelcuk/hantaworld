import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Shield, Activity, Users, Database } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About | HantaWorld Intelligence',
  description: 'HantaWorld is an independent outbreak intelligence platform dedicated to real-time surveillance of hantavirus clusters worldwide.',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--bg-primary)' }}>
        
        {/* Header */}
        <div style={{ padding: '4rem 1.5rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'center' }}>
          <div className="container-main" style={{ maxWidth: 800 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '1rem' }}>
              About HantaWorld
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
              HantaWorld is an independent, non-profit intelligence platform dedicated to the real-time surveillance, aggregation, and analysis of hantavirus outbreaks worldwide.
            </p>
          </div>
        </div>

        <div className="container-main" style={{ padding: '4rem 1.5rem', maxWidth: 800 }}>
          
          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Our Mission</h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
              In an era where zoonotic spillovers pose an increasing threat to global public health, rapid access to verified epidemiological data is critical. Our mission is to bridge the gap between complex health ministry reports and actionable intelligence for researchers, public health officials, and the general public.
            </p>
          </section>

          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2rem' }}>Core Principles</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <Shield size={24} color="#60a5fa" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Strict Verification</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>We only publish data corroborated by primary sources such as the WHO, CDC, ECDC, or national health ministries.</p>
              </div>
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <Activity size={24} color="#ef4444" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Real-time Surveillance</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>Our systems continuously monitor epidemiological chatter and official registries to identify outbreak clusters early.</p>
              </div>
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <Database size={24} color="#eab308" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Data Transparency</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>Every statistic and report on HantaWorld includes a direct citation to the primary source material.</p>
              </div>
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <Users size={24} color="#8b5cf6" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Public Accessibility</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>We believe critical health intelligence should not be paywalled. HantaWorld is and will remain free to access.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Methodology</h2>
            <div style={{ padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
              <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Our intelligence pipeline relies on a combination of automated aggregation from open-source intelligence (OSINT) and manual editorial review. When a new cluster is detected:
              </p>
              <ul style={{ paddingLeft: '1.5rem', fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                <li style={{ marginBottom: '0.5rem' }}>It is immediately flagged as <strong>UNVERIFIED</strong> or <strong>SUSPECTED</strong>.</li>
                <li style={{ marginBottom: '0.5rem' }}>Our team cross-references the report with local health authority dispatches.</li>
                <li style={{ marginBottom: '0.5rem' }}>Once officially acknowledged, the status is upgraded to <strong>CONFIRMED</strong> with a <strong>VERIFIED</strong> badge.</li>
              </ul>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
