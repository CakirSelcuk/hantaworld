import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, StyleSheet, Text } from "react-native";

import { PathogenCard } from "@/components/PathogenCard";
import { Screen } from "@/components/Screen";
import { getPathogens } from "@/lib/api";

export default function PathogensScreen() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["pathogens"], queryFn: getPathogens });

  return (
    <Screen>
      <Text style={styles.eyebrow}>Pathogen Watch</Text>
      <Text style={styles.title}>Global pathogen and outbreak intelligence profiles</Text>
      <Text style={styles.subtitle}>
        Source-attributed profiles for monitored pathogens and public health intelligence categories.
      </Text>

      {isLoading ? <ActivityIndicator color="#60a5fa" /> : null}
      {isError ? <Text style={styles.empty}>Pathogen profiles could not be loaded.</Text> : null}
      {data?.length === 0 ? <Text style={styles.empty}>No pathogen profiles are available yet.</Text> : null}
      {data?.map((item) => <PathogenCard key={item.slug} item={item} />)}
    </Screen>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: "#38bdf8",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.4,
    textTransform: "uppercase"
  },
  title: {
    color: "#e2e8f0",
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 35
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 15,
    lineHeight: 23
  },
  empty: {
    color: "#94a3b8",
    lineHeight: 22
  }
});
