'use client';
import { useEffect, useState } from 'react';
import { Activity, AlertTriangle, Globe, TrendingDown, TrendingUp, Users } from 'lucide-react';
import type { GlobalStatCard, GlobalStats } from '@/lib/types';
import { formatDate, formatNumber, timeAgo } from '@/lib/utils';

function AnimatedNumber({ target, duration = 1800 }: { target: number; duration?: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = 0;
    const steps = 60;
    const increment = target / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCurrent(target);
        clearInterval(timer);
      } else {
        setCurrent(Math.floor(start));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <>{formatNumber(current)}</>;
}

const STAT_META = {
  reportedCases: { label: 'Reported Cases', icon: Activity, color: '#ef4444', glow: 'rgba(239,68,68,0.15)' },
  totalDeaths: { label: 'Total Deaths', icon: AlertTriangle, color: '#f97316', glow: 'rgba(249,115,22,0.15)' },
  affectedCountries: { label: 'Affected Countries', icon: Globe, color: '#3b82f6', glow: 'rgba(59,130,246,0.15)' },
  activeOutbreaks: { label: 'Active Outbreaks', icon: Users, color: '#eab308', glow: 'rgba(234,179,8,0.15)' },
} satisfies Record<GlobalStatCard['key'], { label: string; icon: typeof Activity; color: string; glow: string }>;

function getDefaultValue(stats: GlobalStats, key: GlobalStatCard['key']) {
  if (key === 'reportedCases') return stats.totalConfirmedCases + stats.totalSuspectedCases;
  return stats[key] as number;
}

function getStatCards(stats: GlobalStats): GlobalStatCard[] {
  const configuredCards = stats.numericCards?.filter((card) => STAT_META[card.key]);
  if (configuredCards && configuredCards.length > 0) {
    return configuredCards;
  }

  return (Object.keys(STAT_META) as GlobalStatCard['key'][]).map((key, index) => ({
    key,
    label: STAT_META[key].label,
    value: getDefaultValue(stats, key),
    displayOrder: index + 1,
  }));
}

export default function HeroStats({ stats, verifiedAt }: { stats: GlobalStats; verifiedAt?: string }) {
  const isRising = stats.growthRate7d > 0;
  const statCards = getStatCards(stats);
  const autoVerifiedDate = verifiedAt ?? stats.lastUpdated;

  return (
    <section style={{ padding: '5rem 0 3rem' }}>
      <div className="container-main">
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--color-brand)', textTransform: 'uppercase' }}>
              Real-Time Global Intelligence
            </span>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, rgba(59,130,246,0.4), transparent)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>
              Updated {timeAgo(stats.lastUpdated)}
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1rem' }}>
            Global Hantavirus
            <br />
            <span className="gradient-text-red">Outbreak Intelligence</span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: 560, lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Verified surveillance data aggregated from WHO, CDC, ECDC, and official health ministry bulletins.
            All published figures are timestamped and source-attributed.
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.85rem', borderRadius: '999px', background: isRising ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', border: `1px solid ${isRising ? 'rgba(239,68,68,0.25)' : 'rgba(34,197,94,0.25)'}` }}>
            {isRising ? <TrendingUp size={13} color="#ef4444" /> : <TrendingDown size={13} color="#22c55e" />}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 600, color: isRising ? '#fca5a5' : '#86efac' }}>
              {isRising ? '+' : ''}{stats.growthRate7d}% 7-day change
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>| Global case count</span>
          </div>
        </div>

        <div className="stats-grid" style={{ background: 'var(--border-subtle)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--border-glass)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
          {statCards.map(({ key, label, value }) => {
            const { icon: Icon, color, glow } = STAT_META[key];

            return (
              <div key={key} style={{ background: 'var(--bg-card)', padding: '1.75rem', position: 'relative', overflow: 'hidden', transition: 'background 0.2s ease' }} className="stat-cell">
                <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: glow, borderRadius: '50%', filter: 'blur(24px)', transform: 'translate(20px, -20px)', pointerEvents: 'none' }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem', position: 'relative' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '10px', background: `${color}18`, border: `1px solid ${color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 15px ${glow}` }}>
                    <Icon size={18} color={color} strokeWidth={2} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.08em', padding: '0.15rem 0.4rem', border: '1px solid var(--border-subtle)', borderRadius: '4px', background: 'var(--bg-secondary)' }}>VERIFIED</span>
                </div>

                <div className="stat-value" style={{ color, marginBottom: '0.35rem', position: 'relative', textShadow: `0 0 20px ${color}40` }}>
                  <AnimatedNumber target={value} />
                </div>
                <div className="stat-label">{label}</div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Data sources:</span>
          {['WHO', 'CDC', 'ECDC'].map((source) => (
            <span key={source} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', padding: '0.15rem 0.45rem', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}>{source}</span>
          ))}
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            Data verified: <span style={{ color: '#86efac' }}>{formatDate(autoVerifiedDate)}</span>
          </span>
        </div>
      </div>
      <style>{`.stat-cell:hover { background: var(--bg-card-hover) !important; }`}</style>
    </section>
  );
}
