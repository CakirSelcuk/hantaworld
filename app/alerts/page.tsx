import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, Bell, CheckCircle, Shield, Mail, Phone, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Outbreak Alerts',
  description: 'Subscribe to verified real-time hantavirus outbreak alerts, travel advisories, and scientific briefings.',
};

export default function AlertsPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--bg-primary)' }}>
        
        <div style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', position: 'sticky', top: 64, zIndex: 10 }}>
          <div className="container-main" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}>
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="container-main" style={{ padding: '4rem 1.5rem', maxWidth: 1000 }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '16px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', marginBottom: '1.5rem' }}>
              <Bell size={28} color="#60a5fa" />
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Intelligence Alerts
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
              Configure your intelligence briefing preferences. Receive critical outbreak updates directly to your inbox or secure messaging channels.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            
            {/* Preferences Form */}
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2rem' }}>
                Subscription Preferences
              </h2>
              
              <form>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  {/* Delivery Channel */}
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Delivery Channel</label>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', border: '1px solid var(--color-brand)', background: 'rgba(59,130,246,0.1)', borderRadius: '8px', cursor: 'pointer' }}>
                        <input type="radio" name="channel" value="email" defaultChecked style={{ accentColor: 'var(--color-brand)' }} />
                        <Mail size={18} color="var(--color-brand)" />
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Secure Email</span>
                      </label>
                      <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', border: '1px solid var(--border-glass)', background: 'var(--bg-tertiary)', borderRadius: '8px', cursor: 'not-allowed', opacity: 0.6 }}>
                        <input type="radio" name="channel" value="sms" disabled />
                        <Phone size={18} color="var(--text-muted)" />
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>SMS (Enterprise Only)</span>
                      </label>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Email Address</label>
                    <input type="email" placeholder="you@organization.com" style={{ width: '100%', padding: '0.85rem 1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '1rem', outline: 'none' }} />
                  </div>

                  {/* Alert Types */}
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Intelligence Categories</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {[
                        { id: 't1', label: 'Critical Outbreak Alerts', desc: 'Immediate notification of confirmed new clusters or high mortality events.' },
                        { id: 't2', label: 'Travel Advisories', desc: 'CDC, WHO, and local health ministry travel restrictions.' },
                        { id: 't3', label: 'Scientific Briefings', desc: 'Weekly summaries of newly published peer-reviewed research.' },
                        { id: 't4', label: 'Daily Data Digest', desc: 'End-of-day statistical summary of global case counts.' },
                      ].map(t => (
                        <label key={t.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                          <input type="checkbox" defaultChecked={t.id === 't1' || t.id === 't2'} style={{ marginTop: '0.25rem', accentColor: 'var(--color-brand)' }} />
                          <div>
                            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500, marginBottom: '0.2rem' }}>{t.label}</div>
                            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button type="button" className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}>
                    Save Preferences
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <Lock size={12} color="var(--text-muted)" />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>Your data is encrypted and never shared.</span>
                  </div>
                </div>
              </form>
            </div>

            {/* Info Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, transparent 100%)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '16px', padding: '2rem' }}>
                <Shield size={24} color="#4ade80" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Verified Sources Only</h3>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  HantaWorld alerts are strictly curated. We only push notifications based on data verified by official health ministries, WHO, CDC, ECDC, or prominent research institutions.
                </p>
              </div>

              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: '16px', padding: '2rem' }}>
                <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>Enterprise Features</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    'API Webhook Integration',
                    'SMS / PagerDuty Routing',
                    'Custom Regional Filters',
                    'Advanced Threat Intelligence'
                  ].map(feature => (
                    <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <CheckCircle size={16} color="var(--text-muted)" />
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', padding: '0.6rem 1rem', borderRadius: '6px', fontSize: '0.8rem', fontFamily: 'var(--font-ui)', marginTop: '1.5rem', cursor: 'pointer', width: '100%' }}>
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
