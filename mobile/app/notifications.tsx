import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/Screen";
import { getMobileNotifications, markNotificationRead } from "@/lib/api";
import { getStoredExpoPushToken } from "@/lib/push";

export default function NotificationsScreen() {
  const tokenQuery = useQuery({ queryKey: ["stored-expo-token"], queryFn: getStoredExpoPushToken });
  const notificationsQuery = useQuery({
    queryKey: ["mobile-notifications", tokenQuery.data],
    queryFn: () => getMobileNotifications(tokenQuery.data),
    enabled: Boolean(tokenQuery.data)
  });

  return (
    <Screen>
      <Text style={styles.title}>Notifications</Text>
      {tokenQuery.isSuccess && !tokenQuery.data ? (
        <Text style={styles.empty}>Enable push notifications to receive report alerts on this device.</Text>
      ) : null}
      {notificationsQuery.isLoading ? <ActivityIndicator color="#60a5fa" /> : null}
      {notificationsQuery.data?.length === 0 ? (
        <Text style={styles.empty}>No notifications have been delivered to this device yet.</Text>
      ) : null}
      {notificationsQuery.data?.map((item) => (
        <Link key={item.id} href={item.newsSlug ? `/news/${item.newsSlug}` : "/news"} asChild>
          <Pressable
            style={styles.link}
            onPress={() => {
              if (tokenQuery.data && !item.readAt) {
                markNotificationRead(item.id, tokenQuery.data).catch(() => null);
              }
            }}
          >
            <View style={[styles.card, item.readAt ? styles.read : styles.unread]}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
              <Text style={styles.date}>{formatDate(item.sentAt || item.createdAt)}</Text>
            </View>
          </Pressable>
        </Link>
      ))}
    </Screen>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

const styles = StyleSheet.create({
  title: {
    color: "#e2e8f0",
    fontSize: 26,
    fontWeight: "900"
  },
  link: {
    width: "100%"
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16
  },
  unread: {
    borderColor: "#2563eb",
    backgroundColor: "#0f1b35"
  },
  read: {
    borderColor: "#1f2a44",
    backgroundColor: "#0c1324"
  },
  cardTitle: {
    color: "#e2e8f0",
    fontSize: 16,
    fontWeight: "900"
  },
  body: {
    marginTop: 8,
    color: "#94a3b8",
    lineHeight: 21
  },
  date: {
    marginTop: 10,
    color: "#64748b",
    fontSize: 12
  },
  empty: {
    color: "#94a3b8",
    lineHeight: 22
  }
});
