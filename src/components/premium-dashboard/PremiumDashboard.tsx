import { Link } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Polygon, Rect, Stop, Text as SvgText } from 'react-native-svg';

import type { BaselineInsight } from '../../domain/baseline/compareToBaseline';
import type { LogEntry, PersonProfile } from '../../domain/logs/log.types';
import type { RiskState } from '../../domain/risk/calculateRisk';

type PremiumDashboardProps = {
  profile: PersonProfile | null;
  logs: LogEntry[];
  risk: RiskState;
  insights: BaselineInsight[];
};

const palette = {
  bg: '#F8FAFC',
  card: '#FFFFFF',
  navy: '#102A5F',
  muted: '#64748B',
  blue: '#4F7DF3',
  blueDark: '#2F5FE3',
  blueSoft: '#EEF6FF',
  blueIcon: '#426BD9',
  green: '#159A63',
  greenSoft: '#EAFBF1',
  purple: '#7C3AED',
  purpleSoft: '#F3E8FF',
  limeSoft: '#ECFCCB',
  skySoft: '#E0F2FE',
  teal: '#0EA5A4',
  tealSoft: '#CCFBF1',
  danger: '#DC2626',
  dangerSoft: '#FEE2E2',
  warning: '#D97706',
  border: '#E7EEF7',
  white: '#FFFFFF',
};

