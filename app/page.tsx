import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LiveTicker from '@/components/dashboard/LiveTicker';
import HeroStats from '@/components/dashboard/HeroStats';
import CountryWatchlist from '@/components/dashboard/CountryWatchlist';
import LatestReports from '@/components/dashboard/LatestReports';
import AlertSignup from '@/components/dashboard/AlertSignup';
import SocialIntelligence from '@/components/dashboard/SocialIntelligence';
import MapWrapper from '@/components/map/MapWrapper';
import { getOutbreaks, getCountryWatchlist, getArticles, getSocialTrends, getGlobalStats, getTickerItems } from '@/lib/data';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function HomePage() {
  const outbreaks = await getOutbreaks();
  const watchlist = await getCountryWatchlist();
  const articles = await getArticles();
  const socialTrends = await getSocialTrends();
  const globalStats = await getGlobalStats();
  const tickerItems = await getTickerItems();

  return (
    <>
      <Navbar />
      <LiveTicker items={tickerItems} />

      <main style={{ paddingTop: 64 }}>
        {/* ── Hero Dashboard ── */}
        <HeroStats stats={globalStats} />

        <hr className="section-divider" style={{ margin: '0 1.5rem' }} />

        {/* ── Interactive Map Preview ── */}
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
                {outbreaks.length} active zones · Click marker for details
              </span>
            </div>
          </div>
        </section>

        <hr className="section-divider" style={{ margin: '0 1.5rem' }} />

        {/* ── Latest Intelligence ── */}
        <LatestReports articles={articles.slice(0, 3)} />

        <hr className="section-divider" style={{ margin: '0 1.5rem' }} />

        {/* ── Country Watchlist ── */}
        <CountryWatchlist items={watchlist} />

        <hr className="section-divider" style={{ margin: '0 1.5rem' }} />

        {/* ── Social Intelligence ── */}
        <SocialIntelligence posts={socialTrends} />

        <hr className="section-divider" style={{ margin: '0 1.5rem' }} />

        {/* ── Alert Signup ── */}
        <AlertSignup />
      </main>

      <Footer />
    </>
  );
}
