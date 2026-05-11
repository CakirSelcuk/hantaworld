import { Article, ArticleCategory, Country, GlobalStats, Outbreak, OutbreakStatus, SeverityLevel, SocialPost, Source, SourceType, VerificationStatus } from './types';
import { sanitizeText } from './utils';
import fallbackOutbreaksData from '../data/outbreaks.json';
import fallbackCountriesData from '../data/countries.json';
import fallbackGlobalStatsData from '../data/global-stats.json';
import fallbackNewsData from '../data/news.json';
import fallbackSourcesData from '../data/sources.json';

const API_BASE_URL =
  process.env.HANTAWORLD_API_BASE_URL ||
  process.env.NEXT_PUBLIC_HANTAWORLD_API_BASE_URL ||
  'https://hantaapi.sinavio.com.tr';

const DEFAULT_LAST_UPDATED = '2026-05-11T00:00:00Z';

type ApiCountry = {
  slug?: string;
  isoCode?: string;
  name?: string;
  continent?: string;
  flagEmoji?: string | null;
  population?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  healthAuthorityUrl?: string | null;
};

type ApiSource = {
  slug?: string;
  name?: string;
  organization?: string;
  sourceType?: string;
  url?: string;
  reliabilityScore?: number;
  isOfficial?: boolean;
};

type ApiSourceLink = {
  slug?: string;
  name?: string;
  organization?: string;
  url?: string;
  isPrimary?: boolean;
  citationTitle?: string | null;
  citationUrl?: string | null;
  publicationDate?: string | null;
  lastVerifiedDate?: string | null;
};

type ApiOutbreak = {
  id?: string;
  slug?: string;
  title?: string;
  summary?: string | null;
  description?: string;
  status?: string;
  severityLevel?: string;
  verificationStatus?: string;
  confirmedCases?: number;
  suspectedCases?: number;
  deaths?: number;
  recovered?: number;
  growthRate?: number;
  confidenceScore?: number;
  verificationNotes?: string | null;
  sourceUrl?: string | null;
  publicationDate?: string | null;
  lastVerifiedDate?: string | null;
  startedAt?: string;
  resolvedAt?: string | null;
  coordinates?: {
    lat?: number | string | null;
    lng?: number | string | null;
    radiusKm?: number | string | null;
  };
  country?: ApiCountry | null;
  sources?: ApiSourceLink[];
};

type ApiArticle = {
  id?: string;
  slug?: string;
  title?: string;
  excerpt?: string;
  content?: string | null;
  category?: string;
  verificationStatus?: string;
  readingTimeMin?: number;
  confidenceScore?: number;
  verificationNotes?: string | null;
  sourceUrl?: string | null;
  publicationDate?: string | null;
  lastVerifiedDate?: string | null;
  publishedAt?: string | null;
  country?: ApiCountry | null;
  tags?: string[];
  sources?: ApiSourceLink[];
};

type ApiGlobalStats = Partial<GlobalStats> & {
  lastUpdated?: string | null;
};

type FallbackOutbreak = Omit<Outbreak, 'country' | 'sources' | 'description' | 'verificationNotes'> & {
  countryId: string;
  sourceIds?: string[];
  description: string;
  verificationNotes?: string;
};

type FallbackArticle = Omit<Article, 'source' | 'title' | 'excerpt' | 'content'> & {
  sourceIds?: string[];
  title: string;
  excerpt: string;
  content?: string;
};

const fallbackOutbreakRows = fallbackOutbreaksData as FallbackOutbreak[];
const fallbackCountryRows = fallbackCountriesData as Country[];
const fallbackArticleRows = fallbackNewsData as FallbackArticle[];
const fallbackSourceRows = fallbackSourcesData as Source[];
const fallbackGlobalStats = fallbackGlobalStatsData as Partial<Pick<GlobalStats, 'totalDeaths' | 'lastUpdated'>>;

