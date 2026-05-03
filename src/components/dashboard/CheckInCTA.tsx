import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/useTheme';
import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';

interface CheckInCTAProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Primary gradient-blue CTA button for starting a new check-in.
 * Note: uses solid blue600 — add expo-linear-gradient for exact CSS gradient parity.
 * @example <CheckInCTA onPress={() => router.push('/log')} />
 */
export function CheckInCTA({ onPress, style }: CheckInCTAProps) {
  const { colors, radii, shadows } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Add a new check-in"
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.primary,
          borderRadius: radii.lg,
          ...shadows.cta,
        },
        pressed && styles.pressed,
        style,
      ]}
    >
      {/* White circle with + icon */}
      <View
        style={[styles.iconCircle, { backgroundColor: colors.onPrimary }]}
        accessibilityElementsHidden
      >
        <Icon name="plus" size={24} color={colors.primaryStrong} />
      </View>

      <View style={styles.textBlock}>
        <AppText variant="ctaTitle" color={colors.onPrimary}>
          Add check-in
        </AppText>
        <AppText variant="bodyMd" color={colors.onPrimary} style={styles.caption}>
          Capture how things are going right now.
        </AppText>
      </View>

      <View accessibilityElementsHidden>
        <Icon name="chevron-right" size={22} color={colors.onPrimary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 18,
    paddingVertical: 18,
    paddingHorizontal: 18,
  },
  pressed: {
    opacity: 0.92,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
  },
  caption: {
    marginTop: 4,
    opacity: 0.92,
  },
});
