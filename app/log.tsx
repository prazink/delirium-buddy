import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

import type { LogEntry } from '../src/domain/logs/log.types';
import {
  scoreFourAt,
  type FourAtAcuteChangeScore,
  type FourAtAmt4Score,
  type FourAtArousalScore,
  type FourAtAttentionScore,
} from '../src/domain/screening/fourAt';
import { scheduleRepeatCheckReminder } from '../src/services/localReminderService';
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
  const [suddenChange, setSuddenChange] = useState(false);
  const [hallucination, setHallucination] = useState(false);
  const [fallOrNearFall, setFallOrNearFall] = useState(false);
  const [hydrationConcern, setHydrationConcern] = useState(false);
  const [eatingConcern, setEatingConcern] = useState(false);
  const [painConcern, setPainConcern] = useState(false);
  const [mobilityConcern, setMobilityConcern] = useState(false);
  const [urineInfectionConcern, setUrineInfectionConcern] = useState(false);
  const [glassesOrHearingAidsMissing, setGlassesOrHearingAidsMissing] = useState(false);
  const [useFourAtScreening, setUseFourAtScreening] = useState(false);
  const [fourAtArousal, setFourAtArousal] = useState<FourAtArousalScore>(0);
  const [fourAtAmt4, setFourAtAmt4] = useState<FourAtAmt4Score>(0);
  const [fourAtAttention, setFourAtAttention] = useState<FourAtAttentionScore>(0);
  const [fourAtAcuteChange, setFourAtAcuteChange] = useState<FourAtAcuteChangeScore>(0);
  const [saving, setSaving] = useState(false);

  const fourAtResult = useMemo(
    () => scoreFourAt({
      arousal: fourAtArousal,
      amt4: fourAtAmt4,
      attention: fourAtAttention,
      acuteChange: fourAtAcuteChange,
    }),
    [fourAtAcuteChange, fourAtAmt4, fourAtArousal, fourAtAttention],
  );

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
      const entry: LogEntry = {
        id: String(Date.now()),
        date,
        agitation: clamp(toFiniteNumber(agitation), 0, 10),
        confusion: clamp(toFiniteNumber(confusion), 0, 10),
        sleepHours: clamp(toFiniteNumber(sleep), 0, 24),
        medsChanged,
        feverOrInfection: fever,
        suddenChange,
        hallucination,
        fallOrNearFall,
        hydrationConcern,
        eatingConcern,
        painConcern,
        mobilityConcern,
        urineInfectionConcern,
        glassesOrHearingAidsMissing,
        notes: notes.trim(),
      };

      if (useFourAtScreening) {
        entry.fourAt = {
          arousal: fourAtArousal,
          amt4: fourAtAmt4,
          attention: fourAtAttention,
          acuteChange: fourAtAcuteChange,
          completedAt: new Date().toISOString(),
          assessorRole: 'family_carer',
        };
      }

      items.push(entry);
      items.sort((a, b) => a.date.localeCompare(b.date));
      await saveLogs(items);
      showSavedPrompt(entry);
    } catch (error) {
      Alert.alert('Save failed', String(error));
    } finally {
      setSaving(false);
    }
  }

  const currentDate = new Date(date);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>New Entry</Text>
      <Text style={styles.helpText}>
        Record what changed today. This supports personal tracking and care conversations only.
      </Text>

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

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Core check-in</Text>
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
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Red flags</Text>
        <ToggleRow label="Sudden change from usual?" value={suddenChange} onValueChange={setSuddenChange} disabled={saving} />
        <ToggleRow label="Fever / infection?" value={fever} onValueChange={setFever} disabled={saving} />
        <ToggleRow label="Hallucination?" value={hallucination} onValueChange={setHallucination} disabled={saving} />
        <ToggleRow label="Fall or near fall?" value={fallOrNearFall} onValueChange={setFallOrNearFall} disabled={saving} />
        <ToggleRow label="Medication changed?" value={medsChanged} onValueChange={setMedsChanged} disabled={saving} />
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Care context</Text>
        <ToggleRow label="Hydration concern?" value={hydrationConcern} onValueChange={setHydrationConcern} disabled={saving} />
        <ToggleRow label="Eating concern?" value={eatingConcern} onValueChange={setEatingConcern} disabled={saving} />
        <ToggleRow label="Pain concern?" value={painConcern} onValueChange={setPainConcern} disabled={saving} />
        <ToggleRow label="Mobility concern?" value={mobilityConcern} onValueChange={setMobilityConcern} disabled={saving} />
        <ToggleRow label="Urine infection concern?" value={urineInfectionConcern} onValueChange={setUrineInfectionConcern} disabled={saving} />
        <ToggleRow
          label="Glasses/hearing aids missing?"
          value={glassesOrHearingAidsMissing}
          onValueChange={setGlassesOrHearingAidsMissing}
          disabled={saving}
        />
      </View>

      <View style={styles.sectionCard}>
        <ToggleRow
          label="Add structured 4AT screening fields?"
          value={useFourAtScreening}
          onValueChange={setUseFourAtScreening}
          disabled={saving}
        />
        <Text style={styles.helpTextSmall}>
          Optional workflow support for settings where 4AT use is approved. This does not diagnose delirium.
        </Text>

        {useFourAtScreening ? (
          <View style={styles.screeningBlock}>
            <ScoreOptionRow
              label="Alertness / arousal"
              selected={fourAtArousal}
              options={[{ label: '0', value: 0 }, { label: '4', value: 4 }]}
              onSelect={(value) => setFourAtArousal(value as FourAtArousalScore)}
              disabled={saving}
            />
            <ScoreOptionRow
              label="AMT4"
              selected={fourAtAmt4}
              options={[{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }]}
              onSelect={(value) => setFourAtAmt4(value as FourAtAmt4Score)}
              disabled={saving}
            />
            <ScoreOptionRow
              label="Attention"
              selected={fourAtAttention}
              options={[{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }]}
              onSelect={(value) => setFourAtAttention(value as FourAtAttentionScore)}
              disabled={saving}
            />
            <ScoreOptionRow
              label="Acute change / fluctuating course"
              selected={fourAtAcuteChange}
              options={[{ label: '0', value: 0 }, { label: '4', value: 4 }]}
              onSelect={(value) => setFourAtAcuteChange(value as FourAtAcuteChangeScore)}
              disabled={saving}
            />

            <View style={styles.screeningResult}>
              <Text style={styles.screeningResultTitle}>{fourAtResult.statusLabel}</Text>
              <Text style={styles.screeningResultScore}>Score: {fourAtResult.totalScore}</Text>
              <Text style={styles.helpTextSmall}>{fourAtResult.summary}</Text>
            </View>
          </View>
        ) : null}
      </View>

      <Field label="Notes" value={notes} onChangeText={setNotes} multiline editable={!saving} />

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
    </ScrollView>
  );
}

