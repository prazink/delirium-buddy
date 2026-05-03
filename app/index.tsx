import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BaselineInsightsCard } from '../src/components/BaselineInsightsCard';
import { RiskCard } from '../src/components/RiskCard';
import { TrendChart } from '../src/components/TrendChart';
import { compareToBaseline } from '../src/domain/baseline/compareToBaseline';
import type { LogEntry, PersonProfile } from '../src/domain/logs/log.types';
import { calculateRisk } from '../src/domain/risk/calculateRisk';
import { loadLogs } from '../src/storage/localLogRepository';
import { loadPersonProfile } from '../src/storage/localProfileRepository';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [profile, setProfile] = useState<PersonProfile | null>(null);

  const refreshDashboard = useCallback(async () => {
    const [data, personProfile] = await Promise.all([loadLogs(), loadPersonProfile()]);
    setLogs(data);
    setProfile(personProfile);
  }, []);

  useEffect(() => {
    async function hydrateDashboard() {
      await refreshDashboard();
      setLoading(false);
    }

    hydrateDashboard();
  }, [refreshDashboard]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function refreshFocusedDashboard() {
        setLoading(true);
        const [data, personProfile] = await Promise.all([loadLogs(), loadPersonProfile()]);

        if (isActive) {
          setLogs(data);
          setProfile(personProfile);
          setLoading(false);
        }
      }

      refreshFocusedDashboard();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const latestLog = logs[logs.length - 1];
  const riskState = useMemo(() => calculateRisk(logs), [logs]);
  const baselineInsights = useMemo(() => compareToBaseline(latestLog, profile), [latestLog, profile]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>Local-first care tracking</Text>
      <Text style={styles.title}>Delirium Buddy</Text>
      <View style={styles.profileCard}>
        <Text style={styles.profileTitle}>{profile ? profile.displayName : 'No person profile yet'}</Text>
        <Text style={styles.profileText}>
          {profile
            ? `Baseline added for ${profile.relationship}. Latest check-ins can now be compared with what is usual.`
            : 'Add a baseline so the app can compare future check-ins against what is normal for this person.'}
        </Text>
      </View>
      <RiskCard risk={riskState} />
      <BaselineInsightsCard insights={baselineInsights} hasProfile={Boolean(profile)} hasLogs={logs.length > 0} />
      <TrendChart logs={logs} />

      <View style={styles.row}>
        <Link href="/profile" asChild>
          <Button title="Profile" />
        </Link>
        <Link href="/log" asChild>
          <Button title="New Log" />
        </Link>
        <Link href="/history" asChild>
          <Button title="History" />
        </Link>
      </View>
      <View style={styles.rowSecondary}>
        <Link href="/summary" asChild>
          <Button title="7-day Summary" />
        </Link>
        <Link href="/about" asChild>
          <Button title="About" />
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8fafc',
    flex: 1,
  },
  content: {
    padding: 16,
  },
  eyebrow: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileText: {
    color: '#475569',
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  rowSecondary: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 24,
  },
  center: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
