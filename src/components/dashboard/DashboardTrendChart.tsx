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

type DailyTrendPoint = {
  date: string;
  score: number;
  count: number;
};

const CHART_W = 320;
const CHART_H = 110;
const PAD_X = 14;
const PAD_Y = 12;
const INNER_W = CHART_W - PAD_X * 2;
const INNER_H = CHART_H - PAD_Y * 2;
const MIN_SCORE = 0;
const MAX_SCORE = 10;

const EMPTY_DAY_LABELS = ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'];
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

/** Composite wellbeing: 0 = worst, 10 = best. */
function wellbeing(log: LogEntry): number {
  const agPenalty = (log.agitation / 10) * 3.5;
  const confPenalty = (log.confusion / 10) * 3.5;
  const sleepBonus = (Math.min(log.sleepHours, 10) / 10) * 3;
  return Math.max(MIN_SCORE, Math.min(MAX_SCORE, 10 - agPenalty - confPenalty + sleepBonus - 3));
}

function parseLocalDate(date: string): Date {
  return new Date(`${date}T12:00:00`);
}

function formatDayLabel(date: string): string {
  return WEEKDAY_LABELS[parseLocalDate(date).getDay()] ?? '';
}

function formatDateRange(points: DailyTrendPoint[]): string {
  if (points.length === 0) return 'No data';

  const first = parseLocalDate(points[0]!.date);
  const last = parseLocalDate(points[points.length - 1]!.date);
  const firstLabel = `${MONTH_LABELS[first.getMonth()]} ${first.getDate()}`;
  const lastLabel = `${MONTH_LABELS[last.getMonth()]} ${last.getDate()}`;

  return firstLabel === lastLabel ? firstLabel : `${firstLabel} - ${lastLabel}`;
}

function getDailyTrendPoints(logs: LogEntry[]): DailyTrendPoint[] {
  const byDate = new Map<string, { lowestScore: number; count: number }>();

  logs.forEach((log) => {
    const score = wellbeing(log);
    const existing = byDate.get(log.date) ?? { lowestScore: MAX_SCORE, count: 0 };
    byDate.set(log.date, {
      lowestScore: Math.min(existing.lowestScore, score),
      count: existing.count + 1,
    });
  });

  return Array.from(byDate.entries())
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .slice(-7)
    .map(([date, value]) => ({
      date,
      score: value.lowestScore,
      count: value.count,
    }));
}

/**
 * 7-day SVG trend line chart + right-side summary panel.
 * Multiple check-ins on the same date become one daily point using the highest concern recorded that day.
 * @example <DashboardTrendChart logs={logs} />
 */
export function DashboardTrendChart({ logs, style }: DashboardTrendChartProps) {
  const { colors } = useTheme();
  const dailyPoints = useMemo(() => getDailyTrendPoints(logs), [logs]);

  const points = useMemo(() => {
    if (dailyPoints.length < 2) return null;

    return dailyPoints.map((point, i) => ({
      x: PAD_X + (i / (dailyPoints.length - 1)) * INNER_W,
      y: PAD_Y + (1 - (point.score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * INNER_H,
      score: point.score,
      date: point.date,
    }));
  }, [dailyPoints]);

  const polylineStr = points?.map((p) => `${p.x},${p.y}`).join(' ') ?? '';
  const areaPath = points
    ? `M${points[0]!.x},${points[0]!.y} ` +
      points.slice(1).map((p) => `L${p.x},${p.y}`).join(' ') +
      ` L${points[points.length - 1]!.x},${CHART_H} L${points[0]!.x},${CHART_H} Z`
    : '';

  const goodDays = points?.filter((p) => p.score >= 5).length ?? 0;
  const lowerDays = (points?.length ?? 0) - goodDays;
  const checkInCount = logs.slice(-14).length;
  const rangeLabel = formatDateRange(dailyPoints);

  const summaryTitle =
    dailyPoints.length === 0 ? 'No data\nyet' :
    dailyPoints.length < 2 ? 'Add more\ncheck-ins' :
    lowerDays === 0 ? 'All\ngood' :
    goodDays >= lowerDays ? 'Mostly\ngood' :
    'Some\nchallenges';

  const summarySub =
    dailyPoints.length === 0 ? 'Start by adding a check-in' :
    dailyPoints.length < 2 ? '2+ days needed for trend' :
    lowerDays === 0 ? 'Great week!' :
    `${lowerDays} lower day${lowerDays !== 1 ? 's' : ''} this week`;

  const summaryColor =
    dailyPoints.length < 2 ? colors.textMuted :
    lowerDays === 0 ? colors.success :
    goodDays >= lowerDays ? colors.success :
    colors.warning;

  const dayLabels = dailyPoints.length > 0
    ? dailyPoints.map((point) => formatDayLabel(point.date))
    : EMPTY_DAY_LABELS;

  return (
    <Card style={style}>
      <View style={styles.head}>
        <AppText variant="sectionTitle" color={colors.textPrimary}>
          7-Day Trend
        </AppText>
        <View style={styles.metaBlock}>
          <AppText variant="caption" color={colors.textSecondary} style={styles.rangeLabel}>
            {rangeLabel}
          </AppText>
          <AppText variant="caption" color={colors.textMuted}>
            {checkInCount > 0 ? `${checkInCount} check-in${checkInCount !== 1 ? 's' : ''}` : 'No data'}
          </AppText>
        </View>
      </View>

      <View style={styles.body}>
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
                  <Stop offset="0%" stopColor={colors.trendAreaStart} stopOpacity={0.28} />
                  <Stop offset="100%" stopColor={colors.trendAreaStart} stopOpacity={0.02} />
                </LinearGradient>
              </Defs>
              <Path d={areaPath} fill="url(#trendFill)" />
              <Polyline
                points={polylineStr}
                fill="none"
                stroke={colors.trendLine}
                strokeWidth={2.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map((p) => (
                <Circle
                  key={p.date}
                  cx={p.x}
                  cy={p.y}
                  r={5.5}
                  fill={p.score >= 5 ? colors.trendLine : colors.trendDotLow}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Svg>
          ) : (
            <View style={styles.emptyChart}>
              <AppText variant="bodyMd" color={colors.textMuted}>
                {dailyPoints.length === 0
                  ? 'No check-ins yet. Add one to see a trend.'
                  : 'Add check-ins on another day to see the line.'}
              </AppText>
            </View>
          )}

          <View style={styles.labels}>
            {dayLabels.map((label, i) => (
              <AppText key={`${label}-${i}`} variant="caption" color={colors.textMuted}>
                {label}
              </AppText>
            ))}
          </View>
        </View>

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
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 12,
  },
  metaBlock: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  rangeLabel: {
    marginBottom: 2,
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
