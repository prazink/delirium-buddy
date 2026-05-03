import React from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';

import { useTheme } from '../../theme/useTheme';

type TextVariant = 'h1' | 'h2' | 'sectionTitle' | 'ctaTitle' | 'body' | 'bodyMd' | 'label' | 'caption' | 'captionBold' | 'chipText';

interface AppTextProps {
  variant?: TextVariant;
  color?: string;
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  accessibilityRole?: 'header' | 'text' | 'none';
}

/**
 * Typography-scale wrapper that pulls font specs from the theme.
 * Respects Dynamic Type / font scaling — never uses allowFontScaling={false}.
 * @example <AppText variant="h1">Delirium Buddy</AppText>
 */
export function AppText({
  variant = 'body',
  color,
  children,
  style,
  numberOfLines,
  accessibilityRole,
}: AppTextProps) {
  const { colors, typography } = useTheme();

  const defaultColor =
    variant === 'h1' || variant === 'h2' || variant === 'sectionTitle' || variant === 'ctaTitle'
      ? colors.textPrimary
      : variant === 'caption' || variant === 'captionBold'
        ? colors.textMuted
        : colors.textSecondary;

  return (
    <Text
      style={[typography[variant], { color: color ?? defaultColor }, style]}
      numberOfLines={numberOfLines}
      accessibilityRole={accessibilityRole}
    >
      {children}
    </Text>
  );
}
