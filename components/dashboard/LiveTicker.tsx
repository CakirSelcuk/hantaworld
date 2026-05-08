'use client';
import { useEffect, useRef } from 'react';

const SEVERITY_COLORS: Record<string, string> = {
  confirmed: '#ef4444',
  suspected: '#f97316',
  monitoring: '#eab308',
};

export default function LiveTicker({ items }: { items: any[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const doubled = [...items, ...items];

  return (
    <div style={{
      background: 'rgba(0,0,0,0.4)',
      borderTop: '1px solid rgba(239,68,68,0.15)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      overflow: 'hidden',
      height: 38,
      display: 'flex',
      alignItems: 'center',
    }}>
      {/* Static label */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0 1.25rem',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        height: '100%',
        background: 'rgba(239,68,68,0.08)',
      }}>
        <span className="pulse-dot" />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 600, color: '#fca5a5', letterSpacing: '0.12em', whiteSpace: 'nowrap' }}>
          LIVE FEED
        </span>
      </div>

      {/* Scrolling track */}
      <div style={{ overflow: 'hidden', flex: 1 }}>
        <div ref={trackRef} className="ticker-track" style={{ display: 'flex', alignItems: 'center', gap: '0', whiteSpace: 'nowrap' }}>
          {doubled.map((item, i) => (
            <span key={`${item.id}-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0 2rem' }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.58rem', fontWeight: 700,
                letterSpacing: '0.1em', color: SEVERITY_COLORS[item.severity] ?? '#94a3b8',
                padding: '0.15rem 0.4rem', borderRadius: '3px',
                background: `${SEVERITY_COLORS[item.severity] ?? '#475569'}18`,
                border: `1px solid ${SEVERITY_COLORS[item.severity] ?? '#475569'}30`,
              }}>
                {item.label}
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.77rem', color: 'var(--text-secondary)' }}>
                {item.text}
              </span>
              <span style={{ color: 'var(--border-glass)', fontSize: '0.8rem' }}>·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
