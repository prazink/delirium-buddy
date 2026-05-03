import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { RiskCard } from '../src/components/RiskCard';
import type { LogEntry } from '../src/domain/logs/log.types';
import { calculateRisk } from '../src/domain/risk/calculateRisk';
import { loadLogs } from '../src/storage/localLogRepository';

export default function EntryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<LogEntry | null>(null);

  useEffect(() => {
    async function hydrateEntry() {
      const all = await loadLogs();
      setItem(all.find((log) => log.id === id) ?? null);
      setLoading(false);
    }

    hydrateEntry();
  }, [id]);

  const risk = useMemo(() => (item ? calculateRisk([item]) : null), [item]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.center}>
        <Text>Entry not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entry {item.date}</Text>
      {risk ? <RiskCard risk={risk} /> : null}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Details</Text>
        <Text>Date: {item.date}</Text>
        <Text>Agitation: {item.agitation}</Text>
        <Text>Confusion: {item.confusion}</Text>
        <Text>Sleep: {item.sleepHours}h</Text>
        {item.medsChanged ? <Text>Meds changed</Text> : null}
        {item.feverOrInfection ? <Text>Fever/Infection</Text> : null}
        {item.suddenChange ? <Text>Sudden change noted</Text> : null}
        {item.hallucination ? <Text>Hallucination noted</Text> : null}
        {item.fallOrNearFall ? <Text>Fall or near fall noted</Text> : null}
        {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  notes: { marginTop: 6 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
