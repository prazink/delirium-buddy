import { StyleSheet, Text, View } from 'react-native';

import type { BaselineInsight } from '../domain/baseline/compareToBaseline';

type BaselineInsightsCardProps = {
  insights: BaselineInsight[];
  hasProfile: boolean;
  hasLogs: boolean;
};

export function BaselineInsightsCard({ insights, hasProfile, hasLogs }: BaselineInsightsCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Baseline insights</Text>
      {!hasProfile ? (
        <Text style={styles.muted}>Add a person profile to compare future check-ins against what is usual.</Text>
      ) : null}
      {hasProfile && !hasLogs ? (
        <Text style={styles.muted}>Add your first check-in to see baseline insights.</Text>
      ) : null}
      {hasProfile && hasLogs && insights.length === 0 ? (
        <Text style={styles.muted}>No major baseline differences or red flags in the latest check-in.</Text>
      ) : null}
      {insights.map((insight) => (
        <View key={insight.id} style={[styles.insight, styles[insight.severity]]}>
          <Text style={styles.insightTitle}>{insight.label}</Text>
          <Text style={styles.insightDetail}>{insight.detail}</Text>
        </View>
      ))}
      <Text style={styles.disclaimer}>
        These are personal tracking insights only. They do not diagnose or replace medical assessment.
      </Text>
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
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  muted: {
    color: '#475569',
    lineHeight: 20,
    marginBottom: 8,
  },
  insight: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    padding: 12,
  },
  info: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  watch: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  'red-flag': {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  insightTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
  insightDetail: {
    color: '#334155',
    lineHeight: 20,
  },
  disclaimer: {
    color: '#64748b',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
});
