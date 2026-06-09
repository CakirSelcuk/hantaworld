import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { AdBanner } from "@/components/AdBanner";
import { Screen } from "@/components/Screen";
import { getNewsBySlug } from "@/lib/api";

export default function NewsDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["news-detail", slug],
    queryFn: () => getNewsBySlug(slug),
    enabled: Boolean(slug)
  });

  if (isLoading) {
    return (
      <Screen>
        <ActivityIndicator color="#60a5fa" />
      </Screen>
    );
  }

  if (isError || !data) {
    return (
      <Screen>
        <Text style={styles.empty}>This report could not be loaded.</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.categoryRow}>
        <Text style={styles.category}>{data.category.replace(/-/g, " ").toUpperCase()}</Text>
        {data.pathogen ? (
          <Text style={[styles.pathogen, { borderColor: data.pathogen.color || "#60a5fa", color: data.pathogen.color || "#60a5fa" }]}>
            {data.pathogen.displayName}
          </Text>
        ) : null}
      </View>
      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.excerpt}>{data.excerpt}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{data.readingTimeMin} min read</Text>
        <Text style={styles.meta}>Verified</Text>
      </View>
      <Text style={styles.content}>{data.content}</Text>
      {data.sourceUrl ? (
        <Pressable style={styles.sourceButton} onPress={() => Linking.openURL(data.sourceUrl!)}>
          <Text style={styles.sourceText}>Open primary source</Text>
        </Pressable>
      ) : null}
      <AdBanner placement="news-detail" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8
  },
  category: {
    color: "#60a5fa",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.2
  },
  pathogen: {
    borderWidth: 1,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "900",
    paddingHorizontal: 9,
    paddingVertical: 4
  },
  title: {
    color: "#e2e8f0",
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 35
  },
  excerpt: {
    color: "#94a3b8",
    fontSize: 16,
    lineHeight: 24
  },
  metaRow: {
    flexDirection: "row",
    gap: 12
  },
  meta: {
    color: "#64748b",
    fontWeight: "700"
  },
  content: {
    color: "#cbd5e1",
    fontSize: 16,
    lineHeight: 25
  },
  sourceButton: {
    borderRadius: 12,
    backgroundColor: "#2563eb",
    paddingHorizontal: 16,
    paddingVertical: 13
  },
  sourceText: {
    color: "#eff6ff",
    fontWeight: "900",
    textAlign: "center"
  },
  empty: {
    color: "#94a3b8",
    lineHeight: 22
  }
});
