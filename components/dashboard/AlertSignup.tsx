import Link from 'next/link';
import { ArrowRight, Bell, CheckCircle, ShieldCheck } from 'lucide-react';

export default function AlertSignup() {
  return (
    <section style={{ padding: '3rem 0' }}>
      <div className="container-main">
        <div className="alert-cta-grid" style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.10) 0%, rgba(99,102,241,0.08) 100%)', border: '1px solid rgba(14,165,233,0.22)', borderRadius: 'var(--radius-2xl)', padding: 'clamp(2rem,5vw,3.5rem)', display: 'grid', gap: '2rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{ width: 38, height: 38, borderRadius: '10px', background: 'rgba(14,165,233,0.14)', border: '1px solid rgba(14,165,233,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bell size={17} color="#38bdf8" />
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.12em', color: 'var(--color-brand)', textTransform: 'uppercase' }}>
                Alert subscriptions
              </span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.45rem,3vw,2.15rem)', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: '0.85rem' }}>
              Get Outbreak Intelligence Alerts
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.75, maxWidth: 680 }}>
              Subscribe to receive source-attributed outbreak updates and weekly intelligence briefings. No spam. Public-health updates only.
            </p>
          </div>

          <div style={{ background: 'rgba(15,23,42,0.62)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-xl)', padding: '1.25rem', display: 'grid', gap: '0.9rem' }}>
            {['Verified-source updates', 'Weekly intelligence briefings', 'Privacy-respecting notifications'].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                {item.includes('Privacy') ? <ShieldCheck size={14} color="#22c55e" /> : <CheckCircle size={14} color="#38bdf8" />}
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{item}</span>
              </div>
            ))}

            <Link href="/alerts" className="btn btn-primary" style={{ width: '100%', marginTop: '0.25rem' }}>
              Open Alert Preferences <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
