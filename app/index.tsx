import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { PremiumDashboard } from '../src/components/premium-dashboard/PremiumDashboard';
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
  const risk = useMemo(() => calculateRisk(logs), [logs]);
  const insights = useMemo(() => compareToBaseline(latestLog, profile), [latestLog, profile]);

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator color="#4F7DF3" />
      </View>
    );
  }

  return <PremiumDashboard profile={profile} logs={logs} risk={risk} insights={insights} />;
}

const styles = StyleSheet.create({
  loadingWrap: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    flex: 1,
    justifyContent: 'center',
  },
});
