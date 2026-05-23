'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { formatDate, formatNumber } from '@/lib/utils';
import type { Outbreak } from '@/lib/types';

interface Props {
  outbreaks: Outbreak[];
  height?: string;
}

const STATUS_LABELS: Record<string, string> = {
  confirmed: 'Confirmed',
  suspected: 'Suspected',
  monitoring: 'Monitoring',
  resolved: 'Resolved',
};

const RISK_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Moderate',
  high: 'High',
  critical: 'Critical',
};

const RISK_COLORS: Record<string, string> = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#f97316',
  critical: '#ef4444',
};

function getRiskColor(level: string) {
  return RISK_COLORS[level] ?? '#64748b';
}

export default function OutbreakMap({ outbreaks, height = '100%' }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapObjRef = useRef<import('leaflet').Map | null>(null);
  const initialized = useRef(false);
  const [selected, setSelected] = useState<Outbreak | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (initialized.current || !mapRef.current) return;
    initialized.current = true;

    let map: import('leaflet').Map | null = null;

    const init = async () => {
      await import('leaflet/dist/leaflet.css');
      const leaflet = await import('leaflet');
      const L = leaflet.default;

      delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const mapElement = mapRef.current as HTMLDivElement & { _leaflet_id?: number };
      if (mapElement._leaflet_id) {
        mapElement._leaflet_id = undefined;
      }

      map = L.map(mapRef.current!, {
        center: [15, 0],
        zoom: 2,
        minZoom: 1,
        maxZoom: 10,
        zoomControl: false,
        attributionControl: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
      }).addTo(map!);

      L.control.zoom({ position: 'bottomright' }).addTo(map!);

      outbreaks.forEach((outbreak) => {
        const color = getRiskColor(outbreak.severityLevel);
        const radius = Math.max(18, Math.min(55, Math.sqrt(outbreak.confirmedCases) * 1.2));

        const circle = L.circleMarker([outbreak.coordinates.lat, outbreak.coordinates.lng], {
          radius,
          fillColor: color,
          fillOpacity: 0.22,
          color,
          weight: 1.5,
          opacity: 0.8,
          className: outbreak.status !== 'resolved' ? 'outbreak-marker-pulse' : 'standard-marker',
        }).addTo(map!);

        L.circleMarker([outbreak.coordinates.lat, outbreak.coordinates.lng], {
          radius: 5,
          fillColor: color,
          fillOpacity: 1,
          color: '#fff',
          weight: 1,
          opacity: 0.9,
        }).addTo(map!);

        circle.on('click', () => setSelected(outbreak));
        circle.on('mouseover', function (this: { setStyle: (style: { fillOpacity: number; weight: number }) => void }) {
          this.setStyle({ fillOpacity: 0.5, weight: 3 });
        });
        circle.on('mouseout', function (this: { setStyle: (style: { fillOpacity: number; weight: number }) => void }) {
          this.setStyle({ fillOpacity: 0.22, weight: 1.5 });
        });
      });

      mapObjRef.current = map;
      setLoaded(true);
    };

    init().catch(console.error);

    return () => {
      if (mapObjRef.current) {
        mapObjRef.current.remove();
        mapObjRef.current = null;
      }
      initialized.current = false;
    };
  }, [outbreaks]);

  return (
    <div style={{ position: 'relative', height, width: '100%', background: '#070b14', borderRadius: 'inherit' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: 'inherit' }} />

      {!loaded && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(7,11,20,0.85)', borderRadius: 'inherit', zIndex: 500 }}>
          <div style={{ textAlign: 'center' }}>
            <div className="radar-loader" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-primary)', letterSpacing: '0.05em' }}>LOADING OUTBREAK MAP...</span>
          </div>
        </div>
      )}

      {loaded && (
        <div style={{ position: 'absolute', bottom: 40, left: 12, zIndex: 1000, background: 'rgba(7,11,20,0.92)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.75rem 1rem', backdropFilter: 'blur(12px)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>SEVERITY</div>
          {(['low', 'medium', 'high', 'critical'] as const).map((risk) => (
            <div key={risk} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: getRiskColor(risk), flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{RISK_LABELS[risk]}</span>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 1000, width: 'min(340px, calc(100% - 24px))', maxHeight: 'calc(100% - 24px)', overflowY: 'auto', background: 'rgba(17,24,39,0.97)', border: '1px solid rgba(148,163,184,0.18)', borderRadius: '12px', padding: '1.25rem', backdropFilter: 'blur(20px)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>{selected.country.flagEmoji}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{selected.country.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: getRiskColor(selected.severityLevel), textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {RISK_LABELS[selected.severityLevel]} risk | {STATUS_LABELS[selected.status]}
                </div>
              </div>
            </div>
            <button aria-label="Close outbreak details" onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1, padding: '0.1rem 0.25rem' }}>x</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
            {[
              { label: 'Reported cases', value: formatNumber(selected.confirmedCases), color: 'var(--text-primary)', show: selected.confirmedCases >= 0 },
              { label: 'Deaths', value: formatNumber(selected.deaths), color: '#fca5a5' },
              { label: 'Suspected', value: formatNumber(selected.suspectedCases), color: '#fdba74', show: selected.suspectedCases > 0 },
              { label: 'Recovered', value: formatNumber(selected.recovered), color: '#86efac', show: selected.recovered > 0 },
            ].filter((item) => item.show !== false).map(({ label, value, color }) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '0.6rem 0.75rem' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 500, color }}>{value}</div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
              </div>
            ))}
          </div>

          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.5rem' }}>
            {selected.description}
          </p>

          <div style={{ display: 'grid', gap: '0.45rem', marginBottom: '0.8rem' }}>
            {selected.lastVerifiedDate && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>Last verified: {formatDate(selected.lastVerifiedDate)}</span>
            )}
            {!selected.lastVerifiedDate && selected.lastUpdated && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>Last updated: {formatDate(selected.lastUpdated)}</span>
            )}
          </div>

          {selected.verificationNotes && (
            <div style={{ background: 'rgba(59,130,246,0.1)', padding: '0.6rem', borderRadius: '6px', marginBottom: '0.75rem', border: '1px solid rgba(59,130,246,0.2)' }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#93c5fd', marginBottom: '0.2rem' }}>VERIFICATION NOTES</span>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>{selected.verificationNotes}</p>
            </div>
          )}

          {selected.sources.length > 0 && (
            <div style={{ marginBottom: '0.85rem' }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sources</span>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {selected.sources.slice(0, 3).map((source) => (
                  <a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer" style={{ color: '#bae6fd', border: '1px solid rgba(14,165,233,0.24)', borderRadius: 999, padding: '0.15rem 0.45rem', fontSize: '0.62rem', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}>
                    {source.organization}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: selected.verified ? '#86efac' : '#fdba74', padding: '0.12rem 0.4rem', borderRadius: '3px', background: selected.verified ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)' }}>
              {selected.verified ? 'VERIFIED' : 'UNVERIFIED'}
            </span>
            <Link href={`/country/${selected.country.slug}`} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--color-brand)', textDecoration: 'none' }}>
              Country detail {'->'}
            </Link>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
