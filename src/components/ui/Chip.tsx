import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/useTheme';

type ChipVariant = 'default' | 'success' | 'warning';

interface ChipProps {
  label: string;
  icon?: React.ReactNode;
  variant?: ChipVariant;
  style?: StyleProp<ViewStyle>;
}

/**
 * Pill badge with optional leading icon. Used for labels like "Primary carer".
 * @example <Chip icon={<Icon name="people" size={14} color={chipIconColor} />} label="Primary carer" />
 */
export function Chip({ label, icon, variant = 'default', style }: ChipProps) {
  const { colors, radii, typography } = useTheme();

  const bgColor =
    variant === 'success'
      ? colors.successBg
      : variant === 'warning'
        ? colors.yellowBg
        : colors.chipBg;

  const textColor =
    variant === 'success'
      ? colors.success
      : variant === 'warning'
        ? colors.warning
        : colors.chipIcon;

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: bgColor, borderRadius: radii.pill },
        style,
      ]}
    >
      {icon ? <View style={styles.iconSlot}>{icon}</View> : null}
      <Text style={[typography.chipText, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  iconSlot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
