import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { NewsArticle } from "@/lib/types";

type NewsCardProps = {
  article: NewsArticle;
};

export function NewsCard({ article }: NewsCardProps) {
  return (
    <Link href={`/news/${article.slug}`} asChild>
      <Pressable style={styles.link}>
        <View style={styles.card}>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>{article.category.replace(/-/g, " ").toUpperCase()}</Text>
            {article.pathogen ? (
              <Text style={[styles.pathogen, { borderColor: article.pathogen.color || "#60a5fa", color: article.pathogen.color || "#60a5fa" }]}>
                {article.pathogen.displayName}
              </Text>
            ) : null}
          </View>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.excerpt}>{article.excerpt}</Text>
          <Text style={styles.footer}>{article.readingTimeMin} min read</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  link: {
    width: "100%"
  },
  card: {
    borderWidth: 1,
    borderColor: "#1f2a44",
    borderRadius: 14,
    backgroundColor: "#0c1324",
    padding: 16
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8
  },
  meta: {
    color: "#60a5fa",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1
  },
  pathogen: {
    borderWidth: 1,
    borderRadius: 999,
    fontSize: 10,
    fontWeight: "900",
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  title: {
    marginTop: 8,
    color: "#e2e8f0",
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 24
  },
  excerpt: {
    marginTop: 8,
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 21
  },
  footer: {
    marginTop: 12,
    color: "#64748b",
    fontSize: 12
  }
});
