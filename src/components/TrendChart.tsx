import { StyleSheet, Text, View } from 'react-native';
import { VictoryAxis, VictoryChart, VictoryLegend, VictoryLine, VictoryScatter, VictoryTheme } from 'victory-native';

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
  const recentLogs = logs.slice(-7);
  const series: TrendPoint[] = recentLogs.map((log) => ({
    x: log.date,
    agitation: log.agitation,
    confusion: log.confusion,
    sleep: log.sleepHours,
  }));

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>7-day trend</Text>
        <Text style={styles.badge}>{series.length} logs</Text>
      </View>
      {series.length >= 2 ? (
        <VictoryChart
          height={230}
          padding={{ top: 38, bottom: 44, left: 42, right: 48 }}
          theme={VictoryTheme.material}
          domain={{ y: [0, 10] }}
          domainPadding={{ x: 24, y: 10 }}
        >
          <VictoryAxis
            fixLabelOverlap
            style={{ tickLabels: { fontSize: 11, padding: 8 } }}
            tickFormat={(value) => (typeof value === 'string' ? value.slice(5) : value)}
          />
          <VictoryAxis dependentAxis tickValues={[0, 2, 4, 6, 8, 10]} style={{ tickLabels: { fontSize: 11 } }} />
          <VictoryLegend
            x={42}
            y={4}
            orientation="horizontal"
            gutter={16}
            data={[{ name: 'Agitation' }, { name: 'Confusion' }, { name: 'Sleep' }]}
            style={{ labels: { fontSize: 11 } }}
          />
          <VictoryLine data={series} y="agitation" style={{ data: { stroke: '#ef4444', strokeWidth: 3 } }} />
          <VictoryLine data={series} y="confusion" style={{ data: { stroke: '#ca8a04', strokeWidth: 3 } }} />
          <VictoryLine data={series} y="sleep" style={{ data: { stroke: '#10b981', strokeWidth: 3 } }} />
          <VictoryScatter data={series} y="agitation" size={3} style={{ data: { fill: '#ef4444' } }} />
          <VictoryScatter data={series} y="confusion" size={3} style={{ data: { fill: '#ca8a04' } }} />
          <VictoryScatter data={series} y="sleep" size={3} style={{ data: { fill: '#10b981' } }} />
        </VictoryChart>
      ) : series.length === 1 ? (
        <View style={styles.singleLogState}>
          <Text style={styles.singleLogTitle}>One check-in recorded</Text>
          <Text style={styles.muted}>
            Add another check-in to see a trend line. Latest: agitation {series[0]?.agitation}/10, confusion{' '}
            {series[0]?.confusion}/10, sleep {series[0]?.sleep}h.
          </Text>
        </View>
      ) : (
        <Text style={styles.muted}>No data yet. Add a check-in to start seeing trends.</Text>
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
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: '#f1f5f9',
    borderRadius: 999,
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  singleLogState: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
  },
  singleLogTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
  muted: {
    color: '#475569',
    lineHeight: 20,
  },
});
