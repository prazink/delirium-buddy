import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { palette } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';
import { AppText } from '../ui/AppText';
import { Card } from '../ui/Card';
import { Icon, type IconName } from '../ui/Icon';

type QuickActionHref = '/profile' | '/history' | '/summary' | '/settings' | '/about';

interface QuickAction {
  href: QuickActionHref;
  icon: IconName;
  label: string;
}

interface QuickActionsProps {
  style?: StyleProp<ViewStyle>;
}

export function QuickActions({ style }: QuickActionsProps) {
  const { colors } = useTheme();
  const router = useRouter();

  const actions: QuickAction[] = [
    { href: '/profile', icon: 'person', label: 'Profile' },
    { href: '/history', icon: 'history', label: 'History' },
    { href: '/summary', icon: 'bar-chart', label: 'Handover summary' },
    { href: '/settings', icon: 'settings', label: 'Settings' },
    { href: '/about', icon: 'info', label: 'About' },
  ];

  return (
    <Card style={[styles.card, style]}>
      <AppText variant="sectionTitle" color={colors.textPrimary} style={styles.title}>
        Quick actions
      </AppText>

      <View style={styles.list}>
        {actions.map((action, index) => (
          <Pressable
            key={action.href}
            onPress={() => router.push(action.href)}
            accessibilityRole="button"
            accessibilityLabel={action.label}
            style={({ pressed }) => [
              styles.item,
              index < actions.length - 1 && styles.itemBorder,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.iconBubble} accessibilityElementsHidden>
              <Icon name={action.icon} size={20} color={palette.navy900} />
            </View>
            <AppText variant="bodyMd" color={palette.navy900} style={styles.label}>
              {action.label}
            </AppText>
            <Icon name="chevron-right" size={18} color="#7890aa" />
          </Pressable>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontWeight: '900',
    marginBottom: 10,
  },
  list: {
    gap: 0,
  },
  item: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    minHeight: 46,
    paddingVertical: 7,
  },
  itemBorder: {
    borderBottomColor: '#eef2f6',
    borderBottomWidth: 1,
  },
  iconBubble: {
    alignItems: 'center',
    backgroundColor: '#eef3f8',
    borderRadius: 14,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  label: {
    flex: 1,
    fontWeight: '700',
  },
  pressed: {
    backgroundColor: '#f4f7fb',
  },
});
