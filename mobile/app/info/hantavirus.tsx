import { StyleSheet, Text } from "react-native";

import { Screen } from "@/components/Screen";

export default function HantavirusInfoScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Hantavirus</Text>
      <Text style={styles.body}>
        Hantaviruses are a family of viruses carried mainly by rodents. Human illness usually follows exposure to
        infected rodent urine, droppings, saliva, or contaminated dust.
      </Text>
      <Text style={styles.body}>
        Public health reporting should separate confirmed cases, probable cases, monitored contacts, and media signals.
        HantaWorld prioritizes verified and published records from official health sources.
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
