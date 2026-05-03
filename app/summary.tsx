import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { buildSevenDaySummary } from '../src/domain/summary/buildSevenDaySummary';
import type { LogEntry, PersonProfile } from '../src/domain/logs/log.types';
import { loadLogs } from '../src/storage/localLogRepository';
import { loadPersonProfile } from '../src/storage/localProfileRepository';

export default function SummaryScreen() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [profile, setProfile] = useState<PersonProfile | null>(null);

  useEffect(() => {
    async function hydrateSummary() {
      const [items, personProfile] = await Promise.all([loadLogs(), loadPersonProfile()]);
      setLogs(items);
      setProfile(personProfile);
      setLoading(false);
    }

    hydrateSummary();
  }, []);

  const summary = useMemo(() => buildSevenDaySummary(logs, profile), [logs, profile]);

  async function shareSummary() {
    await Share.share({ message: summary.summaryText });
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>7-day Summary</Text>
      <Text style={styles.helpText}>
        A simple personal tracking summary you can share with care staff. It is not a diagnosis or medical advice.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Overview</Text>
        <Text>Total check-ins: {summary.totalLogs}</Text>
        <Text>Medication change days: {summary.medicationChangeDays}</Text>
        <Text>Fever or infection days: {summary.feverOrInfectionDays}</Text>
        {summary.highestConcernDay ? (
          <Text>
            Highest concern day: {summary.highestConcernDay.date} - agitation {summary.highestConcernDay.agitation}/10, confusion{' '}
            {summary.highestConcernDay.confusion}/10, sleep {summary.highestConcernDay.sleepHours}h
          </Text>
        ) : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Red flags noted</Text>
        {summary.redFlags.length > 0 ? (
          summary.redFlags.map((flag) => (
            <Text key={flag} style={styles.flag}>
              • {flag}
            </Text>
          ))
        ) : (
          <Text style={styles.muted}>No red flags recorded in the latest check-ins.</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Shareable text</Text>
        <Text style={styles.summaryText}>{summary.summaryText}</Text>
      </View>

      <TouchableOpacity style={styles.shareBtn} onPress={shareSummary} activeOpacity={0.8}>
        <Text style={styles.shareText}>Share Summary</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  helpText: { color: '#475569', lineHeight: 20, marginBottom: 16 },
  card: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  flag: { color: '#dc2626', fontWeight: '600', marginBottom: 4 },
  muted: { color: '#475569' },
  summaryText: { color: '#334155', lineHeight: 20 },
  shareBtn: { backgroundColor: '#111827', paddingVertical: 14, alignItems: 'center', borderRadius: 12, marginBottom: 24 },
  shareText: { color: '#fff', fontWeight: '700' },
});
