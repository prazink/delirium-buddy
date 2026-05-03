import { Link } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { RiskCard } from '../src/components/RiskCard';
import { TrendChart } from '../src/components/TrendChart';
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

  const riskState = useMemo(() => calculateRisk(logs), [logs]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delirium Buddy</Text>
      <View style={styles.profileCard}>
        <Text style={styles.profileTitle}>{profile ? profile.displayName : 'No person profile yet'}</Text>
        <Text style={styles.profileText}>
          {profile
            ? `Baseline added for ${profile.relationship}. Use this to compare future check-ins.`
            : 'Add a baseline so the app can compare future check-ins against what is normal for this person.'}
        </Text>
      </View>
      <RiskCard risk={riskState} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8fafc',
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
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
  },
  center: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
