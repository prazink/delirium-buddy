import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AppHeader,
  CheckInCTA,
  DashboardBottomNav,
  DashboardReminderCard,
  DashboardTrendChart,
  InsightsGrid,
  PatientCard,
  PrivacyFooter,
  QuickActions,
  RiskSummary,
} from '../src/components/dashboard';
import { OnboardingStepCard } from '../src/components/OnboardingStepCard';
import type { InsightTile } from '../src/components/dashboard/InsightsGrid';
import { compareToBaseline } from '../src/domain/baseline/compareToBaseline';
import { calculateRisk } from '../src/domain/risk/calculateRisk';
import { loadUser } from '../src/storage/localUserRepository';
import { useCheckInStore } from '../src/stores/checkInStore';
import { usePatientStore } from '../src/stores/patientStore';
import { useTheme } from '../src/theme/useTheme';
import { MOCK_INSIGHTS } from '../mocks';

/** Extracts "9:20 am" style string from an ISO datetime if it falls on todayStr. */
function formatTime(iso: string | undefined, todayStr: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  if (d.toISOString().slice(0, 10) !== todayStr) return null;
  const h = d.getHours() % 12 || 12;
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m} ${d.getHours() >= 12 ? 'pm' : 'am'}`;
}

export default function Dashboard() {
  const { colors } = useTheme();
  const [userName, setUserName] = useState<string | undefined>();

  // ─── State ────────────────────────────────────────────────────────────────
  const profile = usePatientStore((s) => s.profile);
  const profileReady = usePatientStore((s) => s.isLoaded);
  const loadProfile = usePatientStore((s) => s.loadProfile);

  const logs = useCheckInStore((s) => s.logs);
  const logsReady = useCheckInStore((s) => s.isLoaded);
  const loadLogs = useCheckInStore((s) => s.loadLogs);

  // Reload on every screen focus so edits from other screens are reflected.
  useFocusEffect(
    useCallback(() => {
      void loadUser().then((user) => setUserName(user?.name));
      void loadProfile();
      void loadLogs();
    }, [loadProfile, loadLogs]),
  );

  // ─── Derived ──────────────────────────────────────────────────────────────
  const latestLog = logs[logs.length - 1];
  const riskState = useMemo(() => calculateRisk(logs), [logs]);
  const baselineData = useMemo(
    () => compareToBaseline(latestLog, profile),
    [latestLog, profile],
  );

  const lastCheckInLabel = useMemo(() => {
    if (!latestLog) return undefined;

    const todayStr = new Date().toISOString().slice(0, 10);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    if (latestLog.date === todayStr) {
      // Use profile.updatedAt time if it was also updated today
      const time = formatTime(profile?.updatedAt, todayStr);
      return time ? `Today, ${time}` : 'Today';
    }
    if (latestLog.date === yesterdayStr) return 'Yesterday';

    // Append T12:00:00 so Date() parses as local noon, avoiding timezone off-by-one
    return new Date(`${latestLog.date}T12:00:00`).toLocaleDateString('en-AU', {
      month: 'short',
      day: 'numeric',
    });
  }, [latestLog, profile]);

  /** Map baseline insights → insight tiles, falling back to mock defaults. */
  const insightTiles: InsightTile[] = useMemo(() => {
    if (baselineData.length === 0) return MOCK_INSIGHTS;
    return baselineData.slice(0, 3).map<InsightTile>((insight, i) => ({
      id: insight.id,
      icon: i === 0 ? 'moon' : i === 1 ? 'sun' : 'water',
      title: insight.label,
      sub: insight.detail.split('.')[0] ?? insight.detail,
      variant: ((['purple', 'yellow', 'blue'] as const)[i]) ?? 'blue',
    }));
  }, [baselineData]);

  const isReady = profileReady && logsReady;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.pageBg }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <AppHeader userName={userName} />

        {/* Onboarding nudges */}
        {isReady && !profile && (
          <OnboardingStepCard
            stepLabel="Step 1"
            title="Add the person you are supporting"
            description="Create a simple baseline first. This helps compare future check-ins with what is usual for that person."
            actionLabel="Create person profile"
            href="/profile"
          />
        )}
        {isReady && profile && logs.length === 0 && (
          <OnboardingStepCard
            stepLabel="Step 2"
            title="Add the first check-in"
            description="Record today's sleep, confusion, agitation, red flags and notes to unlock dashboard insights."
            actionLabel="Add first check-in"
            href="/log"
          />
        )}

        {/* Patient card */}
        {profile && (
          <PatientCard
            profile={profile}
            {...(lastCheckInLabel !== undefined ? { lastCheckInLabel } : {})}
            onPress={() => router.push('/profile')}
          />
        )}

        {/* Primary CTA */}
        <CheckInCTA onPress={() => router.push('/log')} />

        {/* Risk summary */}
        <RiskSummary
          risk={riskState}
          onViewDetails={() => router.push('/history')}
        />

        {/* Baseline insights */}
        <InsightsGrid insights={insightTiles} />

        {/* 7-day trend */}
        <DashboardTrendChart logs={logs} />

        <View style={styles.dashboardGrid}>
          <DashboardReminderCard />
          <QuickActions />
        </View>

        <DashboardBottomNav />

        {/* Privacy footer */}
        <PrivacyFooter style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 88,
  },
  dashboardGrid: {
    flexDirection: 'row',
    gap: 14,
  },
  footer: {
    marginBottom: 8,
  },
});
