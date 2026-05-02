import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

import { loadLogs, saveLogs } from '../src/storage/localLogRepository';
import { todayISO, toISODate } from '../src/utils/dates';
import { clamp, toFiniteNumber } from '../src/utils/numbers';

export default function Log() {
  const [date, setDate] = useState(todayISO());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [agitation, setAgitation] = useState('3');
  const [confusion, setConfusion] = useState('3');
  const [sleep, setSleep] = useState('6');
  const [notes, setNotes] = useState('');
  const [medsChanged, setMedsChanged] = useState(false);
  const [fever, setFever] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleDateChange = (_event: unknown, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setDate(toISODate(selectedDate));
    }
  };

  async function save() {
    try {
      setSaving(true);
      const items = await loadLogs();
      items.push({
        id: String(Date.now()),
        date,
        agitation: clamp(toFiniteNumber(agitation), 0, 10),
        confusion: clamp(toFiniteNumber(confusion), 0, 10),
        sleepHours: clamp(toFiniteNumber(sleep), 0, 24),
        medsChanged,
        feverOrInfection: fever,
        notes: notes.trim(),
      });
      items.sort((a, b) => a.date.localeCompare(b.date));
      await saveLogs(items);
      Alert.alert('Saved');
      router.replace('/');
    } catch (error) {
      Alert.alert('Save failed', String(error));
    } finally {
      setSaving(false);
    }
  }

  const currentDate = new Date(date);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Entry</Text>

      <View style={styles.fieldWrap}>
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
          disabled={saving}
        >
          <Text style={styles.dateButtonText}>{date}</Text>
          <Text style={styles.dateButtonIcon}>📅</Text>
        </TouchableOpacity>
      </View>

      <Field
        label="Agitation (0-10)"
        value={agitation}
        onChangeText={setAgitation}
        keyboardType="number-pad"
        editable={!saving}
      />
      <Field
        label="Confusion (0-10)"
        value={confusion}
        onChangeText={setConfusion}
        keyboardType="number-pad"
        editable={!saving}
      />
      <Field
        label="Sleep (hours)"
        value={sleep}
        onChangeText={setSleep}
        keyboardType="number-pad"
        editable={!saving}
      />
      <Field label="Notes" value={notes} onChangeText={setNotes} multiline editable={!saving} />

      <View style={styles.switchRow}>
        <Text>Meds changed?</Text>
        <Switch value={medsChanged} onValueChange={setMedsChanged} disabled={saving} />
      </View>
      <View style={styles.switchRow}>
        <Text>Fever / Infection?</Text>
        <Switch value={fever} onValueChange={setFever} disabled={saving} />
      </View>

      <TouchableOpacity
        style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
        onPress={save}
        disabled={saving}
        activeOpacity={0.8}
      >
        {saving ? (
          <View style={styles.saveInner}>
            <ActivityIndicator color="#fff" />
            <Text style={styles.saveText}>Saving...</Text>
          </View>
        ) : (
          <Text style={styles.saveText}>Save Entry</Text>
        )}
      </TouchableOpacity>

      {Platform.OS === 'ios' && showDatePicker ? (
        <Modal transparent animationType="slide" visible={showDatePicker} onRequestClose={() => setShowDatePicker(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.modalButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Select Date</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.modalButton}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={currentDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                style={styles.datePicker}
              />
            </View>
          </View>
        </Modal>
      ) : null}

      {Platform.OS === 'android' && showDatePicker ? (
        <DateTimePicker value={currentDate} mode="date" display="default" onChange={handleDateChange} />
      ) : null}

      {saving ? (
        <View style={styles.overlay} pointerEvents="none">
          <ActivityIndicator size="large" color="#111827" />
        </View>
      ) : null}
    </View>
  );
}

type FieldProps = TextInputProps & {
  label: string;
};

function Field({ label, ...props }: FieldProps) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  fieldWrap: { marginBottom: 12 },
  label: { fontWeight: '600', marginBottom: 4 },
  input: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', padding: 12 },
  dateButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateButtonText: { fontSize: 16, color: '#111827' },
  dateButtonIcon: { fontSize: 18 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  saveBtn: { backgroundColor: '#111827', paddingVertical: 14, alignItems: 'center', borderRadius: 12 },
  saveBtnDisabled: { opacity: 0.8 },
  saveInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  saveText: { color: '#fff', fontWeight: '700' },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: { fontSize: 18, fontWeight: '600' },
  modalButton: { fontSize: 16, color: '#007AFF', fontWeight: '600' },
  datePicker: { height: 200 },
});
