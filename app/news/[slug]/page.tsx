import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getArticleBySlug } from '@/lib/data';
import { timeAgo } from '@/lib/utils';
import { CheckCircle, Clock, AlertCircle, ArrowLeft, ExternalLink, Calendar, BookOpen, Share2 } from 'lucide-react';

const CATEGORY_META: Record<string, { label: string; color: string }> = {
  'outbreak-report':    { label: 'Outbreak Report',    color: '#ef4444' },
  'scientific-research':{ label: 'Research',           color: '#3b82f6' },
  'public-health':      { label: 'Public Health',      color: '#8b5cf6' },
  'travel-advisory':    { label: 'Travel Advisory',    color: '#f97316' },
  'prevention':         { label: 'Prevention',         color: '#22c55e' },
  'analysis':           { label: 'Analysis',           color: '#06b6d4' },
};

function VerificationBadge({ status }: { status: string }) {
  const styles: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' };
  if (status === 'verified') return <span className="badge-verified" style={styles}><CheckCircle size={10} /> VERIFIED</span>;
  if (status === 'pending')  return <span className="badge-monitoring" style={styles}><Clock size={10} /> PENDING</span>;
  return <span className="badge-unverified" style={styles}><AlertCircle size={10} /> UNVERIFIED</span>;
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

  const cat = CATEGORY_META[article.category];

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--bg-primary)' }}>
        
        {/* Top Navigation Bar */}
        <div style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', position: 'sticky', top: 64, zIndex: 10 }}>
          <div className="container-main" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/news" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}>
              <ArrowLeft size={14} /> Back to Intelligence Feed
            </Link>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-ui)', fontSize: '0.75rem' }}>
                <Share2 size={13} /> Share
              </button>
            </div>
          </div>
        </div>

        <article className="container-main" style={{ padding: '3rem 1.5rem', maxWidth: 880 }}>
          {/* Header Metadata */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, color: cat.color, background: `${cat.color}15`, padding: '0.2rem 0.6rem', borderRadius: '4px', border: `1px solid ${cat.color}28` }}>
              {cat.label}
            </span>
            <VerificationBadge status={article.verificationStatus} />
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
            {article.title}
          </h1>

          {/* Article Info Bar */}
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
                <Calendar size={13} color="var(--text-muted)" /> {new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '1.5rem' }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Read Time</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                <BookOpen size={13} color="var(--text-muted)" /> {article.readingTimeMin} min read
              </div>
            </div>
          </div>

          {/* Excerpt / Lead Paragraph */}
          <div style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-primary)', fontWeight: 400, marginBottom: '2.5rem' }}>
            <p>{article.excerpt}</p>
          </div>

          {/* Placeholder Content (To be replaced by real markdown/HTML rendering later) */}
          <div className="article-content" style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              This is a placeholder for the full article content. In the final system, this area will render the full text from the backend API or markdown files. The structure is built to handle complex typography, tables, and embedded media, adhering to strict security headers and CSP.
            </p>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>Epidemiological Context</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              Field response teams are currently isolating the affected regions and conducting contact tracing. Early serological testing indicates a high viral load in the initial clusters. The international response includes logistics for specialized PPE and mobile testing units.
            </p>
            <div style={{ padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: '12px', marginBottom: '1.5rem' }}>
              <h4 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertCircle size={14} color="var(--color-brand)" /> Intelligence Note
              </h4>
              <p style={{ fontSize: '0.9rem' }}>
                All data is preliminary and subject to change as the epidemiological investigation continues. Always cross-reference with official local health ministry statements.
              </p>
            </div>
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>Tags:</span>
              {article.tags.map(tag => (
                <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-secondary)', padding: '0.2rem 0.6rem', border: '1px solid var(--border-subtle)', borderRadius: '4px', background: 'var(--bg-secondary)' }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Source Citations */}
          {article.citations && article.citations.length > 0 && (
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)', borderRadius: '12px' }}>
              <h4 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                Source Citations & References
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {article.citations.map((citation, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-brand)' }}>[{i + 1}]</span>
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
