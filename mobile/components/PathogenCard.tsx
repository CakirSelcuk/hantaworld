import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { PathogenSummary } from "@/lib/types";

type PathogenCardProps = {
  item: PathogenSummary;
};

export function PathogenCard({ item }: PathogenCardProps) {
  const color = item.color || "#60a5fa";
  const stats = item.stats;

  return (
    <Link href={{ pathname: "/pathogens/[slug]", params: { slug: item.slug } }} asChild>
      <Pressable style={styles.link}>
        <View style={[styles.card, { borderLeftColor: color }]}>
          <View style={styles.header}>
            <View style={[styles.dot, { backgroundColor: color }]} />
            <Text style={styles.name}>{item.displayName}</Text>
          </View>
          {item.shortDescription || item.description ? (
            <Text style={styles.description} numberOfLines={3}>
              {item.shortDescription || item.description}
            </Text>
          ) : null}
          {stats ? (
            <View style={styles.statsRow}>
              {renderMetric("Cases", stats.reportedCases)}
              {renderMetric("Deaths", stats.totalDeaths)}
              {renderMetric("Countries", stats.affectedCountries)}
            </View>
          ) : (
            <Text style={styles.noStats}>Statistics pending verified records.</Text>
          )}
        </View>
      </Pressable>
    </Link>
  );
}

function renderMetric(label: string, value?: number | null) {
  if (value === null || value === undefined) {
    return null;
  }

  return (
    <View style={styles.metric} key={label}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  link: {
    width: "100%"
  },
  card: {
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: "#1f2a44",
    borderRadius: 14,
    backgroundColor: "#0c1324",
    padding: 16,
    gap: 12
  },
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
  name: {
    color: "#e2e8f0",
    flex: 1,
    fontSize: 18,
    fontWeight: "900"
  },
  description: {
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 21
  },
  statsRow: {
    borderTopWidth: 1,
    borderColor: "#1f2a44",
    paddingTop: 12,
    flexDirection: "row",
    gap: 22
  },
  metric: {
    minWidth: 64
  },
  metricValue: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "900"
  },
  metricLabel: {
    color: "#64748b",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginTop: 3,
    textTransform: "uppercase"
  },
  noStats: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "700"
  }
});
