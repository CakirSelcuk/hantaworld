'use client';

import { Camera, ExternalLink, Play } from 'lucide-react';
import type { InstagramPost } from '@/lib/types';

type InstagramUpdatesProps = {
  posts: InstagramPost[];
};

function getInstagramThumbnailUrl(postUrl: string) {
  try {
    const url = new URL(postUrl);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const type = pathParts[0];
    const shortcode = pathParts[1];

    if (!shortcode || !['p', 'reel', 'tv'].includes(type)) {
      return null;
    }

    return `https://www.instagram.com/${type}/${shortcode}/media/?size=l`;
  } catch {
    return null;
  }
}

export default function InstagramUpdates({ posts }: InstagramUpdatesProps) {
  const visiblePosts = posts.slice(0, 3);

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
          {visiblePosts.map((post) => {
            const thumbnailUrl = getInstagramThumbnailUrl(post.postUrl);

            return (
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

                <a
                  href={post.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ position: 'relative', display: 'block', overflow: 'hidden', borderRadius: 8, background: 'rgba(2,6,23,0.5)', border: '1px solid var(--border-subtle)', aspectRatio: '16 / 9', textDecoration: 'none' }}
                >
                  {thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumbnailUrl}
                      alt={post.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)', fontSize: '0.85rem' }}>
                      View on Instagram
                    </div>
                  )}
                  <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'linear-gradient(180deg, rgba(2,6,23,0.05), rgba(2,6,23,0.48))' }}>
                    <span style={{ width: 48, height: 48, borderRadius: '999px', display: 'grid', placeItems: 'center', background: 'rgba(15,23,42,0.78)', border: '1px solid rgba(255,255,255,0.22)', color: '#fff', boxShadow: '0 12px 32px rgba(0,0,0,0.28)' }}>
                      <Play size={19} fill="currentColor" />
                    </span>
                  </div>
                  <span style={{ position: 'absolute', left: 12, bottom: 10, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.76rem', fontWeight: 700, textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}>
                    Watch on Instagram <ExternalLink size={12} />
                  </span>
                </a>

                <a href={post.postUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.85rem', color: 'var(--color-brand)', textDecoration: 'none', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 600 }}>
                  Open post <ExternalLink size={13} />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
