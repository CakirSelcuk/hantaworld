import { StyleSheet, Text } from "react-native";

import { Screen } from "@/components/Screen";

export default function SymptomsScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Symptoms</Text>
      <Text style={styles.body}>
        Early symptoms can include fever, fatigue, muscle aches, headache, dizziness, chills, nausea, vomiting, diarrhea,
        and abdominal pain.
      </Text>
      <Text style={styles.body}>
        Severe disease may progress to coughing, shortness of breath, fluid in the lungs, low blood pressure, or shock.
        People with relevant exposure and symptoms should contact local health services promptly.
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
