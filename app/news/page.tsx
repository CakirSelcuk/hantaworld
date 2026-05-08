import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getArticles } from '@/lib/data';
import { timeAgo } from '@/lib/utils';
import { CheckCircle, Clock, AlertCircle, ExternalLink, Filter } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Intelligence Feed',
  description: 'Verified hantavirus outbreak reports, scientific research, travel advisories, and public health updates from WHO, CDC, ECDC and peer-reviewed sources.',
};

const CATEGORY_META: Record<string, { label: string; color: string }> = {
  'outbreak-report':    { label: 'Outbreak Report',    color: '#ef4444' },
  'scientific-research':{ label: 'Research',           color: '#3b82f6' },
  'public-health':      { label: 'Public Health',      color: '#8b5cf6' },
  'travel-advisory':    { label: 'Travel Advisory',    color: '#f97316' },
  'prevention':         { label: 'Prevention',         color: '#22c55e' },
  'analysis':           { label: 'Analysis',           color: '#06b6d4' },
};

function VerificationBadge({ status }: { status: string }) {
  const styles: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.6rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' };
  if (status === 'verified') return <span className="badge-verified" style={styles}><CheckCircle size={9} /> VERIFIED</span>;
  if (status === 'pending')  return <span className="badge-monitoring" style={styles}><Clock size={9} /> PENDING</span>;
  return <span className="badge-unverified" style={styles}><AlertCircle size={9} /> UNVERIFIED</span>;
}

export default async function NewsPage() {
  const articles = await getArticles();
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: '100vh' }}>
        <div className="container-main" style={{ padding: '3rem 1.5rem' }}>

          {/* Page header */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.15em', color: 'var(--color-brand)', textTransform: 'uppercase' }}>
                Verified Intelligence
              </span>
              <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, rgba(59,130,246,0.4), transparent)' }} />
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: '0.75rem' }}>
              Outbreak Intelligence Feed
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 600, lineHeight: 1.7 }}>
              Curated, verified reports from WHO, CDC, ECDC, ProMED, and peer-reviewed scientific publications.
              Every article includes source attribution, verification status, and confidence level.
            </p>
          </div>

          {/* Filter bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>
              <Filter size={13} />
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem' }}>Filter:</span>
            </div>
            {['All', ...Object.values(CATEGORY_META).map(m => m.label)].map((label) => (
              <button key={label} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', padding: '0.3rem 0.75rem', borderRadius: '5px', border: label === 'All' ? '1px solid rgba(59,130,246,0.4)' : '1px solid var(--border-glass)', background: label === 'All' ? 'rgba(59,130,246,0.12)' : 'transparent', color: label === 'All' ? '#93c5fd' : 'var(--text-muted)', cursor: 'pointer' }}>
                {label}
              </button>
            ))}
          </div>

          {/* Disclaimer */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.9rem 1.1rem', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.12)', borderRadius: '10px', marginBottom: '2rem' }}>
            <CheckCircle size={15} color="#60a5fa" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.77rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              All articles are reviewed by our editorial team against primary sources before publication. AI-assisted summaries are clearly labeled and always link to original documents. This platform does not publish unverified claims.
            </p>
          </div>

          {/* Articles grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {articles.map((article, idx) => {
              const cat = CATEGORY_META[article.category];
              return (
                <article key={article.id} className="glass-card" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: idx === 0 ? '1fr' : '1fr auto', gap: '1rem', alignItems: 'start' }}>
                  <div>
                    {/* Meta row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, color: cat.color, background: `${cat.color}15`, padding: '0.15rem 0.5rem', borderRadius: '4px', border: `1px solid ${cat.color}28` }}>
                        {cat.label}
                      </span>
                      <VerificationBadge status={article.verificationStatus} />
                      {article.source && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '0.5rem' }}>
                          {article.source.organization}
                        </span>
                      )}
                      <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                        {timeAgo(article.publishedAt)} · {article.readingTimeMin} min read
                      </span>
                    </div>

                    {/* Title */}
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: idx === 0 ? '1.2rem' : '0.95rem', fontWeight: 600, lineHeight: 1.35, color: 'var(--text-primary)', marginBottom: '0.6rem', letterSpacing: '-0.01em' }}>
                      {article.title}
                    </h2>

                    {/* Excerpt */}
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.7, marginBottom: '1rem', maxWidth: 780 }}>
                      {article.excerpt}
                    </p>

                    {/* Footer row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <Link href={`/news/${article.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-brand)', textDecoration: 'none' }}>
                        Read full report <ExternalLink size={11} />
                      </Link>

                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        {article.tags.slice(0, 3).map(tag => (
                          <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', padding: '0.12rem 0.4rem', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}>
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {article.citations.length > 0 && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#86efac', marginLeft: 'auto' }}>
                          {article.citations.length} citation{article.citations.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
