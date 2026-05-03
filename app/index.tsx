import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BaselineInsightsCard } from '../src/components/BaselineInsightsCard';
import { OnboardingStepCard } from '../src/components/OnboardingStepCard';
import { RiskCard } from '../src/components/RiskCard';
import { TrendChart } from '../src/components/TrendChart';
import { compareToBaseline } from '../src/domain/baseline/compareToBaseline';
import type { LogEntry, PersonProfile } from '../src/domain/logs/log.types';
import { calculateRisk } from '../src/domain/risk/calculateRisk';
import { loadLogs } from '../src/storage/localLogRepository';
import { loadPersonProfile } from '../src/storage/localProfileRepository';

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
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>Local-first care tracking</Text>
      <Text style={styles.title}>Delirium Buddy</Text>

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
        <Pressable style={styles.primaryAction}>
          <Text style={styles.primaryActionIcon}>＋</Text>
          <View style={styles.primaryActionCopy}>
            <Text style={styles.primaryActionTitle}>Add check-in</Text>
            <Text style={styles.primaryActionText}>Record today’s changes, sleep, red flags and notes.</Text>
          </View>
        </Pressable>
      </Link>

      <View style={styles.profileCard}>
        <Text style={styles.profileTitle}>{profile ? profile.displayName : 'No person profile yet'}</Text>
        <Text style={styles.profileText}>
          {profile
            ? `Baseline added for ${profile.relationship}. Latest check-ins can now be compared with what is usual.`
            : 'Add a baseline so the app can compare future check-ins against what is normal for this person.'}
        </Text>
      </View>
      <RiskCard risk={riskState} />
      <BaselineInsightsCard insights={baselineInsights} hasProfile={Boolean(profile)} hasLogs={logs.length > 0} />
      <TrendChart logs={logs} />

      <Text style={styles.sectionLabel}>Quick actions</Text>
      <View style={styles.actionGrid}>
        <DashboardAction href="/profile" title="Profile" description="Baseline" />
        <DashboardAction href="/history" title="History" description="Past logs" />
        <DashboardAction href="/summary" title="7-day Summary" description="Shareable" />
        <DashboardAction href="/settings" title="Settings" description="Privacy & data" />
        <DashboardAction href="/about" title="About" description="Safety info" />
      </View>
    </ScrollView>
  );
}

type DashboardActionProps = {
  href: '/profile' | '/history' | '/summary' | '/settings' | '/about';
  title: string;
  description: string;
};

function DashboardAction({ href, title, description }: DashboardActionProps) {
  return (
    <Link href={href} asChild>
      <Pressable style={styles.actionCard}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionDescription}>{description}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8fafc',
    flex: 1,
  },
  content: {
    padding: 16,
  },
  eyebrow: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
  },
  primaryAction: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    padding: 16,
  },
  primaryActionIcon: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 36,
  },
  primaryActionCopy: {
    flex: 1,
  },
  primaryActionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  primaryActionText: {
    color: '#cbd5e1',
    lineHeight: 20,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileText: {
    color: '#475569',
    lineHeight: 20,
  },
  sectionLabel: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
    marginTop: 4,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    width: '48%',
  },
  actionTitle: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  actionDescription: {
    color: '#64748b',
    fontSize: 12,
  },
  center: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
