import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { buildSevenDaySummary, type HandoverPriority } from '../src/domain/summary/buildSevenDaySummary';
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
      <Text style={styles.eyebrow}>Care conversation</Text>
      <Text style={styles.title}>7-day Handover</Text>
      <Text style={styles.helpText}>
        A structured personal tracking summary you can share with care staff. It is not a diagnosis or medical advice.
      </Text>

      <View style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroLabel}>For</Text>
            <Text style={styles.heroName}>{summary.personLabel}</Text>
            {summary.carerContext ? <Text style={styles.carerContext}>{summary.carerContext}</Text> : null}
          </View>
          <PriorityBadge priority={summary.handoverPriority} />
        </View>
        <Text style={styles.headline}>{summary.handoverHeadline}</Text>
        <Text style={styles.dateRange}>{summary.dateRange}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Overview</Text>
        <View style={styles.metricGrid}>
          <Metric label="Check-ins" value={String(summary.totalLogs)} />
          <Metric label="Avg agitation" value={`${formatNumber(summary.averageAgitation)}/10`} />
          <Metric label="Avg confusion" value={`${formatNumber(summary.averageConfusion)}/10`} />
          <Metric label="Avg sleep" value={`${formatNumber(summary.averageSleepHours)}h`} />
        </View>
        {summary.highestConcernDay ? (
          <Text style={styles.overviewNote}>
            Highest concern: {summary.highestConcernDay.date} - agitation {summary.highestConcernDay.agitation}/10, confusion{' '}
            {summary.highestConcernDay.confusion}/10, sleep {summary.highestConcernDay.sleepHours}h
          </Text>
        ) : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Key talking points</Text>
        <BulletList items={summary.keyTalkingPoints} emptyText="No talking points available yet." />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Risks and care context</Text>
        <View style={styles.statRow}>
          <MiniStat label="Sudden change" value={summary.suddenChangeDays} />
          <MiniStat label="Fever/infection" value={summary.feverOrInfectionDays} />
          <MiniStat label="Medicine changes" value={summary.medicationChangeDays} />
        </View>
        <View style={styles.statRow}>
          <MiniStat label="Screens" value={summary.structuredScreeningCount} />
          <MiniStat label="Positive screens" value={summary.positiveStructuredScreens} />
          <MiniStat label="Red flag types" value={summary.redFlags.length} />
        </View>

        <Text style={styles.subTitle}>Red flags noted</Text>
        <ChipList items={summary.redFlags} emptyText="None recorded" tone="danger" />

        <Text style={styles.subTitle}>Care context noted</Text>
        <ChipList items={summary.careContextFlags} emptyText="None recorded" tone="neutral" />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Questions to ask care staff</Text>
        <BulletList items={summary.suggestedQuestions} emptyText="No questions generated yet." />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Shareable handover text</Text>
        <Text style={styles.summaryText}>{summary.summaryText}</Text>
      </View>

      <TouchableOpacity style={styles.shareBtn} onPress={shareSummary} activeOpacity={0.8}>
        <Text style={styles.shareText}>Share Handover Summary</Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        This summary is for personal tracking and care conversations only. It does not diagnose delirium and does not replace clinical assessment.
      </Text>
    </ScrollView>
  );
}

type PriorityBadgeProps = {
  priority: HandoverPriority;
};

