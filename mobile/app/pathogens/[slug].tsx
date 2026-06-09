import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { NewsCard } from "@/components/NewsCard";
import { Screen } from "@/components/Screen";
import { StatCard } from "@/components/StatCard";
import { TrendChart } from "@/components/TrendChart";
import { getNews, getPathogenBySlug, getPathogenTrend } from "@/lib/api";
import type { GlobalStatsTrendPoint, PathogenStats } from "@/lib/types";

export default function PathogenDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const pathogenQuery = useQuery({
    queryKey: ["pathogen", slug],
    queryFn: () => getPathogenBySlug(slug),
    enabled: Boolean(slug)
  });
  const trendQuery = useQuery({
    queryKey: ["pathogen-trend", slug],
    queryFn: () => getPathogenTrend(slug),
    enabled: Boolean(slug)
  });
  const newsQuery = useQuery({
    queryKey: ["news", "pathogen", slug],
    queryFn: () => getNews(false, slug),
    enabled: Boolean(slug)
  });

  const pathogen = pathogenQuery.data;
  const stats = pathogen?.stats ?? null;
  const chartPoints = (trendQuery.data ?? [])
    .filter((point) => point.reportedCases !== null && point.reportedCases !== undefined && point.totalDeaths !== null && point.totalDeaths !== undefined)
    .map<GlobalStatsTrendPoint>((point) => ({
      date: point.snapshotDate || point.date,
      reportedCases: point.reportedCases!,
      totalDeaths: point.totalDeaths!
    }));

  if (pathogenQuery.isLoading) {
    return (
      <Screen>
        <ActivityIndicator color="#60a5fa" />
      </Screen>
    );
  }

  if (!pathogen) {
    return (
      <Screen>
        <Text style={styles.empty}>This pathogen profile could not be loaded.</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View style={[styles.dot, { backgroundColor: pathogen.color || "#60a5fa" }]} />
        <Text style={styles.eyebrow}>Pathogen Profile</Text>
      </View>
      <Text style={styles.title}>{pathogen.displayName}</Text>
      {pathogen.shortDescription || pathogen.description ? (
        <Text style={styles.subtitle}>{pathogen.shortDescription || pathogen.description}</Text>
      ) : null}

      {stats ? <StatsGrid stats={stats} /> : <Text style={styles.empty}>No verified statistics available yet.</Text>}

      {stats?.lastVerifiedAt || stats?.updatedAt || stats?.sourceInstitution ? (
        <View style={styles.sourceCard}>
          {stats.sourceInstitution ? <Text style={styles.sourceTitle}>{stats.sourceInstitution}</Text> : null}
          {stats.lastVerifiedAt || stats.updatedAt ? (
            <Text style={styles.sourceMeta}>Last verified: {formatDate(stats.lastVerifiedAt || stats.updatedAt)}</Text>
          ) : null}
          {stats.sourceUrl ? (
            <Pressable style={styles.sourceButton} onPress={() => Linking.openURL(stats.sourceUrl!)}>
              <Text style={styles.sourceButtonText}>Open source</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      <TrendChart points={chartPoints} />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Related Intelligence Reports</Text>
      </View>
      {newsQuery.isLoading ? <ActivityIndicator color="#60a5fa" /> : null}
      {newsQuery.data?.length === 0 ? <Text style={styles.empty}>No related reports are published yet.</Text> : null}
      {newsQuery.data?.map((article) => <NewsCard key={article.slug} article={article} />)}

      <Text style={styles.disclaimer}>
        HantaWorld provides source-attributed public health intelligence for informational purposes only.
      </Text>
    </Screen>
  );
}

function StatsGrid({ stats }: { stats: PathogenStats }) {
  const items = [
    { key: "cases", label: "Reported Cases", value: stats.reportedCases, tone: "red" as const },
    { key: "deaths", label: "Total Deaths", value: stats.totalDeaths, tone: "orange" as const },
    { key: "countries", label: "Affected Countries", value: stats.affectedCountries, tone: "blue" as const },
    { key: "outbreaks", label: "Active Outbreaks", value: stats.activeOutbreaks, tone: "yellow" as const }
  ].filter((item) => item.value !== null && item.value !== undefined);

  if (items.length === 0) {
    return <Text style={styles.empty}>No verified statistics available yet.</Text>;
  }

  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <StatCard key={item.key} label={item.label} value={item.value!} tone={item.tone} />
      ))}
    </View>
  );
}

function formatDate(value?: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999
  },
  eyebrow: {
    color: "#38bdf8",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.4,
    textTransform: "uppercase"
  },
  title: {
    color: "#e2e8f0",
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 37
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 15,
    lineHeight: 23
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  sourceCard: {
    borderWidth: 1,
    borderColor: "#1f2a44",
    borderRadius: 14,
    backgroundColor: "#0c1324",
    padding: 16,
    gap: 10
  },
  sourceTitle: {
    color: "#e2e8f0",
    fontSize: 16,
    fontWeight: "900"
  },
  sourceMeta: {
    color: "#94a3b8",
    lineHeight: 22
  },
  sourceButton: {
    alignSelf: "flex-start",
    borderRadius: 10,
    backgroundColor: "#2563eb",
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  sourceButtonText: {
    color: "#eff6ff",
    fontWeight: "900"
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
  empty: {
    color: "#94a3b8",
    lineHeight: 22
  },
  disclaimer: {
    borderTopWidth: 1,
    borderColor: "#1f2a44",
    paddingTop: 14,
    color: "#64748b",
    fontSize: 12,
    lineHeight: 18
  }
});
