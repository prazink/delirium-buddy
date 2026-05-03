import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { BaselineInsight } from '../src/domain/baseline/compareToBaseline';
import { compareToBaseline } from '../src/domain/baseline/compareToBaseline';
import type { LogEntry, PersonProfile } from '../src/domain/logs/log.types';
import type { RiskState } from '../src/domain/risk/calculateRisk';
import { calculateRisk } from '../src/domain/risk/calculateRisk';
import { loadLogs } from '../src/storage/localLogRepository';
import { loadPersonProfile } from '../src/storage/localProfileRepository';

const palette = {
  bg: '#F8FAFC',
  card: '#FFFFFF',
  navy: '#102A5F',
  muted: '#66748A',
  blue: '#4F7DF3',
  blueDark: '#3266E8',
  blueSoft: '#EAF2FF',
  teal: '#0EA5A4',
  tealSoft: '#CCFBF1',
  green: '#159A63',
  greenSoft: '#E9FBEF',
  limeSoft: '#ECFCCB',
  purple: '#7C3AED',
  purpleSoft: '#F3E8FF',
  skySoft: '#E0F2FE',
  danger: '#DC2626',
  dangerSoft: '#FEE2E2',
  warning: '#D97706',
  border: '#E6EDF5',
  white: '#FFFFFF',
};

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
  const risk = useMemo(() => calculateRisk(logs), [logs]);
  const insights = useMemo(() => compareToBaseline(latestLog, profile), [latestLog, profile]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingWrap}>
        <ActivityIndicator color={palette.blue} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HeaderHero />
        <AddCheckInCard />
        <PersonCard profile={profile} latestLog={latestLog} />
        <RiskCard risk={risk} />
        <InsightCards insights={insights} hasProfile={Boolean(profile)} hasLogs={logs.length > 0} />
        <TrendCard logs={logs} />
        <QuickActions />
        <PrivacyFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

function HeaderHero() {
  return (
    <View style={styles.heroWrap}>
      <View style={styles.heroMain}>
        <View style={styles.brandMark}>
          <View style={styles.leafLeft} />
          <View style={styles.leafRight} />
          <View style={styles.leafBottom} />
        </View>
        <View style={styles.heroText}>
          <Text style={styles.heroTitle}>Delirium Buddy</Text>
          <Text style={styles.heroSubtitle}>You’re making a real difference.</Text>
          <Text style={styles.heroSubtitle}>Small moments, better days.</Text>
        </View>
      </View>
      <View style={styles.heroScene} pointerEvents="none">
        <View style={styles.sun} />
        <View style={styles.hillBack} />
        <View style={styles.hillFront} />
        <View style={styles.pathLine} />
        <View style={styles.leafSprigOne} />
        <View style={styles.leafSprigTwo} />
      </View>
    </View>
  );
}

function AddCheckInCard() {
  return (
    <Link href="/log" asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add a new daily check-in"
        style={({ pressed }) => [styles.addCard, pressed && styles.pressed]}
      >
        <View style={styles.addAccent} />
        <View style={styles.plusCircle}>
          <Text style={styles.plusText}>+</Text>
        </View>
        <View style={styles.addTextWrap}>
          <Text style={styles.addTitle}>Add check-in</Text>
          <Text style={styles.addSubtitle}>Capture how things are going right now.</Text>
        </View>
        <Text style={styles.chevronLight}>›</Text>
      </Pressable>
    </Link>
  );
}

