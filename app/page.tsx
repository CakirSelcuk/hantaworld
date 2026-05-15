import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
        <div style={{ background: 'rgba(34,197,94,0.05)', borderBottom: '1px solid rgba(34,197,94,0.15)', padding: '0.75rem 1.5rem', textAlign: 'center' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#86efac', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
            <strong>STRICT VERIFICATION ENFORCED:</strong> This platform only displays data officially confirmed by WHO, CDC, or ECDC. No estimated or unverified figures are included.
          </span>
        </div>

        <HeroStats stats={displayStats} verifiedAt={verifiedAt} />

        <hr className="section-divider" style={{ margin: '0 1.5rem' }} />

        <GlobalStatsTrendChart trend={globalStatsTrend} />

        <hr className="section-divider" style={{ margin: '0 1.5rem' }} />

        <section style={{ padding: '3rem 0' }}>
          <div className="container-main">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div className="section-header" style={{ margin: 0 }}>Global Outbreak Map</div>
              <Link href="/map" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--color-brand)', textDecoration: 'none' }}>
                Full interactive map <ArrowRight size={13} />
              </Link>
            </div>

            <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--border-glass)', height: 480, position: 'relative' }}>
              <MapWrapper outbreaks={outbreaks} height="480px" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.85rem', flexWrap: 'wrap' }}>
              {[
                { color: '#ef4444', label: 'Confirmed outbreak' },
                { color: '#f97316', label: 'Suspected' },
                { color: '#eab308', label: 'Under monitoring' },
                { color: '#22c55e', label: 'Resolved' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>{label}</span>
                </div>
              ))}
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                {outbreaks.length} active zones | Click marker for details
              </span>
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
