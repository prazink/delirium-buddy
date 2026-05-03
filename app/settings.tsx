import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { buildAllLogsExportText } from '../src/domain/export/buildAllLogsExportText';
import { cancelReminder, scheduleDailyReminder } from '../src/services/localReminderService';
import { clearLogs, loadLogs } from '../src/storage/localLogRepository';
import { clearPersonProfile, loadPersonProfile } from '../src/storage/localProfileRepository';
import {
  clearReminderSettings,
  loadReminderSettings,
  saveReminderSettings,
  type ReminderSettings,
} from '../src/storage/localReminderRepository';
import { clearUser } from '../src/storage/localUserRepository';

export default function SettingsScreen() {
  const [clearing, setClearing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [savingReminder, setSavingReminder] = useState(false);
  const [reminder, setReminder] = useState<ReminderSettings | null>(null);

  useEffect(() => {
    async function hydrateReminder() {
      setReminder(await loadReminderSettings());
    }

    hydrateReminder();
  }, []);

  function confirmClearData() {
    Alert.alert(
      'Clear local data?',
      'This removes the local user, person profile, all check-ins and reminder settings from this device. This cannot be undone.',
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

  async function toggleReminder(enabled: boolean) {
    if (!reminder || savingReminder) return;

    try {
      setSavingReminder(true);

      if (enabled) {
        const notificationId = await scheduleDailyReminder(reminder);
        const nextSettings: ReminderSettings = {
          ...reminder,
          enabled: true,
          notificationId,
          updatedAt: new Date().toISOString(),
        };
        await saveReminderSettings(nextSettings);
        setReminder(nextSettings);
        Alert.alert('Reminder enabled', 'A local daily check-in reminder has been scheduled.');
        return;
      }

      await cancelReminder(reminder.notificationId);
      const nextSettings: ReminderSettings = {
        ...reminder,
        enabled: false,
        notificationId: undefined,
        updatedAt: new Date().toISOString(),
      };
      await saveReminderSettings(nextSettings);
      setReminder(nextSettings);
      Alert.alert('Reminder disabled', 'The local daily reminder has been turned off.');
    } catch (error) {
      Alert.alert('Reminder update failed', String(error));
    } finally {
      setSavingReminder(false);
    }
  }

  async function clearAllData() {
    try {
      setClearing(true);
      if (reminder?.notificationId) {
        await cancelReminder(reminder.notificationId);
      }
      await Promise.all([clearLogs(), clearPersonProfile(), clearUser(), clearReminderSettings()]);
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
        <Text style={styles.cardTitle}>Daily check-in reminder</Text>
        <Text style={styles.bodyText}>
          Turn on a local reminder to help you remember a daily check-in. This is habit support only, not medical monitoring.
        </Text>
        <View style={styles.reminderRow}>
          <View style={styles.reminderCopy}>
            <Text style={styles.reminderTitle}>{reminder?.enabled ? 'Reminder on' : 'Reminder off'}</Text>
            <Text style={styles.reminderText}>
              Default time: {formatTime(reminder?.hour ?? 18, reminder?.minute ?? 0)}
            </Text>
          </View>
          <Switch
            value={Boolean(reminder?.enabled)}
            onValueChange={toggleReminder}
            disabled={!reminder || savingReminder}
          />
        </View>
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
          Remove the local user, person profile, reminder settings and all check-ins stored on this device.
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

function formatTime(hour: number, minute: number): string {
  const hour12 = hour % 12 || 12;
  const suffix = hour >= 12 ? 'PM' : 'AM';
  return `${hour12}:${String(minute).padStart(2, '0')} ${suffix}`;
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
  reminderRow: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  reminderCopy: { flex: 1, paddingRight: 12 },
  reminderTitle: { fontWeight: '800', marginBottom: 2 },
  reminderText: { color: '#64748b', fontSize: 12 },
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