function showSavedPrompt(entry: LogEntry) {
  if (!shouldSuggestRepeatCheck(entry)) {
    Alert.alert('Saved', 'Entry saved.', [{ text: 'OK', onPress: () => router.replace('/') }]);
    return;
  }

  Alert.alert(
    'Entry saved',
    'This entry has a higher-concern observation. You can set a local repeat check prompt for later. This is a personal reminder only.',
    [
      { text: 'Not now', style: 'cancel', onPress: () => router.replace('/') },
      {
        text: 'Remind me in 2 hours',
        onPress: async () => {
          try {
            await scheduleRepeatCheckReminder(120);
            Alert.alert('Repeat prompt set', 'A local repeat check prompt has been set for later.', [
              { text: 'OK', onPress: () => router.replace('/') },
            ]);
          } catch (error) {
            Alert.alert('Could not set repeat prompt', String(error), [{ text: 'OK', onPress: () => router.replace('/') }]);
          }
        },
      },
    ],
  );
}

function shouldSuggestRepeatCheck(entry: LogEntry): boolean {
  const positiveStructuredScreen = entry.fourAt ? scoreFourAt(entry.fourAt).isPositiveScreen : false;

  return Boolean(
    entry.agitation >= 8 ||
      entry.confusion >= 8 ||
      entry.suddenChange ||
      entry.feverOrInfection ||
      entry.hallucination ||
      entry.fallOrNearFall ||
      positiveStructuredScreen,
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

type ToggleRowProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

function ToggleRow({ label, value, onValueChange, disabled }: ToggleRowProps) {
  return (
    <View style={styles.switchRow}>
      <Text style={styles.switchLabel}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} disabled={disabled} />
    </View>
  );
}

type ScoreOption = {
  label: string;
  value: number;
};

type ScoreOptionRowProps = {
  label: string;
  selected: number;
  options: ScoreOption[];
  onSelect: (value: number) => void;
  disabled?: boolean;
};

function ScoreOptionRow({ label, selected, options, onSelect, disabled }: ScoreOptionRowProps) {
  return (
    <View style={styles.scoreRow}>
      <Text style={styles.scoreLabel}>{label}</Text>
      <View style={styles.scoreOptions}>
        {options.map((option) => {
          const isSelected = selected === option.value;
          return (
            <TouchableOpacity
              key={`${label}-${option.value}`}
              accessibilityRole="button"
              accessibilityLabel={`${label} score ${option.label}`}
              accessibilityState={{ selected: isSelected, disabled }}
              disabled={disabled}
              onPress={() => onSelect(option.value)}
              style={[styles.scoreButton, isSelected && styles.scoreButtonSelected]}
            >
              <Text style={[styles.scoreButtonText, isSelected && styles.scoreButtonTextSelected]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 6 },
  helpText: { color: '#475569', lineHeight: 20, marginBottom: 12 },
  helpTextSmall: { color: '#64748b', fontSize: 13, lineHeight: 18, marginBottom: 10 },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
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
  switchLabel: { flex: 1, fontWeight: '600', paddingRight: 12 },
  screeningBlock: { marginTop: 2 },
  scoreRow: { marginBottom: 12 },
  scoreLabel: { color: '#334155', fontWeight: '700', marginBottom: 8 },
  scoreOptions: { flexDirection: 'row', gap: 8 },
  scoreButton: {
    minHeight: 42,
    minWidth: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
  scoreButtonSelected: { backgroundColor: '#111827', borderColor: '#111827' },
  scoreButtonText: { color: '#334155', fontWeight: '700' },
  scoreButtonTextSelected: { color: '#fff' },
  screeningResult: { backgroundColor: '#f1f5f9', borderRadius: 14, padding: 12, marginTop: 2 },
  screeningResultTitle: { color: '#111827', fontWeight: '800', marginBottom: 4 },
  screeningResultScore: { color: '#334155', fontWeight: '700', marginBottom: 6 },
  saveBtn: { backgroundColor: '#111827', paddingVertical: 14, alignItems: 'center', borderRadius: 12, marginBottom: 24 },
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
