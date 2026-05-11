'use client';
import { useState } from 'react';
import { Bell, CheckCircle, Loader2, Mail } from 'lucide-react';

export default function AlertSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !email.includes('@')) return;
    setStatus('loading');
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setStatus('success');
  };

  return (
    <section style={{ padding: '3rem 0' }}>
      <div className="container-main">
        <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(239,68,68,0.06) 100%)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 'var(--radius-2xl)', padding: 'clamp(2rem,5vw,3.5rem)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: '9px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bell size={17} color="#fca5a5" />
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.12em', color: 'var(--color-brand)', textTransform: 'uppercase' }}>
                Outbreak Alert System
              </span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: '0.85rem' }}>
              Get Real-Time
              <br />
              <span className="gradient-text-red">Outbreak Alerts</span>
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Subscribe to verified alerts for new outbreak detections, death spikes, travel advisories, and scientific reports delivered directly to your inbox.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['New confirmed outbreaks worldwide', 'Death toll milestones and spikes', 'CDC and WHO travel advisory changes', 'Weekly intelligence briefing'].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={13} color="#86efac" />
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <CheckCircle size={24} color="#86efac" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Subscription Confirmed</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.6 }}>
                  You&apos;ll receive real-time alerts for verified outbreak events. Check your inbox for a confirmation email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-xl)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@organization.com" required style={{ paddingLeft: '2.25rem' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Alert Frequency
                    </label>
                    <select style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', padding: '0.625rem 1rem', outline: 'none' }}>
                      <option>Real-time (immediate)</option>
                      <option>Daily digest</option>
                      <option>Weekly briefing</option>
                    </select>
                  </div>

                  <button type="submit" disabled={status === 'loading'} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                    {status === 'loading' ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Subscribing...</> : <><Bell size={15} /> Subscribe to Alerts</>}
                  </button>

                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
                    No spam. Unsubscribe anytime. Alerts sourced from WHO, CDC, and ECDC only.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </section>
  );
}
