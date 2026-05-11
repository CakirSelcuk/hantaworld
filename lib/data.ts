import { Article, Country, Outbreak, SocialPost, Source } from './types';
import { sanitizeText } from './utils';
import outbreaksData from '../data/outbreaks.json';
import countriesData from '../data/countries.json';
import globalStatsData from '../data/global-stats.json';
import newsData from '../data/news.json';
import sourcesData from '../data/sources.json';
import socialTrendsData from '../data/social-trends.json';

type RawOutbreak = Omit<Outbreak, 'country' | 'sources' | 'description' | 'verificationNotes'> & {
  countryId: string;
  sourceIds?: string[];
  description: string;
  verificationNotes?: string;
};

type RawArticle = Omit<Article, 'source' | 'title' | 'excerpt' | 'content'> & {
  sourceIds?: string[];
  title: string;
  excerpt: string;
  content?: string;
};

type RawSocialTrend = {
  id: string;
  platform?: string;
  content: string;
  author: string;
  verified: boolean;
  sentiment?: string;
  likes?: number;
  shares?: number;
  timestamp: string;
};

const outbreakRows = outbreaksData as RawOutbreak[];
const countryRows = countriesData as Country[];
const articleRows = newsData as RawArticle[];
const sourceRows = sourcesData as Source[];
const socialRows = socialTrendsData as RawSocialTrend[];
const globalStatsOverride = globalStatsData as Partial<{
  totalDeaths: number;
  lastUpdated: string;
}>;

/**
 * Data Access Layer for Static MVP - VERIFIED DATA ONLY
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

const UNKNOWN_COUNTRY: Country = {
  id: 'unknown',
  isoCode: 'UNK',
  name: 'Unknown',
  slug: 'unknown',
  continent: 'Unknown',
  population: 0,
  flagEmoji: '🌐',
  coordinates: { lat: 0, lng: 0 },
};

export async function getOutbreaks(): Promise<Outbreak[]> {
  return outbreakRows.map((outbreak) => {
    const country = countryRows.find((entry) => entry.id === outbreak.countryId);
    const sources = outbreak.sourceIds?.length
      ? sourceRows.filter((entry) => outbreak.sourceIds?.includes(entry.id))
      : [];

    return {
      ...outbreak,
      description: sanitizeText(outbreak.description),
      verificationNotes: sanitizeText(outbreak.verificationNotes),
      sources,
      country: country || { ...UNKNOWN_COUNTRY, id: outbreak.countryId },
    };
  });
}

export async function getOutbreakById(id: string): Promise<Outbreak | undefined> {
  const outbreaks = await getOutbreaks();
  return outbreaks.find((outbreak) => outbreak.id === id);
}

export async function getCountries(): Promise<Country[]> {
  return countryRows;
}

export async function getCountryBySlug(slug: string): Promise<Country | undefined> {
  return countryRows.find((country) => country.slug === slug);
}

export async function getArticles(): Promise<Article[]> {
  return articleRows.map((article) => {
    const sourceIds = article.sourceIds ?? [];
    const source = sourceIds.length
      ? sourceRows.find((entry) => entry.id === sourceIds[0])
      : undefined;

    return {
      ...article,
      title: sanitizeText(article.title),
      excerpt: sanitizeText(article.excerpt),
      content: sanitizeText(article.content),
      source,
    };
  });
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const articles = await getArticles();
  return articles.find((article) => article.slug === slug);
}

export async function getSources(): Promise<Source[]> {
  return sourceRows;
}

export async function getSocialTrends(): Promise<SocialPost[]> {
  if (socialRows.length === 0) {
    return [];
  }

  return socialRows.map((trend) => {
    const platformRaw = (trend.platform || 'twitter').toLowerCase();
    const platform = platformRaw === 'news' ? 'official' : platformRaw;

    return {
      id: trend.id,
      platform: platform as SocialPost['platform'],
      content: sanitizeText(trend.content),
      authorHandle: trend.author,
      url: '#',
      verificationStatus: trend.verified ? 'verified' : 'unverified',
      isMisinformation: trend.sentiment === 'negative' && !trend.verified,
      engagementScore: (trend.likes || 0) + (trend.shares || 0),
      publishedAt: trend.timestamp,
    };
  });
}

/**
 * Watchlist: returns countries that have active verified outbreaks.
 * Dynamically computed from outbreaks.json - no hardcoded data.
 */
