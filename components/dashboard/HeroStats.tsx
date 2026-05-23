'use client';
import Link from 'next/link';
import { Activity, AlertTriangle, ArrowRight, CheckCircle, Globe, Map, Newspaper, TrendingDown, TrendingUp, Users } from 'lucide-react';
import type { GlobalStatCard, GlobalStats } from '@/lib/types';
import { formatDate, formatNumber, timeAgo } from '@/lib/utils';

function AnimatedNumber({ target }: { target: number }) {
  return <>{formatNumber(target)}</>;
}

const STAT_META = {
  reportedCases: { label: 'Reported Cases', icon: Activity, color: '#0ea5e9', glow: 'rgba(14,165,233,0.18)', description: 'Published case count' },
  totalDeaths: { label: 'Total Deaths', icon: AlertTriangle, color: '#ef4444', glow: 'rgba(239,68,68,0.18)', description: 'Fatal outcomes reported' },
  affectedCountries: { label: 'Affected Countries', icon: Globe, color: '#6366f1', glow: 'rgba(99,102,241,0.18)', description: 'Countries in current dataset' },
  activeOutbreaks: { label: 'Active Outbreaks', icon: Users, color: '#f59e0b', glow: 'rgba(245,158,11,0.18)', description: 'Unresolved monitored events' },
} satisfies Record<GlobalStatCard['key'], { label: string; icon: typeof Activity; color: string; glow: string; description: string }>;

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
    <section style={{ padding: '5.5rem 0 3rem' }}>
      <div className="container-main">
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.9rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--color-brand)', textTransform: 'uppercase' }}>
              Source-attributed public health intelligence
            </span>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, rgba(59,130,246,0.4), transparent)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>
              Latest dataset update {timeAgo(stats.lastUpdated)}
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.35rem, 6vw, 4.8rem)', fontWeight: 750, letterSpacing: '-0.035em', lineHeight: 1.02, marginBottom: '1rem', maxWidth: 900 }}>
            Global Hantavirus <span className="gradient-text-red">Intelligence</span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 720, lineHeight: 1.75, marginBottom: '1.35rem' }}>
            Track hantavirus outbreaks, country-level risk, and source-attributed public health updates from official global health sources.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
            <Link href="/map" className="btn btn-primary" style={{ padding: '0.72rem 1rem' }}>
              <Map size={16} /> View Live Map <ArrowRight size={14} />
            </Link>
            <Link href="/news" className="btn btn-ghost" style={{ padding: '0.72rem 1rem' }}>
              <Newspaper size={16} /> Read Intelligence Feed
            </Link>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.85rem', borderRadius: '999px', background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.22)' }}>
              <CheckCircle size={13} color="#38bdf8" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#bae6fd' }}>Verified sources</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap', marginBottom: '1.15rem' }}>
            {['WHO', 'CDC', 'ECDC', 'Official health ministries'].map((source) => (
              <span key={source} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: 'var(--text-secondary)', padding: '0.22rem 0.5rem', border: '1px solid var(--border-glass)', borderRadius: '999px', background: 'rgba(15,23,42,0.55)' }}>
                {source}
              </span>
            ))}
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.85rem', borderRadius: '999px', background: isRising ? 'rgba(245,158,11,0.1)' : 'rgba(14,165,233,0.08)', border: `1px solid ${isRising ? 'rgba(245,158,11,0.26)' : 'rgba(14,165,233,0.22)'}` }}>
            {isRising ? <TrendingUp size={13} color="#f59e0b" /> : <TrendingDown size={13} color="#38bdf8" />}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 600, color: isRising ? '#fcd34d' : '#bae6fd' }}>
              {isRising ? '+' : ''}{stats.growthRate7d}% 7-day change
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>| Published global case count</span>
          </div>
        </div>

        <div className="stats-grid" style={{ gap: '0.75rem' }}>
          {statCards.map(({ key, label, value }) => {
            const { icon: Icon, color, glow, description } = STAT_META[key];

            return (
              <div key={key} style={{ background: 'linear-gradient(180deg, rgba(17,24,39,0.88), rgba(15,23,42,0.72))', padding: '1.45rem', position: 'relative', overflow: 'hidden', transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease', border: `1px solid ${color}38`, borderRadius: 'var(--radius-xl)', boxShadow: `0 18px 42px rgba(0,0,0,0.28), 0 0 28px ${glow}` }} className="stat-cell">
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
                <p style={{ marginTop: '0.45rem', color: 'var(--text-muted)', fontSize: '0.72rem', lineHeight: 1.4 }}>{description}</p>
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
            Data verified: <span style={{ color: '#bae6fd' }}>{formatDate(autoVerifiedDate)}</span>
          </span>
        </div>
      </div>
      <style>{`.stat-cell:hover { transform: translateY(-3px); border-color: rgba(148,163,184,0.32) !important; box-shadow: 0 20px 48px rgba(0,0,0,0.36) !important; } @media (prefers-reduced-motion: reduce) { .stat-cell:hover { transform: none; } }`}</style>
    </section>
  );
}
