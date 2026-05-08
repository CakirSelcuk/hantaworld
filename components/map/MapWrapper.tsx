'use client';
import dynamic from 'next/dynamic';
import type { Outbreak } from '@/lib/types';

const OutbreakMap = dynamic(() => import('./OutbreakMap'), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100%', height: '100%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'inherit' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="radar-loader" />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-primary)', letterSpacing: '0.05em' }}>ACQUIRING SATELLITE DATA...</span>
      </div>
    </div>
  ),
});

export default function MapWrapper({ outbreaks, height }: { outbreaks: Outbreak[]; height?: string }) {
  return <OutbreakMap outbreaks={outbreaks} height={height} />;
}
