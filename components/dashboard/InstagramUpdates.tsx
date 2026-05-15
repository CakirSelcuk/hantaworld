'use client';

import { useEffect } from 'react';
import { Camera, ExternalLink } from 'lucide-react';
import type { InstagramPost } from '@/lib/types';

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process: () => void;
      };
    };
  }
}

type InstagramUpdatesProps = {
  posts: InstagramPost[];
};

export default function InstagramUpdates({ posts }: InstagramUpdatesProps) {
  const visiblePosts = posts.slice(0, 3);

  useEffect(() => {
    if (visiblePosts.length === 0) return;

    if (window.instgrm?.Embeds) {
      window.instgrm.Embeds.process();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://www.instagram.com/embed.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => window.instgrm?.Embeds?.process(), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.onload = () => window.instgrm?.Embeds?.process();
    document.body.appendChild(script);
  }, [visiblePosts.length]);

  if (visiblePosts.length === 0) {
    return null;
  }

  return (
    <section style={{ padding: '3rem 0' }}>
      <div className="container-main">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div className="section-header" style={{ marginBottom: '0.65rem' }}>Instagram Updates</div>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.88rem', lineHeight: 1.7, maxWidth: 620 }}>
              Selected posts from the HantaWorld Instagram feed. Public health figures on this site remain source-verified separately from social media content.
            </p>
          </div>
          <Camera size={22} color="#f472b6" aria-hidden="true" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', alignItems: 'start' }}>
          {visiblePosts.map((post) => (
            <article key={post.id} className="glass-card" style={{ padding: '1rem', minHeight: 220 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', margin: 0, color: 'var(--text-primary)' }}>
                    {post.title}
                  </h3>
                  {post.description && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: 1.6, margin: '0.35rem 0 0' }}>
                      {post.description}
                    </p>
                  )}
                </div>
                {post.isFeatured && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#f9a8d4', padding: '0.25rem 0.45rem', borderRadius: 6, background: 'rgba(244,114,182,0.1)', border: '1px solid rgba(244,114,182,0.22)' }}>
                    FEATURED
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', placeItems: 'center', overflow: 'hidden', borderRadius: 8, background: 'rgba(2,6,23,0.35)', border: '1px solid var(--border-subtle)', minHeight: 160 }}>
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={post.postUrl}
                  data-instgrm-version="14"
                  style={{ background: '#fff', border: 0, borderRadius: 3, boxShadow: 'none', margin: 0, maxWidth: 540, minWidth: 260, width: '100%' }}
                >
                  <a href={post.postUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '1rem', color: '#2563eb', textDecoration: 'none', fontFamily: 'var(--font-ui)', fontSize: '0.8rem' }}>
                    View on Instagram <ExternalLink size={13} />
                  </a>
                </blockquote>
              </div>

              <a href={post.postUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.85rem', color: 'var(--color-brand)', textDecoration: 'none', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 600 }}>
                Open post <ExternalLink size={13} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
