import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

import { Avatar } from '../src/components/ui/Avatar';
import type { PersonGender, PersonProfile } from '../src/domain/logs/log.types';
import { loadPersonProfile, savePersonProfile } from '../src/storage/localProfileRepository';
import { toFiniteNumber } from '../src/utils/numbers';

const GENDER_OPTIONS: Array<{ label: string; value: PersonGender }> = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Not specified', value: 'not_specified' },
];

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [careRole, setCareRole] = useState('Primary carer');
  const [relationship, setRelationship] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [gender, setGender] = useState<PersonGender>('not_specified');
  const [ageRange, setAgeRange] = useState('');
  const [normalMobility, setNormalMobility] = useState('');
  const [normalSleepMin, setNormalSleepMin] = useState('5');
  const [normalSleepMax, setNormalSleepMax] = useState('8');
  const [normalConfusionBaseline, setNormalConfusionBaseline] = useState('2');
  const [existingMemoryIssues, setExistingMemoryIssues] = useState(false);
  const [recentSurgery, setRecentSurgery] = useState(false);
  const [recentInfection, setRecentInfection] = useState(false);

  const avatarFallback = useMemo(() => {
    const initials = displayName
      .trim()
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0] ?? '')
      .join('')
      .slice(0, 2);

    return initials || '?';
  }, [displayName]);

  useEffect(() => {
    async function hydrateProfile() {
      const profile = await loadPersonProfile();

      if (profile) {
        setDisplayName(profile.displayName);
        setCareRole(profile.careRole ?? 'Primary carer');
        setRelationship(profile.relationship);
        setAvatarUri(profile.avatarUri ?? null);
        setGender(profile.gender ?? 'not_specified');
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

  async function chooseAvatarPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Photo access needed',
        'Please allow photo library access to choose a profile photo. The photo stays on this device.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.72,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      const pickedUri = result.assets[0]?.uri;
      if (pickedUri) {
        setAvatarUri(pickedUri);
      }
    }
  }

  function removeAvatarPhoto() {
    setAvatarUri(null);
  }

  async function saveProfile() {
    const trimmedName = displayName.trim();
    const trimmedCareRole = careRole.trim();
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
        careRole: trimmedCareRole || 'Primary carer',
        avatarUri: avatarUri ?? undefined,
        gender,
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

      <View style={styles.avatarCard}>
        <Avatar source={avatarUri} size={82} fallback={avatarFallback} gender={gender} />
        <View style={styles.avatarCopy}>
          <Text style={styles.avatarTitle}>Profile photo</Text>
          <Text style={styles.avatarHelp}>Optional. Stored locally on this device only. If no photo is selected, the app uses a default avatar.</Text>
          <View style={styles.avatarActions}>
            <TouchableOpacity style={styles.avatarButton} onPress={chooseAvatarPhoto} disabled={saving} activeOpacity={0.8}>
              <Text style={styles.avatarButtonText}>{avatarUri ? 'Change photo' : 'Choose photo'}</Text>
            </TouchableOpacity>
            {avatarUri ? (
              <TouchableOpacity style={styles.removeButton} onPress={removeAvatarPhoto} disabled={saving} activeOpacity={0.8}>
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>

      <Field label="Person name or nickname" value={displayName} onChangeText={setDisplayName} editable={!saving} />
      <Field label="Your care role" value={careRole} onChangeText={setCareRole} placeholder="e.g. Primary carer, Nurse, Support worker" editable={!saving} />
      <Field label="Your relationship" value={relationship} onChangeText={setRelationship} placeholder="e.g. Godson, Daughter, Spouse, Nurse" editable={!saving} />

      <View style={styles.fieldWrap}>
        <Text style={styles.label}>Default avatar</Text>
        <View style={styles.segmentedControl}>
          {GENDER_OPTIONS.map((option) => {
            const selected = gender === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[styles.segmentButton, selected && styles.segmentButtonSelected]}
                onPress={() => setGender(option.value)}
                disabled={saving}
                accessibilityRole="button"
                accessibilityState={{ selected, disabled: saving }}
              >
                <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>{option.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

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
  avatarCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
    padding: 14,
  },
  avatarCopy: { flex: 1, minWidth: 0 },
  avatarTitle: { color: '#111827', fontSize: 16, fontWeight: '700', marginBottom: 2 },
  avatarHelp: { color: '#64748b', fontSize: 13, lineHeight: 18, marginBottom: 10 },
  avatarActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  avatarButton: { backgroundColor: '#111827', borderRadius: 999, paddingHorizontal: 13, paddingVertical: 8 },
  avatarButtonText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  removeButton: { backgroundColor: '#f8fafc', borderColor: '#e5e7eb', borderRadius: 999, borderWidth: 1, paddingHorizontal: 13, paddingVertical: 8 },
  removeButtonText: { color: '#475569', fontSize: 13, fontWeight: '700' },
  fieldWrap: { marginBottom: 12 },
  label: { fontWeight: '600', marginBottom: 4 },
  input: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', padding: 12 },
  segmentedControl: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', flexDirection: 'row', padding: 4 },
  segmentButton: { alignItems: 'center', borderRadius: 9, flex: 1, paddingHorizontal: 8, paddingVertical: 9 },
  segmentButtonSelected: { backgroundColor: '#111827' },
  segmentText: { color: '#475569', fontSize: 13, fontWeight: '700', textAlign: 'center' },
  segmentTextSelected: { color: '#fff' },
  switchRow: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  switchLabel: { fontWeight: '600' },
  saveBtn: { backgroundColor: '#111827', paddingVertical: 14, alignItems: 'center', borderRadius: 12, marginTop: 6, marginBottom: 24 },
  saveBtnDisabled: { opacity: 0.8 },
  saveText: { color: '#fff', fontWeight: '700' },
});
