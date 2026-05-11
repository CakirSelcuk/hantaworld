import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Activity, ArrowLeft, MapPin, Minus, ShieldAlert, TrendingDown, TrendingUp, Users } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MapWrapper from '@/components/map/MapWrapper';
import { getCountryWatchlist, getOutbreaks } from '@/lib/data';
import { formatDate, formatNumber, getSeverityColor } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const watchlist = await getCountryWatchlist();
  const stat = watchlist.find((entry) => entry.country.slug === slug);

  if (!stat) return { title: 'Not Found' };

  return {
    title: `${stat.country.name} | Risk Profile & Outbreaks`,
    description: `Real-time intelligence and outbreak data for ${stat.country.name}. Current risk level: ${stat.riskLevel}.`,
  };
}

const RISK_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
};

export default async function CountryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const watchlist = await getCountryWatchlist();
  const stat = watchlist.find((entry) => entry.country.slug === slug);

  if (!stat) {
    notFound();
  }

  const outbreaks = await getOutbreaks();
  const countryOutbreaks = outbreaks.filter((outbreak) => outbreak.country.id === stat.country.id);
  const country = stat.country;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', position: 'sticky', top: 64, zIndex: 10 }}>
          <div className="container-main" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}>
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              Live Data Intelligence
            </span>
          </div>
        </div>

        <div className="container-main" style={{ padding: '3rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '3rem', lineHeight: 1 }}>{country.flagEmoji}</span>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                  {country.name}
                </h1>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <MapPin size={14} color="var(--text-muted)" /> {country.continent}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <Users size={14} color="var(--text-muted)" /> {formatNumber(country.population)} pop.
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 600, color: RISK_COLORS[stat.riskLevel], background: `${RISK_COLORS[stat.riskLevel]}15`, padding: '0.2rem 0.6rem', borderRadius: '4px', border: `1px solid ${RISK_COLORS[stat.riskLevel]}28`, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {stat.riskLevel} RISK
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={16} color="var(--color-brand)" /> Intelligence Overview
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>Active Outbreaks</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 500, color: 'var(--text-primary)' }}>{stat.activeOutbreaks}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>Trend Direction</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '1.25rem', color: stat.trendDirection === 'up' ? '#ef4444' : stat.trendDirection === 'down' ? '#22c55e' : '#eab308', textTransform: 'capitalize' }}>
                    {stat.trendDirection === 'up' ? <TrendingUp size={20} /> : stat.trendDirection === 'down' ? <TrendingDown size={20} /> : <Minus size={20} />}
                    {stat.trendDirection}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>Total Cases</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 500, color: 'var(--text-primary)' }}>{formatNumber(stat.totalCases)}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>Total Deaths</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 500, color: '#fca5a5' }}>{formatNumber(countryOutbreaks.reduce((sum, outbreak) => sum + outbreak.deaths, 0))}</div>
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ height: '300px', overflow: 'hidden', padding: 0, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, background: 'rgba(7,11,20,0.85)', padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid var(--border-glass)', backdropFilter: 'blur(8px)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>LOCAL RADAR</span>
              </div>
              <MapWrapper outbreaks={countryOutbreaks} height="100%" />
            </div>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={20} color="var(--color-brand)" /> Monitored Zones
            </h2>

            {countryOutbreaks.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px dashed var(--border-glass)' }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>No active outbreaks monitored for this region.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {countryOutbreaks.map((outbreak) => (
                  <div key={outbreak.id} className="glass-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: getSeverityColor(outbreak.status), boxShadow: `0 0 10px ${getSeverityColor(outbreak.status)}80` }} />
                        <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                          {outbreak.status} Cluster
                        </h3>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: outbreak.verified ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)', color: outbreak.verified ? '#86efac' : '#fde047', border: `1px solid ${outbreak.verified ? 'rgba(34,197,94,0.2)' : 'rgba(234,179,8,0.2)'}` }}>
                          {outbreak.verified ? 'VERIFIED' : 'UNVERIFIED'}
                        </span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Started {formatDate(outbreak.startedAt)}
                      </span>
                    </div>

                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                      {outbreak.description}
                    </p>

                    {outbreak.verificationNotes && (
                      <div style={{ background: 'rgba(59,130,246,0.1)', padding: '0.8rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(59,130,246,0.2)' }}>
                        <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#93c5fd', marginBottom: '0.3rem', letterSpacing: '0.05em' }}>VERIFICATION NOTES</span>
                        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{outbreak.verificationNotes}</p>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                      <div>
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confirmed</span>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{formatNumber(outbreak.confirmedCases)}</div>
                      </div>
                      <div>
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Suspected</span>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: '#fdba74' }}>{formatNumber(outbreak.suspectedCases)}</div>
                      </div>
                      <div>
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deaths</span>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: '#fca5a5' }}>{formatNumber(outbreak.deaths)}</div>
                      </div>
                      <div>
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Growth Rate</span>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: outbreak.growthRate > 0 ? '#ef4444' : '#22c55e' }}>{outbreak.growthRate > 0 ? '+' : ''}{outbreak.growthRate}%</div>
                      </div>
                    </div>

                    {outbreak.sourceUrl && (
                      <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                          Last Verified: {formatDate(outbreak.lastVerifiedDate || outbreak.lastUpdated)}
                        </span>
                        <a href={outbreak.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--color-brand)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          View Official Source {'->'}
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
