import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/useTheme';
import { AppText } from '../ui/AppText';
import { Card } from '../ui/Card';
import { Icon, type IconName } from '../ui/Icon';

export type InsightVariant = 'purple' | 'yellow' | 'blue';

export interface InsightTile {
  id: string;
  icon: IconName;
  title: string;
  sub: string;
  variant: InsightVariant;
}

interface InsightsGridProps {
  insights: InsightTile[];
  style?: StyleProp<ViewStyle>;
}

/**
 * 3-column grid of coloured insight tiles (sleep, morning, hydration).
 * Pass an array of up to 3 InsightTile objects; extras are ignored.
 * @example <InsightsGrid insights={mockInsights} />
 */
export function InsightsGrid({ insights, style }: InsightsGridProps) {
  const { colors } = useTheme();

  return (
    <Card style={style}>
      <AppText variant="sectionTitle" color={colors.textPrimary} style={styles.title}>
        Baseline Insights
      </AppText>
      <View style={styles.grid}>
        {insights.slice(0, 3).map((tile) => (
          <InsightTileView key={tile.id} tile={tile} />
        ))}
      </View>
    </Card>
  );
}

function InsightTileView({ tile }: { tile: InsightTile }) {
  const { colors } = useTheme();

  const bgColor =
    tile.variant === 'purple'
      ? colors.purpleBg
      : tile.variant === 'yellow'
        ? colors.yellowBg
        : colors.blueBg;

  const titleColor =
    tile.variant === 'purple'
      ? colors.purpleTitle
      : tile.variant === 'yellow'
        ? colors.yellowTitle
        : colors.blueTitle;

  const iconColor =
    tile.variant === 'purple'
      ? colors.purple
      : tile.variant === 'yellow'
        ? colors.warning
        : colors.blueTitle;

  return (
    <View style={[styles.tile, { backgroundColor: bgColor, borderRadius: 14 }]}>
      <View style={styles.tileIcon} accessibilityElementsHidden>
        <Icon name={tile.icon} size={22} color={iconColor} />
      </View>
      <View style={styles.tileText}>
        <AppText variant="captionBold" color={titleColor}>
          {tile.title}
        </AppText>
        <AppText variant="caption" color={colors.textSecondary} style={styles.tileSub}>
          {tile.sub}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    gap: 10,
  },
  tile: {
    flex: 1,
    padding: 12,
    paddingBottom: 14,
    flexDirection: 'column',
    gap: 4,
  },
  tileIcon: {
    marginTop: 2,
    marginBottom: 4,
  },
  tileText: {
    flex: 1,
  },
  tileSub: {
    marginTop: 4,
  },
});
