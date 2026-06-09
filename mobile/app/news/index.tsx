import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { NewsCard } from "@/components/NewsCard";
import { Screen } from "@/components/Screen";
import { getNews } from "@/lib/api";

const filters = [
  { label: "All", value: null },
  { label: "Hantavirus", value: "hantavirus" },
  { label: "Mpox", value: "mpox" },
  { label: "Dengue", value: "dengue" },
  { label: "Measles", value: "measles" },
  { label: "Avian Influenza", value: "avian-influenza" },
  { label: "Ebola / Marburg", value: "ebola-marburg" }
];

export default function NewsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["news", selectedFilter],
    queryFn: () => getNews(false, selectedFilter)
  });

  return (
    <Screen>
      <Text style={styles.title}>Latest Intelligence Reports</Text>
      <Text style={styles.subtitle}>Source-attributed outbreak updates and public health reports.</Text>
      <View style={styles.filters}>
        {filters.map((filter) => {
          const active = selectedFilter === filter.value;

          return (
            <Pressable
              key={filter.label}
              style={[styles.filterChip, active ? styles.filterChipActive : null]}
              onPress={() => setSelectedFilter(filter.value)}
            >
              <Text style={[styles.filterText, active ? styles.filterTextActive : null]}>{filter.label}</Text>
            </Pressable>
          );
        })}
      </View>
      {isLoading ? <ActivityIndicator color="#60a5fa" /> : null}
      {isError ? <Text style={styles.empty}>News could not be loaded.</Text> : null}
      {data?.length === 0 ? <Text style={styles.empty}>No verified reports are published yet.</Text> : null}
      {data?.map((article) => <NewsCard key={article.slug} article={article} />)}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#e2e8f0",
    fontSize: 26,
    fontWeight: "900"
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 15,
    lineHeight: 23
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  filterChip: {
    borderWidth: 1,
    borderColor: "#1f2a44",
    borderRadius: 999,
    backgroundColor: "#0c1324",
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  filterChipActive: {
    borderColor: "#38bdf8",
    backgroundColor: "#082f49"
  },
  filterText: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "800"
  },
  filterTextActive: {
    color: "#e0f2fe"
  },
  empty: {
    color: "#94a3b8",
    lineHeight: 22
  }
});
