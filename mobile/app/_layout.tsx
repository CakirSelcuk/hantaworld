import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, router } from "expo-router";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";

import { registerForPushNotificationsAsync } from "@/lib/push";

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    registerForPushNotificationsAsync().catch((error) => {
      console.error("[HantaWorld Push] Unexpected registration error.", error);
    });

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const slug = response.notification.request.content.data?.slug;
      if (typeof slug === "string" && slug.length > 0) {
        router.push(`/news/${slug}`);
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#050914" },
          headerTintColor: "#e2e8f0",
          headerTitleStyle: { fontWeight: "800" },
          contentStyle: { backgroundColor: "#050914" }
        }}
      >
        <Stack.Screen name="index" options={{ title: "HantaWorld" }} />
        <Stack.Screen name="pathogens/index" options={{ title: "Pathogens" }} />
        <Stack.Screen name="pathogens/[slug]" options={{ title: "Pathogen Profile" }} />
        <Stack.Screen name="news/index" options={{ title: "News" }} />
        <Stack.Screen name="news/[slug]" options={{ title: "Report" }} />
        <Stack.Screen name="notifications" options={{ title: "Notifications" }} />
        <Stack.Screen name="info/hantavirus" options={{ title: "Hantavirus" }} />
        <Stack.Screen name="info/andes-virus" options={{ title: "Andes Virus" }} />
        <Stack.Screen name="info/symptoms" options={{ title: "Symptoms" }} />
        <Stack.Screen name="info/methodology" options={{ title: "Methodology" }} />
      </Stack>
    </QueryClientProvider>
  );
}
