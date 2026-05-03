import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { BaselineInsight } from '../src/domain/baseline/compareToBaseline';
import { compareToBaseline } from '../src/domain/baseline/compareToBaseline';
import type { LogEntry, PersonProfile } from '../src/domain/logs/log.types';
import type { RiskState } from '../src/domain/risk/calculateRisk';
import { calculateRisk } from '../src/domain/risk/calculateRisk';
import { loadLogs } from '../src/storage/localLogRepository';
import { loadPersonProfile } from '../src/storage/localProfileRepository';
import { colors, layout, radius, semantic, shadows, spacing } from '../src/theme/tokens';

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
        <ActivityIndicator color={colors.blue} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <HeroHeader />
      <PrimaryCheckInCard />
      <PersonSummaryCard profile={profile} latestLog={latestLog} />
      <RiskSupportSummaryCard risk={riskState} />
      <BaselineInsightPills insights={baselineInsights} hasProfile={Boolean(profile)} hasLogs={logs.length > 0} />
      <PremiumTrendCard logs={logs} />
      <QuickActions />
      <PrivacyFooter />
    </ScrollView>
  );
}

function HeroHeader() {
  return (
    <View style={styles.hero}>
      <View style={styles.heroLeft}>
        <MockBrandMark />
        <View style={styles.heroTextWrap}>
          <Text style={styles.heroTitle}>Delirium Buddy</Text>
          <Text style={styles.heroSubtitle}>You’re making a real difference.</Text>
          <Text style={styles.heroSubtitle}>Small moments, better days.</Text>
        </View>
      </View>
      <View style={styles.heroArt} pointerEvents="none">
        <View style={styles.heroSun} />
        <View style={styles.heroHillBack} />
        <View style={styles.heroHillFront} />
        <View style={styles.heroPath} />
        <View style={styles.heroLeafOne} />
        <View style={styles.heroLeafTwo} />
      </View>
    </View>
  );
}

function MockBrandMark() {
  return (
    <View accessible accessibilityRole="image" accessibilityLabel="Delirium Buddy logo" style={styles.brandMark}>
      <View style={styles.brandLeafLeft} />
      <View style={styles.brandLeafRight} />
      <View style={styles.brandLeafBottom} />
    </View>
  );
}

function PrimaryCheckInCard() {
  return (
    <Link href="/log" asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add a new daily check-in"
        style={({ pressed }) => [styles.addCard, pressed && styles.pressed]}
      >
        <View style={styles.addCardGlow} />
        <View style={styles.addCircle}>
          <Text style={styles.addPlus}>+</Text>
        </View>
        <View style={styles.addCopy}>
          <Text style={styles.addTitle}>Add check-in</Text>
          <Text style={styles.addSubtitle}>Capture how things are going right now.</Text>
        </View>
        <Text style={styles.addChevron}>›</Text>
      </Pressable>
    </Link>
  );
}

function PersonSummaryCard({ profile, latestLog }: { profile: PersonProfile | null; latestLog: LogEntry | undefined }) {
  const name = profile?.displayName ?? 'No person profile yet';
  const initial = profile?.displayName?.slice(0, 1).toUpperCase() ?? '?';
  const metaParts = [profile?.ageRange, latestLog?.date ? `Latest ${formatShortDate(latestLog.date)}` : undefined].filter(Boolean);
  const meta = metaParts.length > 0 ? metaParts.join(' · ') : 'Create a baseline profile first';
  const badge = profile ? `Supporting · ${profile.relationship}` : 'Baseline needed';

  return (
    <Link href="/profile" asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open person profile"
        style={({ pressed }) => [styles.personCard, pressed && styles.pressed]}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={styles.personContent}>
          <Text style={styles.personName}>{name}</Text>
          <Text style={styles.personMeta}>{meta}</Text>
          <View style={styles.personBadge}>
            <UsersMiniIcon />
            <Text style={styles.personBadgeText}>{badge}</Text>
          </View>
        </View>
        <Text style={styles.personChevron}>›</Text>
      </Pressable>
    </Link>
  );
}