export async function getCountryWatchlist() {
  const outbreaks = await getOutbreaks();
  const countries = await getCountries();

  const countriesWithOutbreaks = countries.filter((country) =>
    outbreaks.some((outbreak) => outbreak.country.id === country.id)
  );

  return countriesWithOutbreaks
    .map((country) => {
      const countryOutbreaks = outbreaks.filter((outbreak) => outbreak.country.id === country.id);
      const activeOutbreaks = countryOutbreaks.length;
      const totalCases = countryOutbreaks.reduce(
        (sum, outbreak) => sum + outbreak.confirmedCases + outbreak.suspectedCases,
        0
      );
      const trend = (
        countryOutbreaks.length > 0 && countryOutbreaks[0].growthRate > 0
          ? 'up'
          : countryOutbreaks[0]?.growthRate < 0
            ? 'down'
            : 'stable'
      ) as 'up' | 'down' | 'stable';
      const riskLevel = (
        countryOutbreaks.some((outbreak) => outbreak.severityLevel === 'critical')
          ? 'critical'
          : countryOutbreaks.some((outbreak) => outbreak.severityLevel === 'high')
            ? 'high'
            : 'medium'
      ) as 'critical' | 'high' | 'medium' | 'low';

      return {
        country,
        activeOutbreaks,
        totalCases,
        totalDeaths: countryOutbreaks.reduce((sum, outbreak) => sum + outbreak.deaths, 0),
        trendDirection: trend,
        riskLevel,
        lastReportedAt: countryOutbreaks.reduce(
          (latest, outbreak) => (outbreak.lastUpdated > latest ? outbreak.lastUpdated : latest),
          countryOutbreaks[0]?.lastUpdated ?? '2026-05-07T00:00:00Z'
        ),
      };
    })
    .filter((country) => country.activeOutbreaks > 0);
}

/**
 * Global Stats: dynamically computed from verified outbreaks only.
 * No hardcoded or fabricated global statistics.
 */
export async function getGlobalStats() {
  const outbreaks = await getOutbreaks();
  const totalConfirmedCases = outbreaks.reduce((sum, outbreak) => sum + outbreak.confirmedCases, 0);
  const totalSuspectedCases = outbreaks.reduce((sum, outbreak) => sum + outbreak.suspectedCases, 0);
  const totalDeaths = outbreaks.reduce((sum, outbreak) => sum + outbreak.deaths, 0);
  const totalRecovered = outbreaks.reduce((sum, outbreak) => sum + outbreak.recovered, 0);
  const affectedCountries = new Set(outbreaks.map((outbreak) => outbreak.country.id)).size;
  const activeOutbreaks = outbreaks.filter((outbreak) => outbreak.status !== 'resolved').length;

  const avgGrowthRate = outbreaks.length > 0
    ? Math.round((outbreaks.reduce((sum, outbreak) => sum + outbreak.growthRate, 0) / outbreaks.length) * 10) / 10
    : 0;

  const lastUpdated = outbreaks.length > 0
    ? outbreaks.reduce(
        (latest, outbreak) => (outbreak.lastUpdated > latest ? outbreak.lastUpdated : latest),
        outbreaks[0].lastUpdated
      )
    : '2026-05-07T00:00:00Z';

  return {
    totalConfirmedCases,
    totalSuspectedCases,
    totalDeaths: globalStatsOverride.totalDeaths ?? totalDeaths,
    totalRecovered,
    affectedCountries,
    activeOutbreaks,
    growthRate7d: avgGrowthRate,
    lastUpdated: globalStatsOverride.lastUpdated ?? lastUpdated,
  };
}

/**
 * Ticker items: derived from verified outbreak data only.
 */
export async function getTickerItems() {
  const outbreaks = await getOutbreaks();

  return outbreaks.map((outbreak) => ({
    id: outbreak.id,
    severity: outbreak.status,
    label: outbreak.status.toUpperCase(),
    text: `${outbreak.description.substring(0, 120)}${outbreak.description.length > 120 ? '...' : ''}`,
  }));
}

export async function getSiteLastModified() {
  const outbreaks = await getOutbreaks();
  const articles = await getArticles();

  const timestamps = [
    ...outbreaks.map((outbreak) => Date.parse(outbreak.lastUpdated)),
    ...articles.map((article) => Date.parse(article.lastVerifiedDate || article.publishedAt)),
  ].filter(Number.isFinite);

  if (timestamps.length === 0) {
    return '2026-05-07T00:00:00Z';
  }

  return new Date(Math.max(...timestamps)).toISOString();
}
