import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Bell, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LiveTicker from '@/components/dashboard/LiveTicker';
import CountryWatchlist from '@/components/dashboard/CountryWatchlist';
import LatestReports from '@/components/dashboard/LatestReports';
import AlertSignup from '@/components/dashboard/AlertSignup';
import SocialIntelligence from '@/components/dashboard/SocialIntelligence';
import MapWrapper from '@/components/map/MapWrapper';
import MultiPathogenCaseTrendChart from '@/components/pathogens/MultiPathogenCaseTrendChart';
import PathogenCard from '@/components/pathogens/PathogenCard';
import { getArticles, getCountryWatchlist, getGlobalStatsTrend, getOutbreaks, getPathogens, getPathogenStatsTrend, getSocialTrends, getTickerItems } from '@/lib/data';
import type { GlobalStatsTrendPoint, PathogenTrendPoint } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'HantaWorld - Global Outbreak and Virus Intelligence',
  description:
    'Verified outbreak updates, pathogen profiles, public health signals, and official source-attributed intelligence.',
  alternates: { canonical: 'https://www.hantaworld.com' },
  openGraph: {
    title: 'HantaWorld - Global Outbreak and Virus Intelligence',
    description: 'Verified outbreak updates, pathogen profiles, and public health signals from HantaWorld.',
    url: 'https://www.hantaworld.com',
    type: 'website',
  },
};

function mapLegacyGlobalTrendToHantavirusTrend(trend: GlobalStatsTrendPoint[]): PathogenTrendPoint[] {
  return trend.map((point) => ({
    date: point.date,
    pathogenSlug: 'hantavirus',
    pathogenDisplayName: 'Hantavirus',
    pathogenColor: '#ef4444',
    reportedCases: point.reportedCases,
    totalDeaths: point.totalDeaths,
  }));
}

