import { StyleSheet, Text } from "react-native";

import { Screen } from "@/components/Screen";

export default function MethodologyScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Methodology</Text>
      <Text style={styles.body}>
        HantaWorld publishes verified public health records from official or source-attributed reporting. Draft,
        unverified, rejected, or unpublished records are not shown in the public app.
      </Text>
      <Text style={styles.body}>
        Numeric dashboard cards, trend points, and news reports are served from the HantaWorld admin API so approved
        changes can appear on the website and mobile app from one operational panel.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#e2e8f0",
    fontSize: 28,
    fontWeight: "900"
  },
  body: {
    color: "#cbd5e1",
    fontSize: 16,
    lineHeight: 25
  }
});
