'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Activity, Bell, BookOpen, Camera, Globe, Menu, Newspaper, Shield, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Dashboard', icon: Activity },
  { href: '/map', label: 'Live Map', icon: Globe },
  { href: '/news', label: 'Intelligence', icon: Newspaper },
  { href: '/hantavirus', label: 'Hantavirus', icon: BookOpen },
  { href: '/alerts', label: 'Alerts', icon: Bell },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isActiveRoute = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/hantavirus') return pathname === href || ['/hantavirus-symptoms', '/andes-virus'].includes(pathname);
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? 'rgba(10,15,30,0.96)' : 'rgba(10,15,30,0.76)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(148,163,184,0.14)' : '1px solid rgba(148,163,184,0.06)',
        transition: 'all 0.3s ease',
      }}
    >
      <div className="container-main" style={{ display: 'flex', alignItems: 'center', height: 64, gap: '2rem' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', flexShrink: 0 }}>
          <Image
            src="/hantaLogo.png"
            alt="HantaWorld Logo"
            width={36}
            height={36}
            style={{ objectFit: 'contain' }}
          />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Hanta<span style={{ color: '#38bdf8' }}>World</span>
          </span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1 }} className="desktop-nav">
          {NAV_LINKS.map(({ href, label }) => {
            const active = isActiveRoute(href);
            return (
              <Link
                key={href}
                href={href}
                className={`nav-link${active ? ' active' : ''}`}
                style={{ padding: '0.48rem 0.78rem', borderRadius: '8px', background: active ? 'rgba(14,165,233,0.12)' : 'transparent' }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
          <div className="nav-status-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.35rem 0.75rem', borderRadius: '999px', background: 'rgba(14,165,233,0.10)', border: '1px solid rgba(14,165,233,0.24)' }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: '#38bdf8', boxShadow: '0 0 12px rgba(56,189,248,0.65)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 600, color: '#bae6fd', letterSpacing: '0.08em' }}>LIVE MAP</span>
          </div>

          <Link
            href="https://www.instagram.com/hanta.world/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="HantaWorld Instagram"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '8px', border: '1px solid rgba(244,114,182,0.24)', color: '#f472b6', transition: 'all 0.2s ease', textDecoration: 'none', background: 'rgba(244,114,182,0.08)' }}
            className="btn-ghost"
          >
            <Camera size={15} />
          </Link>

          <Link
            href="/about/methodology"
            aria-label="Methodology"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '8px', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text-secondary)', transition: 'all 0.2s ease', textDecoration: 'none' }}
            className="btn-ghost nav-methodology-link"
          >
            <Shield size={15} />
          </Link>

          <Link href="/alerts" className="btn btn-primary nav-alert-cta" style={{ fontSize: '0.72rem', padding: '0.45rem 0.95rem' }}>
            Get Alerts
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.25rem' }}
            className="mobile-menu-btn"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={{ background: 'rgba(10,15,30,0.98)', borderTop: '1px solid var(--border-glass)', padding: '1rem 1.5rem 1.5rem' }}>
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = isActiveRoute(href);

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 0', borderBottom: '1px solid var(--border-subtle)', textDecoration: 'none', color: active ? 'var(--color-brand)' : 'var(--text-secondary)', fontFamily: 'var(--font-ui)', fontSize: '0.875rem' }}
              >
                <Icon size={16} /> {label}
              </Link>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .nav-status-badge,
          .nav-methodology-link,
          .nav-alert-cta { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
