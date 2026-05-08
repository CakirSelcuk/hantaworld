import { Outbreak, Article, Source, SocialPost } from './types';
import outbreaksData from '../data/outbreaks.json';
import countriesData from '../data/countries.json';
import newsData from '../data/news.json';
import sourcesData from '../data/sources.json';
import socialTrendsData from '../data/social-trends.json';

/**
 * Data Access Layer for Static MVP
 * These async functions simulate an API backend.
 * Later, you can swap the contents of these functions to use `fetch('https://api.hantaworld.com/...')`
 * without changing any of the frontend UI components.
 */

export async function getOutbreaks(): Promise<Outbreak[]> {
  // Mapping country data into outbreaks for UI convenience
  return (outbreaksData as any[]).map(ob => {
    const country = countriesData.find(c => c.id === ob.countryId);
    return {
      ...ob,
      country: country || { name: 'Unknown', flagEmoji: '🌐' }
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

// Watchlist simulation (fetching countries that have active outbreaks)
export async function getCountryWatchlist() {
  const outbreaks = await getOutbreaks();
  const countries = await getCountries();
  
  return countries.slice(0, 5).map(country => {
    const countryOutbreaks = outbreaks.filter(o => o.country?.id === country.id);
    const activeOutbreaks = countryOutbreaks.length;
    const totalCases = countryOutbreaks.reduce((sum, o) => sum + o.confirmedCases, 0);
    const trend = (countryOutbreaks.length > 0 && countryOutbreaks[0].growthRate > 0 ? 'up' : 'down') as 'up' | 'down' | 'stable';
    const riskLevel = (activeOutbreaks > 1 ? 'critical' : activeOutbreaks > 0 ? 'high' : 'medium') as 'critical' | 'high' | 'medium' | 'low';
    
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

export async function getGlobalStats() {
  const outbreaks = await getOutbreaks();
  const totalConfirmedCases = outbreaks.reduce((acc, o) => acc + o.confirmedCases, 0);
  const totalDeaths = outbreaks.reduce((acc, o) => acc + o.deaths, 0);
  const affectedCountries = new Set(outbreaks.map(o => o.country?.id)).size;
  const activeOutbreaks = outbreaks.filter(o => o.status !== 'resolved').length;
  
  return {
    totalConfirmedCases,
    totalDeaths,
    affectedCountries,
    activeOutbreaks,
    growthRate7d: 8.4,
    lastUpdated: new Date().toISOString()
  };
}

export async function getTickerItems() {
  const outbreaks = await getOutbreaks();
  return outbreaks.slice(0, 5).map(o => ({
    id: o.id,
    severity: o.status,
    label: o.status.toUpperCase(),
    text: o.description.substring(0, 100) + '...'
  }));
}
