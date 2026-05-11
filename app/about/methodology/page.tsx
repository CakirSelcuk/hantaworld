import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ShieldCheck, Scale, Search, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Transparency & Methodology | HantaWorld',
  description: 'Our data verification processes, editorial principles, and anti-misinformation policies. Discover how HantaWorld ensures the highest standards of scientific accuracy.',
};

export default function MethodologyPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--bg-primary)' }}>
        
        {/* Top Navigation Bar */}
        <div style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', position: 'sticky', top: 64, zIndex: 10 }}>
          <div className="container-main" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/about" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}>
              <ArrowLeft size={14} /> Back to About
            </Link>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              Data Integrity Guidelines
            </span>
          </div>
        </div>

        {/* Header */}
        <div style={{ padding: '4rem 1.5rem 3rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="container-main" style={{ maxWidth: 840 }}>
            <span style={{ display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#86efac', letterSpacing: '0.1em', marginBottom: '1rem', padding: '0.3rem 0.8rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '4px' }}>
              PUBLIC TRUST DOCUMENT
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '1.25rem', lineHeight: 1.1 }}>
              Transparency & Methodology
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: 700 }}>
              HantaWorld is committed to the highest standards of epidemiological accuracy and public transparency. This document details how we source, verify, and publish hantavirus outbreak data.
            </p>
          </div>
        </div>

        <div className="container-main" style={{ padding: '4rem 1.5rem', maxWidth: 840 }}>
          
          {/* Medical Disclaimer Alert */}
          <div style={{ padding: '1.5rem', background: 'rgba(249,115,22,0.05)', borderLeft: '4px solid #f97316', borderRadius: '0 8px 8px 0', marginBottom: '4rem' }}>
            <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '1rem', color: '#fdba74', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <AlertTriangle size={18} /> Medical Disclaimer
            </h3>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
              HantaWorld is a data aggregation and intelligence platform, not a medical authority. The information provided here does not constitute medical advice, diagnosis, or treatment. Always consult a licensed healthcare professional or your national health ministry for personal medical decisions and travel safety guidelines.
            </p>
          </div>

          <div style={{ display: 'grid', gap: '4rem' }}>
            
            {/* Section 1: Verification */}
            <section>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldCheck size={24} color="var(--color-brand)" /> Data Sourcing & Verification
              </h2>
              <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
                <p style={{ marginBottom: '1rem' }}>
                  Our strict &quot;Zero-Fake-Data&quot; policy dictates that no statistic, case count, or geographic marker is published on HantaWorld without verification from recognized public health institutions. We do not use predictive modeling to estimate case counts; we report exactly what authorities confirm.
                </p>
                <p style={{ marginBottom: '1rem' }}>We solely rely on primary reports from:</p>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li><strong>World Health Organization (WHO):</strong> Disease Outbreak News (DON) and regional updates.</li>
                  <li><strong>Centers for Disease Control and Prevention (CDC):</strong> Health Alert Network (HAN) and MMWR publications.</li>
                  <li><strong>European Centre for Disease Prevention and Control (ECDC):</strong> Communicable disease threats reports.</li>
                  <li><strong>National Ministries of Health:</strong> Direct press releases and epidemiological bulletins from sovereign health departments.</li>
                </ul>
                <p>
                  <strong>Evolving Numbers:</strong> Epidemiological investigations are dynamic. Initial reports often change as laboratory results confirm or rule out suspected cases. We document these revisions in the <em>Verification Notes</em> attached to each outbreak profile, ensuring full historical traceability.
                </p>
              </div>
            </section>

            {/* Section 2: Statuses */}
            <section>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Search size={24} color="var(--color-brand)" /> Taxonomy of Statuses
              </h2>
              <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
                <p style={{ marginBottom: '1.5rem' }}>To maintain scientific clarity, we classify outbreak intelligence into specific statuses:</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                      <h4 style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Confirmed</h4>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>Pathogen presence (e.g., Sin Nombre, Andes, Puumala) has been laboratory-confirmed by an official reference laboratory via PCR or serology.</p>
                  </div>
                  
                  <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#f97316' }} />
                      <h4 style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Suspected</h4>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>Patients present clinical symptoms consistent with Hantavirus Pulmonary Syndrome (HPS) or Hemorrhagic Fever with Renal Syndrome (HFRS), and an epidemiological link is likely, but laboratory confirmation is pending.</p>
                  </div>

                  <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#eab308' }} />
                      <h4 style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Monitoring</h4>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>Authorities are observing environmental precursors (e.g., unprecedented rodent population surges) or non-specific clinical clusters before declaring a formal outbreak.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Confidence & Editorial */}
            <section>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Scale size={24} color="var(--color-brand)" /> Editorial & Anti-Misinformation Policy
              </h2>
              <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
                <p style={{ marginBottom: '1.5rem' }}>
                  During public health events, misinformation spreads rapidly. HantaWorld acts as a firewall against epidemiological rumors.
                </p>
                <div style={{ paddingLeft: '1.25rem', borderLeft: '2px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <h4 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', marginBottom: '0.25rem' }}>Confidence Scores</h4>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>Every report is assigned a Confidence Score (0-100). A score of 95+ requires direct citation from a global health authority (WHO/CDC). Data lacking primary source corroboration is categorically rejected from our platform.</p>
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', marginBottom: '0.25rem' }}>Social Media Exclusion</h4>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>Unverified crowdsourced data, social media speculation, and uncorroborated news reports are strictly excluded from our databases to prevent the amplification of public panic.</p>
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', marginBottom: '0.25rem' }}>Editorial Neutrality</h4>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>Our summaries are written with scientific detachment. We do not use sensational language, speculative forecasting, or fear-inducing rhetoric. Our duty is to present the facts as determined by the scientific community.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Timestamps */}
            <section>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Clock size={24} color="var(--color-brand)" /> Update Methodology
              </h2>
              <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
                <p>
                  Timeliness is crucial, but accuracy supersedes speed. Data points on our platform feature two distinct timestamps:
                </p>
                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li><strong>Publication Date:</strong> The exact date the official source (e.g., WHO DON) released the information to the public.</li>
                  <li><strong>Last Verified Date:</strong> The time our editorial team or automated systems last checked the primary source to confirm the figures remain accurate and un-retracted.</li>
                </ul>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
