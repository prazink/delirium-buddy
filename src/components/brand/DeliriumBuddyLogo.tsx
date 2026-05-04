import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { palette } from '../../theme/tokens';
import { AppText } from '../ui/AppText';

type LogoSize = 'sm' | 'md' | 'lg';

interface DeliriumBuddyLogoProps {
  size?: LogoSize;
  showWordmark?: boolean;
  centered?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

const sizeMap = {
  sm: 38,
  md: 58,
  lg: 88,
} as const;

/**
 * Premium Delirium Buddy mark: calm cognitive tracking, observation and handover support.
 * The mark intentionally avoids medical/emergency symbolism and replaces the old heart icon.
 */
export function DeliriumBuddyLogo({
  size = 'md',
  showWordmark = true,
  centered = false,
  accessibilityLabel = 'Delirium Buddy app logo',
  style,
}: DeliriumBuddyLogoProps) {
  const markSize = sizeMap[size];

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={[styles.wrap, centered && styles.centered, style]}
    >
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <LogoMark size={markSize} />
      </View>
      {showWordmark ? (
        <View style={styles.wordmark} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <AppText
            variant={size === 'lg' ? 'h1' : 'h2'}
            color={palette.navy900}
            style={[styles.wordmarkText, size === 'lg' && styles.wordmarkLarge]}
          >
            Delirium <AppText variant={size === 'lg' ? 'h1' : 'h2'} color="#486385">Buddy</AppText>
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

function LogoMark({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 96 96" fill="none">
      <Circle cx="48" cy="48" r="36" stroke="#486385" strokeWidth="4" opacity="0.9" />
      <Path
        d="M18 54c4 18 19 30 39 27-11-5-18-12-22-22-5-1-11-2-17-5z"
        fill="#486385"
        opacity="0.9"
      />
      <Path
        d="M29 43c0-12 10-22 25-22 15 0 25 9 25 23 0 9-5 17-13 21-4 2-7 5-9 9-9-2-16-6-21-13-6-1-11-4-13-8 7 1 13 1 18 0-8-2-12-5-12-10z"
        stroke={palette.navy900}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 42c-2-8 1-17 7-24"
        stroke={palette.navy900}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <Circle cx="21" cy="21" r="5" fill={palette.navy900} />
      <Rect x="55" y="42" width="4" height="18" rx="2" fill="#486385" />
      <Rect x="64" y="35" width="4" height="28" rx="2" fill="#486385" />
      <Rect x="73" y="45" width="4" height="14" rx="2" fill="#486385" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  centered: {
    justifyContent: 'center',
  },
  wordmark: {
    minWidth: 0,
  },
  wordmarkText: {
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  wordmarkLarge: {
    fontSize: 30,
    lineHeight: 36,
  },
});
