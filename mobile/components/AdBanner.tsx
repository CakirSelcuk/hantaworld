import Constants from "expo-constants";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type AdsModule = typeof import("react-native-google-mobile-ads");

type AdBannerProps = {
  placement: "dashboard" | "news-detail";
};

const REAL_BANNER_AD_UNIT_ID =
  Constants.expoConfig?.extra?.adMobBannerAdUnitId || "ca-app-pub-1333313233367768/5033438042";

export function AdBanner({ placement }: AdBannerProps) {
  const [adsModule, setAdsModule] = useState<AdsModule | null>(null);
  const [failed, setFailed] = useState(false);
  const isExpoGo = Constants.appOwnership === "expo";

  useEffect(() => {
    if (isExpoGo) {
      return;
    }

    import("react-native-google-mobile-ads")
      .then((module) => {
        module.default().initialize().catch(() => null);
        setAdsModule(module);
      })
      .catch(() => setFailed(true));
  }, [isExpoGo]);

  const adUnitId = useMemo(() => {
    if (!adsModule) {
      return null;
    }

    return __DEV__ ? adsModule.TestIds.BANNER : REAL_BANNER_AD_UNIT_ID;
  }, [adsModule]);

  if (isExpoGo) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Ad preview is available in the Android build.</Text>
      </View>
    );
  }

  if (failed || !adsModule || !adUnitId) {
    return null;
  }

  const { BannerAd, BannerAdSize } = adsModule;

  return (
    <View style={styles.container} accessibilityLabel={`${placement} advertisement`}>
      <BannerAd unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 64,
    overflow: "hidden"
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
    borderWidth: 1,
    borderColor: "#1f2a44",
    borderRadius: 12,
    backgroundColor: "#0c1324",
    paddingHorizontal: 14
  },
  placeholderText: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center"
  }
});