function PersonCard({ profile, latestLog }: { profile: PersonProfile | null; latestLog?: LogEntry }) {
  const initial = profile?.displayName?.slice(0, 1).toUpperCase() ?? '?';
  const name = profile?.displayName ?? 'Add person profile';
  const meta = profile
    ? [profile.ageRange, latestLog?.date ? `Latest ${shortDate(latestLog.date)}` : 'Baseline recorded']
        .filter(Boolean)
        .join(' · ')
    : 'Create a baseline before tracking';
  const badge = profile ? `Supporting · ${profile.relationship}` : 'Baseline needed';

  return (
    <Link href="/profile" asChild>
      <Pressable accessibilityRole="button" accessibilityLabel="Open person profile" style={({ pressed }) => [styles.personCard, pressed && styles.pressed]}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={styles.personTextWrap}>
          <Text style={styles.personName}>{name}</Text>
          <Text style={styles.personMeta}>{meta}</Text>
          <View style={styles.badgePill}>
            <Text style={styles.badgeIcon}>●●</Text>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        </View>
        <Text style={styles.chevronMuted}>›</Text>
      </Pressable>
    </Link>
  );
}

function RiskCard({ risk }: { risk: RiskState }) {
  const status = risk.level === 'No data' ? 'No data yet' : `${risk.level} today`;
  const riskColor = getRiskColour(risk.level);

  return (
    <View style={styles.sectionWrap}>
      <Text style={styles.sectionTitle}>Risk / Support Summary</Text>
      <Link href="/summary" asChild>
        <Pressable accessibilityRole="button" accessibilityLabel="View risk support details" style={({ pressed }) => [styles.riskCard, pressed && styles.pressed]}>
          <View style={[styles.shield, { backgroundColor: riskColor }]}>
            <Text style={styles.shieldTick}>✓</Text>
          </View>
          <View style={styles.riskTextWrap}>
            <Text style={[styles.riskStatus, { color: riskColor }]}>{status}</Text>
            <Text style={styles.riskTip} numberOfLines={2}>{risk.tip}</Text>
          </View>
          <View style={styles.detailsPill}>
            <Text style={styles.detailsIcon}>👥</Text>
            <Text style={styles.detailsText}>View details</Text>
            <Text style={styles.detailsChevron}>›</Text>
          </View>
        </Pressable>
      </Link>
    </View>
  );
}

