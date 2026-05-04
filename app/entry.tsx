import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BaselineInsightsCard } from '../src/components/BaselineInsightsCard';
import { RiskCard } from '../src/components/RiskCard';
import { compareToBaseline } from '../src/domain/baseline/compareToBaseline';
import { buildCheckInShareText } from '../src/domain/export/buildCheckInShareText';
import { getLogObservationLabels, type ObservationLabel } from '../src/domain/logs/getLogObservationLabels';
import type { LogEntry, PersonProfile } from '../src/domain/logs/log.types';
import { calculateRisk } from '../src/domain/risk/calculateRisk';
import { scoreFourAt, type FourAtResult } from '../src/domain/screening/fourAt';
import { loadLogs } from '../src/storage/localLogRepository';
import { loadPersonProfile } from '../src/storage/localProfileRepository';

export default function EntryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<LogEntry | null>(null);
  const [profile, setProfile] = useState<PersonProfile | null>(null);

  useEffect(() => {
    async function hydrateEntry() {
      const [all, personProfile] = await Promise.all([loadLogs(), loadPersonProfile()]);
      setItem(all.find((log) => log.id === id) ?? null);
      setProfile(personProfile);
      setLoading(false);
    }

    hydrateEntry();
  }, [id]);

  const risk = useMemo(() => (item ? calculateRisk([item]) : null), [item]);
  const labels = useMemo(() => (item ? getLogObservationLabels(item) : []), [item]);
  const baselineInsights = useMemo(() => compareToBaseline(item ?? undefined, profile), [item, profile]);
  const screeningResult = useMemo(() => (item?.fourAt ? scoreFourAt(item.fourAt) : null), [item]);

  async function shareCheckIn() {
    if (!item) {
      Alert.alert('Nothing to share', 'This check-in could not be found.');
      return;
    }

    await Share.share({ message: buildCheckInShareText(item, profile) });
  }

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>Check-in detail</Text>
      <Text style={styles.title}>{item.date}</Text>
      <TouchableOpacity style={styles.shareButton} onPress={shareCheckIn} activeOpacity={0.8}>
        <Text style={styles.shareButtonText}>Share this check-in</Text>
      </TouchableOpacity>
      {risk ? <RiskCard risk={risk} /> : null}
      {screeningResult ? <ScreeningResultCard result={screeningResult} /> : null}
      <BaselineInsightsCard insights={baselineInsights} hasProfile={Boolean(profile)} hasLogs />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Core measures</Text>
        <View style={styles.metricRow}>
          <Metric label="Agitation" value={`${item.agitation}/10`} />
          <Metric label="Confusion" value={`${item.confusion}/10`} />
          <Metric label="Sleep" value={`${item.sleepHours}h`} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Observations</Text>
        {labels.length > 0 ? (
          <View style={styles.chipWrap}>
            {labels.map((label) => (
              <ObservationChip key={label.id} label={label} />
            ))}
          </View>
        ) : (
          <Text style={styles.muted}>No red flags or care context were recorded for this check-in.</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Notes</Text>
        <Text style={item.notes ? styles.notes : styles.muted}>{item.notes || 'No notes added.'}</Text>
      </View>

      <Text style={styles.disclaimer}>
        This entry is for personal tracking and care conversations only. It does not diagnose or replace medical assessment.
      </Text>
    </ScrollView>
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

type ScreeningResultCardProps = {
  result: FourAtResult;
};

function ScreeningResultCard({ result }: ScreeningResultCardProps) {
  const toneStyle = result.isPositiveScreen ? styles.screeningAlert : styles.screeningNeutral;
  const scoreToneStyle = result.isPositiveScreen ? styles.screeningScoreAlert : styles.screeningScoreNeutral;

  return (
    <View style={[styles.card, styles.screeningCard]}>
      <View style={styles.screeningHeader}>
        <View style={styles.screeningHeaderCopy}>
          <Text style={styles.cardTitle}>Structured screening</Text>
          <Text style={styles.screeningSubTitle}>Recorded with this check-in</Text>
        </View>
        <View style={[styles.screeningScorePill, scoreToneStyle]}>
          <Text style={styles.screeningScoreLabel}>Score</Text>
          <Text style={styles.screeningScoreValue}>{result.totalScore}</Text>
        </View>
      </View>

      <View style={[styles.screeningStatusBox, toneStyle]}>
        <Text style={styles.screeningStatus}>{result.statusLabel}</Text>
        <Text style={styles.screeningSummary}>{result.summary}</Text>
      </View>

      {result.flags.length > 0 ? (
        <View style={styles.screeningFlags}>
          {result.flags.map((flag) => (
            <Text key={flag} style={styles.screeningFlag}>{flag}</Text>
          ))}
        </View>
      ) : (
        <Text style={styles.muted}>No structured screening flags were recorded.</Text>
      )}

      <Text style={styles.screeningSafety}>{result.safetyNote}</Text>
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
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16 },
  eyebrow: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 12 },
  shareButton: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 12,
    marginBottom: 12,
    paddingVertical: 13,
  },
  shareButtonText: { color: '#fff', fontWeight: '800' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  metricRow: { flexDirection: 'row', gap: 8 },
  metric: { flex: 1, backgroundColor: '#f8fafc', borderRadius: 12, padding: 10 },
  metricValue: { fontSize: 16, fontWeight: '800', marginBottom: 2 },
  metricLabel: { color: '#64748b', fontSize: 11, fontWeight: '600' },
  screeningCard: { gap: 12 },
  screeningHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  screeningHeaderCopy: { flex: 1 },
  screeningSubTitle: { color: '#64748b', fontWeight: '600' },
  screeningScorePill: { alignItems: 'center', borderRadius: 14, minWidth: 72, paddingHorizontal: 12, paddingVertical: 8 },
  screeningScoreNeutral: { backgroundColor: '#eef2ff' },
  screeningScoreAlert: { backgroundColor: '#fef2f2' },
  screeningScoreLabel: { color: '#64748b', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  screeningScoreValue: { color: '#111827', fontSize: 22, fontWeight: '900' },
  screeningStatusBox: { borderRadius: 14, padding: 12 },
  screeningNeutral: { backgroundColor: '#f8fafc' },
  screeningAlert: { backgroundColor: '#fff7ed' },
  screeningStatus: { color: '#111827', fontSize: 16, fontWeight: '800', marginBottom: 4 },
  screeningSummary: { color: '#475569', lineHeight: 20 },
  screeningFlags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  screeningFlag: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    borderRadius: 999,
    borderWidth: 1,
    color: '#334155',
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  screeningSafety: { color: '#64748b', fontSize: 12, lineHeight: 18 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { borderRadius: 999, borderWidth: 1, fontSize: 12, fontWeight: '700', overflow: 'hidden', paddingHorizontal: 9, paddingVertical: 5 },
  neutral: { backgroundColor: '#f8fafc', borderColor: '#e2e8f0', color: '#475569' },
  watch: { backgroundColor: '#fffbeb', borderColor: '#fde68a', color: '#92400e' },
  'red-flag': { backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#991b1b' },
  notes: { color: '#334155', lineHeight: 20 },
  muted: { color: '#475569', lineHeight: 20 },
  disclaimer: { color: '#64748b', fontSize: 12, lineHeight: 18, marginBottom: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
