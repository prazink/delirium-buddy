import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/useTheme';
import { AppText } from '../ui/AppText';
import { Card } from '../ui/Card';
import { Icon, type IconName } from '../ui/Icon';

type QuickActionHref = '/profile' | '/history' | '/summary' | '/settings' | '/about';

interface QuickAction {
  href: QuickActionHref;
  icon: IconName;
  label: string;
  iconColor: string;
}

interface QuickActionsProps {
  style?: StyleProp<ViewStyle>;
}

/**
 * 5-item row of tappable action tiles: icon centred above label text.
 * Uses router.push (not Link asChild) so flex: 1 is never broken by a wrapper.
 * @example <QuickActions />
 */
export function QuickActions({ style }: QuickActionsProps) {
  const { colors } = useTheme();
  const router = useRouter();

  const actions: QuickAction[] = [
    { href: '/profile',  icon: 'person',    label: 'Profile',        iconColor: colors.primary },
    { href: '/history',  icon: 'history',   label: 'History',        iconColor: colors.primaryStrong },
    { href: '/summary',  icon: 'bar-chart', label: '7-day\nSummary', iconColor: colors.success },
    { href: '/settings', icon: 'settings',  label: 'Settings',       iconColor: colors.warning },
    { href: '/about',    icon: 'info',       label: 'About',          iconColor: colors.primaryStrong },
  ];

  return (
    <Card style={style}>
      <AppText variant="sectionTitle" color={colors.textPrimary} style={styles.title}>
        Quick Actions
      </AppText>

      <View style={styles.grid}>
        {actions.map((action) => (
          <Pressable
            key={action.href}
            onPress={() => router.push(action.href)}
            accessibilityRole="button"
            accessibilityLabel={action.label.replace('\n', ' ')}
            style={({ pressed }) => [
              styles.item,
              {
                backgroundColor: pressed ? colors.actionBg : colors.surface,
                borderColor: colors.quickBorder,
              },
            ]}
          >
            <Icon name={action.icon} size={22} color={action.iconColor} />
            <AppText
              variant="captionBold"
              color={colors.textPrimary}
              style={styles.label}
            >
              {action.label}
            </AppText>
          </Pressable>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    gap: 8,
  },
  item: {
    flex: 1,
    minHeight: 78,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  label: {
    textAlign: 'center',
    lineHeight: 15,
  },
});
