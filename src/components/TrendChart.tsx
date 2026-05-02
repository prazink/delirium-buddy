import { StyleSheet, Text, View } from 'react-native';
import { VictoryArea, VictoryAxis, VictoryChart, VictoryLegend, VictoryLine, VictoryTheme } from 'victory-native';

import type { LogEntry } from '../domain/logs/log.types';

type TrendChartProps = {
  logs: LogEntry[];
};

type TrendPoint = {
  x: string;
  agitation: number;
  confusion: number;
  sleep: number;
};

export function TrendChart({ logs }: TrendChartProps) {
  const series: TrendPoint[] = logs.map((log) => ({
    x: log.date,
    agitation: log.agitation,
    confusion: log.confusion,
    sleep: log.sleepHours,
  }));

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Trends</Text>
      {series.length > 0 ? (
        <VictoryChart theme={VictoryTheme.material} domainPadding={{ x: 12, y: 10 }}>
          <VictoryAxis tickFormat={(value) => (typeof value === 'string' ? value.slice(5) : value)} />
          <VictoryAxis dependentAxis />
          <VictoryLegend
            x={20}
            orientation="horizontal"
            gutter={18}
            data={[{ name: 'Agitation' }, { name: 'Confusion' }, { name: 'Sleep (h)' }]}
          />
          <VictoryArea
            data={series}
            y="agitation"
            style={{ data: { fill: '#fca5a5', stroke: '#ef4444' } }}
          />
          <VictoryArea
            data={series}
            y="confusion"
            style={{ data: { fill: '#fde68a', stroke: '#ca8a04' } }}
          />
          <VictoryLine data={series} y="sleep" style={{ data: { stroke: '#10b981' } }} />
        </VictoryChart>
      ) : (
        <Text style={styles.muted}>No data yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  muted: {
    color: '#475569',
  },
});
