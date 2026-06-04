import Link from 'next/link';
import { Activity, ArrowRight, Globe2, Skull, Users } from 'lucide-react';
import type { Pathogen } from '@/lib/types';
import { formatNumber } from '@/lib/utils';

function hasValue(value: number | null | undefined): value is number {
  return value !== null && value !== undefined;
}

function hasStats(pathogen: Pathogen) {
  const stats = pathogen.stats;
  if (!stats) return false;
  return [stats.reportedCases, stats.totalDeaths, stats.affectedCountries, stats.activeOutbreaks].some(hasValue);
}

export default function PathogenCard({ pathogen, featured = false }: { pathogen: Pathogen; featured?: boolean }) {
  const statsAvailable = hasStats(pathogen);
  const stats = pathogen.stats;

  return (
    <Link href={`/pathogens/${pathogen.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <article
        className="glass-card pathogen-card"
        style={{
          height: '100%',
          padding: featured ? '1.35rem' : '1.1rem',
          borderLeft: `3px solid ${pathogen.color}`,
          boxShadow: `0 18px 42px rgba(0,0,0,0.24), 0 0 28px ${pathogen.color}16`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: -28,
            top: -28,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: `${pathogen.color}18`,
            filter: 'blur(18px)',
          }}
        />

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.9rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.45rem' }}>
                <span style={{ width: 9, height: 9, borderRadius: 999, background: pathogen.color, boxShadow: `0 0 18px ${pathogen.color}80` }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: pathogen.color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Pathogen Watch
                </span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: featured ? '1.05rem' : '0.92rem', lineHeight: 1.3, color: 'var(--text-primary)', marginBottom: '0.45rem' }}>
                {pathogen.displayName}
              </h3>
            </div>
            <ArrowRight size={15} color={pathogen.color} style={{ flexShrink: 0, marginTop: 3 }} />
          </div>

          <p style={{ minHeight: featured ? 54 : 46, color: 'var(--text-secondary)', fontSize: '0.76rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            {pathogen.shortDescription || 'Source-attributed public health intelligence profile.'}
          </p>

          {statsAvailable ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.55rem' }}>
              {hasValue(stats?.reportedCases) && (
                <Metric icon={Activity} label="Cases" value={stats.reportedCases} color="#38bdf8" />
              )}
              {hasValue(stats?.totalDeaths) && (
                <Metric icon={Skull} label="Deaths" value={stats.totalDeaths} color="#ef4444" />
              )}
              {hasValue(stats?.affectedCountries) && (
                <Metric icon={Globe2} label="Countries" value={stats.affectedCountries} color="#818cf8" />
              )}
              {hasValue(stats?.activeOutbreaks) && (
                <Metric icon={Users} label="Active" value={stats.activeOutbreaks} color="#f59e0b" />
              )}
            </div>
          ) : (
            <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '0.7rem 0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontSize: '0.72rem' }}>
              No verified stats yet
            </div>
          )}
        </div>

        <style>{`
          .pathogen-card {
            transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
          }
          .pathogen-card:hover {
            transform: translateY(-3px);
            border-color: rgba(148,163,184,0.34) !important;
          }
          @media (prefers-reduced-motion: reduce) {
            .pathogen-card:hover { transform: none; }
          }
        `}</style>
      </article>
    </Link>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Activity;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '0.6rem 0.65rem', background: 'rgba(15,23,42,0.38)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color, marginBottom: '0.25rem' }}>
        <Icon size={12} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</span>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontWeight: 650, fontSize: '0.95rem' }}>
        {formatNumber(value)}
      </div>
    </div>
  );
}
