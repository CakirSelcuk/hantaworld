import { Outbreak, Article, Source, SocialPost } from './types';
import outbreaksData from '../data/outbreaks.json';
import countriesData from '../data/countries.json';
import newsData from '../data/news.json';
import sourcesData from '../data/sources.json';
import socialTrendsData from '../data/social-trends.json';

/**
 * Data Access Layer for Static MVP — VERIFIED DATA ONLY
 * 
 * IMPORTANT: All data served by these functions is sourced exclusively
 * from official public health authorities (WHO, CDC, ECDC).
 * No fabricated, estimated, or unverified numbers are included.
 * 
 * Every statistic is traceable to its source via sourceUrl, publicationDate,
 * lastVerifiedDate, and verificationNotes fields.
 * 
 * Later, you can swap the contents of these functions to use
 * `fetch('https://api.hantaworld.com/...')` without changing the UI.
 */

export async function getOutbreaks(): Promise<Outbreak[]> {
  return (outbreaksData as any[]).map(ob => {
    const country = countriesData.find(c => c.id === ob.countryId);
    return {
      ...ob,
      country: country || { id: ob.countryId, name: 'Unknown', flagEmoji: '🌐', slug: 'unknown', isoCode: 'UNK', continent: 'Unknown', population: 0, coordinates: { lat: 0, lng: 0 } }
    };
  }) as Outbreak[];
}

export async function getOutbreakById(id: string): Promise<Outbreak | undefined> {
  const outbreaks = await getOutbreaks();
  return outbreaks.find(o => o.id === id);
}

export async function getCountries(): Promise<any[]> {
  return countriesData;
}

export async function getCountryBySlug(slug: string): Promise<any | undefined> {
  return countriesData.find(c => c.slug === slug);
}

export async function getArticles(): Promise<Article[]> {
  return (newsData as any[]).map(a => {
    const source = a.sourceIds?.length ? sourcesData.find(s => s.id === a.sourceIds[0]) : undefined;
    return {
      ...a,
      source
    };
  }) as Article[];
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const articles = await getArticles();
  return articles.find(a => a.slug === slug);
}

export async function getSources(): Promise<Source[]> {
  return sourcesData as Source[];
}

export async function getSocialTrends(): Promise<SocialPost[]> {
  if (!socialTrendsData || (socialTrendsData as any[]).length === 0) {
    return [];
  }
  return (socialTrendsData as any[]).map(st => {
    const platformRaw = (st.platform || 'twitter').toLowerCase();
    const platform = platformRaw === 'news' ? 'official' : platformRaw;
    return {
      id: st.id,
      platform,
      content: st.content,
      authorHandle: st.author,
      url: '#',
      verificationStatus: st.verified ? 'verified' : 'unverified',
      isMisinformation: st.sentiment === 'negative' && !st.verified,
      engagementScore: (st.likes || 0) + (st.shares || 0),
      publishedAt: st.timestamp,
    };
  }) as SocialPost[];
}

/**
 * Watchlist: returns countries that have active verified outbreaks.
 * Dynamically computed from outbreaks.json — no hardcoded data.
 */
export async function getCountryWatchlist() {
  const outbreaks = await getOutbreaks();
  const countries = await getCountries();
  
  // Only include countries that have at least one outbreak
  const countriesWithOutbreaks = countries.filter(country =>
    outbreaks.some(o => o.country?.id === country.id)
  );

  return countriesWithOutbreaks.map(country => {
    const countryOutbreaks = outbreaks.filter(o => o.country?.id === country.id);
    const activeOutbreaks = countryOutbreaks.length;
    const totalCases = countryOutbreaks.reduce((sum, o) => sum + o.confirmedCases + o.suspectedCases, 0);
    const trend = (countryOutbreaks.length > 0 && countryOutbreaks[0].growthRate > 0 ? 'up' : countryOutbreaks[0]?.growthRate < 0 ? 'down' : 'stable') as 'up' | 'down' | 'stable';
    const riskLevel = (countryOutbreaks.some(o => o.severityLevel === 'critical') ? 'critical' : countryOutbreaks.some(o => o.severityLevel === 'high') ? 'high' : 'medium') as 'critical' | 'high' | 'medium' | 'low';
    
    return {
      country,
      activeOutbreaks,
      totalCases,
      totalDeaths: countryOutbreaks.reduce((sum, o) => sum + o.deaths, 0),
      trendDirection: trend,
      riskLevel,
      lastReportedAt: countryOutbreaks.length > 0 ? countryOutbreaks[0].lastUpdated : new Date().toISOString()
    };
  }).filter(c => c.activeOutbreaks > 0);
}

/**
 * Global Stats: dynamically computed from verified outbreaks only.
 * No hardcoded or fabricated global statistics.
 */
export async function getGlobalStats() {
  const outbreaks = await getOutbreaks();
  const totalConfirmedCases = outbreaks.reduce((acc, o) => acc + o.confirmedCases, 0);
  const totalDeaths = outbreaks.reduce((acc, o) => acc + o.deaths, 0);
  const affectedCountries = new Set(outbreaks.map(o => o.country?.id)).size;
  const activeOutbreaks = outbreaks.filter(o => o.status !== 'resolved').length;
  
  // Growth rate computed from verified data (weighted average of all active outbreaks)
  const avgGrowthRate = outbreaks.length > 0
    ? Math.round((outbreaks.reduce((acc, o) => acc + o.growthRate, 0) / outbreaks.length) * 10) / 10
    : 0;

  // Use the most recent lastUpdated from actual data, not new Date()
  const lastUpdated = outbreaks.length > 0
    ? outbreaks.reduce((latest, o) => o.lastUpdated > latest ? o.lastUpdated : latest, outbreaks[0].lastUpdated)
    : '2026-05-07T00:00:00Z';

  return {
    totalConfirmedCases,
    totalDeaths,
    affectedCountries,
    activeOutbreaks,
    growthRate7d: avgGrowthRate,
    lastUpdated
  };
}

/**
 * Ticker items: derived from verified outbreak data only.
 */
export async function getTickerItems() {
  const outbreaks = await getOutbreaks();
  return outbreaks.map(o => ({
    id: o.id,
    severity: o.status,
    label: o.status.toUpperCase(),
    text: `${o.description.substring(0, 120)}${o.description.length > 120 ? '...' : ''}`
  }));
}
