import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PathogenCard from '@/components/pathogens/PathogenCard';
import { getPathogens } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Pathogen Watch | HantaWorld',
  description:
    'Browse HantaWorld pathogen and outbreak intelligence profiles with source-attributed public health updates.',
  alternates: { canonical: 'https://www.hantaworld.com/pathogens' },
  openGraph: {
    title: 'Pathogen Watch | HantaWorld',
    description: 'Source-attributed pathogen and outbreak intelligence profiles from HantaWorld.',
    url: 'https://www.hantaworld.com/pathogens',
    type: 'website',
  },
};

export default async function PathogensPage() {
  const pathogens = await getPathogens();

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: '100vh' }}>
        <section style={{ padding: '5rem 0 2rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="container-main">
            <div style={{ maxWidth: 860 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '1rem' }}>
                <ShieldCheck size={16} color="#38bdf8" />
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-brand)', fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  Pathogen Watch
                </span>
              </div>

              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 750, letterSpacing: '-0.035em', lineHeight: 1.05, marginBottom: '1rem' }}>
                Global pathogen and outbreak intelligence profiles
              </h1>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.75, maxWidth: 760 }}>
                Explore source-attributed profiles for monitored pathogens and public health intelligence categories.
                Statistics are shown only when verified records exist in the live HantaWorld API.
              </p>
            </div>
          </div>
        </section>

        <section style={{ padding: '2.5rem 0 4rem' }}>
          <div className="container-main">
            {pathogens.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 270px), 1fr))', gap: '1rem' }}>
                {pathogens.map((pathogen) => (
                  <PathogenCard key={pathogen.slug} pathogen={pathogen} featured={pathogen.slug === 'hantavirus'} />
                ))}
              </div>
            ) : (
              <div className="glass-card" style={{ padding: '1.5rem', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontSize: '0.86rem' }}>
                No active pathogen profiles are available from the live API yet.
              </div>
            )}

            <div style={{ marginTop: '2rem' }}>
              <Link href="/news" className="btn btn-ghost" style={{ padding: '0.72rem 1rem' }}>
                Read Intelligence Feed <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
