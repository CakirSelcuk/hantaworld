import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

import type { GlobalStatsTrendPoint } from "@/lib/types";

type TrendChartProps = {
  points: GlobalStatsTrendPoint[];
};

export function TrendChart({ points }: TrendChartProps) {
  const { width } = useWindowDimensions();
  const chartWidth = Math.max(240, width - 72);
  const chartHeight = 178;

  if (points.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Case and Death Trend</Text>
        <Text style={styles.empty}>No trend data has been published yet.</Text>
      </View>
    );
  }

  const caseData = points.map((point) => ({
    value: point.reportedCases
  }));
  const deathData = points.map((point) => ({
    value: point.totalDeaths
  }));
  const maxValue = Math.max(1, ...caseData.map((point) => point.value), ...deathData.map((point) => point.value));

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Case and Death Trend</Text>
        <View style={styles.legend}>
          <Text style={styles.caseLegend}>Cases</Text>
          <Text style={styles.deathLegend}>Deaths</Text>
        </View>
      </View>
      <View style={styles.chart}>
        <View style={styles.gridLine} />
        <View style={[styles.gridLine, styles.gridLineMiddle]} />
        <View style={[styles.gridLine, styles.gridLineBottom]} />
        <SparkLine values={caseData.map((point) => point.value)} maxValue={maxValue} color="#ff5353" width={chartWidth} height={chartHeight} />
        <SparkLine values={deathData.map((point) => point.value)} maxValue={maxValue} color="#ff7a1a" width={chartWidth} height={chartHeight} />
      </View>
      <View style={styles.labels}>
        {points.map((point) => (
          <Text key={point.date} style={styles.axisText}>
            {formatDay(point.date)}
          </Text>
        ))}
      </View>
    </View>
  );
}

function SparkLine({
  values,
  maxValue,
  color,
  width,
  height
}: {
  values: number[];
  maxValue: number;
  color: string;
  width: number;
  height: number;
}) {
  if (values.length === 1) {
    return (
      <View
        style={[
          styles.point,
          {
            backgroundColor: color,
            left: width / 2,
            top: height - (values[0] / maxValue) * (height - 18)
          }
        ]}
      />
    );
  }

  const coordinates = values.map((value, index) => ({
    x: (index / Math.max(values.length - 1, 1)) * width,
    y: height - (value / maxValue) * (height - 18)
  }));

  return (
    <View style={StyleSheet.absoluteFill}>
      {coordinates.map((point, index) => (
        <View key={`${color}-${index}`} style={[styles.point, { backgroundColor: color, left: point.x, top: point.y }]} />
      ))}
      {coordinates.slice(0, -1).map((point, index) => {
        const nextPoint = coordinates[index + 1];
        const dx = nextPoint.x - point.x;
        const dy = nextPoint.y - point.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = `${Math.atan2(dy, dx)}rad`;

        return (
          <View
            key={`${color}-line-${index}`}
            style={[
              styles.segment,
              {
                borderColor: color,
                left: point.x,
                top: point.y,
                width: length,
                transform: [{ rotate: angle }]
              }
            ]}
          />
        );
      })}
    </View>
  );
}

function formatDay(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#1f2a44",
    borderRadius: 14,
    backgroundColor: "#0c1324",
    padding: 16
  },
  header: {
    gap: 10,
    marginBottom: 10
  },
  title: {
    color: "#e2e8f0",
    fontSize: 18,
    fontWeight: "800"
  },
  legend: {
    flexDirection: "row",
    gap: 16
  },
  caseLegend: {
    color: "#ff5353",
    fontWeight: "700"
  },
  deathLegend: {
    color: "#ff7a1a",
    fontWeight: "700"
  },
  axisText: {
    color: "#94a3b8",
    fontSize: 10
  },
  empty: {
    color: "#94a3b8",
    lineHeight: 22
  },
  chart: {
    height: 190,
    marginTop: 10,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#253149",
    position: "relative"
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    borderTopWidth: 1,
    borderColor: "#1f2a44"
  },
  gridLineMiddle: {
    top: "50%"
  },
  gridLineBottom: {
    top: "100%"
  },
  point: {
    position: "absolute",
    width: 9,
    height: 9,
    borderRadius: 999,
    marginLeft: -4,
    marginBottom: -4
  },
  segment: {
    position: "absolute",
    height: 1,
    borderTopWidth: 2,
    opacity: 0.85
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  }
});
