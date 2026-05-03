import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { buildAllLogsExportText } from '../src/domain/export/buildAllLogsExportText';
import { clearLogs, loadLogs } from '../src/storage/localLogRepository';
import { clearPersonProfile, loadPersonProfile } from '../src/storage/localProfileRepository';
import { clearUser } from '../src/storage/localUserRepository';

export default function SettingsScreen() {
  const [clearing, setClearing] = useState(false);
  const [exporting, setExporting] = useState(false);

  function confirmClearData() {
    Alert.alert(
      'Clear local data?',
      'This removes the local user, person profile, and all check-ins from this device. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear data', style: 'destructive', onPress: clearAllData },
      ],
    );
  }

  async function exportAllLogs() {
    try {
      setExporting(true);
      const [logs, profile] = await Promise.all([loadLogs(), loadPersonProfile()]);
      await Share.share({ message: buildAllLogsExportText(logs, profile) });
    } catch (error) {
      Alert.alert('Could not export logs', String(error));
    } finally {
      setExporting(false);
    }
  }

  async function clearAllData() {
    try {
      setClearing(true);
      await Promise.all([clearLogs(), clearPersonProfile(), clearUser()]);
      Alert.alert('Local data cleared', 'All local Delirium Buddy data has been removed from this device.');
      router.replace('/login');
    } catch (error) {
      Alert.alert('Could not clear data', String(error));
    } finally {
      setClearing(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>Privacy and control</Text>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Local-only MVP</Text>
        <Text style={styles.bodyText}>
          Delirium Buddy currently stores your check-ins, profile and local user on this device only.
        </Text>
        <Text style={styles.bodyText}>
          This version does not sync to a server, does not use AI, and does not send your entries to a clinic or hospital.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Export local logs</Text>
        <Text style={styles.bodyText}>
          Share a plain-text export of the check-ins stored on this device. You choose where to send or save it.
        </Text>
        <TouchableOpacity
          style={[styles.primaryButton, exporting && styles.disabledButton]}
          onPress={exportAllLogs}
          disabled={exporting}
          activeOpacity={0.8}
        >
          {exporting ? (
            <View style={styles.buttonInner}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.primaryButtonText}>Preparing export...</Text>
            </View>
          ) : (
            <Text style={styles.primaryButtonText}>Export all local logs</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Medical safety</Text>
        <Text style={styles.bodyText}>
          This app supports personal tracking and care conversations only. It does not diagnose, predict, prevent or treat delirium, and it does not replace medical assessment.
        </Text>
      </View>

      <View style={styles.dangerCard}>
        <Text style={styles.cardTitle}>Clear local data</Text>
        <Text style={styles.bodyText}>
          Remove the local user, person profile and all check-ins stored on this device.
        </Text>
        <TouchableOpacity
          style={[styles.dangerButton, clearing && styles.disabledButton]}
          onPress={confirmClearData}
          disabled={clearing}
          activeOpacity={0.8}
        >
          {clearing ? (
            <View style={styles.buttonInner}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.dangerButtonText}>Clearing...</Text>
            </View>
          ) : (
            <Text style={styles.dangerButtonText}>Clear local data</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
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
  card: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  dangerCard: {
    backgroundColor: '#fff',
    borderColor: '#fecaca',
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 24,
    padding: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
  bodyText: { color: '#475569', lineHeight: 20, marginBottom: 8 },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 12,
    marginTop: 6,
    paddingVertical: 14,
  },
  primaryButtonText: { color: '#fff', fontWeight: '800' },
  dangerButton: {
    alignItems: 'center',
    backgroundColor: '#dc2626',
    borderRadius: 12,
    marginTop: 6,
    paddingVertical: 14,
  },
  disabledButton: { opacity: 0.75 },
  buttonInner: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  dangerButtonText: { color: '#fff', fontWeight: '800' },
});
