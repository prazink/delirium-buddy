import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BaselineInsightsCard } from '../src/components/BaselineInsightsCard';
import { BrandMark } from '../src/components/BrandMark';
import { BrandedCard } from '../src/components/BrandedCard';
import { OnboardingStepCard } from '../src/components/OnboardingStepCard';
import { RiskCard } from '../src/components/RiskCard';
import { TrendChart } from '../src/components/TrendChart';
import { compareToBaseline } from '../src/domain/baseline/compareToBaseline';
import type { LogEntry, PersonProfile } from '../src/domain/logs/log.types';
import { calculateRisk } from '../src/domain/risk/calculateRisk';
import { loadLogs } from '../src/storage/localLogRepository';
import { loadPersonProfile } from '../src/storage/localProfileRepository';
import { colors, layout, radius, shadows, spacing } from '../src/theme/tokens';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [profile, setProfile] = useState<PersonProfile | null>(null);

  const refreshDashboard = useCallback(async () => {
    const [data, personProfile] = await Promise.all([loadLogs(), loadPersonProfile()]);
    setLogs(data);
    setProfile(personProfile);
  }, []);

  useEffect(() => {
    async function hydrateDashboard() {
      await refreshDashboard();
      setLoading(false);
    }

    hydrateDashboard();
  }, [refreshDashboard]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function refreshFocusedDashboard() {
        setLoading(true);
        const [data, personProfile] = await Promise.all([loadLogs(), loadPersonProfile()]);

        if (isActive) {
          setLogs(data);
          setProfile(personProfile);
          setLoading(false);
        }
      }

      refreshFocusedDashboard();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const latestLog = logs[logs.length - 1];
  const riskState = useMemo(() => calculateRisk(logs), [logs]);
  const baselineInsights = useMemo(() => compareToBaseline(latestLog, profile), [latestLog, profile]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.teal} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.heroHeader}>
          <BrandMark size={54} />
          <View style={styles.heroCopy}>
            <Text style={styles.title}>Delirium Buddy</Text>
            <Text style={styles.subtitle}>You’re making a real difference. Small moments, better days.</Text>
          </View>
        </View>
        <View style={styles.heroLandscape}>
          <View style={styles.sun} />
          <View style={styles.waveOne} />
          <View style={styles.waveTwo} />
        </View>
      </View>

      {!profile ? (
        <OnboardingStepCard
          stepLabel="Step 1"
          title="Add the person you are supporting"
          description="Create a simple baseline first. This helps compare future check-ins with what is usual for that person."
          actionLabel="Create person profile"
          href="/profile"
        />
      ) : null}

      {profile && logs.length === 0 ? (
        <OnboardingStepCard
          stepLabel="Step 2"
          title="Add the first check-in"
          description="Record today’s sleep, confusion, agitation, red flags and notes to unlock dashboard insights."
          actionLabel="Add first check-in"
          href="/log"
        />
      ) : null}

      <Link href="/log" asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add a new daily check-in"
          style={({ pressed }) => [styles.primaryAction, pressed && styles.pressed]}
        >
          <View style={styles.primaryIconWrap}>
            <Text style={styles.primaryActionIcon}>＋</Text>
          </View>
          <View style={styles.primaryActionCopy}>
            <Text style={styles.primaryActionTitle}>Add check-in</Text>
            <Text style={styles.primaryActionText}>Capture how things are going right now.</Text>
          </View>
          <Text style={styles.primaryChevron}>›</Text>
        </Pressable>
      </Link>

      <BrandedCard>
        <View style={styles.profileRow}>
          <View style={styles.avatarBadge}>
            <Text style={styles.avatarText}>{profile?.displayName?.slice(0, 1).toUpperCase() ?? '?'}</Text>
          </View>
          <View style={styles.profileCopy}>
            <Text style={styles.profileTitle}>{profile ? profile.displayName : 'No person profile yet'}</Text>
            <Text style={styles.profileText}>
              {profile
                ? `Baseline added for ${profile.relationship}. Latest check-ins can now be compared with what is usual.`
                : 'Add a baseline so the app can compare future check-ins against what is normal for this person.'}
            </Text>
          </View>
        </View>
      </BrandedCard>

      <RiskCard risk={riskState} />
      <BaselineInsightsCard insights={baselineInsights} hasProfile={Boolean(profile)} hasLogs={logs.length > 0} />
      <TrendChart logs={logs} />

      <Text style={styles.sectionLabel}>Quick actions</Text>
      <View style={styles.actionGrid}>
        <DashboardAction href="/profile" icon="👤" title="Profile" description="Baseline" />
        <DashboardAction href="/history" icon="↺" title="History" description="Past logs" />
        <DashboardAction href="/summary" icon="▥" title="7-day Summary" description="Shareable" />
        <DashboardAction href="/settings" icon="⚙" title="Settings" description="Privacy & data" />
        <DashboardAction href="/about" icon="ⓘ" title="About" description="Safety info" />
      </View>

      <View style={styles.privacyFooter}>
        <Text style={styles.lockIcon}>🔒</Text>
        <View>
          <Text style={styles.privacyText}>All data stays on this device.</Text>
          <Text style={styles.privacySubtext}>Private. Secure. Yours.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

