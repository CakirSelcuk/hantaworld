'use client';
import Link from 'next/link';
import { CheckCircle, Clock, AlertCircle, ExternalLink, Brain } from 'lucide-react';
import type { Article } from '@/lib/types';
import { timeAgo } from '@/lib/utils';

const CATEGORY_LABELS: Record<string, string> = {
  'outbreak-report':    'Outbreak Report',
  'scientific-research':'Research',
  'public-health':      'Public Health',
  'travel-advisory':    'Travel Advisory',
  'prevention':         'Prevention',
  'analysis':           'Analysis',
};

const CATEGORY_COLORS: Record<string, string> = {
  'outbreak-report':    '#ef4444',
  'scientific-research':'#3b82f6',
  'public-health':      '#8b5cf6',
  'travel-advisory':    '#f97316',
  'prevention':         '#22c55e',
  'analysis':           '#06b6d4',
};

function VerificationBadge({ status }: { status: string }) {
  if (status === 'verified')   return <span className="badge-base badge-verified"><CheckCircle size={10} /> VERIFIED</span>;
  if (status === 'pending')    return <span className="badge-base badge-monitoring"><Clock size={10} /> PENDING</span>;
  return <span className="badge-base badge-unverified"><AlertCircle size={10} /> UNVERIFIED</span>;
}

export default function LatestReports({ articles }: { articles: Article[] }) {
  const [featured, ...rest] = articles;
  return (
    <section style={{ padding: '2rem 0' }}>
      <div className="container-main">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
          <div className="section-header" style={{ margin: 0 }}>Intelligence Feed</div>
          <Link href="/news" style={{ fontFamily:'var(--font-ui)', fontSize:'0.75rem', color:'var(--color-brand)', textDecoration:'none' }}>
            All reports →
          </Link>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
          {/* Featured article */}
          {featured && (
            <div className="glass-card" style={{ padding:'1.75rem', gridRow:'span 2' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem', flexWrap:'wrap' }}>
                <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.6rem', fontWeight:700, color: CATEGORY_COLORS[featured.category], background:`${CATEGORY_COLORS[featured.category]}15`, padding:'0.15rem 0.5rem', borderRadius:'4px', border:`1px solid ${CATEGORY_COLORS[featured.category]}28` }}>
                  {CATEGORY_LABELS[featured.category]}
                </span>
                <VerificationBadge status={featured.verificationStatus} />
                {featured.source && (
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.6rem', color:'var(--text-muted)' }}>
                    {featured.source.organization}
                  </span>
                )}
              </div>

              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.15rem', fontWeight:600, lineHeight:1.35, color:'var(--text-primary)', marginBottom:'0.85rem', letterSpacing:'-0.01em' }}>
                {featured.title}
              </h2>
              <p style={{ color:'var(--text-secondary)', fontSize:'0.82rem', lineHeight:1.7, marginBottom:'1.25rem' }}>
                {featured.excerpt}
              </p>

              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', flexWrap:'wrap' }}>
                <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', color:'var(--text-muted)' }}>
                  {timeAgo(featured.publishedAt)} · {featured.readingTimeMin} min read
                </span>
                <Link href={`/news/${featured.slug}`} style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', fontFamily:'var(--font-ui)', fontSize:'0.75rem', fontWeight:600, color:'var(--color-brand)', textDecoration:'none' }}>
                  Read report <ExternalLink size={11} />
                </Link>
              </div>

              {featured.tags.length > 0 && (
                <div style={{ display:'flex', gap:'0.4rem', marginTop:'1rem', flexWrap:'wrap' }}>
                  {featured.tags.map(tag => (
                    <span key={tag} style={{ fontFamily:'var(--font-mono)', fontSize:'0.6rem', color:'var(--text-muted)', padding:'0.15rem 0.4rem', border:'1px solid var(--border-subtle)', borderRadius:'4px' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Rest of articles */}
          {rest.slice(0, 4).map((article) => (
            <Link key={article.id} href={`/news/${article.slug}`} style={{ textDecoration:'none' }}>
              <div className="glass-card" style={{ padding:'1.1rem 1.25rem', height:'100%' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.6rem', flexWrap:'wrap' }}>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.58rem', fontWeight:700, color: CATEGORY_COLORS[article.category], background:`${CATEGORY_COLORS[article.category]}15`, padding:'0.12rem 0.4rem', borderRadius:'3px' }}>
                    {CATEGORY_LABELS[article.category]}
                  </span>
                  <VerificationBadge status={article.verificationStatus} />
                </div>
                <h3 style={{ fontFamily:'var(--font-ui)', fontSize:'0.82rem', fontWeight:600, color:'var(--text-primary)', lineHeight:1.4, marginBottom:'0.5rem' }}>
                  {article.title}
                </h3>
                <p style={{ color:'var(--text-secondary)', fontSize:'0.75rem', lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                  {article.excerpt}
                </p>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginTop:'0.75rem' }}>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.6rem', color:'var(--text-muted)' }}>
                    {timeAgo(article.publishedAt)}
                  </span>
                  {article.source && (
                    <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.6rem', color:'var(--text-muted)', borderLeft:'1px solid var(--border-subtle)', paddingLeft:'0.5rem' }}>
                      {article.source.name.split(' ')[0]}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
