import { StyleSheet, Text } from "react-native";

import { Screen } from "@/components/Screen";

export default function AndesVirusScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Andes Virus</Text>
      <Text style={styles.body}>
        Andes virus is a hantavirus strain associated with southern South America. It is notable because limited
        person-to-person transmission has been reported in close and prolonged contact settings.
      </Text>
      <Text style={styles.body}>
        Risk remains context-dependent. Vessel-linked passengers, crew, household contacts, and healthcare settings
        require more active monitoring than the general public.
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