async function fetchApi<T>(path: string): Promise<T | null> {
  const url = new URL(path, API_BASE_URL);

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      console.error(`HantaWorld API request failed: ${response.status} ${url.toString()}`);
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`HantaWorld API request failed: ${url.toString()}`, error);
    return null;
  }
}

function toNumber(value: number | string | null | undefined, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function toSourceType(value?: string): SourceType {
  const allowed: SourceType[] = ['who', 'cdc', 'ecdc', 'promed', 'healthmap', 'official', 'academic', 'manual'];
  return allowed.includes(value as SourceType) ? (value as SourceType) : 'official';
}

function toVerificationStatus(value?: string): VerificationStatus {
  const allowed: VerificationStatus[] = ['verified', 'pending', 'unverified', 'rejected'];
  return allowed.includes(value as VerificationStatus) ? (value as VerificationStatus) : 'unverified';
}

function toOutbreakStatus(value?: string): OutbreakStatus {
  const allowed: OutbreakStatus[] = ['confirmed', 'suspected', 'monitoring', 'resolved'];
  return allowed.includes(value as OutbreakStatus) ? (value as OutbreakStatus) : 'monitoring';
}

function toSeverityLevel(value?: string): SeverityLevel {
  const allowed: SeverityLevel[] = ['critical', 'high', 'medium', 'low'];
  return allowed.includes(value as SeverityLevel) ? (value as SeverityLevel) : 'medium';
}

function toArticleCategory(value?: string): ArticleCategory {
  const allowed: ArticleCategory[] = [
    'outbreak-report',
    'scientific-research',
    'public-health',
    'travel-advisory',
    'prevention',
    'analysis',
  ];
  return allowed.includes(value as ArticleCategory) ? (value as ArticleCategory) : 'outbreak-report';
}

function dateToIso(value?: string | null): string {
  if (!value) return DEFAULT_LAST_UPDATED;
  if (value.includes('T')) return value;
  return `${value}T00:00:00Z`;
}

function mapCountry(country?: ApiCountry | null): Country {
  const slug = country?.slug || 'unknown';

  return {
    id: slug,
    isoCode: country?.isoCode || 'UNK',
    name: country?.name || 'Unknown',
    slug,
    continent: country?.continent || 'Unknown',
    population: country?.population ?? 0,
    flagEmoji: country?.flagEmoji || '🌐',
    healthAuthorityUrl: country?.healthAuthorityUrl || undefined,
    coordinates: {
      lat: toNumber(country?.latitude),
      lng: toNumber(country?.longitude),
    },
  };
}

function mapSource(source: ApiSource | ApiSourceLink): Source {
  const slug = source.slug || source.name || 'source';
  const url = 'citationUrl' in source ? source.citationUrl || source.url : source.url;

  return {
    id: slug,
    name: source.name || source.organization || 'Official source',
    organization: source.organization || source.name || 'Official source',
    url: url || '#',
    type: toSourceType('sourceType' in source ? source.sourceType : undefined),
    reliabilityScore: 'reliabilityScore' in source ? source.reliabilityScore ?? 10 : 10,
    isOfficial: 'isOfficial' in source ? source.isOfficial ?? true : true,
  };
}

function mapOutbreak(outbreak: ApiOutbreak): Outbreak {
  const lastUpdated = dateToIso(outbreak.lastVerifiedDate || outbreak.publicationDate || outbreak.startedAt);
  const country = mapCountry(outbreak.country);

  return {
    id: outbreak.id || outbreak.slug || `${country.slug}-outbreak`,
    country,
    status: toOutbreakStatus(outbreak.status),
    severityLevel: toSeverityLevel(outbreak.severityLevel),
    confirmedCases: outbreak.confirmedCases ?? 0,
    suspectedCases: outbreak.suspectedCases ?? 0,
    deaths: outbreak.deaths ?? 0,
    recovered: outbreak.recovered ?? 0,
    growthRate: outbreak.growthRate ?? 0,
    startedAt: outbreak.startedAt || lastUpdated,
    resolvedAt: outbreak.resolvedAt || undefined,
    coordinates: {
      lat: toNumber(outbreak.coordinates?.lat, country.coordinates.lat),
      lng: toNumber(outbreak.coordinates?.lng, country.coordinates.lng),
      radiusKm: outbreak.coordinates?.radiusKm == null ? undefined : toNumber(outbreak.coordinates.radiusKm),
    },
    sources: (outbreak.sources ?? []).map(mapSource),
    verified: toVerificationStatus(outbreak.verificationStatus) === 'verified',
    lastUpdated,
    description: sanitizeText(outbreak.description || outbreak.summary || ''),
    confidenceScore: outbreak.confidenceScore,
    verificationNotes: sanitizeText(outbreak.verificationNotes || undefined),
    sourceUrl: outbreak.sourceUrl || outbreak.sources?.find((source) => source.isPrimary)?.citationUrl || undefined,
    publicationDate: outbreak.publicationDate || undefined,
    lastVerifiedDate: outbreak.lastVerifiedDate || undefined,
  };
}

function mapArticle(article: ApiArticle): Article {
  const sources = article.sources ?? [];
  const primarySource = sources.find((source) => source.isPrimary) ?? sources[0];
  const sourceUrl = article.sourceUrl || primarySource?.citationUrl || primarySource?.url || undefined;
  const publishedAt = dateToIso(article.publishedAt || article.publicationDate || article.lastVerifiedDate);

  return {
    id: article.id || article.slug || article.title || 'article',
    title: sanitizeText(article.title || 'Untitled report'),
    slug: article.slug || article.id || 'untitled-report',
    excerpt: sanitizeText(article.excerpt || ''),
    content: sanitizeText(article.content || undefined),
    category: toArticleCategory(article.category),
    tags: article.tags ?? [],
    source: primarySource ? mapSource(primarySource) : undefined,
    verificationStatus: toVerificationStatus(article.verificationStatus),
    publishedAt,
    readingTimeMin: article.readingTimeMin ?? 3,
    citations: sources
      .map((source) => source.citationUrl || source.url)
      .filter((url): url is string => Boolean(url)),
    confidenceScore: article.confidenceScore,
    sourceUrl,
    lastVerifiedDate: article.lastVerifiedDate || undefined,
  };
}

function mapFallbackOutbreak(outbreak: FallbackOutbreak): Outbreak {
  const country = fallbackCountryRows.find((entry) => entry.id === outbreak.countryId) ?? {
    id: outbreak.countryId,
    isoCode: 'UNK',
    name: 'Unknown',
    slug: 'unknown',
    continent: 'Unknown',
    population: 0,
    flagEmoji: '🌐',
    coordinates: { lat: 0, lng: 0 },
  };
  const sources = outbreak.sourceIds?.length
    ? fallbackSourceRows.filter((entry) => outbreak.sourceIds?.includes(entry.id))
    : [];

  return {
    ...outbreak,
    description: sanitizeText(outbreak.description),
    verificationNotes: sanitizeText(outbreak.verificationNotes),
    country,
    sources,
  };
}

function getFallbackOutbreaks(): Outbreak[] {
  return fallbackOutbreakRows.map(mapFallbackOutbreak);
}

function mapFallbackArticle(article: FallbackArticle): Article {
  const sourceIds = article.sourceIds ?? [];
  const source = sourceIds.length
    ? fallbackSourceRows.find((entry) => entry.id === sourceIds[0])
    : undefined;

  return {
    ...article,
    title: sanitizeText(article.title),
    excerpt: sanitizeText(article.excerpt),
    content: sanitizeText(article.content),
    source,
  };
}

function getFallbackArticles(): Article[] {
  return fallbackArticleRows.map(mapFallbackArticle);
}

function getFallbackGlobalStats(): GlobalStats {
  const outbreaks = getFallbackOutbreaks();
  const totalConfirmedCases = outbreaks.reduce((sum, outbreak) => sum + outbreak.confirmedCases, 0);
  const totalSuspectedCases = outbreaks.reduce((sum, outbreak) => sum + outbreak.suspectedCases, 0);
  const totalDeaths = outbreaks.reduce((sum, outbreak) => sum + outbreak.deaths, 0);
  const totalRecovered = outbreaks.reduce((sum, outbreak) => sum + outbreak.recovered, 0);
  const affectedCountries = new Set(outbreaks.map((outbreak) => outbreak.country.id)).size;
  const activeOutbreaks = outbreaks.filter((outbreak) => outbreak.status !== 'resolved').length;
  const growthRate7d = outbreaks.length > 0
    ? Math.round((outbreaks.reduce((sum, outbreak) => sum + outbreak.growthRate, 0) / outbreaks.length) * 10) / 10
    : 0;
  const lastUpdated = outbreaks.length > 0
    ? outbreaks.reduce(
        (latest, outbreak) => (outbreak.lastUpdated > latest ? outbreak.lastUpdated : latest),
        outbreaks[0].lastUpdated
      )
    : DEFAULT_LAST_UPDATED;

  return {
    totalConfirmedCases,
    totalSuspectedCases,
    totalDeaths: fallbackGlobalStats.totalDeaths ?? totalDeaths,
    totalRecovered,
    affectedCountries,
    activeOutbreaks,
    growthRate7d,
    lastUpdated: fallbackGlobalStats.lastUpdated ?? lastUpdated,
  };
}

export async function getOutbreaks(): Promise<Outbreak[]> {
  const outbreaks = await fetchApi<ApiOutbreak[]>('/api/outbreaks');
  const liveOutbreaks = (outbreaks ?? [])
    .filter((outbreak) => toVerificationStatus(outbreak.verificationStatus) === 'verified')
    .map(mapOutbreak);

  return liveOutbreaks.length > 0 ? liveOutbreaks : getFallbackOutbreaks();
}

export async function getOutbreakById(id: string): Promise<Outbreak | undefined> {
  const outbreaks = await getOutbreaks();
  return outbreaks.find((outbreak) => outbreak.id === id);
}

export async function getCountries(): Promise<Country[]> {
  const countries = await fetchApi<ApiCountry[]>('/api/countries');
  const liveCountries = (countries ?? []).map(mapCountry);
  const merged = new Map<string, Country>();

  fallbackCountryRows.forEach((country) => merged.set(country.slug, country));
  liveCountries.forEach((country) => merged.set(country.slug, country));

  return [...merged.values()];
}

export async function getCountryBySlug(slug: string): Promise<Country | undefined> {
  const countries = await getCountries();
  return countries.find((country) => country.slug === slug);
}

export async function getArticles(): Promise<Article[]> {
  const articles = await fetchApi<ApiArticle[]>('/api/news');
  const liveArticles = (articles ?? [])
    .filter((article) => toVerificationStatus(article.verificationStatus) === 'verified')
    .map(mapArticle);

  return liveArticles.length > 0 ? liveArticles : getFallbackArticles();
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const articles = await fetchApi<ApiArticle[]>('/api/news?includeContent=true');
  const liveArticle = (articles ?? [])
    .filter((article) => toVerificationStatus(article.verificationStatus) === 'verified')
    .map(mapArticle)
    .find((article) => article.slug === slug);

  return liveArticle ?? getFallbackArticles().find((article) => article.slug === slug);
}

export async function getSources(): Promise<Source[]> {
  const sources = await fetchApi<ApiSource[]>('/api/sources');
  const liveSources = (sources ?? []).map(mapSource);
  return liveSources.length > 0 ? liveSources : fallbackSourceRows;
}

export async function getSocialTrends(): Promise<SocialPost[]> {
  return [];
}

export async function getCountryWatchlist() {
  const outbreaks = await getOutbreaks();
  const countries = await getCountries();
  const countryMap = new Map(countries.map((country) => [country.slug, country]));
  const visibleCountries = new Map<string, Country>();

  outbreaks.forEach((outbreak) => {
    visibleCountries.set(outbreak.country.slug, countryMap.get(outbreak.country.slug) ?? outbreak.country);
  });

  return [...visibleCountries.values()]
    .map((country) => {
      const countryOutbreaks = outbreaks.filter((outbreak) => outbreak.country.slug === country.slug);
      const activeOutbreaks = countryOutbreaks.filter((outbreak) => outbreak.status !== 'resolved').length;
      const totalCases = countryOutbreaks.reduce(
        (sum, outbreak) => sum + outbreak.confirmedCases + outbreak.suspectedCases,
        0
      );
      const trendDirection = (
        countryOutbreaks.some((outbreak) => outbreak.growthRate > 0)
          ? 'up'
          : countryOutbreaks.some((outbreak) => outbreak.growthRate < 0)
            ? 'down'
            : 'stable'
      ) as 'up' | 'down' | 'stable';
      const riskLevel = (
        countryOutbreaks.some((outbreak) => outbreak.severityLevel === 'critical')
          ? 'critical'
          : countryOutbreaks.some((outbreak) => outbreak.severityLevel === 'high')
            ? 'high'
            : countryOutbreaks.some((outbreak) => outbreak.severityLevel === 'medium')
              ? 'medium'
              : 'low'
      ) as SeverityLevel;

      return {
        country,
        activeOutbreaks,
        totalCases,
        totalDeaths: countryOutbreaks.reduce((sum, outbreak) => sum + outbreak.deaths, 0),
        trendDirection,
        riskLevel,
        lastReportedAt: countryOutbreaks.reduce(
          (latest, outbreak) => (outbreak.lastUpdated > latest ? outbreak.lastUpdated : latest),
          countryOutbreaks[0]?.lastUpdated ?? DEFAULT_LAST_UPDATED
        ),
      };
    })
    .filter((country) => country.activeOutbreaks > 0);
}

export async function getGlobalStats(): Promise<GlobalStats> {
  const stats = await fetchApi<ApiGlobalStats>('/api/global-stats');
  const hasLiveStats = Boolean(
    stats &&
    ((stats.totalConfirmedCases ?? 0) > 0 ||
      (stats.totalSuspectedCases ?? 0) > 0 ||
      (stats.totalDeaths ?? 0) > 0 ||
      (stats.affectedCountries ?? 0) > 0 ||
      (stats.activeOutbreaks ?? 0) > 0)
  );

  if (!hasLiveStats) {
    return getFallbackGlobalStats();
  }

  return {
    totalConfirmedCases: stats?.totalConfirmedCases ?? 0,
    totalSuspectedCases: stats?.totalSuspectedCases ?? 0,
    totalDeaths: stats?.totalDeaths ?? 0,
    totalRecovered: stats?.totalRecovered ?? 0,
    affectedCountries: stats?.affectedCountries ?? 0,
    activeOutbreaks: stats?.activeOutbreaks ?? 0,
    growthRate7d: stats?.growthRate7d ?? 0,
    lastUpdated: dateToIso(stats?.lastUpdated || DEFAULT_LAST_UPDATED),
  };
}

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
  const [outbreaks, articles, stats] = await Promise.all([
    getOutbreaks(),
    getArticles(),
    getGlobalStats(),
  ]);

  const timestamps = [
    Date.parse(stats.lastUpdated),
    ...outbreaks.map((outbreak) => Date.parse(outbreak.lastUpdated)),
    ...articles.map((article) => Date.parse(article.lastVerifiedDate || article.publishedAt)),
  ].filter(Number.isFinite);

  if (timestamps.length === 0) {
    return DEFAULT_LAST_UPDATED;
  }

  return new Date(Math.max(...timestamps)).toISOString();
}
