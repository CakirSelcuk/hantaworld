'use client';
import { useState } from 'react';
import { CheckCircle, AlertTriangle, TrendingUp, ExternalLink } from 'lucide-react';
import type { SocialPost } from '@/lib/types';
import { timeAgo } from '@/lib/utils';

const PLATFORM_STYLES: Record<string, { label: string; color: string }> = {
  twitter:  { label: 'X / Twitter', color: '#1d9bf0' },
  official: { label: 'Official',    color: '#22c55e' },
  reddit:   { label: 'Reddit',      color: '#ff4500' },
  youtube:  { label: 'YouTube',     color: '#ff0000' },
  tiktok:   { label: 'TikTok',      color: '#69c9d0' },
};

const TABS = ['all', 'official', 'twitter', 'reddit'] as const;

export default function SocialIntelligence({ posts }: { posts: SocialPost[] }) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const filtered = activeTab === 'all' ? posts : posts.filter(p => p.platform === activeTab);

  return (
    <section style={{ padding: '2rem 0' }}>
      <div className="container-main">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem', flexWrap:'wrap', gap:'0.75rem' }}>
          <div className="section-header" style={{ margin:0 }}>Social Trend Intelligence</div>
          <div style={{ display:'flex', gap:'0.35rem' }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ fontFamily:'var(--font-mono)', fontSize:'0.62rem', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', padding:'0.3rem 0.7rem', borderRadius:'5px', border: activeTab === tab ? '1px solid rgba(59,130,246,0.4)' : '1px solid var(--border-glass)', background: activeTab === tab ? 'rgba(59,130,246,0.12)' : 'transparent', color: activeTab === tab ? '#93c5fd' : 'var(--text-muted)', cursor:'pointer', transition:'all 0.15s ease' }}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.6rem 0.9rem', background:'rgba(234,179,8,0.06)', border:'1px solid rgba(234,179,8,0.15)', borderRadius:'8px', marginBottom:'1rem' }}>
          <AlertTriangle size={13} color="#fde047" />
          <span style={{ fontFamily:'var(--font-ui)', fontSize:'0.72rem', color:'#fde047' }}>
            Social content is NOT independently verified. Always cross-reference with official sources. Misinformation is flagged where detected.
          </span>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'0.65rem' }}>
          {filtered.map(post => {
            const platform = PLATFORM_STYLES[post.platform];
            return (
              <div key={post.id} className="glass-card" style={{ padding:'1.1rem 1.25rem', borderLeft: post.isMisinformation ? '3px solid #ef4444' : post.verificationStatus === 'verified' ? '3px solid #22c55e' : '3px solid transparent' }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:'0.75rem' }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem', flexWrap:'wrap' }}>
                      <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.62rem', fontWeight:700, color:platform.color, padding:'0.12rem 0.4rem', borderRadius:'3px', background:`${platform.color}15` }}>
                        {platform.label}
                      </span>
                      <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', color:'var(--text-secondary)', fontWeight:600 }}>
                        {post.authorHandle}
                      </span>
                      {post.verificationStatus === 'verified' && (
                        <span style={{ display:'inline-flex', alignItems:'center', gap:'0.25rem', fontFamily:'var(--font-mono)', fontSize:'0.58rem', color:'#86efac' }}>
                          <CheckCircle size={9} /> OFFICIAL
                        </span>
                      )}
                      {post.isMisinformation && (
                        <span style={{ display:'inline-flex', alignItems:'center', gap:'0.25rem', fontFamily:'var(--font-mono)', fontSize:'0.58rem', color:'#fca5a5', background:'rgba(239,68,68,0.1)', padding:'0.12rem 0.4rem', borderRadius:'3px' }}>
                          <AlertTriangle size={9} /> MISINFORMATION RISK
                        </span>
                      )}
                      <span style={{ marginLeft:'auto', fontFamily:'var(--font-mono)', fontSize:'0.6rem', color:'var(--text-muted)' }}>
                        {timeAgo(post.publishedAt)}
                      </span>
                    </div>

                    <p style={{ color:'var(--text-secondary)', fontSize:'0.82rem', lineHeight:1.65 }}>
                      {post.content}
                    </p>

                    {post.isMisinformation && post.misinformationNote && (
                      <div style={{ marginTop:'0.5rem', padding:'0.5rem 0.75rem', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'6px' }}>
                        <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.72rem', color:'#fca5a5' }}>⚠ {post.misinformationNote}</p>
                      </div>
                    )}

                    <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginTop:'0.6rem' }}>
                      <span style={{ display:'flex', alignItems:'center', gap:'0.3rem', fontFamily:'var(--font-mono)', fontSize:'0.62rem', color:'var(--text-muted)' }}>
                        <TrendingUp size={10} /> {post.engagementScore.toLocaleString()} engagements
                      </span>
                      <a href={post.url} target="_blank" rel="noopener noreferrer"
                        style={{ display:'inline-flex', alignItems:'center', gap:'0.25rem', fontFamily:'var(--font-ui)', fontSize:'0.7rem', color:'var(--color-brand)', textDecoration:'none' }}>
                        View source <ExternalLink size={9} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
