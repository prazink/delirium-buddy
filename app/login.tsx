import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { BrandMark } from '../src/components/BrandMark';
import { BrandedCard } from '../src/components/BrandedCard';
import type { User } from '../src/domain/logs/log.types';
import { loadUser, saveUser } from '../src/storage/localUserRepository';
import { colors, layout, radius, shadows, spacing } from '../src/theme/tokens';

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroArt}>
        <View style={styles.sun} />
        <View style={styles.waveOne} />
        <View style={styles.waveTwo} />
      </View>

      <BrandMark size={82} />
      <Text style={styles.eyebrow}>Local-first care tracking</Text>
      <Text style={styles.title}>Welcome to Delirium Buddy</Text>
      <Text style={styles.subtitle}>Track daily changes and share clearer care conversations.</Text>

      <BrandedCard tone="soft">
        <Text style={styles.infoTitle}>Start in three simple steps</Text>
        <Step number="1" text="Create a local user" />
        <Step number="2" text="Add the person profile and baseline" />
        <Step number="3" text="Add the first check-in" />
      </BrandedCard>

      <View style={styles.fieldWrap}>
        <Text style={styles.label}>Your name</Text>
        <TextInput
          accessibilityLabel="Your name"
          style={styles.input}
          placeholder="e.g. Alex"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
          editable={!loading}
          returnKeyType="done"
          onSubmitEditing={onSubmitCreate}
        />
      </View>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Create local user"
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
        accessibilityRole="button"
        accessibilityLabel="Use existing local user"
        style={[styles.secondaryBtn, loading && styles.secondaryBtnDisabled]}
        onPress={onSubmitLogin}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={styles.secondaryBtnText}>I already have a local user</Text>
      </TouchableOpacity>

      <View style={styles.privacyFooter}>
        <Text style={styles.lockIcon}>🔒</Text>
        <Text style={styles.disclaimer}>
          Your current MVP data stays on this device. This app supports personal tracking and care conversations only.
        </Text>
      </View>
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
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
    padding: layout.screenPadding,
  },
  heroArt: {
    height: 86,
    marginBottom: -8,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  sun: {
    backgroundColor: colors.warm,
    borderRadius: radius.pill,
    height: 52,
    position: 'absolute',
    right: 42,
    top: 10,
    width: 52,
  },
  waveOne: {
    backgroundColor: colors.blueSoft,
    borderRadius: radius.pill,
    height: 58,
    position: 'absolute',
    right: 4,
    top: 42,
    transform: [{ rotate: '-8deg' }],
    width: 220,
  },
  waveTwo: {
    backgroundColor: colors.tealSoft,
    borderRadius: radius.pill,
    height: 44,
    position: 'absolute',
    right: -22,
    top: 60,
    transform: [{ rotate: '-5deg' }],
    width: 172,
  },
  eyebrow: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.6,
    marginTop: spacing.md,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.textStrong,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.4,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 22,
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  infoTitle: { color: colors.text, fontSize: 17, fontWeight: '900', marginBottom: spacing.sm },
  stepRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  stepBadge: {
    alignItems: 'center',
    backgroundColor: colors.teal,
    borderRadius: radius.pill,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  stepNumber: { color: '#fff', fontSize: 13, fontWeight: '900' },
  stepText: { color: colors.textMuted, flex: 1, fontSize: 15, lineHeight: 20 },
  fieldWrap: { marginTop: spacing.sm, width: '100%' },
  label: { color: colors.text, fontWeight: '800', marginBottom: spacing.xs },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.text,
    minHeight: 50,
    padding: spacing.md,
    width: '100%',
  },
  btn: {
    alignItems: 'center',
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    marginTop: spacing.md,
    minHeight: layout.minTouchTarget,
    paddingVertical: 15,
    width: '100%',
    ...shadows.soft,
  },
  btnDisabled: { opacity: 0.8 },
  btnInner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  btnText: { color: '#fff', fontWeight: '900' },
  secondaryBtn: { alignItems: 'center', borderRadius: radius.md, marginTop: spacing.sm, paddingVertical: 13, width: '100%' },
  secondaryBtnDisabled: { opacity: 0.6 },
  secondaryBtnText: { color: colors.textStrong, fontWeight: '800' },
  privacyFooter: {
    alignItems: 'center',
    backgroundColor: colors.backgroundSoft,
    borderColor: '#BFDBFE',
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.md,
    width: '100%',
  },
  lockIcon: { fontSize: 20 },
  disclaimer: { color: colors.textMuted, flex: 1, fontSize: 12, lineHeight: 18 },
});
