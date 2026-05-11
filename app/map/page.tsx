import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import MapWrapper from '@/components/map/MapWrapper';
import { getOutbreaks } from '@/lib/data';
import { formatNumber, getSeverityColor, timeAgo } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Global Outbreak Map',
  description: 'Real-time interactive map of hantavirus outbreaks worldwide. Track confirmed cases, suspected zones, and severity by country.',
};

export const dynamic = 'force-dynamic';

const STATUS_COLORS: Record<string, string> = {
  confirmed: '#ef4444',
  suspected: '#f97316',
  monitoring: '#eab308',
  resolved: '#22c55e',
};

export default async function MapPage() {
  const outbreaks = await getOutbreaks();
  const active = outbreaks.filter((outbreak) => outbreak.status !== 'resolved');
  const reportedCases = outbreaks.reduce(
    (sum, outbreak) => sum + outbreak.confirmedCases + outbreak.suspectedCases,
    0
  );

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 64, height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0.75rem 1.5rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="pulse-dot" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 600, color: '#fca5a5', letterSpacing: '0.1em' }}>LIVE MAP</span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            {active.length} active zones | {reportedCases.toLocaleString()} reported cases
          </span>
          <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto', flexWrap: 'wrap' }}>
            {Object.entries(STATUS_COLORS).map(([status, color]) => (
              <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{status}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <div style={{ width: 300, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
            <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                Active Zones ({active.length})
              </span>
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {outbreaks.map((outbreak) => (
                <div key={outbreak.id} style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s' }} className="sidebar-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: getSeverityColor(outbreak.status), flexShrink: 0 }} />
                    <span style={{ fontSize: '1rem' }}>{outbreak.country.flagEmoji}</span>
                    <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-primary)', flex: 1 }}>{outbreak.country.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: getSeverityColor(outbreak.status), textTransform: 'uppercase', padding: '0.1rem 0.35rem', borderRadius: '3px', background: `${getSeverityColor(outbreak.status)}15` }}>
                      {outbreak.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', paddingLeft: '1.25rem' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-primary)' }}>{formatNumber(outbreak.confirmedCases)}</div>
                      <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cases</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#f87171' }}>{formatNumber(outbreak.deaths)}</div>
                      <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Deaths</div>
                    </div>
                  </div>
                  <div style={{ marginTop: '0.35rem', paddingLeft: '1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)' }}>
                    Updated {timeAgo(outbreak.lastUpdated)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, position: 'relative', background: '#0a0d14' }}>
            <MapWrapper outbreaks={outbreaks} height="100%" />
          </div>
        </div>
      </div>
      <style>{`.sidebar-item:hover { background: var(--bg-tertiary) !important; cursor: pointer; }`}</style>
    </>
  );
}
