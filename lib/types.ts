// ─── Outbreak & Country Types ────────────────────────────────────────────────

export type OutbreakStatus = 'confirmed' | 'suspected' | 'monitoring' | 'resolved';
export type SeverityLevel  = 'critical' | 'high' | 'medium' | 'low';
export type VerificationStatus = 'verified' | 'pending' | 'unverified' | 'rejected';
export type SourceType = 'who' | 'cdc' | 'ecdc' | 'promed' | 'healthmap' | 'official' | 'academic' | 'manual';
export type Platform = 'twitter' | 'reddit' | 'youtube' | 'tiktok' | 'official';
export type AlertChannel = 'email' | 'push' | 'sms';
export type UserRole = 'superadmin' | 'admin' | 'editor' | 'analyst' | 'subscriber';
export type ArticleCategory =
  | 'outbreak-report'
  | 'scientific-research'
  | 'public-health'
  | 'travel-advisory'
  | 'prevention'
  | 'analysis';

export interface Coordinates {
  lat: number;
  lng: number;
  radiusKm?: number;
}

export interface Country {
  id: string;
  isoCode: string;
  name: string;
  slug: string;
  continent: string;
  population: number;
  healthAuthorityUrl?: string;
  flagEmoji: string;
  coordinates: Coordinates;
}

export interface Source {
  id: string;
  name: string;
  organization: string;
  url: string;
  type: SourceType;
  reliabilityScore: number; // 1-10
  isOfficial: boolean;
  logo?: string;
}

export interface Outbreak {
  id: string;
  country: Country;
  status: OutbreakStatus;
  severityLevel: SeverityLevel;
  confirmedCases: number;
  suspectedCases: number;
  deaths: number;
  recovered: number;
  growthRate: number;       // % change vs last 7d
  startedAt: string;        // ISO date string
  resolvedAt?: string;
  coordinates: Coordinates;
  sources: Source[];
  verified: boolean;
  lastUpdated: string;
  description: string;
  // Traceability fields
  confidenceScore?: number;      // 0-100
  verificationNotes?: string;    // e.g. "WHO updated figures on 7 May"
  sourceUrl?: string;            // direct link to the authoritative source
  publicationDate?: string;      // ISO date of the source publication
  lastVerifiedDate?: string;     // ISO date when data was last verified
}

export interface OutbreakEvent {
  id: string;
  outbreakId: string;
  eventType: string;
  deltaCases: number;
  deltaDeaths: number;
  description: string;
  reportedAt: string;
  sourceId: string;
}

export interface Report {
  id: string;
  outbreakId?: string;
  country?: Country;
  source: Source;
  title: string;
  excerpt: string;
  url: string;
  publishedAt: string;
  verificationStatus: VerificationStatus;
  confidenceScore: number;   // 0-100
  isAiSummarized: boolean;
  aiDisclaimer?: string;
  tags: string[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  category: ArticleCategory;
  tags: string[];
  source?: Source;
  verificationStatus: VerificationStatus;
  publishedAt: string;
  readingTimeMin: number;
  coverImage?: string;
  citations: string[];
  // Traceability fields
  confidenceScore?: number;      // 0-100
  sourceUrl?: string;            // direct link to the authoritative source
  lastVerifiedDate?: string;     // ISO date when data was last verified
}

export interface SocialPost {
  id: string;
  platform: Platform;
  content: string;
  authorHandle: string;
  url: string;
  verificationStatus: VerificationStatus;
  isMisinformation: boolean;
  misinformationNote?: string;
  engagementScore: number;
  publishedAt: string;
  outbreakId?: string;
}

export interface GlobalStatCard {
  key: 'reportedCases' | 'totalDeaths' | 'affectedCountries' | 'activeOutbreaks';
  label: string;
  value: number;
  displayOrder: number;
}

export interface GlobalStats {
  totalConfirmedCases: number;
  totalSuspectedCases: number;
  totalDeaths: number;
  totalRecovered: number;
  affectedCountries: number;
  activeOutbreaks: number;
  growthRate7d: number;        // %
  lastUpdated: string;
  numericCards?: GlobalStatCard[];
}

export interface GlobalStatsTrendPoint {
  date: string;
  reportedCases: number;
  totalDeaths: number;
}

export interface InstagramPost {
  id: string;
  title: string;
  postUrl: string;
  description?: string;
  sortOrder: number;
  isFeatured: boolean;
  updatedAt: string;
}

export interface CountryStats {
  country: Country;
  activeOutbreaks: number;
  totalCases: number;
  totalDeaths: number;
  riskLevel: SeverityLevel;
  trendDirection: 'up' | 'down' | 'stable';
  lastReportedAt: string;
}

export interface AlertSubscription {
  id: string;
  email: string;
  countryIds: string[];
  alertTypes: string[];
  channels: AlertChannel[];
}
