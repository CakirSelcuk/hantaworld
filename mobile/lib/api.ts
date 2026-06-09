import Constants from "expo-constants";

import type {
  GlobalStats,
  GlobalStatsTrendPoint,
  MobileDeviceRegistration,
  MobileNotification,
  NewsArticle,
  Outbreak,
  PathogenSummary,
  PathogenTrendPoint
} from "./types";

const configuredBaseUrl =
  process.env.EXPO_PUBLIC_HANTAWORLD_API_BASE_URL ||
  Constants.expoConfig?.extra?.apiBaseUrl ||
  "https://hantaapi.sinavio.com.tr";

export const API_BASE_URL = String(configuredBaseUrl).replace(/\/$/, "");

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json"
  };

  if (init?.headers) {
    Object.assign(headers, init.headers);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function postJsonWithStatus<T>(path: string, payload: unknown): Promise<T> {
  const result = await postJsonDetailed<T>(path, payload);
  return result.data;
}

export async function postJsonDetailed<T>(path: string, payload: unknown): Promise<{
  status: number;
  body: string;
  data: T;
}> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const responseText = await response.text();
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${responseText}`);
  }

  return {
    status: response.status,
    body: responseText,
    data: responseText ? (JSON.parse(responseText) as T) : ({} as T)
  };
}

export function getGlobalStats() {
  return fetchJson<GlobalStats>("/api/global-stats");
}

export function getGlobalStatsTrend() {
  return fetchJson<GlobalStatsTrendPoint[]>("/api/global-stats/trend");
}

export function getNews(includeContent = false, pathogenSlug?: string | null) {
  const params = new URLSearchParams({
    includeContent: includeContent ? "true" : "false"
  });

  if (pathogenSlug) {
    params.set("pathogen", pathogenSlug);
  }

  return fetchJson<NewsArticle[]>(`/api/news?${params.toString()}`);
}

export function getOutbreaks() {
  return fetchJson<Outbreak[]>("/api/outbreaks?surface=mobile");
}

export async function getPathogens() {
  try {
    const items = await fetchJson<PathogenSummary[]>("/api/pathogens");
    return items.length > 0 ? items : FALLBACK_PATHOGENS;
  } catch {
    return FALLBACK_PATHOGENS;
  }
}

export async function getPathogenBySlug(slug: string) {
  try {
    return await fetchJson<PathogenSummary>(`/api/pathogens/${encodeURIComponent(slug)}`);
  } catch {
    return FALLBACK_PATHOGENS.find((item) => item.slug === slug) ?? null;
  }
}

export async function getPathogenTrend(slug: string) {
  try {
    return await fetchJson<PathogenTrendPoint[]>(`/api/pathogens/${encodeURIComponent(slug)}/stats/trend`);
  } catch {
    return [];
  }
}

export async function getNewsBySlug(slug: string) {
  const items = await getNews(true);
  return items.find((item) => item.slug === slug) ?? null;
}

export function registerMobileDevice(payload: MobileDeviceRegistration) {
  return postJsonWithStatus<{ id: string; isActive: boolean; lastSeenAt: string }>("/api/mobile/devices", payload);
}

export function registerMobileDeviceDetailed(payload: MobileDeviceRegistration) {
  return postJsonDetailed<{ id: string; isActive: boolean; lastSeenAt: string }>("/api/mobile/devices", payload);
}

export function getMobileNotifications(expoPushToken?: string | null) {
  const query = expoPushToken ? `?expoPushToken=${encodeURIComponent(expoPushToken)}` : "";
  return fetchJson<MobileNotification[]>(`/api/mobile/notifications${query}`);
}

export function markNotificationRead(notificationId: string, expoPushToken: string) {
  return fetchJson<{ success: boolean }>(`/api/mobile/notifications/${notificationId}/read`, {
    method: "POST",
    body: JSON.stringify({ expoPushToken })
  });
}

export const FALLBACK_PATHOGENS: PathogenSummary[] = [
  {
    slug: "hantavirus",
    displayName: "Hantavirus",
    shortDescription: "Rodent-borne hantavirus surveillance and outbreak updates.",
    color: "#ef4444"
  },
  {
    slug: "ebola-marburg",
    displayName: "Ebola / Marburg",
    shortDescription: "Filovirus outbreak intelligence from official public health sources.",
    color: "#f97316"
  },
  {
    slug: "mpox",
    displayName: "Mpox",
    shortDescription: "Mpox situation updates, reports, and public health signals.",
    color: "#a855f7"
  },
  {
    slug: "dengue",
    displayName: "Dengue",
    shortDescription: "Dengue outbreak monitoring and regional risk reports.",
    color: "#f59e0b"
  },
  {
    slug: "measles",
    displayName: "Measles",
    shortDescription: "Measles resurgence and outbreak intelligence.",
    color: "#38bdf8"
  },
  {
    slug: "avian-influenza",
    displayName: "Avian Influenza",
    shortDescription: "Avian influenza monitoring for animal and human health signals.",
    color: "#22c55e"
  },
  {
    slug: "covid-respiratory-viruses",
    displayName: "COVID / Respiratory Viruses",
    shortDescription: "Respiratory virus intelligence and official update tracking.",
    color: "#6366f1"
  },
  {
    slug: "unknown-emerging-outbreaks",
    displayName: "Unknown / Emerging Outbreaks",
    shortDescription: "Early signals and source-attributed updates for emerging outbreaks.",
    color: "#64748b"
  },
  {
    slug: "official-updates",
    displayName: "Official Updates",
    shortDescription: "Official public health notices and agency updates.",
    color: "#0ea5e9"
  },
  {
    slug: "weekly-risk-brief",
    displayName: "Weekly Risk Brief",
    shortDescription: "Weekly intelligence summaries for monitored outbreak signals.",
    color: "#14b8a6"
  }
];
