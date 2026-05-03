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
        Alert.alert('No user found', 'Create a user to continue.');
      }
    } catch (error) {
      Alert.alert('Error', String(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Create a local user to continue.</Text>

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
          <Text style={styles.btnText}>Create User</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.secondaryBtn, loading && styles.secondaryBtnDisabled]}
        onPress={onSubmitLogin}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={styles.secondaryBtnText}>I already have a user</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#475569', marginTop: 6 },
  fieldWrap: { marginTop: 16, width: '100%' },
  label: { fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', padding: 12, width: '100%' },
  btn: { backgroundColor: '#111827', paddingVertical: 14, alignItems: 'center', borderRadius: 12, marginTop: 12, width: '100%' },
  btnDisabled: { opacity: 0.8 },
  btnInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btnText: { color: '#fff', fontWeight: '700' },
  secondaryBtn: { paddingVertical: 12, alignItems: 'center', borderRadius: 12, marginTop: 8, width: '100%' },
  secondaryBtnDisabled: { opacity: 0.6 },
  secondaryBtnText: { color: '#111827', fontWeight: '600' },
});
