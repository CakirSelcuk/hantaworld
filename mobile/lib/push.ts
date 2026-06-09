import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Localization from "expo-localization";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { Alert, Linking, Platform } from "react-native";

import { API_BASE_URL, registerMobileDeviceDetailed } from "./api";

const TOKEN_STORAGE_KEY = "hantaworld_expo_push_token";
const DEVICE_ID_STORAGE_KEY = "hantaworld_device_id";
const DEFAULT_NOTIFICATION_CHANNEL_ID = "default";
const ALERTS_NOTIFICATION_CHANNEL_ID = "hantaworld-alerts";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
    priority: Notifications.AndroidNotificationPriority.MAX
  })
});

function getProjectId() {
  return Constants.easConfig?.projectId || Constants.expoConfig?.extra?.eas?.projectId;
}

function maskToken(token: string) {
  return `${token.slice(0, 20)}...`;
}

function logPushDebug(message: string, data?: unknown) {
  if (data === undefined) {
    console.log(`[HantaWorld Push] ${message}`);
    return;
  }

  console.log(`[HantaWorld Push] ${message}`, data);
}

function logPushError(message: string, error: unknown) {
  console.error(`[HantaWorld Push] ${message}`, error);
}

async function getDeviceId() {
  const existing = await SecureStore.getItemAsync(DEVICE_ID_STORAGE_KEY);
  if (existing) {
    return existing;
  }

  const generated = `android-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  await SecureStore.setItemAsync(DEVICE_ID_STORAGE_KEY, generated);
  return generated;
}

export async function getStoredExpoPushToken() {
  return SecureStore.getItemAsync(TOKEN_STORAGE_KEY);
}

async function ensureAndroidNotificationChannelsAsync() {
  if (Platform.OS !== "android") {
    return;
  }

  const channelConfig = {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#60a5fa",
    sound: "default",
    enableVibrate: true,
    enableLights: true,
    showBadge: true,
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC
  };

  await Notifications.setNotificationChannelAsync(DEFAULT_NOTIFICATION_CHANNEL_ID, channelConfig);
  await Notifications.setNotificationChannelAsync(ALERTS_NOTIFICATION_CHANNEL_ID, {
    ...channelConfig,
    name: "HantaWorld Alerts"
  });
  logPushDebug("Android notification channels are ready.");
}

export async function registerForPushNotificationsAsync() {
  if (Constants.appOwnership === "expo") {
    logPushDebug("Skipping registration in Expo Go.");
    return null;
  }

  if (!Device.isDevice) {
    logPushDebug("Skipping registration because this is not a physical device.");
    return null;
  }

  try {
    await ensureAndroidNotificationChannelsAsync();

    const permissions = await Notifications.getPermissionsAsync();
    let finalStatus = permissions.status;
    logPushDebug("Current notification permission status.", finalStatus);

    if (finalStatus !== "granted") {
      const requested = await Notifications.requestPermissionsAsync();
      finalStatus = requested.status;
      logPushDebug("Requested notification permission status.", finalStatus);
    }

    if (finalStatus !== "granted") {
      logPushDebug("Push registration stopped because permission was not granted.");
      Alert.alert(
        "Notifications disabled",
        "Enable notifications from Android settings to receive HantaWorld report alerts.",
        [
          { text: "Not now", style: "cancel" },
          { text: "Open settings", onPress: () => Linking.openSettings().catch(() => null) }
        ]
      );
      return null;
    }

    const projectId = getProjectId();
    if (!projectId) {
      throw new Error("Expo projectId is missing.");
    }

    logPushDebug("Requesting Expo push token.", { projectId, apiBaseUrl: API_BASE_URL });
    const tokenResult = await Notifications.getExpoPushTokenAsync({ projectId });
    const expoPushToken = tokenResult.data;
    const deviceId = await getDeviceId();
    const payload = {
      expoPushToken,
      platform: Platform.OS,
      deviceId,
      appVersion: Constants.expoConfig?.version,
      locale: Localization.getLocales()[0]?.languageTag || "en"
    };

    logPushDebug("Expo push token received.", maskToken(expoPushToken));
    const response = await registerMobileDeviceDetailed(payload);
    await SecureStore.setItemAsync(TOKEN_STORAGE_KEY, expoPushToken);
    logPushDebug("Mobile device registration succeeded.", {
      status: response.status,
      body: response.body,
      id: response.data.id,
      isActive: response.data.isActive,
      lastSeenAt: response.data.lastSeenAt,
      token: maskToken(expoPushToken)
    });

    return expoPushToken;
  } catch (error) {
    logPushError("Mobile device registration failed.", error);
    return null;
  }
}
