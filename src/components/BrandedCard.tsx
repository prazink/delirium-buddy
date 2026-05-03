import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius, shadows, spacing } from '../theme/tokens';

type BrandedCardProps = {
  children: ReactNode;
  tone?: 'default' | 'soft' | 'care' | 'danger';
};

export function BrandedCard({ children, tone = 'default' }: BrandedCardProps) {
  return <View style={[styles.card, styles[tone]]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
    padding: spacing.md,
    ...shadows.soft,
  },
  default: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  soft: {
    backgroundColor: colors.backgroundSoft,
    borderColor: '#BFDBFE',
  },
  care: {
    backgroundColor: colors.surface,
    borderColor: '#BAE6FD',
  },
  danger: {
    backgroundColor: colors.surface,
    borderColor: '#FECACA',
  },
});
