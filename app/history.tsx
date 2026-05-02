import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import type { LogEntry } from '../src/domain/logs/log.types';
import { loadLogs } from '../src/storage/localLogRepository';

export default function History() {
  const [items, setItems] = useState<LogEntry[]>([]);
  const router = useRouter();

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
      <Text style={styles.title}>History</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() => router.push({ pathname: '/entry', params: { id: item.id } })}
          >
            <Text style={styles.date}>{item.date}</Text>
            <Text>
              Ag:{item.agitation} Co:{item.confusion} Sleep:{item.sleepHours}h
            </Text>
            {item.medsChanged ? <Text style={styles.flag}>Meds changed</Text> : null}
            {item.feverOrInfection ? <Text style={styles.flag}>Fever/Infection</Text> : null}
            {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.muted}>No entries yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  row: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 10,
  },
  date: { fontWeight: '600', marginBottom: 4 },
  notes: { color: '#334155', marginTop: 4 },
  flag: { color: '#dc2626', fontWeight: '600' },
  muted: { color: '#475569' },
});
