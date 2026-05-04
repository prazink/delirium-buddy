import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { DeliriumBuddyLogo } from '../src/components/brand/DeliriumBuddyLogo';
import { Icon } from '../src/components/ui/Icon';
import type { User } from '../src/domain/logs/log.types';
import { loadUser, saveUser } from '../src/storage/localUserRepository';
import { palette } from '../src/theme/tokens';

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
        Alert.alert('No account found', 'Create an account on this device to continue.');
      }
    } catch (error) {
      Alert.alert('Error', String(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <DeliriumBuddyLogo size="lg" centered style={styles.logo} />

      <Text style={styles.title}>Welcome to Delirium Buddy</Text>
      <Text style={styles.subtitle}>
        Track daily changes, support structured checks, and prepare clear handovers for care conversations.
      </Text>

      <View style={styles.privacyRow}>
        <View style={styles.privacyIcon}>
          <Icon name="lock" size={24} color="#486385" />
        </View>
        <Text style={styles.privacyText}>
          Your information stays on this device unless you choose to share a handover.
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Get started in three steps</Text>
        <Step number="1" text="Create your account" />
        <Step number="2" text="Add the person profile and baseline" />
        <Step number="3" text="Start daily check-ins and handovers" />
      </View>

      <View style={styles.fieldWrap}>
        <Text style={styles.label}>Your name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Alex"
          placeholderTextColor="#b8bec8"
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
        activeOpacity={0.86}
      >
        {loading ? (
          <View style={styles.btnInner}>
            <ActivityIndicator color="#fff" />
            <Text style={styles.btnText}>Please wait…</Text>
          </View>
        ) : (
          <Text style={styles.btnText}>Create account</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.secondaryBtn, loading && styles.secondaryBtnDisabled]}
        onPress={onSubmitLogin}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={styles.secondaryBtnText}>I already have an account</Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        Delirium Buddy supports daily tracking, structured screening support, reminders, and handover preparation. It is not a diagnosis tool and does not replace professional assessment.
      </Text>
    </ScrollView>
  );
}

function Step({ number, text }: { number: string; text: string }) {
  return (
    <View style={styles.stepRow}>
      <View style={styles.stepBadge}>
        <Text style={styles.stepNumber}>{number}</Text>
      </View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f8fb' },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 34,
  },
  logo: {
    marginBottom: 28,
  },
  title: {
    color: palette.navy900,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.8,
    lineHeight: 38,
    textAlign: 'center',
  },
  subtitle: {
    color: '#486385',
    fontSize: 17,
    lineHeight: 25,
    marginTop: 12,
    textAlign: 'center',
  },
  privacyRow: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 12,
    marginTop: 26,
    maxWidth: 340,
  },
  privacyIcon: {
    alignItems: 'center',
    backgroundColor: '#eef3f8',
    borderRadius: 18,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  privacyText: {
    color: '#486385',
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderColor: '#dce2ea',
    borderRadius: 22,
    borderWidth: 1,
    marginTop: 28,
    padding: 18,
    shadowColor: palette.navy900,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    width: '100%',
  },
  infoTitle: { color: palette.navy900, fontSize: 19, fontWeight: '900', marginBottom: 14 },
  stepRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  stepBadge: {
    alignItems: 'center',
    backgroundColor: palette.navy900,
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  stepNumber: { color: '#fff', fontSize: 15, fontWeight: '900' },
  stepText: { color: '#1c2d44', flex: 1, fontSize: 16, lineHeight: 22 },
  fieldWrap: { marginTop: 26, width: '100%' },
  label: { color: palette.navy900, fontSize: 16, fontWeight: '900', marginBottom: 8 },
  input: {
    backgroundColor: '#fff',
    borderColor: '#dce2ea',
    borderRadius: 18,
    borderWidth: 1,
    color: palette.navy900,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 15,
    width: '100%',
  },
  btn: {
    alignItems: 'center',
    backgroundColor: palette.navy900,
    borderRadius: 18,
    marginTop: 18,
    paddingVertical: 17,
    shadowColor: palette.navy900,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    width: '100%',
  },
  btnDisabled: { opacity: 0.8 },
  btnInner: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '900' },
  secondaryBtn: { alignItems: 'center', borderRadius: 12, marginTop: 16, paddingVertical: 12, width: '100%' },
  secondaryBtnDisabled: { opacity: 0.6 },
  secondaryBtnText: { color: '#486385', fontSize: 16, fontWeight: '900' },
  disclaimer: {
    color: '#64748b',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 24,
    textAlign: 'center',
  },
});
