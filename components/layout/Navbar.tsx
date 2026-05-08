'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Globe, Newspaper, Bell, Search, Menu, X, Shield } from 'lucide-react';

const NAV_LINKS = [
  { href: '/',       label: 'Dashboard', icon: Activity },
  { href: '/map',    label: 'Live Map',  icon: Globe },
  { href: '/news',   label: 'Intelligence', icon: Newspaper },
  { href: '/alerts', label: 'Alerts',    icon: Bell },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [mounted, setMounted]     = useState(false);

  useEffect(() => {
    setMounted(true);
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(7,11,20,0.95)' : 'rgba(7,11,20,0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}
    >
      <div className="container-main" style={{ display: 'flex', alignItems: 'center', height: 64, gap: '2rem' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '8px',
            background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(239,68,68,0.35)',
          }}>
            <Shield size={16} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Hanta<span style={{ color: '#ef4444' }}>World</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1 }} className="desktop-nav">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className={`nav-link${active ? ' active' : ''}`}
                style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', background: active ? 'rgba(59,130,246,0.1)' : 'transparent' }}>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
          {/* Live indicator & Timestamp */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.7rem', borderRadius: '999px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <span className="pulse-dot" style={{ width: 6, height: 6 }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 600, color: '#fca5a5', letterSpacing: '0.08em' }}>LIVE</span>
            </div>
            {mounted && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)' }} className="desktop-timestamp">
                UPDATED: {new Date().toISOString().split('T')[0]}
              </span>
            )}
          </div>

          <Link href="/search" aria-label="Search" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '8px', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text-secondary)', transition: 'all 0.2s ease', textDecoration: 'none' }}
            className="btn-ghost">
            <Search size={15} />
          </Link>

          <Link href="/alerts" className="btn btn-danger" style={{ fontSize: '0.72rem', padding: '0.4rem 0.9rem' }}>
            Subscribe Alerts
          </Link>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu"
            style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.25rem' }}
            className="mobile-menu-btn">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: 'rgba(7,11,20,0.98)', borderTop: '1px solid var(--border-glass)', padding: '1rem 1.5rem 1.5rem' }}>
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border-subtle)', textDecoration: 'none', color: pathname === href ? 'var(--color-brand)' : 'var(--text-secondary)', fontFamily: 'var(--font-ui)', fontSize: '0.875rem' }}>
              <Icon size={16} /> {label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .desktop-timestamp { display: none !important; }
        }
      `}</style>
    </header>
  );
}
