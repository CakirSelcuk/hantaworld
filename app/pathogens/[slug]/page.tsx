import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Activity, ArrowLeft, ArrowRight, Calendar, ExternalLink, Globe2, ShieldCheck, Skull, Users } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getArticlesByPathogen, getPathogenBySlug, getPathogenTrend } from '@/lib/data';
import type { Article, Pathogen, PathogenStats } from '@/lib/types';
import { formatDate, formatNumber } from '@/lib/utils';

export const dynamic = 'force-dynamic';

function hasValue(value: number | null | undefined): value is number {
  return value !== null && value !== undefined;
}

function hasAnyStats(stats?: PathogenStats | null) {
  if (!stats) return false;
  return [stats.reportedCases, stats.totalDeaths, stats.affectedCountries, stats.activeOutbreaks].some(hasValue);
}

function buildDescription(pathogen: Pathogen) {
  return pathogen.shortDescription || `${pathogen.displayName} outbreak intelligence and source-attributed public health updates.`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pathogen = await getPathogenBySlug(slug);

  if (!pathogen) {
    return { title: 'Pathogen Not Found | HantaWorld' };
  }

  const canonical = `https://www.hantaworld.com/pathogens/${pathogen.slug}`;
  const description = buildDescription(pathogen);

  return {
    title: `${pathogen.displayName} Intelligence | HantaWorld`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${pathogen.displayName} Intelligence | HantaWorld`,
      description,
      url: canonical,
      type: 'website',
    },
  };
}

export default async function PathogenDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [pathogen, trend, articles] = await Promise.all([
    getPathogenBySlug(slug),
    getPathogenTrend(slug),
    getArticlesByPathogen(slug),
  ]);

  if (!pathogen) {
    notFound();
  }

  const stats = pathogen.stats;
  const statsAvailable = hasAnyStats(stats);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: '100vh' }}>
        <section style={{ padding: '2.75rem 0 2rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="container-main">
            <Link href="/pathogens" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
              <ArrowLeft size={14} /> Back to Pathogen Watch
            </Link>

            <div style={{ maxWidth: 900 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '1rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: 999, background: pathogen.color, boxShadow: `0 0 20px ${pathogen.color}80` }} />
                <span style={{ fontFamily: 'var(--font-mono)', color: pathogen.color, fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  Source-attributed profile
                </span>
              </div>

              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 4.2rem)', fontWeight: 750, letterSpacing: '-0.035em', lineHeight: 1.04, marginBottom: '1rem' }}>
                {pathogen.displayName} Intelligence
              </h1>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.75, maxWidth: 780, marginBottom: '1.2rem' }}>
                {buildDescription(pathogen)}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.28rem 0.65rem', borderRadius: 999, border: `1px solid ${pathogen.color}40`, color: pathogen.color, background: `${pathogen.color}12`, fontFamily: 'var(--font-mono)', fontSize: '0.64rem' }}>
                  <ShieldCheck size={11} /> Latest available verified-source updates
                </span>
                {stats?.lastVerifiedAt && (
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.64rem' }}>
                    Last verified: {formatDate(stats.lastVerifiedAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '2.5rem 0' }}>
          <div className="container-main" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '1rem', alignItems: 'start' }}>
            <div>
              <div className="section-header">Current Statistics</div>

              {statsAvailable ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                  {hasValue(stats?.reportedCases) && <StatCard icon={Activity} label="Reported Cases" value={stats.reportedCases} color="#38bdf8" />}
                  {hasValue(stats?.totalDeaths) && <StatCard icon={Skull} label="Total Deaths" value={stats.totalDeaths} color="#ef4444" />}
                  {hasValue(stats?.affectedCountries) && <StatCard icon={Globe2} label="Affected Countries" value={stats.affectedCountries} color="#818cf8" />}
                  {hasValue(stats?.activeOutbreaks) && <StatCard icon={Users} label="Active Outbreaks" value={stats.activeOutbreaks} color="#f59e0b" />}
                </div>
              ) : (
                <div className="glass-card" style={{ padding: '1.25rem', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontSize: '0.84rem', marginBottom: '1rem' }}>
                  No verified statistics are available for this profile yet.
                </div>
              )}

              <div className="glass-card" style={{ padding: '1.1rem', marginBottom: '1.25rem' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.8rem' }}>
                  Source and verification
                </h2>

                <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '0.8rem', margin: 0 }}>
                  {stats?.sourceInstitution && <InfoItem label="Source Institution" value={stats.sourceInstitution} />}
                  {stats?.officialPublishedAt && <InfoItem label="Official Published" value={formatDate(stats.officialPublishedAt)} />}
                  {stats?.lastVerifiedAt && <InfoItem label="Last Verified" value={formatDate(stats.lastVerifiedAt)} />}
                  {trend.length > 0 && <InfoItem label="Historical Snapshots" value={String(trend.length)} />}
                </dl>

                {stats?.notes && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: 1.65, marginTop: '1rem' }}>
                    {stats.notes}
                  </p>
                )}

                {stats?.sourceUrl && (
                  <a href={stats.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-brand)', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', textDecoration: 'none', marginTop: '1rem' }}>
                    Open source link <ExternalLink size={11} />
                  </a>
                )}
              </div>

              <div className="glass-card" style={{ padding: '1.1rem', borderColor: 'rgba(14,165,233,0.18)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
                  Medical disclaimer
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: 1.7 }}>
                  HantaWorld provides source-attributed public health intelligence for informational purposes only.
                  It does not provide medical diagnosis, treatment, or emergency guidance. Always follow official
                  health authorities and licensed clinicians.
                </p>
              </div>
            </div>

            <aside className="glass-card" style={{ padding: '1.1rem', position: 'sticky', top: 88 }}>
              <div className="section-header" style={{ marginBottom: '1rem' }}>Related Intelligence</div>

              {articles.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {articles.slice(0, 5).map((article) => (
                    <RelatedArticle key={article.id} article={article} accent={pathogen.color} />
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', lineHeight: 1.6 }}>
                  No published intelligence feed records are currently linked to this profile.
                </p>
              )}

              <Link href={`/news?pathogen=${pathogen.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-brand)', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', textDecoration: 'none', marginTop: '1rem' }}>
                View intelligence feed <ArrowRight size={12} />
              </Link>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function StatCard({
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
    <div className="glass-card" style={{ padding: '1rem', borderLeft: `3px solid ${color}`, boxShadow: `0 16px 36px rgba(0,0,0,0.24), 0 0 24px ${color}18` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color, marginBottom: '0.8rem' }}>
        <Icon size={15} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {label}
        </span>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.45rem' }}>
        {formatNumber(value)}
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
        {label}
      </dt>
      <dd style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', margin: 0 }}>
        {value}
      </dd>
    </div>
  );
}

function RelatedArticle({ article, accent }: { article: Article; accent: string }) {
  return (
    <Link href={`/news/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <article style={{ padding: '0.85rem', border: '1px solid var(--border-subtle)', borderLeft: `3px solid ${accent}`, borderRadius: 10, background: 'rgba(15,23,42,0.42)' }}>
        <h3 style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-primary)', fontSize: '0.82rem', lineHeight: 1.45, marginBottom: '0.45rem' }}>
          {article.title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.62rem' }}>
          <Calendar size={11} /> {formatDate(article.publishedAt)}
        </div>
      </article>
    </Link>
  );
}
