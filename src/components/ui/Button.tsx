import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '../../theme/useTheme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

/**
 * Themed button with primary/secondary/ghost variants and press states.
 * @example <Button label="Save" onPress={handleSave} variant="primary" />
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const { colors, radii, typography } = useTheme();

  const bgColor =
    variant === 'primary'
      ? colors.primary
      : variant === 'secondary'
        ? colors.actionBg
        : 'transparent';

  const textColor =
    variant === 'primary'
      ? colors.onPrimary
      : colors.textPrimary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: disabled || loading }}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: bgColor, borderRadius: radii.badge },
        variant === 'secondary' && { borderWidth: 1, borderColor: colors.divider },
        (pressed || disabled) && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text
          style={[
            typography.label,
            styles.label,
            { color: textColor, fontWeight: '600' },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  label: {
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});
