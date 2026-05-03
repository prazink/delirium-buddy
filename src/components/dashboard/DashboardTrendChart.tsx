import React, { useMemo } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Polyline, Stop } from 'react-native-svg';

import type { LogEntry } from '../../domain/logs/log.types';
import { useTheme } from '../../theme/useTheme';
import { AppText } from '../ui/AppText';
import { Card } from '../ui/Card';

interface DashboardTrendChartProps {
  logs: LogEntry[];
  style?: StyleProp<ViewStyle>;
}

const CHART_W = 320;
const CHART_H = 110;
const PAD_X = 20;
const PAD_Y = 10;
const INNER_W = CHART_W - PAD_X * 2;
const INNER_H = CHART_H - PAD_Y * 2;

const DAY_LABELS = ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'];

/** Composite wellbeing: 0 = worst, 10 = best. */
function wellbeing(log: LogEntry): number {
  const agPenalty  = (log.agitation  / 10) * 3.5;
  const confPenalty = (log.confusion  / 10) * 3.5;
  const sleepBonus  = (Math.min(log.sleepHours, 10) / 10) * 3;
  return Math.max(0, Math.min(10, 10 - agPenalty - confPenalty + sleepBonus - 3));
}

/**
 * 7-day SVG trend line chart + right-side summary panel, matching the HTML mockup.
 * Summary panel always renders — shows a "no data" state when logs are empty.
 * @example <DashboardTrendChart logs={logs} />
 */
export function DashboardTrendChart({ logs, style }: DashboardTrendChartProps) {
  const { colors } = useTheme();
  const recent = logs.slice(-7);

  const points = useMemo(() => {
    if (recent.length < 2) return null;
    const scores = recent.map(wellbeing);
    const maxScore = Math.max(...scores, 0.1);
    return scores.map((score, i) => ({
      x: PAD_X + (i / (scores.length - 1)) * INNER_W,
      y: PAD_Y + (1 - score / maxScore) * INNER_H,
      score,
    }));
  }, [recent]);

  const polylineStr = points?.map((p) => `${p.x},${p.y}`).join(' ') ?? '';
  const areaPath = points
    ? `M${points[0]!.x},${points[0]!.y} ` +
      points.slice(1).map((p) => `L${p.x},${p.y}`).join(' ') +
      ` L${points[points.length - 1]!.x},${CHART_H} L${points[0]!.x},${CHART_H} Z`
    : '';

  const goodDays  = points?.filter((p) => p.score >= 5).length ?? 0;
  const lowerDays = (points?.length ?? 0) - goodDays;

  const summaryTitle =
    recent.length === 0 ? 'No data\nyet' :
    recent.length < 2   ? 'Add more\ncheck-ins' :
    lowerDays === 0     ? 'All\ngood' :
    goodDays >= lowerDays ? 'Mostly\ngood' :
    'Some\nchallenges';

  const summarySub =
    recent.length === 0 ? 'Start by adding a check-in' :
    recent.length < 2   ? '2+ needed for trend' :
    lowerDays === 0     ? 'Great week!' :
    `${lowerDays} lower day${lowerDays !== 1 ? 's' : ''} this week`;

  const summaryColor =
    recent.length < 2 ? colors.textMuted :
    lowerDays === 0   ? colors.success :
    goodDays >= lowerDays ? colors.success :
    colors.warning;

  const dayLabels = recent.length > 0
    ? recent.map((log) => {
        const d = new Date(log.date);
        return (['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] as const)[d.getDay()] ?? '';
      })
    : DAY_LABELS;

  return (
    <Card style={style}>
      <View style={styles.head}>
        <AppText variant="sectionTitle" color={colors.textPrimary}>
          7-Day Trend
        </AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          {recent.length > 0
            ? `${recent.length} check-in${recent.length !== 1 ? 's' : ''}`
            : 'No data'}
        </AppText>
      </View>

      <View style={styles.body}>
        {/* ─── Chart area ─── */}
        <View style={styles.chartWrapper}>
          {points ? (
            <Svg
              width="100%"
              height={CHART_H}
              viewBox={`0 0 ${CHART_W} ${CHART_H}`}
              preserveAspectRatio="none"
              accessibilityLabel="Weekly wellbeing trend line"
              accessibilityRole="image"
            >
              <Defs>
                <LinearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
                  <Stop offset="0%"   stopColor={colors.trendAreaStart} stopOpacity={0.35} />
                  <Stop offset="100%" stopColor={colors.trendAreaStart} stopOpacity={0.02} />
                </LinearGradient>
              </Defs>
              <Path d={areaPath} fill="url(#trendFill)" />
              <Polyline
                points={polylineStr}
                fill="none"
                stroke={colors.trendLine}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map((p, i) => (
                <Circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={5}
                  fill={p.score >= 5 ? colors.trendLine : colors.trendDotLow}
                />
              ))}
            </Svg>
          ) : (
            <View style={styles.emptyChart}>
              <AppText variant="bodyMd" color={colors.textMuted}>
                {recent.length === 0
                  ? 'No check-ins yet. Add one to see a trend.'
                  : 'Add one more check-in to see the line.'}
              </AppText>
            </View>
          )}

          <View style={styles.labels}>
            {dayLabels.map((label, i) => (
              <AppText key={i} variant="caption" color={colors.textMuted}>
                {label}
              </AppText>
            ))}
          </View>
        </View>

        {/* ─── Summary panel — always rendered ─── */}
        <View
          style={[styles.summary, { backgroundColor: colors.trendLineFill, borderRadius: 12 }]}
          accessibilityLabel={`Trend summary: ${summaryTitle.replace('\n', ' ')}. ${summarySub}`}
        >
          <AppText
            variant="captionBold"
            color={summaryColor}
            style={styles.summaryTitle}
          >
            {summaryTitle}
          </AppText>
          <AppText
            variant="caption"
            color={colors.textSecondary}
            style={styles.summarySub}
          >
            {summarySub}
          </AppText>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 14,
    marginTop: 6,
  },
  chartWrapper: {
    flex: 1,
    minWidth: 0,
  },
  emptyChart: {
    height: CHART_H,
    justifyContent: 'center',
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  summary: {
    width: 92,
    flexShrink: 0,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignSelf: 'center',
    alignItems: 'center',
  },
  summaryTitle: {
    textAlign: 'center',
    lineHeight: 17,
    fontWeight: '700',
  },
  summarySub: {
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 14,
  },
});
