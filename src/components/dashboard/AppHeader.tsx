import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { useTheme } from '../../theme/useTheme';
import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';

interface AppHeaderProps {
  style?: StyleProp<ViewStyle>;
}

/**
 * Dashboard header: heart-leaf logo, app name, tagline, decorative sunrise art.
 * The art sits in the row's right column (not absolute) so it never gets clipped.
 * @example <AppHeader />
 */
export function AppHeader({ style }: AppHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        {/* ─── Left: logo + text ─── */}
        <View style={styles.left}>
          <View style={styles.logoRow}>
            <View accessibilityElementsHidden style={styles.logoSlot}>
              <Icon name="heart-leaf" size={44} />
            </View>
            <View style={styles.textBlock}>
              <AppText variant="h1" color={colors.textPrimary} style={styles.title}>
                Delirium Buddy
              </AppText>
              <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
                {"You're making a real difference.\nSmall moments, better days."}
              </AppText>
            </View>
          </View>
        </View>

        {/* ─── Right: decorative sunrise art ─── */}
        <View
          style={styles.artColumn}
          accessibilityElementsHidden
          pointerEvents="none"
        >
          <Svg width={150} height={110} viewBox="0 0 150 110" fill="none">
            <Circle cx={118} cy={42} r={14} fill="#ffd166" />
            <Circle cx={118} cy={42} r={20} fill="#ffd166" opacity={0.25} />
            <Path d="M0 80 Q35 55 70 70 T150 60 L150 110 L0 110 Z" fill="#dbe6fb" />
            <Path d="M0 95 Q40 78 80 88 T150 80 L150 110 L0 110 Z" fill="#c5d6f4" opacity={0.8} />
            <Path d="M132 78 q4 -10 0 -20 q-4 10 0 20 z" fill="#9fb8e6" opacity={0.7} />
            <Path d="M138 82 q3 -7 0 -14 q-3 7 0 14 z" fill="#9fb8e6" opacity={0.6} />
          </Svg>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  left: {
    flex: 1,
    minWidth: 0,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  logoSlot: {
    width: 44,
    height: 44,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
    paddingTop: 2,
  },
  title: {
    marginBottom: 6,
  },
  subtitle: {
    lineHeight: 22,
  },
  artColumn: {
    width: 150,        // exactly matches the SVG viewport width
    flexShrink: 0,
    alignSelf: 'flex-start',
    marginRight: -10,  // hang 10 px off the right edge, matching CSS right: -10px
    overflow: 'visible', // Android defaults to 'hidden'; must be explicit here
  },
});