type DashboardActionProps = {
  href: '/profile' | '/history' | '/summary' | '/settings' | '/about';
  icon: string;
  title: string;
  description: string;
};

function DashboardAction({ href, icon, title, description }: DashboardActionProps) {
  return (
    <Link href={href} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${title}`}
        style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]}
      >
        <Text style={styles.actionIcon}>{icon}</Text>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionDescription}>{description}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    padding: layout.screenPadding,
  },
  hero: {
    marginBottom: spacing.md,
    overflow: 'hidden',
    position: 'relative',
  },
  heroHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 88,
  },
  heroCopy: {
    flex: 1,
  },
  title: {
    color: colors.textStrong,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.textMuted,
    lineHeight: 20,
    marginTop: 2,
  },
  heroLandscape: {
    height: 42,
    marginTop: -8,
    opacity: 0.95,
  },
  sun: {
    backgroundColor: colors.warm,
    borderRadius: radius.pill,
    height: 42,
    position: 'absolute',
    right: 28,
    top: 0,
    width: 42,
  },
  waveOne: {
    backgroundColor: colors.blueSoft,
    borderRadius: radius.pill,
    height: 42,
    position: 'absolute',
    right: 0,
    top: 14,
    transform: [{ rotate: '-8deg' }],
    width: 190,
  },
  waveTwo: {
    backgroundColor: colors.tealSoft,
    borderRadius: radius.pill,
    height: 36,
    position: 'absolute',
    right: -18,
    top: 24,
    transform: [{ rotate: '-5deg' }],
    width: 150,
  },
  primaryAction: {
    alignItems: 'center',
    backgroundColor: colors.navy,
    borderRadius: radius.xl,
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
    minHeight: 104,
    padding: spacing.md,
    ...shadows.card,
  },
  primaryIconWrap: {
    alignItems: 'center',
    backgroundColor: colors.teal,
    borderRadius: radius.pill,
    height: 62,
    justifyContent: 'center',
    width: 62,
  },
  primaryActionIcon: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '500',
    lineHeight: 38,
  },
  primaryActionCopy: {
    flex: 1,
  },
  primaryActionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  primaryActionText: {
    color: '#DDEAFE',
    fontSize: 15,
    lineHeight: 21,
  },
  primaryChevron: {
    color: '#fff',
    fontSize: 38,
    fontWeight: '200',
  },
  profileRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  avatarBadge: {
    alignItems: 'center',
    backgroundColor: colors.blueSoft,
    borderColor: '#BFDBFE',
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  avatarText: {
    color: colors.textStrong,
    fontSize: 24,
    fontWeight: '900',
  },
  profileCopy: {
    flex: 1,
  },
  profileTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 4,
  },
  profileText: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 21,
  },
  sectionLabel: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  actionCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    minHeight: 92,
    padding: spacing.sm,
    width: '31.8%',
    ...shadows.soft,
  },
  actionIcon: {
    color: colors.blue,
    fontSize: 24,
    marginBottom: 6,
  },
  actionTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
  },
  actionDescription: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  privacyFooter: {
    alignItems: 'center',
    backgroundColor: colors.backgroundSoft,
    borderColor: '#BFDBFE',
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  lockIcon: {
    fontSize: 22,
  },
  privacyText: {
    color: colors.textStrong,
    fontWeight: '800',
  },
  privacySubtext: {
    color: colors.textMuted,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  center: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
  },
});
