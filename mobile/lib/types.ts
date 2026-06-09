export type NumericCard = {
  key: string;
  label: string;
  value: number;
  displayOrder: number;
};

export type GlobalStats = {
  totalConfirmedCases: number;
  totalDeaths: number;
  affectedCountries: number;
  activeOutbreaks: number;
  growthRate7d: number;
  lastUpdated: string | null;
  numericCards: NumericCard[];
};

export type GlobalStatsTrendPoint = {
  date: string;
  reportedCases: number;
  totalDeaths: number;
};

export type PathogenSummary = {
  id?: string;
  slug: string;
  displayName: string;
  shortDescription?: string | null;
  description?: string | null;
  color?: string | null;
  isActive?: boolean;
  stats?: PathogenStats | null;
};

export type PathogenStats = {
  reportedCases?: number | null;
  totalDeaths?: number | null;
  affectedCountries?: number | null;
  activeOutbreaks?: number | null;
  sourceInstitution?: string | null;
  sourceUrl?: string | null;
  officialPublishedAt?: string | null;
  lastVerifiedAt?: string | null;
  updatedAt?: string | null;
  notes?: string | null;
};

export type PathogenTrendPoint = {
  date: string;
  snapshotDate?: string;
  reportedCases?: number | null;
  totalDeaths?: number | null;
  affectedCountries?: number | null;
  activeOutbreaks?: number | null;
};

export type NewsPathogenInfo = {
  slug: string;
  displayName: string;
  color?: string | null;
};

export type NewsArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string | null;
  category: string;
  verificationStatus: string;
  readingTimeMin: number;
  confidenceScore: number;
  sourceUrl?: string | null;
  publicationDate?: string | null;
  publishedAt?: string | null;
  tags: string[];
  pathogen?: NewsPathogenInfo | null;
};

export type CountrySummary = {
  slug: string;
  isoCode: string;
  name: string;
  continent: string;
  flagEmoji?: string | null;
};

export type Outbreak = {
  id: string;
  slug: string;
  title: string;
  summary?: string | null;
  status: string;
  severityLevel: "critical" | "high" | "medium" | "low" | string;
  confirmedCases: number;
  suspectedCases: number;
  deaths: number;
  recovered: number;
  growthRate: number;
  startedAt: string;
  lastVerifiedDate?: string | null;
  publicationDate?: string | null;
  showOnWebsite?: boolean;
  showOnMobile?: boolean;
  country: CountrySummary;
};

export type CountryRiskCard = {
  slug: string;
  isoCode: string;
  name: string;
  continent: string;
  flagEmoji?: string | null;
  cases: number;
  deaths: number;
  activeOutbreaks: number;
  severityLevel: string;
  status: string;
  lastUpdated?: string | null;
};

export type MobileNotification = {
  id: string;
  newsId?: string | null;
  newsSlug?: string | null;
  title: string;
  body: string;
  dataJson?: string | null;
  createdAt: string;
  sentAt?: string | null;
  readAt?: string | null;
};

export type MobileDeviceRegistration = {
  expoPushToken: string;
  platform: string;
  deviceId?: string;
  appVersion?: string;
  locale?: string;
};
