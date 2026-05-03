import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { RiskState } from '../../domain/risk/calculateRisk';
import { useTheme } from '../../theme/useTheme';
import { AppText } from '../ui/AppText';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';

interface RiskSummaryProps {
  risk: RiskState;
  onViewDetails?: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Short hint copy — one line that fits next to the shield icon. */
function shortHint(risk: RiskState): string {
  if (risk.level === 'No data') return 'Add a check-in to get insights.';
  if (risk.level === 'Low')      return 'Keep up the great care.';
  if (risk.level === 'Moderate') return 'Monitor closely today.';
  return 'Consider contacting care staff.';
}

/**
 * Today's risk level: coloured shield, one-line status, and a "View details" action.
 * @example <RiskSummary risk={riskState} onViewDetails={() => router.push('/history')} />
 */
export function RiskSummary({ risk, onViewDetails, style }: RiskSummaryProps) {
  const { colors, radii } = useTheme();

  const statusColor =
    risk.level === 'Low'      ? colors.success :
    risk.level === 'Moderate' ? colors.warning :
    risk.level === 'No data'  ? colors.textMuted :
    '#dc2626';

  const statusLabel =
    risk.level === 'No data' ? 'No data yet' : `${risk.level} today`;

  return (
    <Card style={style}>
      <AppText variant="sectionTitle" color={colors.textPrimary} style={styles.title}>
        Risk / Support Summary
      </AppText>

      <View style={styles.row}>
        {/* Shield + status block */}
        <View style={styles.main}>
          <View
            style={[styles.shieldBox, { backgroundColor: statusColor, borderRadius: radii.badge }]}
            accessibilityElementsHidden
          >
            <Icon name="shield-check" size={22} color="#fff" />
          </View>

          <View style={styles.statusText}>
            <AppText variant="ctaTitle" color={statusColor}>
              {statusLabel}
            </AppText>
            <AppText variant="label" color={colors.textSecondary}>
              {shortHint(risk)}
            </AppText>
          </View>
        </View>

        {/* Vertical divider */}
        <View style={[styles.divider, { backgroundColor: colors.divider }]} accessibilityElementsHidden />

        {/* View details */}
        {onViewDetails && (
          <Pressable
            onPress={onViewDetails}
            accessibilityRole="button"
            accessibilityLabel="View risk details"
            style={({ pressed }) => [
              styles.actionBtn,
              { backgroundColor: colors.actionBg, borderRadius: radii.badge },
              pressed && styles.pressed,
            ]}
          >
            <AppText variant="label" color={colors.textPrimary} style={styles.actionLabel}>
              View details
            </AppText>
            <Icon name="chevron-right" size={16} color={colors.textChevron} />
          </Pressable>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 0,
  },
  shieldBox: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statusText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  divider: {
    width: 1,
    height: 40,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 44,
  },
  actionLabel: {
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.75,
  },
});