function RiskSupportSummaryCard({ risk }: { risk: RiskState }) {
  const status = risk.level === 'No data' ? 'No data yet' : `${risk.level} today`;
  const toneColor = getRiskColor(risk.level);

  return (
    <View style={styles.sectionBlock}>
      <Text style={styles.sectionTitle}>Risk / Support Summary</Text>
      <Link href="/summary" asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View risk and support summary details"
          style={({ pressed }) => [styles.riskCard, pressed && styles.pressed]}
        >
          <View style={[styles.shield, { backgroundColor: toneColor }]}>
            <Text style={styles.shieldCheck}>✓</Text>
          </View>
          <View style={styles.riskCopy}>
            <Text style={[styles.riskStatus, { color: toneColor }]}>{status}</Text>
            <Text style={styles.riskTip} numberOfLines={2}>{risk.tip}</Text>
          </View>
          <View style={styles.riskRail}>
            <UsersIcon />
            <Text style={styles.riskRailText}>View details</Text>
            <Text style={styles.riskRailChevron}>›</Text>
          </View>
        </Pressable>
      </Link>
    </View>
  );
}

function BaselineInsightPills({
  insights,
  hasProfile,
  hasLogs,
}: {
  insights: BaselineInsight[];
  hasProfile: boolean;
  hasLogs: boolean;
}) {
  const items = buildInsightCards(insights, hasProfile, hasLogs);

  return (
    <View style={styles.sectionBlock}>
      <Text style={styles.sectionTitle}>Baseline Insights</Text>
      <View style={styles.insightRow}>
        {items.map((item, index) => (
          <View key={`${item.title}-${index}`} style={[styles.insightCard, item.style]}>
            <Text style={[styles.insightIcon, { color: item.color }]}>{item.icon}</Text>
            <Text style={[styles.insightTitle, { color: item.color }]} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.insightSubtitle} numberOfLines={2}>{item.subtitle}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.sectionNote}>Personal tracking only — not a diagnosis.</Text>
    </View>
  );
}

function PremiumTrendCard({ logs }: { logs: LogEntry[] }) {
  const sorted = logs.slice(-7);
  const latest = sorted[sorted.length - 1];
  const first = sorted[0];
  const status = getTrendStatus(sorted);
  const points = buildTrendPoints(sorted);

  return (
    <View style={styles.trendCard}>
      <View style={styles.trendHeader}>
        <Text style={styles.trendTitle}>7-Day Trend</Text>
        <Text style={styles.trendRange}>{first && latest ? `${formatShortDate(first.date)} – ${formatShortDate(latest.date)}` : 'Build a week'}</Text>
      </View>
      <View style={styles.trendBody}>
        <View style={styles.chartArea}>
          <View style={styles.gridLineTop} />
          <View style={styles.gridLineMid} />
          <View style={styles.gridLineBase} />
          <View style={styles.axisLeft} />
          <Text style={styles.yTop}>10</Text>
          <Text style={styles.yMid}>5</Text>
          <Text style={styles.yBase}>0</Text>
          <View style={styles.chartFill} />
          <View style={[styles.chartLine, { top: points.lineTop }]} />
          <View style={[styles.chartDot, { left: '18%', top: points.dotTop }]} />
          <View style={[styles.chartDot, { right: '18%', top: points.dotTop }]} />
          {points.showAttentionDot ? <View style={[styles.attentionDot, { right: '18%', top: points.dotTop }]} /> : null}
          <Text style={styles.xLeft}>{first ? formatShortDate(first.date) : 'Start'}</Text>
          <Text style={styles.xRight}>{latest ? formatShortDate(latest.date) : 'Next'}</Text>
        </View>
        <View style={styles.trendStatusSlab}>
          <Text style={styles.trendStatusTitle}>{status.title}</Text>
          <Text style={styles.trendStatusText}>{status.subtitle}</Text>
        </View>
      </View>
      <Text style={styles.trendFootnote}>Blended agitation + confusion for personal tracking only.</Text>
    </View>
  );
}

function QuickActions() {
  const actions = [
    { href: '/profile' as const, icon: <ProfileIcon />, title: 'Profile', label: 'Open profile' },
    { href: '/history' as const, icon: <HistoryIcon />, title: 'History', label: 'Open history' },
    { href: '/summary' as const, icon: <BarsIcon />, title: '7-day\nSummary', label: 'Open 7-day summary' },
    { href: '/settings' as const, icon: <SettingsIcon />, title: 'Settings', label: 'Open settings' },
    { href: '/about' as const, icon: <InfoIcon />, title: 'About', label: 'Open about' },
  ];

  return (
    <View style={styles.sectionBlock}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickRow}>
        {actions.map((action) => (
          <Link key={action.href} href={action.href} asChild>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={action.label}
              style={({ pressed }) => [styles.quickTile, pressed && styles.pressed]}
            >
              {action.icon}
              <Text style={styles.quickTitle}>{action.title}</Text>
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
      <LockIcon />
      <View style={styles.privacyCopy}>
        <Text style={styles.privacyText}>All data stays on this device.</Text>
        <Text style={styles.privacySubtext}>Private. Secure. Yours.</Text>
      </View>
      <View style={styles.privacyShield}>
        <Text style={styles.privacyShieldLock}>▢</Text>
      </View>
    </View>
  );
}

function buildInsightCards(insights: BaselineInsight[], hasProfile: boolean, hasLogs: boolean) {
  const mapped = insights.slice(0, 3).map((insight, index) => {
    const red = insight.severity === 'red-flag';
    const watch = insight.severity === 'watch';

    return {
      icon: red ? '◎' : watch ? '☼' : '▱',
      title: compactTitle(insight.label),
      subtitle: compactDetail(insight.detail),
      color: red ? colors.danger : watch ? colors.green : colors.blue,
      style: index === 0 ? styles.insightPink : index === 1 ? styles.insightGreen : styles.insightBlue,
    };
  });

  const placeholders = [
    {
      icon: '☼',
      title: hasProfile ? 'Routine anchors' : 'Add baseline',
      subtitle: hasProfile ? 'Consistency helps' : 'Start with profile',
      color: colors.green,
      style: styles.insightGreen,
    },
    {
      icon: '▱',
      title: hasLogs ? 'Conversation ready' : 'First check-in',
      subtitle: hasLogs ? '7-day overview' : 'Build a pattern',
      color: colors.blue,
      style: styles.insightBlue,
    },
    {
      icon: '◌',
      title: 'Keep tracking',
      subtitle: 'Small notes help',
      color: colors.purple,
      style: styles.insightPurple,
    },
  ];

  return [...mapped, ...placeholders].slice(0, 3);
}

function compactTitle(label: string): string {
  return label
    .replace('Sleep below usual range', 'Sleep pattern')
    .replace('Confusion higher than baseline', 'Confusion above')
    .replace('Sudden change noted', 'Sudden change noted')
    .replace('Fever or infection noted', 'Infection context')
    .replace('Fall or near fall noted', 'Fall noted')
    .replace('Hallucination noted', 'Conversation ready');
}

function compactDetail(detail: string): string {
  if (detail.length <= 34) return detail;
  return `${detail.slice(0, 31)}...`;
}

function getRiskColor(level: RiskState['level']): string {
  if (level === 'High') return semantic.risk.high;
  if (level === 'Moderate') return semantic.risk.moderate;
  if (level === 'Low') return semantic.risk.low;
  return semantic.risk.none;
}

function getTrendStatus(logs: LogEntry[]): { title: string; subtitle: string } {
  if (logs.length === 0) return { title: 'Ready', subtitle: 'Add entries this week' };
  if (logs.length === 1) return { title: 'Building streak', subtitle: '1 entry this week' };

  const latest = logs[logs.length - 1];
  if (!latest) return { title: 'Building streak', subtitle: `${logs.length} entries this week` };

  const blended = (latest.agitation + latest.confusion) / 2;
  if (blended >= 7) return { title: 'Needs attention', subtitle: `${logs.length} entries this week` };
  if (blended >= 4) return { title: 'Keep watching', subtitle: `${logs.length} entries this week` };
  return { title: 'Mostly good', subtitle: `${logs.length} entries this week` };
}

function buildTrendPoints(logs: LogEntry[]): { lineTop: number; dotTop: number; showAttentionDot: boolean } {
  const latest = logs[logs.length - 1];
  const blended = latest ? (latest.agitation + latest.confusion) / 2 : 2.5;
  const top = Math.max(28, Math.min(104, 118 - blended * 9));

  return {
    lineTop: top + 5,
    dotTop: top,
    showAttentionDot: logs.length >= 2 && blended >= 4,
  };
}

function formatShortDate(date: string): string {
  const parts = date.split('-');
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  if (!month || !day) return date;
  return `${day} ${getMonthName(month)}`;
}

function getMonthName(month: number): string {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1] ?? '';
}

function UsersMiniIcon() {
  return (
    <View style={styles.usersMiniIcon}>
      <View style={styles.usersMiniHead} />
      <View style={styles.usersMiniBody} />
      <View style={[styles.usersMiniHead, styles.usersMiniHeadTwo]} />
      <View style={[styles.usersMiniBody, styles.usersMiniBodyTwo]} />
    </View>
  );
}

function UsersIcon() {
  return (
    <View style={styles.usersIcon}>
      <View style={styles.usersHead} />
      <View style={styles.usersBody} />
      <View style={[styles.usersHead, styles.usersHeadTwo]} />
      <View style={[styles.usersBody, styles.usersBodyTwo]} />
    </View>
  );
}

function ProfileIcon() {
  return (
    <View style={styles.iconBox}>
      <View style={[styles.outlineHead, { borderColor: colors.purple }]} />
      <View style={[styles.outlineShoulders, { borderColor: colors.purple }]} />
    </View>
  );
}

function HistoryIcon() {
  return (
    <View style={styles.iconBox}>
      <View style={[styles.clockCircle, { borderColor: colors.blue }]}>
        <View style={[styles.clockHand, { backgroundColor: colors.blue }]} />
      </View>
      <Text style={[styles.iconGlyph, { color: colors.blue }]}>↺</Text>
    </View>
  );
}

function BarsIcon() {
  return (
    <View style={styles.iconBox}>
      <View style={[styles.bar, styles.barOne]} />
      <View style={[styles.bar, styles.barTwo]} />
      <View style={[styles.bar, styles.barThree]} />
    </View>
  );
}

function SettingsIcon() {
  return (
    <View style={styles.iconBox}>
      <View style={styles.cogOuter}>
        <View style={styles.cogInner} />
      </View>
    </View>
  );
}

function InfoIcon() {
  return (
    <View style={styles.iconBox}>
      <View style={styles.infoCircle}>
        <Text style={styles.infoText}>i</Text>
      </View>
    </View>
  );
}

function LockIcon() {
  return (
    <View style={styles.lockIcon}>
      <View style={styles.lockShackle} />
      <View style={styles.lockBody} />
    </View>
  );
}

const CARD_WIDTH = '100%';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    padding: layout.screenPadding,
    paddingBottom: 28,
  },
  center: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
  },
  hero: {
    minHeight: 128,
    marginBottom: spacing.md,
    overflow: 'hidden',
    position: 'relative',
  },
  heroLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    paddingTop: 4,
    width: '70%',
    zIndex: 2,
  },
  heroTextWrap: {
    flex: 1,
  },
  heroTitle: {
    color: colors.textStrong,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  heroSubtitle: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  brandMark: {
    height: 54,
    position: 'relative',
    width: 54,
  },
  brandLeafLeft: {
    backgroundColor: '#8EAFF8',
    borderBottomLeftRadius: 24,
    borderTopRightRadius: 24,
    height: 44,
    left: 7,
    position: 'absolute',
    top: 2,
    transform: [{ rotate: '-35deg' }],
    width: 25,
  },
  brandLeafRight: {
    backgroundColor: '#A7C3FF',
    borderBottomRightRadius: 24,
    borderTopLeftRadius: 24,
    height: 44,
    position: 'absolute',
    right: 7,
    top: 2,
    transform: [{ rotate: '35deg' }],
    width: 25,
  },
  brandLeafBottom: {
    backgroundColor: colors.blueMid,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    bottom: 0,
    height: 34,
    left: 13,
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
    width: 28,
  },
  heroArt: {
    bottom: 0,
    height: 105,
    position: 'absolute',
    right: -8,
    width: 215,
  },
  heroSun: {
    backgroundColor: '#FDE68A',
    borderRadius: radius.pill,
    height: 58,
    opacity: 0.62,
    position: 'absolute',
    right: 50,
    top: 0,
    width: 58,
  },
  heroHillBack: {
    backgroundColor: '#C7DAF8',
    borderRadius: 80,
    height: 68,
    opacity: 0.88,
    position: 'absolute',
    right: 0,
    top: 34,
    transform: [{ rotate: '-8deg' }],
    width: 185,
  },
  heroHillFront: {
    backgroundColor: '#E3EFFD',
    borderRadius: 80,
    height: 52,
    opacity: 0.95,
    position: 'absolute',
    right: 52,
    top: 48,
    transform: [{ rotate: '-9deg' }],
    width: 155,
  },
  heroPath: {
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    height: 8,
    opacity: 0.9,
    position: 'absolute',
    right: 65,
    top: 70,
    transform: [{ rotate: '-23deg' }],
    width: 72,
  },
  heroLeafOne: {
    backgroundColor: '#AFC7EC',
    borderBottomLeftRadius: 18,
    borderTopRightRadius: 18,
    height: 32,
    opacity: 0.65,
    position: 'absolute',
    right: 18,
    top: 55,
    transform: [{ rotate: '20deg' }],
    width: 11,
  },
  heroLeafTwo: {
    backgroundColor: '#90B4E7',
    borderBottomRightRadius: 18,
    borderTopLeftRadius: 18,
    height: 28,
    opacity: 0.65,
    position: 'absolute',
    right: 36,
    top: 62,
    transform: [{ rotate: '-20deg' }],
    width: 10,
  },
  addCard: {
    alignItems: 'center',
    backgroundColor: colors.blueMid,
    borderRadius: radius.xl,
    flexDirection: 'row',
    gap: spacing.lg,
    minHeight: 104,
    marginBottom: spacing.md,
    overflow: 'hidden',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    width: CARD_WIDTH,
    ...shadows.lifted,
  },
  addCardGlow: {
    backgroundColor: '#2E64E8',
    borderRadius: 120,
    height: 170,
    opacity: 0.58,
    position: 'absolute',
    right: -28,
    top: -56,
    transform: [{ rotate: '-18deg' }],
    width: 230,
  },
  addCircle: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    height: 64,
    justifyContent: 'center',
    width: 64,
    ...shadows.soft,
  },
  addPlus: {
    color: colors.blue,
    fontSize: 36,
    fontWeight: '600',
    lineHeight: 38,
  },
  addCopy: {
    flex: 1,
    zIndex: 1,
  },
  addTitle: {
    color: colors.white,
    fontSize: 23,
    fontWeight: '900',
    marginBottom: 4,
  },
  addSubtitle: {
    color: '#EFF6FF',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 21,
  },
  addChevron: {
    color: colors.white,
    fontSize: 44,
    fontWeight: '200',
    zIndex: 1,
  },
  personCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.borderSoft,
    borderRadius: radius.xl,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.md,
    minHeight: 104,
    padding: spacing.lg,
    ...shadows.card,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.bluePale,
    borderColor: '#D7E7FB',
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 68,
    justifyContent: 'center',
    width: 68,
  },
  avatarText: {
    color: colors.textStrong,
    fontSize: 28,
    fontWeight: '900',
  },
  personContent: {
    flex: 1,
  },
  personName: {
    color: colors.textStrong,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  personMeta: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 2,
  },
  personBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.tealSoft,
    borderColor: '#7DD3FC',
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  personBadgeText: {
    color: colors.textStrong,
    fontSize: 12,
    fontWeight: '900',
  },
  personChevron: {
    color: '#9AA6B8',
    fontSize: 36,
    fontWeight: '200',
  },
  sectionBlock: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.textStrong,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: spacing.sm,
  },
  riskCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.borderSoft,
    borderRadius: radius.xl,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 98,
    padding: spacing.lg,
    ...shadows.card,
  },
  shield: {
    alignItems: 'center',
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    height: 56,
    justifyContent: 'center',
    width: 50,
  },
  shieldCheck: {
    color: colors.white,
    fontSize: 31,
    fontWeight: '900',
    lineHeight: 34,
  },
  riskCopy: {
    flex: 1,
  },
  riskStatus: {
    fontSize: 20,
    fontWeight: '900',
  },
  riskTip: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  riskRail: {
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
    borderColor: colors.borderSoft,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  riskRailText: {
    color: colors.textStrong,
    fontSize: 13,
    fontWeight: '900',
  },
  riskRailChevron: {
    color: '#94A3B8',
    fontSize: 20,
    lineHeight: 20,
  },
  insightRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  insightCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    flex: 1,
    minHeight: 112,
    padding: spacing.md,
  },
  insightPink: {
    backgroundColor: '#FCE3E8',
    borderColor: '#F9C8D2',
  },
  insightGreen: {
    backgroundColor: colors.limeSoft,
    borderColor: '#D9F99D',
  },
  insightBlue: {
    backgroundColor: colors.skySoft,
    borderColor: '#BAE6FD',
  },
  insightPurple: {
    backgroundColor: colors.purpleSoft,
    borderColor: '#DDD6FE',
  },
  insightIcon: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 16,
  },
  insightSubtitle: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
    marginTop: 4,
  },
  sectionNote: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  trendCard: {
    backgroundColor: colors.surface,
    borderColor: colors.borderSoft,
    borderRadius: radius.xl,
    borderWidth: 1,
    marginBottom: spacing.md,
    padding: spacing.lg,
    ...shadows.card,
  },
  trendHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  trendTitle: {
    color: colors.textStrong,
    fontSize: 20,
    fontWeight: '900',
  },
  trendRange: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '800',
  },
  trendBody: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  chartArea: {
    flex: 1,
    height: 150,
    paddingLeft: 28,
    position: 'relative',
  },
  gridLineTop: {
    backgroundColor: '#E6F2EE',
    height: 1,
    left: 28,
    position: 'absolute',
    right: 4,
    top: 24,
  },
  gridLineMid: {
    backgroundColor: '#E6F2EE',
    height: 1,
    left: 28,
    position: 'absolute',
    right: 4,
    top: 78,
  },
  gridLineBase: {
    backgroundColor: '#D7E8E3',
    height: 2,
    left: 28,
    position: 'absolute',
    right: 4,
    top: 130,
  },
  axisLeft: {
    backgroundColor: '#D7E8E3',
    bottom: 19,
    left: 28,
    position: 'absolute',
    top: 20,
    width: 2,
  },
  yTop: {
    color: colors.textMuted,
    fontSize: 11,
    left: 3,
    position: 'absolute',
    top: 16,
  },
  yMid: {
    color: colors.textMuted,
    fontSize: 11,
    left: 9,
    position: 'absolute',
    top: 70,
  },
  yBase: {
    color: colors.textMuted,
    fontSize: 11,
    left: 9,
    position: 'absolute',
    top: 122,
  },
  chartFill: {
    backgroundColor: '#BBF7D0',
    bottom: 20,
    left: 44,
    opacity: 0.62,
    position: 'absolute',
    right: 18,
    top: 72,
  },
  chartLine: {
    backgroundColor: colors.green,
    height: 3,
    left: 44,
    position: 'absolute',
    right: 18,
  },
  chartDot: {
    backgroundColor: colors.green,
    borderColor: colors.white,
    borderRadius: radius.pill,
    borderWidth: 2,
    height: 12,
    position: 'absolute',
    width: 12,
  },
  attentionDot: {
    backgroundColor: '#F59E0B',
    borderColor: colors.white,
    borderRadius: radius.pill,
    borderWidth: 2,
    height: 12,
    position: 'absolute',
    width: 12,
  },
  xLeft: {
    bottom: 0,
    color: colors.textMuted,
    fontSize: 11,
    left: 38,
    position: 'absolute',
  },
  xRight: {
    bottom: 0,
    color: colors.textMuted,
    fontSize: 11,
    position: 'absolute',
    right: 4,
  },
  trendStatusSlab: {
    backgroundColor: '#EAFBF1',
    borderColor: '#BBF7D0',
    borderRadius: radius.lg,
    borderWidth: 1,
    justifyContent: 'center',
    padding: spacing.md,
    width: 104,
  },
  trendStatusTitle: {
    color: colors.green,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 21,
  },
  trendStatusText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    marginTop: 6,
  },
  trendFootnote: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  quickRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  quickTile: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    borderWidth: 1,
    flex: 1,
    minHeight: 90,
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: spacing.sm,
    ...shadows.soft,
  },
  quickTitle: {
    color: colors.textStrong,
    fontSize: 11,
    fontWeight: '900',
    lineHeight: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  iconBox: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  outlineHead: {
    borderRadius: radius.pill,
    borderWidth: 2,
    height: 13,
    width: 13,
  },
  outlineShoulders: {
    borderRadius: 8,
    borderTopWidth: 2,
    borderWidth: 2,
    height: 13,
    marginTop: 2,
    width: 24,
  },
  clockCircle: {
    alignItems: 'center',
    borderRadius: radius.pill,
    borderWidth: 2,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  clockHand: {
    borderRadius: radius.pill,
    height: 9,
    width: 2,
  },
  iconGlyph: {
    fontSize: 18,
    fontWeight: '900',
    left: -2,
    position: 'absolute',
    top: 0,
  },
  bar: {
    backgroundColor: colors.green,
    borderRadius: radius.pill,
    bottom: 4,
    position: 'absolute',
    width: 5,
  },
  barOne: {
    height: 16,
    left: 7,
  },
  barTwo: {
    height: 26,
    left: 15,
  },
  barThree: {
    height: 20,
    left: 23,
  },
  cogOuter: {
    alignItems: 'center',
    borderColor: colors.warning,
    borderRadius: radius.pill,
    borderWidth: 3,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  cogInner: {
    backgroundColor: colors.warning,
    borderRadius: radius.pill,
    height: 8,
    width: 8,
  },
  infoCircle: {
    alignItems: 'center',
    borderColor: colors.textStrong,
    borderRadius: radius.pill,
    borderWidth: 2,
    height: 29,
    justifyContent: 'center',
    width: 29,
  },
  infoText: {
    color: colors.textStrong,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 21,
  },
  usersMiniIcon: {
    height: 13,
    position: 'relative',
    width: 20,
  },
  usersMiniHead: {
    backgroundColor: colors.blue,
    borderRadius: radius.pill,
    height: 6,
    left: 4,
    position: 'absolute',
    top: 0,
    width: 6,
  },
  usersMiniBody: {
    backgroundColor: colors.blue,
    borderRadius: 5,
    bottom: 0,
    height: 6,
    left: 1,
    position: 'absolute',
    width: 12,
  },
  usersMiniHeadTwo: {
    left: 11,
  },
  usersMiniBodyTwo: {
    left: 8,
  },
  usersIcon: {
    height: 23,
    position: 'relative',
    width: 28,
  },
  usersHead: {
    borderColor: colors.blue,
    borderRadius: radius.pill,
    borderWidth: 2,
    height: 9,
    left: 6,
    position: 'absolute',
    top: 0,
    width: 9,
  },
  usersBody: {
    borderColor: colors.blue,
    borderRadius: 7,
    borderWidth: 2,
    bottom: 0,
    height: 12,
    left: 1,
    position: 'absolute',
    width: 19,
  },
  usersHeadTwo: {
    left: 15,
  },
  usersBodyTwo: {
    left: 10,
  },
  privacyFooter: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.borderSoft,
    borderRadius: radius.xl,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 86,
    padding: spacing.lg,
    ...shadows.card,
  },
  lockIcon: {
    alignItems: 'center',
    height: 34,
    justifyContent: 'flex-end',
    width: 34,
  },
  lockShackle: {
    borderColor: '#8DA0B8',
    borderRadius: 10,
    borderWidth: 2,
    height: 17,
    position: 'absolute',
    top: 2,
    width: 20,
  },
  lockBody: {
    backgroundColor: '#8DA0B8',
    borderRadius: 5,
    height: 18,
    width: 24,
  },
  privacyCopy: {
    flex: 1,
  },
  privacyText: {
    color: colors.textStrong,
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center',
  },
  privacySubtext: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4,
    textAlign: 'center',
  },
  privacyShield: {
    alignItems: 'center',
    backgroundColor: colors.tealSoft,
    borderColor: '#99F6E4',
    borderRadius: 18,
    borderWidth: 2,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  privacyShieldLock: {
    color: colors.teal,
    fontSize: 20,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
});
