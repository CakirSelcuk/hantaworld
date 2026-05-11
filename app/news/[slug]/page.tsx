import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getArticleBySlug } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import { AlertCircle, ArrowLeft, BookOpen, Calendar, CheckCircle, Clock, ExternalLink } from 'lucide-react';

const CATEGORY_META: Record<string, { label: string; color: string }> = {
  'outbreak-report': { label: 'Outbreak Report', color: '#ef4444' },
  'scientific-research': { label: 'Research', color: '#3b82f6' },
  'public-health': { label: 'Public Health', color: '#8b5cf6' },
  'travel-advisory': { label: 'Travel Advisory', color: '#f97316' },
  prevention: { label: 'Prevention', color: '#22c55e' },
  analysis: { label: 'Analysis', color: '#06b6d4' },
};

function VerificationBadge({ status }: { status: string }) {
  const styles: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' };
  if (status === 'verified') return <span className="badge-verified" style={styles}><CheckCircle size={10} /> VERIFIED</span>;
  if (status === 'pending') return <span className="badge-monitoring" style={styles}><Clock size={10} /> PENDING</span>;
  return <span className="badge-unverified" style={styles}><AlertCircle size={10} /> UNVERIFIED</span>;
}

function renderArticleContent(content?: string) {
  if (!content) return null;

  const blocks = content
    .split('\n\n')
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block, index) => {
    const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
    const bulletLines = lines.filter((line) => line.startsWith('- '));

    if (bulletLines.length === lines.length) {
      return (
        <ul key={index} style={{ paddingLeft: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
          {bulletLines.map((line) => (
            <li key={line} style={{ marginBottom: '0.5rem' }}>{line.slice(2)}</li>
          ))}
        </ul>
      );
    }

    if (lines.length === 1 && lines[0].endsWith(':')) {
      return (
        <h3 key={index} style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>
          {lines[0].slice(0, -1)}
        </h3>
      );
    }

    return (
      <p key={index} style={{ marginBottom: '1.5rem' }}>
        {lines.join(' ')}
      </p>
    );
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: 'Not Found' };

  return {
    title: `${article.title} | Intelligence Feed`,
    description: article.excerpt,
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const category = CATEGORY_META[article.category];

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', position: 'sticky', top: 64, zIndex: 10 }}>
          <div className="container-main" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/news" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}>
              <ArrowLeft size={14} /> Back to Intelligence Feed
            </Link>
          </div>
        </div>

        <article className="container-main" style={{ padding: '3rem 1.5rem', maxWidth: 880 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, color: category.color, background: `${category.color}15`, padding: '0.2rem 0.6rem', borderRadius: '4px', border: `1px solid ${category.color}28` }}>
              {category.label}
            </span>
            <VerificationBadge status={article.verificationStatus} />
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
            {article.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            {article.source && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Source</span>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>{article.source.organization}</span>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '1.5rem' }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Published</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                <Calendar size={13} color="var(--text-muted)" /> {formatDate(article.publishedAt)}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '1.5rem' }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Read Time</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                <BookOpen size={13} color="var(--text-muted)" /> {article.readingTimeMin} min read
              </div>
            </div>
            {article.lastVerifiedDate && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '1.5rem' }}>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Verified</span>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  {formatDate(article.lastVerifiedDate)}
                </div>
              </div>
            )}
          </div>

          <div style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-primary)', fontWeight: 400, marginBottom: '2.5rem' }}>
            <p>{article.excerpt}</p>
          </div>

          <div className="article-content" style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
            {renderArticleContent(article.content)}
          </div>

          {article.tags.length > 0 && (
            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>Tags:</span>
              {article.tags.map((tag) => (
                <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-secondary)', padding: '0.2rem 0.6rem', border: '1px solid var(--border-subtle)', borderRadius: '4px', background: 'var(--bg-secondary)' }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {article.sourceUrl && (
            <div style={{ marginTop: '2rem' }}>
              <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--color-brand)', textDecoration: 'none' }}>
                View official source <ExternalLink size={11} />
              </a>
            </div>
          )}

          {article.citations && article.citations.length > 0 && (
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)', borderRadius: '12px' }}>
              <h4 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                Source Citations & References
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {article.citations.map((citation, index) => (
                  <li key={citation} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-brand)' }}>[{index + 1}]</span>
                    <a href={citation} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', wordBreak: 'break-all' }}>
                      {citation} <ExternalLink size={10} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
