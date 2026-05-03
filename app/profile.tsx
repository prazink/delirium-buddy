import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

import type { PersonProfile } from '../src/domain/logs/log.types';
import { loadPersonProfile, savePersonProfile } from '../src/storage/localProfileRepository';
import { toFiniteNumber } from '../src/utils/numbers';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [normalMobility, setNormalMobility] = useState('');
  const [normalSleepMin, setNormalSleepMin] = useState('5');
  const [normalSleepMax, setNormalSleepMax] = useState('8');
  const [normalConfusionBaseline, setNormalConfusionBaseline] = useState('2');
  const [existingMemoryIssues, setExistingMemoryIssues] = useState(false);
  const [recentSurgery, setRecentSurgery] = useState(false);
  const [recentInfection, setRecentInfection] = useState(false);

  useEffect(() => {
    async function hydrateProfile() {
      const profile = await loadPersonProfile();

      if (profile) {
        setDisplayName(profile.displayName);
        setRelationship(profile.relationship);
        setAgeRange(profile.ageRange ?? '');
        setNormalMobility(profile.normalMobility ?? '');
        setNormalSleepMin(String(profile.normalSleepMin ?? 5));
        setNormalSleepMax(String(profile.normalSleepMax ?? 8));
        setNormalConfusionBaseline(String(profile.normalConfusionBaseline ?? 2));
        setExistingMemoryIssues(Boolean(profile.existingMemoryIssues));
        setRecentSurgery(Boolean(profile.recentSurgery));
        setRecentInfection(Boolean(profile.recentInfection));
      }

      setLoading(false);
    }

    hydrateProfile();
  }, []);

  async function saveProfile() {
    const trimmedName = displayName.trim();
    const trimmedRelationship = relationship.trim();

    if (!trimmedName || !trimmedRelationship) {
      Alert.alert('Missing details', 'Please add a name and your relationship to this person.');
      return;
    }

    try {
      setSaving(true);
      const existing = await loadPersonProfile();
      const profile: PersonProfile = {
        id: existing?.id ?? String(Date.now()),
        displayName: trimmedName,
        relationship: trimmedRelationship,
        ageRange: ageRange.trim() || undefined,
        normalMobility: normalMobility.trim() || undefined,
        normalSleepMin: toFiniteNumber(normalSleepMin, 5),
        normalSleepMax: toFiniteNumber(normalSleepMax, 8),
        normalConfusionBaseline: toFiniteNumber(normalConfusionBaseline, 2),
        existingMemoryIssues,
        recentSurgery,
        recentInfection,
        updatedAt: new Date().toISOString(),
      };

      await savePersonProfile(profile);
      Alert.alert('Profile saved', 'This baseline will help compare future check-ins.');
      router.replace('/');
    } catch (error) {
      Alert.alert('Save failed', String(error));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Person Profile</Text>
      <Text style={styles.helpText}>
        Add what is normal for this person. This app supports personal tracking and care conversations only. It does not diagnose delirium.
      </Text>

      <Field label="Person name or nickname" value={displayName} onChangeText={setDisplayName} editable={!saving} />
      <Field label="Your relationship" value={relationship} onChangeText={setRelationship} placeholder="e.g. Dad, Mum, Patient, Client" editable={!saving} />
      <Field label="Age range" value={ageRange} onChangeText={setAgeRange} placeholder="e.g. 70s" editable={!saving} />
      <Field label="Normal sleep min hours" value={normalSleepMin} onChangeText={setNormalSleepMin} keyboardType="number-pad" editable={!saving} />
      <Field label="Normal sleep max hours" value={normalSleepMax} onChangeText={setNormalSleepMax} keyboardType="number-pad" editable={!saving} />
      <Field label="Normal confusion baseline (0-10)" value={normalConfusionBaseline} onChangeText={setNormalConfusionBaseline} keyboardType="number-pad" editable={!saving} />
      <Field label="Normal mobility" value={normalMobility} onChangeText={setNormalMobility} placeholder="e.g. walks independently" editable={!saving} />

      <ToggleRow label="Existing memory issues?" value={existingMemoryIssues} onValueChange={setExistingMemoryIssues} disabled={saving} />
      <ToggleRow label="Recent surgery?" value={recentSurgery} onValueChange={setRecentSurgery} disabled={saving} />
      <ToggleRow label="Recent infection?" value={recentInfection} onValueChange={setRecentInfection} disabled={saving} />

      <TouchableOpacity style={[styles.saveBtn, saving && styles.saveBtnDisabled]} onPress={saveProfile} disabled={saving} activeOpacity={0.8}>
        <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save Profile'}</Text>
      </TouchableOpacity>
    </ScrollView>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  helpText: { color: '#475569', marginBottom: 16, lineHeight: 20 },
  fieldWrap: { marginBottom: 12 },
  label: { fontWeight: '600', marginBottom: 4 },
  input: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', padding: 12 },
  switchRow: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  switchLabel: { fontWeight: '600' },
  saveBtn: { backgroundColor: '#111827', paddingVertical: 14, alignItems: 'center', borderRadius: 12, marginTop: 6, marginBottom: 24 },
  saveBtnDisabled: { opacity: 0.8 },
  saveText: { color: '#fff', fontWeight: '700' },
});