function InsightCards({ insights, hasProfile, hasLogs }: { insights: BaselineInsight[]; hasProfile: boolean; hasLogs: boolean }) {
  const cards = buildCards(insights, hasProfile, hasLogs);

  return (
    <View style={styles.sectionWrap}>
      <Text style={styles.sectionTitle}>Baseline Insights</Text>
      <View style={styles.insightGrid}>
        {cards.map((card) => (
          <View key={card.title} style={[styles.insightCard, card.cardStyle]}>
            <Text style={[styles.insightIcon, { color: card.color }]}>{card.icon}</Text>
            <Text style={[styles.insightTitle, { color: card.color }]} numberOfLines={2}>{card.title}</Text>
            <Text style={styles.insightDetail} numberOfLines={2}>{card.subtitle}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function TrendCard({ logs }: { logs: LogEntry[] }) {
  const latest = logs[logs.length - 1];
  const first = logs.slice(-7)[0];
  const blended = latest ? (latest.agitation + latest.confusion) / 2 : 3;
  const lineY = Math.max(34, Math.min(100, 112 - blended * 8));
  const status = trendStatus(logs);

  return (
    <View style={styles.trendCard}>
      <View style={styles.trendHeader}>
        <Text style={styles.trendTitle}>7-Day Trend</Text>
        <Text style={styles.trendDate}>{first && latest ? `${shortDate(first.date)} – ${shortDate(latest.date)}` : 'Build a week'}</Text>
      </View>
      <View style={styles.trendContent}>
        <View style={styles.chartBox}>
          <Text style={[styles.chartLabel, styles.chartTop]}>10</Text>
          <Text style={[styles.chartLabel, styles.chartMid]}>5</Text>
          <Text style={[styles.chartLabel, styles.chartBottom]}>0</Text>
          <View style={styles.chartAxisY} />
          <View style={[styles.chartGrid, { top: 22 }]} />
          <View style={[styles.chartGrid, { top: 70 }]} />
          <View style={styles.chartAxisX} />
          <View style={[styles.chartFill, { top: lineY + 4 }]} />
          <View style={[styles.chartLine, { top: lineY }]} />
          <View style={[styles.chartDot, { top: lineY - 4, left: '28%' }]} />
          <View style={[styles.chartDot, { top: lineY - 4, right: '10%' }]} />
          <Text style={styles.chartLeftDate}>{first ? shortDate(first.date) : 'Start'}</Text>
          <Text style={styles.chartRightDate}>{latest ? shortDate(latest.date) : 'Next'}</Text>
        </View>
        <View style={styles.trendSlab}>
          <Text style={styles.trendSlabTitle}>{status.title}</Text>
          <Text style={styles.trendSlabText}>{status.subtitle}</Text>
        </View>
      </View>
    </View>
  );
}

function QuickActions() {
  const actions = [
    { href: '/profile' as const, icon: '♙', title: 'Profile', label: 'Open profile', color: palette.purple },
    { href: '/history' as const, icon: '↺', title: 'History', label: 'Open history', color: palette.blue },
    { href: '/summary' as const, icon: '▮▮▮', title: '7-day\nSummary', label: 'Open 7-day summary', color: palette.green },
    { href: '/settings' as const, icon: '⚙', title: 'Settings', label: 'Open settings', color: palette.warning },
    { href: '/about' as const, icon: 'ⓘ', title: 'About', label: 'Open about', color: palette.navy },
  ];

  return (
    <View style={styles.sectionWrap}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickGrid}>
        {actions.map((action) => (
          <Link href={action.href} asChild key={action.href}>
            <Pressable accessibilityRole="button" accessibilityLabel={action.label} style={({ pressed }) => [styles.quickTile, pressed && styles.pressed]}>
              <Text style={[styles.quickIcon, { color: action.color }]}>{action.icon}</Text>
              <Text style={styles.quickText}>{action.title}</Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </View>
  );
}

function PrivacyFooter() {
  return (
    <View style={styles.privacyFooter}>
      <Text style={styles.lockIcon}>▣</Text>
      <View style={styles.privacyTextWrap}>
        <Text style={styles.privacyMain}>All data stays on this device.</Text>
        <Text style={styles.privacySub}>Private. Secure. Yours.</Text>
      </View>
      <View style={styles.shieldCircle}>
        <Text style={styles.shieldLock}>▢</Text>
      </View>
    </View>
  );
}

function buildCards(insights: BaselineInsight[], hasProfile: boolean, hasLogs: boolean) {
  const mapped = insights.slice(0, 3).map((insight, index) => ({
    icon: insight.severity === 'red-flag' ? '◎' : insight.severity === 'watch' ? '☼' : '▱',
    title: compactTitle(insight.label),
    subtitle: compactText(insight.detail),
    color: insight.severity === 'red-flag' ? palette.danger : insight.severity === 'watch' ? palette.green : palette.blue,
    cardStyle: index === 0 ? styles.insightPink : index === 1 ? styles.insightGreen : styles.insightBlue,
  }));

  const fallback = [
    { icon: '☼', title: hasProfile ? 'Routine anchors' : 'Add baseline', subtitle: hasProfile ? 'Consistency helps' : 'Start profile', color: palette.green, cardStyle: styles.insightGreen },
    { icon: '▱', title: hasLogs ? 'Conversation ready' : 'First check-in', subtitle: hasLogs ? '7-day overview' : 'Build pattern', color: palette.blue, cardStyle: styles.insightBlue },
    { icon: '◌', title: 'Keep tracking', subtitle: 'Small notes help', color: palette.purple, cardStyle: styles.insightPurple },
  ];

  return [...mapped, ...fallback].slice(0, 3);
}

function compactTitle(label: string): string {
  return label
    .replace('Sleep below usual range', 'Best sleep')
    .replace('Confusion higher than baseline', 'Confusion above')
    .replace('Sudden change noted', 'Sudden change noted')
    .replace('Fever or infection noted', 'Care context')
    .replace('Fall or near fall noted', 'Fall noted')
    .replace('Hallucination noted', 'Conversation ready');
}

function compactText(value: string): string {
  return value.length > 28 ? `${value.slice(0, 25)}...` : value;
}

function getRiskColour(level: RiskState['level']): string {
  if (level === 'High') return palette.danger;
  if (level === 'Moderate') return palette.warning;
  if (level === 'Low') return palette.green;
  return palette.muted;
}

function trendStatus(logs: LogEntry[]): { title: string; subtitle: string } {
  if (logs.length === 0) return { title: 'Ready', subtitle: 'Add entries' };
  if (logs.length === 1) return { title: 'Building streak', subtitle: '1 entry this week' };
  const latest = logs[logs.length - 1];
  const blended = latest ? (latest.agitation + latest.confusion) / 2 : 0;
  if (blended >= 7) return { title: 'Needs attention', subtitle: `${logs.length} entries` };
  if (blended >= 4) return { title: 'Keep watching', subtitle: `${logs.length} entries` };
  return { title: 'Mostly good', subtitle: `${logs.length} entries` };
}

function shortDate(date: string): string {
  const [, monthRaw, dayRaw] = date.split('-');
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return month && day ? `${day} ${names[month - 1]}` : date;
}

const cardShadow = {
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.08,
  shadowRadius: 16,
  elevation: 3,
};

const softShadow = {
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.06,
  shadowRadius: 10,
  elevation: 2,
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.bg },
  container: { flex: 1, backgroundColor: palette.bg },
  content: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 28 },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.bg },
  heroWrap: { minHeight: 108, marginBottom: 12, position: 'relative', overflow: 'hidden' },
  heroMain: { flexDirection: 'row', alignItems: 'center', gap: 12, width: '68%', zIndex: 2 },
  heroText: { flex: 1 },
  heroTitle: { color: palette.navy, fontSize: 27, fontWeight: '900', lineHeight: 31, letterSpacing: -0.4 },
  heroSubtitle: { color: palette.muted, fontSize: 13, lineHeight: 18, fontWeight: '600' },
  brandMark: { width: 48, height: 48, position: 'relative' },
  leafLeft: { position: 'absolute', left: 8, top: 2, width: 21, height: 39, borderTopRightRadius: 20, borderBottomLeftRadius: 20, backgroundColor: '#93B5FF', transform: [{ rotate: '-35deg' }] },
  leafRight: { position: 'absolute', right: 8, top: 2, width: 21, height: 39, borderTopLeftRadius: 20, borderBottomRightRadius: 20, backgroundColor: '#B3C9FF', transform: [{ rotate: '35deg' }] },
  leafBottom: { position: 'absolute', left: 14, bottom: 1, width: 22, height: 31, borderRadius: 10, backgroundColor: palette.blue, transform: [{ rotate: '45deg' }] },
  heroScene: { position: 'absolute', right: -4, top: 2, width: 210, height: 100 },
  sun: { position: 'absolute', right: 54, top: 0, width: 54, height: 54, borderRadius: 27, backgroundColor: '#FDE68A', opacity: 0.62 },
  hillBack: { position: 'absolute', right: 0, top: 36, width: 176, height: 58, borderRadius: 90, backgroundColor: '#C6D9F8', transform: [{ rotate: '-8deg' }] },
  hillFront: { position: 'absolute', right: 54, top: 50, width: 142, height: 42, borderRadius: 80, backgroundColor: '#E3EEFD', transform: [{ rotate: '-7deg' }] },
  pathLine: { position: 'absolute', right: 76, top: 67, width: 66, height: 7, borderRadius: 999, backgroundColor: palette.white, opacity: 0.92, transform: [{ rotate: '-22deg' }] },
  leafSprigOne: { position: 'absolute', right: 22, top: 58, width: 9, height: 26, borderTopRightRadius: 18, borderBottomLeftRadius: 18, backgroundColor: '#9DB9E7', transform: [{ rotate: '22deg' }] },
  leafSprigTwo: { position: 'absolute', right: 38, top: 63, width: 9, height: 22, borderTopLeftRadius: 18, borderBottomRightRadius: 18, backgroundColor: '#B9CDEF', transform: [{ rotate: '-22deg' }] },
  addCard: { minHeight: 98, borderRadius: 20, backgroundColor: palette.blue, flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 20, paddingVertical: 16, marginBottom: 14, overflow: 'hidden', ...cardShadow },
  addAccent: { position: 'absolute', right: -28, top: -44, width: 190, height: 150, borderRadius: 80, backgroundColor: palette.blueDark, opacity: 0.36, transform: [{ rotate: '-18deg' }] },
  plusCircle: { width: 58, height: 58, borderRadius: 29, backgroundColor: palette.white, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  plusText: { color: palette.blue, fontSize: 34, fontWeight: '600', lineHeight: 36 },
  addTextWrap: { flex: 1, zIndex: 2 },
  addTitle: { color: palette.white, fontSize: 21, fontWeight: '900', marginBottom: 4 },
  addSubtitle: { color: '#EFF6FF', fontSize: 14, fontWeight: '600', lineHeight: 19 },
  chevronLight: { color: palette.white, fontSize: 38, fontWeight: '200', zIndex: 2 },
  personCard: { minHeight: 98, backgroundColor: palette.card, borderRadius: 20, borderWidth: 1, borderColor: palette.border, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, marginBottom: 14, ...cardShadow },
  avatarCircle: { width: 66, height: 66, borderRadius: 33, backgroundColor: palette.blueSoft, borderColor: '#CFE1FA', borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: palette.navy, fontSize: 26, fontWeight: '900' },
  personTextWrap: { flex: 1 },
  personName: { color: palette.navy, fontSize: 23, fontWeight: '900', letterSpacing: -0.2 },
  personMeta: { color: palette.muted, fontSize: 13, marginTop: 2, fontWeight: '600' },
  badgePill: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginTop: 7, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: palette.tealSoft, borderColor: '#7DD3FC', borderWidth: 1 },
  badgeIcon: { color: palette.blue, fontSize: 10, fontWeight: '900' },
  badgeText: { color: palette.navy, fontSize: 12, fontWeight: '900' },
  chevronMuted: { color: '#9AA6B8', fontSize: 34, fontWeight: '200' },
  sectionWrap: { marginBottom: 14 },
  sectionTitle: { color: palette.navy, fontSize: 17, fontWeight: '900', marginBottom: 8 },
  riskCard: { backgroundColor: palette.card, borderRadius: 20, borderWidth: 1, borderColor: palette.border, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, ...cardShadow },
  shield: { width: 50, height: 54, borderTopLeftRadius: 14, borderTopRightRadius: 14, borderBottomLeftRadius: 22, borderBottomRightRadius: 22, alignItems: 'center', justifyContent: 'center' },
  shieldTick: { color: palette.white, fontSize: 30, fontWeight: '900' },
  riskTextWrap: { flex: 1 },
  riskStatus: { fontSize: 19, fontWeight: '900' },
  riskTip: { color: palette.muted, fontSize: 12, lineHeight: 17, marginTop: 2, fontWeight: '600' },
  detailsPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F7F9FC', borderColor: palette.border, borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 9 },
  detailsIcon: { color: palette.blue, fontSize: 14 },
  detailsText: { color: palette.navy, fontSize: 12, fontWeight: '900' },
  detailsChevron: { color: '#94A3B8', fontSize: 18 },
  insightGrid: { flexDirection: 'row', gap: 8 },
  insightCard: { flex: 1, minHeight: 100, borderRadius: 17, borderWidth: 1, padding: 11 },
  insightPink: { backgroundColor: '#FCE3E8', borderColor: '#F9C8D2' },
  insightGreen: { backgroundColor: palette.limeSoft, borderColor: '#D9F99D' },
  insightBlue: { backgroundColor: palette.skySoft, borderColor: '#BAE6FD' },
  insightPurple: { backgroundColor: palette.purpleSoft, borderColor: '#DDD6FE' },
  insightIcon: { fontSize: 18, fontWeight: '900', marginBottom: 6 },
  insightTitle: { fontSize: 12, fontWeight: '900', lineHeight: 15 },
  insightDetail: { color: palette.muted, fontSize: 10.5, lineHeight: 14, marginTop: 4, fontWeight: '700' },
  trendCard: { backgroundColor: palette.card, borderRadius: 20, borderWidth: 1, borderColor: palette.border, padding: 14, marginBottom: 14, ...cardShadow },
  trendHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  trendTitle: { color: palette.navy, fontSize: 18, fontWeight: '900' },
  trendDate: { color: palette.muted, fontSize: 12, fontWeight: '800' },
  trendContent: { flexDirection: 'row', gap: 12 },
  chartBox: { flex: 1, height: 140, position: 'relative', paddingLeft: 25 },
  chartLabel: { position: 'absolute', left: 0, color: palette.muted, fontSize: 10, fontWeight: '700' },
  chartTop: { top: 14 },
  chartMid: { top: 62 },
  chartBottom: { top: 112 },
  chartAxisY: { position: 'absolute', left: 25, top: 18, bottom: 20, width: 2, backgroundColor: '#D7E8E3' },
  chartAxisX: { position: 'absolute', left: 25, right: 0, bottom: 20, height: 2, backgroundColor: '#D7E8E3' },
  chartGrid: { position: 'absolute', left: 25, right: 0, height: 1, backgroundColor: '#E6F2EE' },
  chartFill: { position: 'absolute', left: 40, right: 12, bottom: 21, backgroundColor: '#BBF7D0', opacity: 0.58 },
  chartLine: { position: 'absolute', left: 40, right: 12, height: 3, backgroundColor: palette.green, borderRadius: 999 },
  chartDot: { position: 'absolute', width: 11, height: 11, borderRadius: 999, backgroundColor: palette.green, borderColor: palette.white, borderWidth: 2 },
  chartLeftDate: { position: 'absolute', bottom: 0, left: 36, color: palette.muted, fontSize: 10, fontWeight: '700' },
  chartRightDate: { position: 'absolute', bottom: 0, right: 0, color: palette.muted, fontSize: 10, fontWeight: '700' },
  trendSlab: { width: 96, borderRadius: 16, borderWidth: 1, borderColor: '#BBF7D0', backgroundColor: palette.greenSoft, justifyContent: 'center', padding: 11 },
  trendSlabTitle: { color: palette.green, fontSize: 16, fontWeight: '900', lineHeight: 19 },
  trendSlabText: { color: palette.muted, fontSize: 11, fontWeight: '700', lineHeight: 14, marginTop: 6 },
  quickGrid: { flexDirection: 'row', gap: 8 },
  quickTile: { flex: 1, minHeight: 82, backgroundColor: palette.card, borderRadius: 15, borderWidth: 1, borderColor: palette.border, alignItems: 'center', justifyContent: 'center', paddingVertical: 8, ...softShadow },
  quickIcon: { fontSize: 25, fontWeight: '900', marginBottom: 5 },
  quickText: { color: palette.navy, fontSize: 10.5, fontWeight: '900', textAlign: 'center', lineHeight: 13 },
  privacyFooter: { minHeight: 76, borderRadius: 20, borderWidth: 1, borderColor: palette.border, backgroundColor: palette.card, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, ...cardShadow },
  lockIcon: { color: '#8DA0B8', fontSize: 24 },
  privacyTextWrap: { flex: 1, alignItems: 'center' },
  privacyMain: { color: palette.navy, fontSize: 14, fontWeight: '900', textAlign: 'center' },
  privacySub: { color: palette.muted, fontSize: 12, fontWeight: '800', marginTop: 3, textAlign: 'center' },
  shieldCircle: { width: 40, height: 40, borderRadius: 16, backgroundColor: palette.tealSoft, borderColor: '#99F6E4', borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  shieldLock: { color: palette.teal, fontSize: 18, fontWeight: '900' },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
});
