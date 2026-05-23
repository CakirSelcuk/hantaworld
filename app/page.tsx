import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Bell } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LiveTicker from '@/components/dashboard/LiveTicker';
import HeroStats from '@/components/dashboard/HeroStats';
import GlobalStatsTrendChart from '@/components/dashboard/GlobalStatsTrendChart';
import CountryWatchlist from '@/components/dashboard/CountryWatchlist';
import LatestReports from '@/components/dashboard/LatestReports';
import AlertSignup from '@/components/dashboard/AlertSignup';
import SocialIntelligence from '@/components/dashboard/SocialIntelligence';
import MapWrapper from '@/components/map/MapWrapper';
import { getArticles, getCountryWatchlist, getGlobalStats, getGlobalStatsTrend, getOutbreaks, getSocialTrends, getTickerItems } from '@/lib/data';
import type { GlobalStatsTrendPoint } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'HantaWorld - Live Hantavirus Outbreak Map and Intelligence',
  description:
    'Live hantavirus outbreak map, verified case counts, death trends, country risk monitoring, and official public health source attribution.',
  alternates: { canonical: 'https://www.hantaworld.com' },
  openGraph: {
    title: 'HantaWorld - Live Hantavirus Outbreak Map and Intelligence',
    description: 'Verified global hantavirus outbreak intelligence, maps, case counts, and public health reports.',
    url: 'https://www.hantaworld.com',
    type: 'website',
  },
};

function calculateCaseChange7d(trend: GlobalStatsTrendPoint[]) {
  const sortedTrend = [...trend].sort((a, b) => a.date.localeCompare(b.date));
  const latest = sortedTrend.at(-1);

  if (!latest || sortedTrend.length < 2) {
    return 0;
  }

  const sevenDaysBeforeLatest = new Date(`${latest.date}T00:00:00Z`);
  sevenDaysBeforeLatest.setUTCDate(sevenDaysBeforeLatest.getUTCDate() - 7);
  const baseline =
    [...sortedTrend].reverse().find((point) => new Date(`${point.date}T00:00:00Z`) <= sevenDaysBeforeLatest) ??
    sortedTrend[0];

  if (!baseline || baseline.date === latest.date || baseline.reportedCases === 0) {
    return 0;
  }

  return Math.round(((latest.reportedCases - baseline.reportedCases) / baseline.reportedCases) * 1000) / 10;
}

export default async function HomePage() {
  const outbreaks = await getOutbreaks();
  const watchlist = await getCountryWatchlist(outbreaks);
  const articles = await getArticles();
  const socialTrends = await getSocialTrends();
  const globalStats = await getGlobalStats();
  const globalStatsTrend = await getGlobalStatsTrend();
  const displayStats = {
    ...globalStats,
    growthRate7d: calculateCaseChange7d(globalStatsTrend),
  };
  const verifiedAt = new Date().toISOString();
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

        <HeroStats stats={displayStats} verifiedAt={verifiedAt} />

        <hr className="section-divider" style={{ margin: '0 1.5rem' }} />

        <GlobalStatsTrendChart trend={globalStatsTrend} />

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
                  <strong style={{ display: 'block', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', fontSize: '0.9rem' }}>Get Hantavirus Outbreak Alerts</strong>
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
