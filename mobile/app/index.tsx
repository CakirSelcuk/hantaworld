import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { AdBanner } from "@/components/AdBanner";
import { CountryRiskCard } from "@/components/CountryRiskCard";
import { NewsCard } from "@/components/NewsCard";
import { PathogenCard } from "@/components/PathogenCard";
import { Screen } from "@/components/Screen";
import { StatCard } from "@/components/StatCard";
import { TrendChart } from "@/components/TrendChart";
import { getGlobalStats, getGlobalStatsTrend, getNews, getOutbreaks, getPathogens } from "@/lib/api";
import type { CountryRiskCard as CountryRiskCardType, Outbreak } from "@/lib/types";

export default function DashboardScreen() {
  const statsQuery = useQuery({ queryKey: ["global-stats"], queryFn: getGlobalStats });
  const trendQuery = useQuery({ queryKey: ["global-stats-trend"], queryFn: getGlobalStatsTrend });
  const newsQuery = useQuery({ queryKey: ["news"], queryFn: () => getNews(false) });
  const outbreaksQuery = useQuery({ queryKey: ["outbreaks"], queryFn: getOutbreaks });
  const pathogensQuery = useQuery({ queryKey: ["pathogens"], queryFn: getPathogens });

  const cards = statsQuery.data?.numericCards ?? [];
  const latestNews = newsQuery.data?.slice(0, 3) ?? [];
  const countryCards = buildCountryCards(outbreaksQuery.data ?? []);
  const pathogenCards = pathogensQuery.data?.slice(0, 6) ?? [];

  return (
    <Screen>
      <View>
        <Text style={styles.eyebrow}>Verified outbreak intelligence</Text>
        <Text style={styles.title}>Global Outbreak & Virus Intelligence</Text>
        <Text style={styles.subtitle}>
          Verified outbreak updates, pathogen profiles, and public health signals from official sources.
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Pathogen Watch</Text>
        <Link href="/pathogens" style={styles.viewAll}>View all</Link>
      </View>
      {pathogensQuery.isLoading ? <ActivityIndicator color="#60a5fa" /> : null}
      {pathogenCards.length === 0 && !pathogensQuery.isLoading ? (
        <Text style={styles.empty}>No pathogen profiles are available yet.</Text>
      ) : (
        pathogenCards.map((item) => <PathogenCard key={item.slug} item={item} />)
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Hantavirus Snapshot</Text>
      </View>
      {statsQuery.isLoading ? (
        <ActivityIndicator color="#60a5fa" />
      ) : (
        <View style={styles.grid}>
          <StatCard label={cards.find((x) => x.key === "reportedCases")?.label ?? "Reported Cases"} value={cards.find((x) => x.key === "reportedCases")?.value ?? statsQuery.data?.totalConfirmedCases ?? 0} tone="red" />
          <StatCard label={cards.find((x) => x.key === "totalDeaths")?.label ?? "Total Deaths"} value={cards.find((x) => x.key === "totalDeaths")?.value ?? statsQuery.data?.totalDeaths ?? 0} tone="orange" />
          <StatCard label={cards.find((x) => x.key === "affectedCountries")?.label ?? "Affected Countries"} value={cards.find((x) => x.key === "affectedCountries")?.value ?? statsQuery.data?.affectedCountries ?? 0} tone="blue" />
          <StatCard label={cards.find((x) => x.key === "activeOutbreaks")?.label ?? "Active Outbreaks"} value={cards.find((x) => x.key === "activeOutbreaks")?.value ?? statsQuery.data?.activeOutbreaks ?? 0} tone="yellow" />
        </View>
      )}

      <TrendChart points={trendQuery.data ?? []} />

      <AdBanner placement="dashboard" />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Country Risk Monitor</Text>
      </View>
      {outbreaksQuery.isLoading ? <ActivityIndicator color="#60a5fa" /> : null}
      {countryCards.length === 0 && !outbreaksQuery.isLoading ? (
        <Text style={styles.empty}>No country risk cards are published yet.</Text>
      ) : (
        countryCards.map((item) => <CountryRiskCard key={item.slug} item={item} />)
      )}

      <View style={styles.menu}>
        <Link href="/pathogens" style={styles.menuItem}>Pathogens</Link>
        <Link href="/news" style={styles.menuItem}>News</Link>
        <Link href="/notifications" style={styles.menuItem}>Notifications</Link>
        <Link href="/info/hantavirus" style={styles.menuItem}>Hantavirus Info</Link>
        <Link href="/info/andes-virus" style={styles.menuItem}>Andes Virus</Link>
        <Link href="/info/symptoms" style={styles.menuItem}>Symptoms</Link>
        <Link href="/info/methodology" style={styles.menuItem}>Methodology</Link>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Latest Reports</Text>
        <Link href="/news" style={styles.viewAll}>View all</Link>
      </View>
      {latestNews.length === 0 ? (
        <Text style={styles.empty}>No verified reports are published yet.</Text>
      ) : (
        latestNews.map((article) => <NewsCard key={article.slug} article={article} />)
      )}
    </Screen>
  );
}

function buildCountryCards(outbreaks: Outbreak[]): CountryRiskCardType[] {
  const severityRank: Record<string, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1
  };
  const grouped = new Map<string, CountryRiskCardType>();

  for (const outbreak of outbreaks) {
    const key = outbreak.country.slug;
    const existing = grouped.get(key);
    const severity = outbreak.severityLevel || "low";
    const nextRank = severityRank[severity] ?? 0;
    const existingRank = existing ? severityRank[existing.severityLevel] ?? 0 : -1;
    const lastUpdated = outbreak.lastVerifiedDate || outbreak.publicationDate || outbreak.startedAt;

    if (!existing) {
      grouped.set(key, {
        slug: key,
        isoCode: outbreak.country.isoCode,
        name: outbreak.country.name,
        continent: outbreak.country.continent,
        flagEmoji: outbreak.country.flagEmoji,
        cases: outbreak.confirmedCases,
        deaths: outbreak.deaths,
        activeOutbreaks: outbreak.status === "resolved" ? 0 : 1,
        severityLevel: severity,
        status: outbreak.status,
        lastUpdated
      });
      continue;
    }

    existing.cases += outbreak.confirmedCases;
    existing.deaths += outbreak.deaths;
    existing.activeOutbreaks += outbreak.status === "resolved" ? 0 : 1;
    existing.lastUpdated = lastUpdated || existing.lastUpdated;

    if (nextRank > existingRank) {
      existing.severityLevel = severity;
      existing.status = outbreak.status;
    }
  }

  return [...grouped.values()].sort((a, b) => {
    const severityDelta = (severityRank[b.severityLevel] ?? 0) - (severityRank[a.severityLevel] ?? 0);
    if (severityDelta !== 0) {
      return severityDelta;
    }

    return b.cases - a.cases;
  });
}

const styles = StyleSheet.create({
  eyebrow: {
    color: "#60a5fa",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase"
  },
  title: {
    marginTop: 8,
    color: "#e2e8f0",
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 35
  },
  subtitle: {
    marginTop: 10,
    color: "#94a3b8",
    fontSize: 15,
    lineHeight: 23
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  menu: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  menuItem: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1f2a44",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: "#dbeafe",
    backgroundColor: "#0c1324",
    fontWeight: "700"
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  sectionTitle: {
    color: "#e2e8f0",
    fontSize: 20,
    fontWeight: "900"
  },
  viewAll: {
    color: "#60a5fa",
    fontWeight: "800"
  },
  empty: {
    color: "#94a3b8",
    lineHeight: 22
  }
});