export default async function HomePage() {
  const outbreaks = await getOutbreaks();
  const watchlist = await getCountryWatchlist(outbreaks);
  const articles = await getArticles();
  const socialTrends = await getSocialTrends();
  const pathogens = await getPathogens();
  const pathogenStatsTrend = await getPathogenStatsTrend();
  const legacyGlobalStatsTrend = await getGlobalStatsTrend();
  const caseTrend = pathogenStatsTrend.length > 0
    ? pathogenStatsTrend
    : mapLegacyGlobalTrendToHantavirusTrend(legacyGlobalStatsTrend);
  const tickerItems = await getTickerItems();

  return (
    <>
      <Navbar />
      <LiveTicker items={tickerItems} />

      <main style={{ paddingTop: 64 }}>
        <div style={{ background: 'rgba(14,165,233,0.06)', borderBottom: '1px solid rgba(14,165,233,0.18)', padding: '0.75rem 1.5rem', textAlign: 'center' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#bae6fd', display: 'inline-flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#0ea5e9' }} />
            <strong>Source-attributed data:</strong> HantaWorld displays published records from official global health sources and clearly attributed public health reports.
          </span>
        </div>

        <section style={{ padding: '5.5rem 0 3rem' }}>
          <div className="container-main">
            <div style={{ maxWidth: 920, marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.9rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--color-brand)', textTransform: 'uppercase' }}>
                  HantaWorld - Global Outbreak & Virus Intelligence
                </span>
                <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, rgba(59,130,246,0.4), transparent)' }} />
              </div>

              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.35rem, 6vw, 4.8rem)', fontWeight: 750, letterSpacing: '-0.035em', lineHeight: 1.02, marginBottom: '1rem' }}>
                Global Outbreak & <span className="gradient-text-red">Virus Intelligence</span>
              </h1>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 760, lineHeight: 1.75, marginBottom: '1.35rem' }}>
                Verified outbreak updates, pathogen profiles, and public health signals from official and trusted sources.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.15rem' }}>
                <Link href="/map" className="btn btn-ghost" style={{ padding: '0.72rem 1rem' }}>
                  View Global Map
                </Link>
                <Link href="/pathogens" className="btn btn-primary" style={{ padding: '0.72rem 1rem' }}>
                  Browse Pathogens <ArrowRight size={14} />
                </Link>
                <Link href="/news" className="btn btn-ghost" style={{ padding: '0.72rem 1rem' }}>
                  Read Intelligence Reports
                </Link>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', padding: '0.8rem 0.95rem', border: '1px solid rgba(14,165,233,0.18)', borderRadius: 'var(--radius-lg)', background: 'rgba(14,165,233,0.06)', maxWidth: 850 }}>
                <ShieldCheck size={16} color="#38bdf8" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: 1.6 }}>
                  Source-attributed intelligence from WHO, CDC, ECDC, Africa CDC, PAHO, and national health authorities.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <div>
                <div className="section-header" style={{ margin: 0 }}>Pathogen Watch</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.45rem', maxWidth: 620 }}>
                  Active public profiles for pathogens and category-like intelligence feeds tracked by HantaWorld.
                </p>
              </div>
              <Link href="/pathogens" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--color-brand)', textDecoration: 'none' }}>
                View all <ArrowRight size={13} />
              </Link>
            </div>

            {pathogens.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '0.9rem' }}>
                {pathogens.slice(0, 8).map((pathogen) => (
                  <PathogenCard key={pathogen.slug} pathogen={pathogen} featured={pathogen.slug === 'hantavirus'} />
                ))}
              </div>
            ) : (
              <div className="glass-card" style={{ padding: '1.25rem', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontSize: '0.85rem' }}>
                No active pathogen profiles are available from the live API yet.
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))', gap: '0.8rem', marginTop: '1.25rem' }}>
              {[
                { label: 'Pathogen Profiles', value: pathogens.length, note: 'Active profiles and categories' },
                { label: 'Mapped Records', value: outbreaks.length, note: 'Country-level outbreak entries' },
                { label: 'Intelligence Reports', value: articles.length, note: 'Published source-attributed reports' },
                { label: 'Trend Snapshots', value: caseTrend.length, note: 'Historical chart points available' },
              ].map((item) => (
                <div key={item.label} className="glass-card" style={{ padding: '1rem', borderColor: 'rgba(14,165,233,0.18)' }}>
                  <div style={{ color: '#bae6fd', fontFamily: 'var(--font-display)', fontSize: '1.7rem', fontWeight: 750, marginBottom: '0.25rem' }}>
                    {item.value}
                  </div>
                  <div style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', fontWeight: 650, fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                    {item.label}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.62rem' }}>
                    {item.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="section-divider" style={{ margin: '0 1.5rem' }} />

        <MultiPathogenCaseTrendChart trend={caseTrend} />

        <hr className="section-divider" style={{ margin: '0 1.5rem' }} />

        <section style={{ padding: '3rem 0' }}>
          <div className="container-main">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <div className="section-header" style={{ margin: 0 }}>Global Outbreak Map</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.5rem', maxWidth: 640 }}>
                  Explore active country-level outbreak records and open a marker for source-attributed details.
                </p>
              </div>
              <Link href="/map" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--color-brand)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                View fullscreen map <ArrowRight size={13} />
              </Link>
            </div>

            <div className="homepage-map-shell" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--border-glass)', position: 'relative', boxShadow: '0 24px 80px rgba(0,0,0,0.32)' }}>
              <MapWrapper outbreaks={outbreaks} height="100%" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.85rem', flexWrap: 'wrap' }}>
              {[
                { color: '#22c55e', label: 'Low / resolved' },
                { color: '#f59e0b', label: 'Moderate monitoring' },
                { color: '#f97316', label: 'High risk' },
                { color: '#ef4444', label: 'Critical risk' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>{label}</span>
                </div>
              ))}
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                {outbreaks.length} mapped records | Click marker for details
              </span>
            </div>
          </div>
        </section>

        <section style={{ padding: '0 0 2rem' }}>
          <div className="container-main">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', padding: '1rem 1.1rem', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(14,165,233,0.2)', background: 'linear-gradient(135deg, rgba(14,165,233,0.10), rgba(99,102,241,0.08))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(14,165,233,0.14)', border: '1px solid rgba(14,165,233,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bell size={17} color="#38bdf8" />
                </div>
                <div>
                  <strong style={{ display: 'block', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', fontSize: '0.9rem' }}>Get Outbreak Intelligence Alerts</strong>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Source-attributed updates and weekly intelligence briefings. No spam.</span>
                </div>
              </div>
              <Link href="/alerts" className="btn btn-primary" style={{ padding: '0.62rem 0.9rem' }}>
                Subscribe <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        <hr className="section-divider" style={{ margin: '0 1.5rem' }} />

        <LatestReports articles={articles.slice(0, 3)} />

        <hr className="section-divider" style={{ margin: '0 1.5rem' }} />

        <CountryWatchlist items={watchlist} />

        {socialTrends.length > 0 && (
          <>
            <hr className="section-divider" style={{ margin: '0 1.5rem' }} />
            <SocialIntelligence posts={socialTrends} />
          </>
        )}

        <hr className="section-divider" style={{ margin: '0 1.5rem' }} />

        <AlertSignup />
      </main>

      <Footer />
    </>
  );
}
