import { StyleSheet, Text, View } from "react-native";

type StatCardProps = {
  label: string;
  value: number;
  tone?: "red" | "orange" | "blue" | "yellow";
};

const toneColors = {
  red: "#ff5353",
  orange: "#ff7a1a",
  blue: "#3b82f6",
  yellow: "#facc15"
};

export function StatCard({ label, value, tone = "red" }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={[styles.value, { color: toneColors[tone] }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: "47%",
    borderWidth: 1,
    borderColor: "#1f2a44",
    borderRadius: 14,
    backgroundColor: "#0c1324",
    padding: 16
  },
  value: {
    fontSize: 34,
    fontWeight: "800"
  },
  label: {
    marginTop: 8,
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase"
  }
});
