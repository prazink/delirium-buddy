import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { getLogObservationLabels, type ObservationLabel } from '../src/domain/logs/getLogObservationLabels';
import type { LogEntry } from '../src/domain/logs/log.types';
import { loadLogs } from '../src/storage/localLogRepository';

export default function History() {
  const [items, setItems] = useState<LogEntry[]>([]);
  const router = useRouter();
  const sortedItems = useMemo(() => [...items].sort((a, b) => b.date.localeCompare(a.date)), [items]);

  useEffect(() => {
    async function hydrateLogs() {
      setItems(await loadLogs());
    }

    hydrateLogs();
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function refreshLogs() {
        const data = await loadLogs();

        if (active) {
          setItems(data);
        }
      }

      refreshLogs();

      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Saved check-ins</Text>
      <Text style={styles.title}>History</Text>
      <FlatList
        data={sortedItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <HistoryCard item={item} onPress={() => router.push({ pathname: '/entry', params: { id: item.id } })} />}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No check-ins yet</Text>
            <Text style={styles.muted}>Add your first check-in to start building a useful history.</Text>
          </View>
        }
      />
    </View>
  );
}

type HistoryCardProps = {
  item: LogEntry;
  onPress: () => void;
};

function HistoryCard({ item, onPress }: HistoryCardProps) {
  const labels = getLogObservationLabels(item);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.date}>{item.date}</Text>
          <Text style={styles.subtle}>Tap to review details</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>

      <View style={styles.metricRow}>
        <Metric label="Agitation" value={`${item.agitation}/10`} />
        <Metric label="Confusion" value={`${item.confusion}/10`} />
        <Metric label="Sleep" value={`${item.sleepHours}h`} />
      </View>

      {labels.length > 0 ? (
        <View style={styles.chipWrap}>
          {labels.slice(0, 4).map((label) => (
            <ObservationChip key={label.id} label={label} />
          ))}
          {labels.length > 4 ? <Text style={styles.moreChip}>+{labels.length - 4} more</Text> : null}
        </View>
      ) : (
        <Text style={styles.muted}>No red flags or care context noted.</Text>
      )}

      {item.notes ? <Text style={styles.notes} numberOfLines={2}>{item.notes}</Text> : null}
    </Pressable>
  );
}

type MetricProps = {
  label: string;
  value: string;
};

function Metric({ label, value }: MetricProps) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

type ObservationChipProps = {
  label: ObservationLabel;
};

function ObservationChip({ label }: ObservationChipProps) {
  return <Text style={[styles.chip, styles[label.tone]]}>{label.label}</Text>;
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  eyebrow: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 12 },
  listContent: { paddingBottom: 24 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  date: { fontSize: 16, fontWeight: '800' },
  subtle: { color: '#64748b', fontSize: 12, marginTop: 2 },
  chevron: { color: '#94a3b8', fontSize: 32, fontWeight: '300' },
  metricRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  metric: { flex: 1, backgroundColor: '#f8fafc', borderRadius: 12, padding: 10 },
  metricValue: { fontSize: 16, fontWeight: '800', marginBottom: 2 },
  metricLabel: { color: '#64748b', fontSize: 11, fontWeight: '600' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  chip: { borderRadius: 999, borderWidth: 1, fontSize: 12, fontWeight: '700', overflow: 'hidden', paddingHorizontal: 9, paddingVertical: 5 },
  neutral: { backgroundColor: '#f8fafc', borderColor: '#e2e8f0', color: '#475569' },
  watch: { backgroundColor: '#fffbeb', borderColor: '#fde68a', color: '#92400e' },
  'red-flag': { backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#991b1b' },
  moreChip: { color: '#64748b', fontSize: 12, fontWeight: '700', paddingHorizontal: 6, paddingVertical: 5 },
  notes: { color: '#334155', lineHeight: 20, marginTop: 4 },
  muted: { color: '#475569', lineHeight: 20 },
  emptyCard: { backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: 18, borderWidth: 1, padding: 16 },
  emptyTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
});