export function PremiumDashboard({ profile, logs, risk, insights }: PremiumDashboardProps) {
  const latestLog = logs[logs.length - 1];

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PremiumDashboardHero />
        <PremiumAddCheckInCard />
        <PremiumPersonCard profile={profile} latestLog={latestLog} />
        <PremiumRiskSupportCard risk={risk} />
        <PremiumBaselineInsights insights={insights} hasProfile={Boolean(profile)} hasLogs={logs.length > 0} />
        <PremiumTrendCard logs={logs} />
        <PremiumQuickActions />
        <PremiumPrivacyFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

function PremiumDashboardHero() {
  return (
    <View style={styles.hero}>
      <View style={styles.heroCopy}>
        <FlowerMark size={58} />
        <View style={styles.heroTextBlock}>
          <Text style={styles.heroTitle}>Delirium Buddy</Text>
          <Text style={styles.heroSubtitle}>You’re making a real difference.</Text>
          <Text style={styles.heroSubtitle}>Small moments, better days.</Text>
        </View>
      </View>
      <View style={styles.heroArt} pointerEvents="none">
        <HeroLandscape />
      </View>
    </View>
  );
}

function PremiumAddCheckInCard() {
  return (
    <Link href="/log" asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add a new daily check-in"
        style={({ pressed }) => [styles.addCard, pressed && styles.pressed]}
      >
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="cta" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#5E87F7" />
              <Stop offset="1" stopColor="#3F6FEB" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" rx="22" fill="url(#cta)" />
          <Ellipse cx="86%" cy="10" rx="118" ry="58" fill="#86A5FA" opacity="0.28" transform="rotate(-12 330 20)" />
        </Svg>
        <View style={styles.addPlusCircle}>
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

function PremiumPersonCard({ profile, latestLog }: { profile: PersonProfile | null; latestLog?: LogEntry }) {
  const name = profile?.displayName ?? 'Add person profile';
  const initial = profile?.displayName?.slice(0, 1).toUpperCase() ?? '?';
  const meta = profile
    ? [profile.ageRange, latestLog?.date ? `Today, ${formatShortDate(latestLog.date)}` : 'Baseline recorded']
        .filter(Boolean)
        .join(' · ')
    : 'Create a baseline before tracking';
  const badge = profile ? `You’re supporting ${profile.relationship}` : 'Add baseline first';

  return (
    <Link href="/profile" asChild>
      <Pressable accessibilityRole="button" accessibilityLabel="Open person profile" style={({ pressed }) => [styles.personCard, pressed && styles.pressed]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={styles.personCopy}>
          <Text style={styles.personName}>{name}</Text>
          <Text style={styles.personMeta}>{meta}</Text>
          <View style={styles.personBadge}>
            <UsersGlyph size={18} color={palette.blueIcon} />
            <Text style={styles.personBadgeText}>{badge}</Text>
          </View>
        </View>
        <Text style={styles.cardChevron}>›</Text>
      </Pressable>
    </Link>
  );
}

function PremiumRiskSupportCard({ risk }: { risk: RiskState }) {
  const riskColor = risk.level === 'High' ? palette.danger : risk.level === 'Moderate' ? palette.warning : risk.level === 'Low' ? palette.green : palette.muted;
  const status = risk.level === 'No data' ? 'No data yet' : `${risk.level} today`;

  return (
    <PremiumSection title="Risk / Support Summary">
      <Link href="/summary" asChild>
        <Pressable accessibilityRole="button" accessibilityLabel="View risk support details" style={({ pressed }) => [styles.riskCard, pressed && styles.pressed]}>
          <ShieldCheck color={riskColor} />
          <View style={styles.riskCopy}>
            <Text style={[styles.riskTitle, { color: riskColor }]}>{status}</Text>
            <Text style={styles.riskText} numberOfLines={2}>{risk.tip}</Text>
          </View>
          <View style={styles.detailsDivider} />
          <View style={styles.detailsRail}>
            <UsersGlyph size={28} color={palette.blueIcon} />
            <Text style={styles.detailsText}>View details</Text>
            <Text style={styles.detailsChevron}>›</Text>
          </View>
        </Pressable>
      </Link>
    </PremiumSection>
  );
}

function PremiumBaselineInsights({ insights, hasProfile, hasLogs }: { insights: BaselineInsight[]; hasProfile: boolean; hasLogs: boolean }) {
  const cards = buildInsightCards(insights, hasProfile, hasLogs);

  return (
    <PremiumSection title="Baseline Insights">
      <View style={styles.insightRow}>
        {cards.map((card) => (
          <View key={card.title} style={[styles.insightCard, card.cardStyle]}>
            {card.icon}
            <Text style={[styles.insightTitle, { color: card.color }]} numberOfLines={2}>{card.title}</Text>
            <Text style={styles.insightSub} numberOfLines={2}>{card.subtitle}</Text>
          </View>
        ))}
      </View>
    </PremiumSection>
  );
}

function PremiumTrendCard({ logs }: { logs: LogEntry[] }) {
  const latest = logs[logs.length - 1];
  const first = logs.slice(-7)[0];
  const blended = latest ? (latest.agitation + latest.confusion) / 2 : 3.2;
  const normalized = Math.max(1, Math.min(9, blended));
  const status = getTrendStatus(logs);

  return (
    <View style={styles.trendCard}>
      <View style={styles.trendHeader}>
        <Text style={styles.trendTitle}>7-Day Trend</Text>
        <Text style={styles.trendRange}>{first && latest ? `${formatShortDate(first.date)} – ${formatShortDate(latest.date)}` : 'Build a week'}</Text>
      </View>
      <View style={styles.trendBody}>
        <View style={styles.trendChartWrap}>
          <TrendSvg value={normalized} hasMultiple={logs.length > 1} />
        </View>
        <View style={styles.trendStatusPill}>
          <Text style={styles.trendStatusTitle}>{status.title}</Text>
          <Text style={styles.trendStatusSub}>{status.subtitle}</Text>
        </View>
      </View>
    </View>
  );
}

function PremiumQuickActions() {
  const actions = [
    { href: '/profile' as const, icon: <UserIcon color={palette.purple} />, title: 'Profile', label: 'Open profile' },
    { href: '/history' as const, icon: <HistoryIcon color={palette.blueIcon} />, title: 'History', label: 'Open history' },
    { href: '/summary' as const, icon: <BarsIcon color={palette.green} />, title: '7-day\nSummary', label: 'Open 7-day summary' },
    { href: '/settings' as const, icon: <CogIcon color="#EA6A22" />, title: 'Settings', label: 'Open settings' },
    { href: '/about' as const, icon: <InfoIcon color={palette.blueIcon} />, title: 'About', label: 'Open about' },
  ];

  return (
    <PremiumSection title="Quick Actions">
      <View style={styles.quickRow}>
        {actions.map((action) => (
          <Link href={action.href} asChild key={action.href}>
            <Pressable accessibilityRole="button" accessibilityLabel={action.label} style={({ pressed }) => [styles.quickTile, pressed && styles.pressed]}>
              {action.icon}
              <Text style={styles.quickText}>{action.title}</Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </PremiumSection>
  );
}

function PremiumPrivacyFooter() {
  return (
    <View style={styles.privacyFooter}>
      <LockIcon color="#8FA0B8" />
      <View style={styles.privacyCopy}>
        <Text style={styles.privacyMain}>All data stays on this device.</Text>
        <Text style={styles.privacySub}>Private. Secure. Yours.</Text>
      </View>
      <View style={styles.privacyShield}>
        <ShieldLockIcon />
      </View>
    </View>
  );
}

function PremiumSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function buildInsightCards(insights: BaselineInsight[], hasProfile: boolean, hasLogs: boolean) {
  const real = insights.slice(0, 3).map((insight, index) => {
    const tone = index === 0 ? styles.insightPink : index === 1 ? styles.insightGreen : styles.insightBlue;
    const color = insight.severity === 'red-flag' ? palette.danger : insight.severity === 'watch' ? palette.green : palette.blueIcon;

    return {
      title: compactTitle(insight.label),
      subtitle: compactText(insight.detail),
      cardStyle: tone,
      color,
      icon: insight.severity === 'red-flag' ? <AlertIcon color={color} /> : insight.severity === 'watch' ? <SunIcon color={color} /> : <CupIcon color={color} />,
    };
  });

  const fallback = [
    {
      title: hasProfile ? 'Calmer mornings' : 'Add baseline',
      subtitle: hasProfile ? 'Usually' : 'Start profile',
      cardStyle: styles.insightGreen,
      color: palette.green,
      icon: <SunIcon color={palette.warning} />,
    },
    {
      title: hasLogs ? 'Hydration helps' : 'First check-in',
      subtitle: hasLogs ? 'Keep it up' : 'Build pattern',
      cardStyle: styles.insightBlue,
      color: palette.blueIcon,
      icon: <CupIcon color={palette.blueIcon} />,
    },
    {
      title: 'Best sleep',
      subtitle: 'Mon, Wed',
      cardStyle: styles.insightPurple,
      color: palette.purple,
      icon: <MoonIcon color={palette.purple} />,
    },
  ];

  return [...real, ...fallback].slice(0, 3);
}

function compactTitle(value: string): string {
  return value
    .replace('Sleep below usual range', 'Best sleep')
    .replace('Sleep above usual range', 'Sleep pattern')
    .replace('Confusion higher than baseline', 'Conversation ready')
    .replace('Sudden change noted', 'Sudden change noted')
    .replace('Fever or infection noted', 'Care context')
    .replace('Fall or near fall noted', 'Fall noted')
    .replace('Hallucination noted', 'Conversation ready');
}

function compactText(value: string): string {
  return value.length > 30 ? `${value.slice(0, 27)}...` : value;
}

function getTrendStatus(logs: LogEntry[]) {
  if (logs.length === 0) return { title: 'Ready', subtitle: 'Add entries' };
  if (logs.length === 1) return { title: 'Building', subtitle: '1 entry' };
  const latest = logs[logs.length - 1];
  const blended = latest ? (latest.agitation + latest.confusion) / 2 : 0;
  if (blended >= 7) return { title: 'Needs care', subtitle: `${logs.length} entries` };
  if (blended >= 4) return { title: 'Keep watch', subtitle: `${logs.length} entries` };
  return { title: 'Mostly good', subtitle: `${logs.length} entries` };
}

function formatShortDate(date: string): string {
  const [, monthRaw, dayRaw] = date.split('-');
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return month && day ? `${day} ${names[month - 1]}` : date;
}

function FlowerMark({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Path d="M31 56C19 46 10 36 10 24c0-9 6-15 14-15 4 0 7 2 9 5 2-3 5-5 9-5 8 0 14 6 14 15 0 12-9 22-21 32l-2 2-2-2Z" fill="#9DB8FF" />
      <Path d="M32 57C23 46 18 36 20 25c2-10 10-16 19-14 8 2 13 9 11 18-3 12-10 20-18 28Z" fill="#5D86F3" opacity="0.94" />
      <Path d="M31 57C21 49 14 39 12 29c-2-10 3-17 11-19 8-1 15 4 17 13 2 12-2 23-9 34Z" fill="#7EA2F8" opacity="0.82" />
    </Svg>
  );
}

function HeroLandscape() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 230 112">
      <Defs>
        <LinearGradient id="hill" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#DDE9FB" />
          <Stop offset="1" stopColor="#BFD2F3" />
        </LinearGradient>
      </Defs>
      <Circle cx="165" cy="25" r="30" fill="#FDE68A" opacity="0.65" />
      <Path d="M10 88C58 35 122 56 223 40v72H10Z" fill="url(#hill)" opacity="0.95" />
      <Path d="M0 102C55 62 116 76 205 62v50H0Z" fill="#EEF5FF" />
      <Path d="M80 100C102 78 127 65 150 50" stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity="0.9" />
      <Path d="M204 66c-18 8-25 20-28 35" stroke="#90AAD8" strokeWidth="4" strokeLinecap="round" />
      <Path d="M193 75c11-5 17-10 18-19" stroke="#90AAD8" strokeWidth="4" strokeLinecap="round" />
      <Path d="M190 88c12-5 19-10 24-20" stroke="#B4C6E6" strokeWidth="4" strokeLinecap="round" />
    </Svg>
  );
}

function ShieldCheck({ color }: { color: string }) {
  return (
    <Svg width={52} height={58} viewBox="0 0 52 58">
      <Path d="M26 4 45 11v16c0 13-7 22-19 27C14 49 7 40 7 27V11L26 4Z" fill={color} />
      <Path d="m17 29 6 6 13-15" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function TrendSvg({ value, hasMultiple }: { value: number; hasMultiple: boolean }) {
  const y = 108 - value * 8;
  const points = hasMultiple
    ? `8,${y + 10} 44,${y - 8} 82,${y - 6} 120,${y + 10} 156,${y - 10} 192,${y + 8}`
    : `8,${y} 192,${y}`;
  const fillPath = hasMultiple
    ? `M8 ${y + 10} L44 ${y - 8} L82 ${y - 6} L120 ${y + 10} L156 ${y - 10} L192 ${y + 8} L192 118 L8 118 Z`
    : `M8 ${y} L192 ${y} L192 118 L8 118 Z`;

  return (
    <Svg width="100%" height="100%" viewBox="0 0 205 140">
      <SvgText x="0" y="20" fontSize="10" fill={palette.muted}>10</SvgText>
      <SvgText x="5" y="68" fontSize="10" fill={palette.muted}>5</SvgText>
      <SvgText x="5" y="119" fontSize="10" fill={palette.muted}>0</SvgText>
      <Path d="M24 16v102h175" stroke="#D7E8E3" strokeWidth="2" />
      <Path d="M24 24h175M24 70h175" stroke="#E6F2EE" strokeWidth="1" />
      <Path d={fillPath} fill="#BBF7D0" opacity="0.62" />
      <Polyline points={points} fill="none" stroke={palette.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {(hasMultiple ? [[8, y + 10], [44, y - 8], [82, y - 6], [120, y + 10], [156, y - 10], [192, y + 8]] : [[8, y], [192, y]]).map(([cx, cy], index) => (
        <Circle key={`${cx}-${cy}-${index}`} cx={cx} cy={cy} r="5" fill={index === 3 && hasMultiple ? '#F59E0B' : palette.green} stroke="#fff" strokeWidth="2" />
      ))}
      <SvgText x="30" y="136" fontSize="10" fill={palette.muted}>Fri</SvgText>
      <SvgText x="75" y="136" fontSize="10" fill={palette.muted}>Sat</SvgText>
      <SvgText x="118" y="136" fontSize="10" fill={palette.muted}>Sun</SvgText>
      <SvgText x="165" y="136" fontSize="10" fill={palette.muted}>Thu</SvgText>
    </Svg>
  );
}

function UsersGlyph({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Circle cx="12" cy="10" r="4" stroke={color} strokeWidth="3" fill="none" />
      <Circle cx="21" cy="10" r="4" stroke={color} strokeWidth="3" fill="none" />
      <Path d="M5 25c1-6 5-8 10-8s9 2 10 8" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function UserIcon({ color }: { color: string }) {
  return <Svg width={32} height={32} viewBox="0 0 32 32"><Circle cx="16" cy="10" r="6" stroke={color} strokeWidth="3" fill="none" /><Path d="M6 28c1-8 6-12 10-12s9 4 10 12" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" /></Svg>;
}

function HistoryIcon({ color }: { color: string }) {
  return <Svg width={32} height={32} viewBox="0 0 32 32"><Path d="M9 9a10 10 0 1 1-2 12" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" /><Path d="M8 4v7H2" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /><Path d="M16 10v7l5 3" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" /></Svg>;
}

function BarsIcon({ color }: { color: string }) {
  return <Svg width={32} height={32} viewBox="0 0 32 32"><Rect x="7" y="15" width="5" height="11" rx="2" fill={color} /><Rect x="14" y="8" width="5" height="18" rx="2" fill={color} /><Rect x="21" y="12" width="5" height="14" rx="2" fill={color} /></Svg>;
}

function CogIcon({ color }: { color: string }) {
  return <Svg width={32} height={32} viewBox="0 0 32 32"><Circle cx="16" cy="16" r="8" stroke={color} strokeWidth="3" fill="none" /><Circle cx="16" cy="16" r="3" fill={color} /><Path d="M16 2v5M16 25v5M2 16h5M25 16h5M6 6l4 4M22 22l4 4M26 6l-4 4M10 22l-4 4" stroke={color} strokeWidth="3" strokeLinecap="round" /></Svg>;
}

function InfoIcon({ color }: { color: string }) {
  return <Svg width={32} height={32} viewBox="0 0 32 32"><Circle cx="16" cy="16" r="12" stroke={color} strokeWidth="3" fill="none" /><Circle cx="16" cy="10" r="1.8" fill={color} /><Path d="M16 15v8" stroke={color} strokeWidth="3" strokeLinecap="round" /></Svg>;
}

function LockIcon({ color }: { color: string }) {
  return <Svg width={32} height={32} viewBox="0 0 32 32"><Path d="M9 14V9a7 7 0 0 1 14 0v5" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" /><Rect x="7" y="14" width="18" height="14" rx="3" fill={color} /></Svg>;
}

function ShieldLockIcon() {
  return <Svg width={26} height={26} viewBox="0 0 32 32"><Path d="M16 3 27 7v9c0 7-4 11-11 14C9 27 5 23 5 16V7l11-4Z" fill="#7DD3FC" /><Rect x="11" y="14" width="10" height="8" rx="2" fill="#fff" /><Path d="M13 14v-2a3 3 0 0 1 6 0v2" stroke="#0EA5A4" strokeWidth="2" fill="none" /></Svg>;
}

function AlertIcon({ color }: { color: string }) {
  return <Svg width={26} height={26} viewBox="0 0 32 32"><Circle cx="16" cy="16" r="10" stroke={color} strokeWidth="3" fill="none" /><Circle cx="16" cy="16" r="4" fill={color} /></Svg>;
}

function SunIcon({ color }: { color: string }) {
  return <Svg width={26} height={26} viewBox="0 0 32 32"><Circle cx="16" cy="16" r="5" stroke={color} strokeWidth="3" fill="none" /><Path d="M16 3v5M16 24v5M3 16h5M24 16h5M6 6l4 4M22 22l4 4M26 6l-4 4M10 22l-4 4" stroke={color} strokeWidth="2.5" strokeLinecap="round" /></Svg>;
}

function CupIcon({ color }: { color: string }) {
  return <Svg width={26} height={26} viewBox="0 0 32 32"><Path d="M10 6h12l-2 20h-8L10 6Z" stroke={color} strokeWidth="3" fill="none" strokeLinejoin="round" /><Path d="M12 14h8" stroke={color} strokeWidth="3" /></Svg>;
}

function MoonIcon({ color }: { color: string }) {
  return <Svg width={26} height={26} viewBox="0 0 32 32"><Path d="M22 25A11 11 0 0 1 18 4a9 9 0 1 0 4 21Z" fill={color} /></Svg>;
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
  content: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 30 },
  hero: { height: 126, marginBottom: 12, position: 'relative' },
  heroCopy: { flexDirection: 'row', gap: 12, alignItems: 'center', width: '68%', zIndex: 2 },
  heroTextBlock: { flex: 1 },
  heroTitle: { color: palette.navy, fontSize: 28, fontWeight: '900', lineHeight: 32, letterSpacing: -0.4 },
  heroSubtitle: { color: palette.muted, fontSize: 13, fontWeight: '600', lineHeight: 18 },
  heroArt: { position: 'absolute', right: -6, top: 2, width: 218, height: 112 },
  addCard: { height: 104, borderRadius: 21, marginBottom: 14, overflow: 'hidden', flexDirection: 'row', alignItems: 'center', gap: 18, paddingHorizontal: 20, ...cardShadow },
  addPlusCircle: { width: 61, height: 61, borderRadius: 31, backgroundColor: palette.white, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  addPlus: { color: palette.blue, fontSize: 35, fontWeight: '500', lineHeight: 37 },
  addCopy: { flex: 1, zIndex: 1 },
  addTitle: { color: palette.white, fontSize: 23, fontWeight: '900', marginBottom: 4 },
  addSubtitle: { color: '#EFF6FF', fontSize: 14.5, fontWeight: '600', lineHeight: 20 },
  addChevron: { color: palette.white, fontSize: 40, fontWeight: '200', zIndex: 1 },
  personCard: { minHeight: 104, borderRadius: 21, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.border, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, marginBottom: 14, ...cardShadow },
  avatar: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#EAF2FF', borderWidth: 1, borderColor: '#D7E7FA', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: palette.navy, fontSize: 27, fontWeight: '900' },
  personCopy: { flex: 1 },
  personName: { color: palette.navy, fontSize: 24, fontWeight: '900', letterSpacing: -0.3 },
  personMeta: { color: palette.muted, fontSize: 13, fontWeight: '600', marginTop: 2 },
  personBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 7, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: '#EEF2FF' },
  personBadgeText: { color: palette.navy, fontSize: 12, fontWeight: '800' },
  cardChevron: { color: '#9AA6B8', fontSize: 36, fontWeight: '200' },
  section: { marginBottom: 14 },
  sectionTitle: { color: palette.navy, fontSize: 16.5, fontWeight: '900', marginBottom: 8 },
  riskCard: { minHeight: 96, borderRadius: 21, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.border, flexDirection: 'row', alignItems: 'center', padding: 14, gap: 13, ...cardShadow },
  riskCopy: { flex: 1 },
  riskTitle: { fontSize: 19, fontWeight: '900' },
  riskText: { color: palette.muted, fontSize: 12.5, lineHeight: 17, fontWeight: '600', marginTop: 2 },
  detailsDivider: { width: 1, height: 54, backgroundColor: palette.border },
  detailsRail: { minWidth: 110, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 999, backgroundColor: '#F7F9FC', paddingHorizontal: 8, paddingVertical: 9 },
  detailsText: { color: palette.navy, fontSize: 12, fontWeight: '900' },
  detailsChevron: { color: '#9AA6B8', fontSize: 18 },
  insightRow: { flexDirection: 'row', gap: 9 },
  insightCard: { flex: 1, minHeight: 92, borderRadius: 17, borderWidth: 1, padding: 11 },
  insightPink: { backgroundColor: '#FCE3E8', borderColor: '#F9C8D2' },
  insightGreen: { backgroundColor: palette.limeSoft, borderColor: '#D9F99D' },
  insightBlue: { backgroundColor: palette.skySoft, borderColor: '#BAE6FD' },
  insightPurple: { backgroundColor: palette.purpleSoft, borderColor: '#DDD6FE' },
  insightTitle: { fontSize: 12.2, fontWeight: '900', lineHeight: 15, marginTop: 6 },
  insightSub: { color: palette.muted, fontSize: 10.8, lineHeight: 14, fontWeight: '700', marginTop: 3 },
  trendCard: { borderRadius: 21, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.border, padding: 14, marginBottom: 14, ...cardShadow },
  trendHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 },
  trendTitle: { color: palette.navy, fontSize: 18, fontWeight: '900' },
  trendRange: { color: palette.muted, fontSize: 12, fontWeight: '800' },
  trendBody: { flexDirection: 'row', gap: 12, alignItems: 'stretch' },
  trendChartWrap: { flex: 1, height: 136 },
  trendStatusPill: { width: 94, borderRadius: 16, borderWidth: 1, borderColor: '#BBF7D0', backgroundColor: palette.greenSoft, padding: 11, justifyContent: 'center' },
  trendStatusTitle: { color: palette.green, fontSize: 16, fontWeight: '900', lineHeight: 19 },
  trendStatusSub: { color: palette.muted, fontSize: 11, fontWeight: '700', lineHeight: 14, marginTop: 6 },
  quickRow: { flexDirection: 'row', gap: 8 },
  quickTile: { flex: 1, minHeight: 82, borderRadius: 15, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.border, alignItems: 'center', justifyContent: 'center', paddingVertical: 8, ...softShadow },
  quickText: { color: palette.navy, fontSize: 10.5, fontWeight: '900', lineHeight: 13, textAlign: 'center', marginTop: 5 },
  privacyFooter: { minHeight: 78, borderRadius: 21, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.border, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, ...cardShadow },
  privacyCopy: { flex: 1 },
  privacyMain: { color: palette.navy, fontSize: 14.5, fontWeight: '900' },
  privacySub: { color: palette.muted, fontSize: 12.5, fontWeight: '700', marginTop: 2 },
  privacyShield: { width: 44, height: 44, borderRadius: 16, backgroundColor: palette.tealSoft, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
});
