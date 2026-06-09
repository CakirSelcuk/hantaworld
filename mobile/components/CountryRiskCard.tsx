import { StyleSheet, Text, View } from "react-native";

import type { CountryRiskCard as CountryRiskCardType } from "@/lib/types";

type CountryRiskCardProps = {
  item: CountryRiskCardType;
};

const severityColors: Record<string, string> = {
  critical: "#ff5353",
  high: "#ff7a1a",
  medium: "#facc15",
  low: "#22c55e"
};

export function CountryRiskCard({ item }: CountryRiskCardProps) {
  const severityColor = severityColors[item.severityLevel] ?? "#60a5fa";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.country}>
          <Text style={styles.iso}>{item.isoCode}</Text>
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.continent}>{item.continent}</Text>
          </View>
        </View>
        <Text style={[styles.severity, { color: severityColor, borderColor: severityColor }]}>
          {item.severityLevel.toUpperCase()}
        </Text>
      </View>

      <View style={styles.metrics}>
        <View>
          <Text style={styles.value}>{item.cases}</Text>
          <Text style={styles.label}>Cases</Text>
        </View>
        <View>
          <Text style={styles.deathValue}>{item.deaths}</Text>
          <Text style={styles.label}>Deaths</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.status}>{item.status.toUpperCase()}</Text>
        <Text style={styles.outbreaks}>{item.activeOutbreaks} active outbreak{item.activeOutbreaks === 1 ? "" : "s"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#1f2a44",
    borderRadius: 14,
    backgroundColor: "#0c1324",
    padding: 16,
    gap: 16
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12
  },
  country: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1
  },
  iso: {
    color: "#e2e8f0",
    fontSize: 20,
    fontWeight: "900",
    minWidth: 34
  },
  name: {
    color: "#e2e8f0",
    fontSize: 17,
    fontWeight: "900"
  },
  continent: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 2
  },
  severity: {
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    paddingHorizontal: 9,
    paddingVertical: 5
  },
  metrics: {
    flexDirection: "row",
    gap: 48
  },
  value: {
    color: "#e2e8f0",
    fontSize: 24,
    fontWeight: "900"
  },
  deathValue: {
    color: "#ff7373",
    fontSize: 24,
    fontWeight: "900"
  },
  label: {
    color: "#94a3b8",
    marginTop: 4,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase"
  },
  footer: {
    borderTopWidth: 1,
    borderColor: "#1f2a44",
    paddingTop: 12,
    flexDirection: "row",
    gap: 8
  },
  status: {
    color: "#facc15",
    fontWeight: "900"
  },
  outbreaks: {
    color: "#64748b",
    fontWeight: "700"
  }
});
