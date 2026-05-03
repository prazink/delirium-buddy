import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import type { User } from '../src/domain/logs/log.types';
import { loadUser, saveUser } from '../src/storage/localUserRepository';

export default function Login() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmitCreate() {
    try {
      setLoading(true);
      const trimmed = name.trim();

      if (!trimmed) {
        Alert.alert('Please enter your name');
        return;
      }

      const user: User = { id: String(Date.now()), name: trimmed };
      await saveUser(user);
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', String(error));
    } finally {
      setLoading(false);
    }
  }

  async function onSubmitLogin() {
    try {
      setLoading(true);
      const existing = await loadUser();

      if (existing) {
        router.replace('/');
      } else {
        Alert.alert('No local user found', 'Create a local user on this device to continue.');
      }
    } catch (error) {
      Alert.alert('Error', String(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Local-first MVP</Text>
      <Text style={styles.title}>Welcome to Delirium Buddy</Text>
      <Text style={styles.subtitle}>
        Create a local user on this device. Your check-ins stay on this device in the current MVP.
      </Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Start in three steps</Text>
        <Text style={styles.infoText}>1. Create local user</Text>
        <Text style={styles.infoText}>2. Add the person profile and baseline</Text>
        <Text style={styles.infoText}>3. Add the first check-in</Text>
      </View>

      <View style={styles.fieldWrap}>
        <Text style={styles.label}>Your name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Alex"
          value={name}
          onChangeText={setName}
          editable={!loading}
          returnKeyType="done"
          onSubmitEditing={onSubmitCreate}
        />
      </View>

      <TouchableOpacity
        style={[styles.btn, loading && styles.btnDisabled]}
        onPress={onSubmitCreate}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <View style={styles.btnInner}>
            <ActivityIndicator color="#fff" />
            <Text style={styles.btnText}>Please wait…</Text>
          </View>
        ) : (
          <Text style={styles.btnText}>Create local user</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.secondaryBtn, loading && styles.secondaryBtnDisabled]}
        onPress={onSubmitLogin}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={styles.secondaryBtnText}>I already have a local user</Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        Delirium Buddy supports personal tracking and care conversations only. It does not diagnose or replace medical assessment.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' },
  eyebrow: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: '#475569', lineHeight: 20, marginTop: 8, textAlign: 'center' },
  infoCard: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 16,
    padding: 16,
    width: '100%',
  },
  infoTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
  infoText: { color: '#475569', lineHeight: 22 },
  fieldWrap: { marginTop: 16, width: '100%' },
  label: { fontWeight: '700', marginBottom: 6 },
  input: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', padding: 12, width: '100%' },
  btn: { backgroundColor: '#111827', paddingVertical: 14, alignItems: 'center', borderRadius: 12, marginTop: 12, width: '100%' },
  btnDisabled: { opacity: 0.8 },
  btnInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btnText: { color: '#fff', fontWeight: '800' },
  secondaryBtn: { paddingVertical: 12, alignItems: 'center', borderRadius: 12, marginTop: 8, width: '100%' },
  secondaryBtnDisabled: { opacity: 0.6 },
  secondaryBtnText: { color: '#111827', fontWeight: '700' },
  disclaimer: { color: '#64748b', fontSize: 12, lineHeight: 18, marginTop: 14, textAlign: 'center' },
});
