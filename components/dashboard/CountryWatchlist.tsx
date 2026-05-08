'use client';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Minus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import type { CountryStats } from '@/lib/types';
import { formatNumber, timeAgo } from '@/lib/utils';

const RISK_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  label: 'CRITICAL' },
  high:     { color: '#f97316', bg: 'rgba(249,115,22,0.1)', label: 'HIGH' },
  medium:   { color: '#eab308', bg: 'rgba(234,179,8,0.1)',  label: 'MEDIUM' },
  low:      { color: '#22c55e', bg: 'rgba(34,197,94,0.1)',  label: 'LOW' },
};

function TrendIcon({ dir }: { dir: 'up' | 'down' | 'stable' }) {
  if (dir === 'up')     return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444' }}><TrendingUp size={12} /> <span style={{ fontSize: '0.6rem', fontWeight: 600 }}>ESCALATING</span></span>;
  if (dir === 'down')   return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#22c55e' }}><TrendingDown size={12} /> <span style={{ fontSize: '0.6rem', fontWeight: 600 }}>DECLINING</span></span>;
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#eab308' }}><Minus size={12} /> <span style={{ fontSize: '0.6rem', fontWeight: 600 }}>STABLE</span></span>;
}

export default function CountryWatchlist({ items }: { items: CountryStats[] }) {
  return (
    <section style={{ padding: '2rem 0' }}>
      <div className="container-main">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div className="section-header" style={{ margin: 0 }}>Country Risk Monitor</div>
          <Link href="/countries" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--color-brand)', textDecoration: 'none' }}>
            View all countries →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
          {items.map((item) => {
            const risk = RISK_CONFIG[item.riskLevel] ?? RISK_CONFIG.low;
            return (
              <Link key={item.country.id} href={`/${item.country.slug}`}
                style={{ textDecoration: 'none', display: 'block' }}>
                <div className="glass-card" style={{ padding: '1.1rem 1.25rem', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{item.country.flagEmoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                        {item.country.name}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                        {item.country.continent}
                      </div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em', color: risk.color, background: risk.bg, padding: '0.2rem 0.5rem', borderRadius: '4px', border: `1px solid ${risk.color}30` }}>
                      {risk.label}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {formatNumber(item.totalCases)}
                      </div>
                      <div className="stat-label">Cases</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 500, color: '#f87171' }}>
                        {formatNumber(item.totalDeaths)}
                      </div>
                      <div className="stat-label">Deaths</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <TrendIcon dir={item.trendDirection} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        {item.activeOutbreaks} active outbreak{item.activeOutbreaks !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                      {timeAgo(item.lastReportedAt)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
