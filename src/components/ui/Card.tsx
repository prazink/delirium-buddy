import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/useTheme';

interface CardProps {
  children: React.ReactNode;
  onPress?: (() => void) | undefined;
  style?: StyleProp<ViewStyle> | undefined;
  accessibilityLabel?: string | undefined;
}

/**
 * White rounded card container with optional tap handling.
 * @example <Card onPress={handlePress}><Text>Content</Text></Card>
 */
export function Card({ children, onPress, style, accessibilityLabel }: CardProps) {
  const { colors, radii, shadows } = useTheme();

  const cardStyle = [
    styles.base,
    {
      backgroundColor: colors.surface,
      borderRadius: radii.lg,
      ...shadows.card,
    },
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [cardStyle, pressed && styles.pressed]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    padding: 18,
    marginTop: 14,
  },
  pressed: {
    opacity: 0.93,
  },
});