function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = {
    routine: { label: 'Routine', style: styles.priorityRoutine, textStyle: styles.priorityRoutineText },
    watch: { label: 'Watch', style: styles.priorityWatch, textStyle: styles.priorityWatchText },
    urgent_review: { label: 'Review', style: styles.priorityUrgent, textStyle: styles.priorityUrgentText },
  }[priority];

  return (
    <View style={[styles.priorityBadge, config.style]}>
      <Text style={[styles.priorityText, config.textStyle]}>{config.label}</Text>
    </View>
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

type MiniStatProps = {
  label: string;
  value: number;
};

function MiniStat({ label, value }: MiniStatProps) {
  return (
    <View style={styles.miniStat}>
      <Text style={styles.miniStatValue}>{value}</Text>
      <Text style={styles.miniStatLabel}>{label}</Text>
    </View>
  );
}

type BulletListProps = {
  items: string[];
  emptyText: string;
};

function BulletList({ items, emptyText }: BulletListProps) {
  if (items.length === 0) {
    return <Text style={styles.muted}>{emptyText}</Text>;
  }

  return (
    <View style={styles.bulletList}>
      {items.map((item) => (
        <View key={item} style={styles.bulletRow}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

type ChipListProps = {
  items: string[];
  emptyText: string;
  tone: 'danger' | 'neutral';
};

function ChipList({ items, emptyText, tone }: ChipListProps) {
  if (items.length === 0) {
    return <Text style={styles.muted}>{emptyText}</Text>;
  }

  return (
    <View style={styles.chipWrap}>
      {items.map((item) => (
        <Text key={item} style={[styles.chip, tone === 'danger' ? styles.chipDanger : styles.chipNeutral]}>
          {item}
        </Text>
      ))}
    </View>
  );
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  eyebrow: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.7,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 8 },
  helpText: { color: '#475569', lineHeight: 20, marginBottom: 16 },
  heroCard: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 12 },
  heroCopy: { flex: 1, minWidth: 0 },
  heroLabel: { color: '#64748b', fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
  heroName: { color: '#0f172a', fontSize: 22, fontWeight: '800', marginTop: 2 },
  carerContext: { color: '#64748b', fontSize: 13, fontWeight: '600', marginTop: 4 },
  headline: { color: '#0f172a', fontSize: 16, fontWeight: '700', lineHeight: 22, marginBottom: 8 },
  dateRange: { color: '#64748b', fontWeight: '700' },
  priorityBadge: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7, alignSelf: 'flex-start' },
  priorityText: { fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  priorityRoutine: { backgroundColor: '#ecfdf5' },
  priorityRoutineText: { color: '#047857' },
  priorityWatch: { backgroundColor: '#fffbeb' },
  priorityWatchText: { color: '#92400e' },
  priorityUrgent: { backgroundColor: '#fef2f2' },
  priorityUrgentText: { color: '#b91c1c' },
  card: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  cardTitle: { color: '#0f172a', fontSize: 16, fontWeight: '800', marginBottom: 10 },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metric: { backgroundColor: '#f8fafc', borderRadius: 12, flexBasis: '48%', flexGrow: 1, padding: 12 },
  metricValue: { color: '#0f172a', fontSize: 18, fontWeight: '900', marginBottom: 2 },
  metricLabel: { color: '#64748b', fontSize: 12, fontWeight: '700' },
  overviewNote: { color: '#475569', lineHeight: 20, marginTop: 12 },
  statRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  miniStat: { backgroundColor: '#f8fafc', borderRadius: 12, flex: 1, padding: 10 },
  miniStatValue: { color: '#0f172a', fontSize: 18, fontWeight: '900' },
  miniStatLabel: { color: '#64748b', fontSize: 11, fontWeight: '700', marginTop: 2 },
  subTitle: { color: '#334155', fontSize: 13, fontWeight: '800', marginTop: 10, marginBottom: 8, textTransform: 'uppercase' },
  bulletList: { gap: 8 },
  bulletRow: { flexDirection: 'row', gap: 8 },
  bulletDot: { color: '#2563eb', fontSize: 18, lineHeight: 20 },
  bulletText: { color: '#334155', flex: 1, lineHeight: 20 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { borderRadius: 999, borderWidth: 1, fontSize: 12, fontWeight: '800', overflow: 'hidden', paddingHorizontal: 9, paddingVertical: 5 },
  chipDanger: { backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#991b1b' },
  chipNeutral: { backgroundColor: '#f8fafc', borderColor: '#e2e8f0', color: '#475569' },
  muted: { color: '#475569', lineHeight: 20 },
  summaryText: { color: '#334155', fontFamily: undefined, lineHeight: 20 },
  shareBtn: { backgroundColor: '#111827', paddingVertical: 14, alignItems: 'center', borderRadius: 12, marginTop: 2, marginBottom: 12 },
  shareText: { color: '#fff', fontWeight: '800' },
  disclaimer: { color: '#64748b', fontSize: 12, lineHeight: 18, marginBottom: 24 },
});
