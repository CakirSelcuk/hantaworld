import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

const FOOTER_LINKS = {
  Platform: [
    { label: 'Dashboard', href: '/' },
    { label: 'Live Map', href: '/map' },
    { label: 'Intelligence Feed', href: '/news' },
    { label: 'Alert Subscriptions', href: '/alerts' },
    { label: 'About', href: '/about' },
  ],
  'Hantavirus Guides': [
    { label: 'What is Hantavirus?', href: '/hantavirus' },
    { label: 'Hantavirus Symptoms', href: '/hantavirus-symptoms' },
    { label: 'Andes Virus', href: '/andes-virus' },
    { label: 'Live Outbreak Map', href: '/map' },
  ],
  'Data & Sources': [
    { label: 'WHO Disease Outbreak News', href: 'https://www.who.int/emergencies/disease-outbreak-news', external: true },
    { label: 'CDC Hantavirus', href: 'https://www.cdc.gov/hantavirus', external: true },
    { label: 'ECDC Surveillance', href: 'https://www.ecdc.europa.eu', external: true },
    { label: 'Source Methodology', href: '/about/methodology' },
  ],
  Legal: [
    { label: 'Medical Disclaimer', href: '/legal/disclaimer' },
    { label: 'Editorial Policy', href: '/legal/editorial-policy' },
    { label: 'Privacy Policy', href: '/legal/privacy' },
    { label: 'Transparency & Methodology', href: '/about/methodology' },
  ],
};

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', marginTop: '5rem' }}>
      <div className="container-main" style={{ padding: '3rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2.25rem', flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 320 }}>
            <div style={{ marginBottom: '1rem' }}>
              <Image
                src="/hantaLogo.png"
                alt="HantaWorld Logo"
                width={160}
                height={80}
                style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.9 }}
              />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.7, marginBottom: '1rem' }}>
              A real-time global hantavirus outbreak intelligence platform. All published data is sourced from verified public health authorities and traceable primary reports.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: '6px', width: 'fit-content' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#fdba74', letterSpacing: '0.08em' }}>MEDICAL DISCLAIMER</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', marginTop: '0.6rem', lineHeight: 1.6, borderLeft: '2px solid rgba(249,115,22,0.4)', paddingLeft: '0.6rem' }}>
              This platform is for informational purposes only. Always consult licensed medical professionals for health decisions.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {section}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      target={'external' in link && link.external ? '_blank' : undefined}
                      rel={'external' in link && link.external ? 'noopener noreferrer' : undefined}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.15s ease' }}
                      className="footer-link"
                    >
                      {link.label}
                      {'external' in link && link.external && <ExternalLink size={10} />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
            © {new Date().getFullYear()} HantaWorld. Data sourced from WHO, CDC, ECDC, and official public health bulletins.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {['WHO', 'CDC', 'ECDC'].map((source) => (
              <span key={source} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.05em', padding: '0.2rem 0.5rem', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}>
                {source}
              </span>
            ))}
          </div>
        </div>
      </div>
      <style>{`.footer-link:hover { color: var(--text-secondary) !important; }`}</style>
    </footer>
  );
}
