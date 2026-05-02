import { Link } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { RiskCard } from '../src/components/RiskCard';
import { TrendChart } from '../src/components/TrendChart';
import type { LogEntry } from '../src/domain/logs/log.types';
import { calculateRisk } from '../src/domain/risk/calculateRisk';
import { loadLogs } from '../src/storage/localLogRepository';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    async function hydrateLogs() {
      setLogs(await loadLogs());
      setLoading(false);
    }

    hydrateLogs();
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function refreshLogs() {
        setLoading(true);
        const data = await loadLogs();

        if (isActive) {
          setLogs(data);
          setLoading(false);
        }
      }

      refreshLogs();

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
      <RiskCard risk={riskState} />
      <TrendChart logs={logs} />

      <View style={styles.row}>
        <Link href="/log" asChild>
          <Button title="New Log" />
        </Link>
        <Link href="/history" asChild>
          <Button title="History" />
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
  row: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
