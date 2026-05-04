import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { palette } from '../../theme/tokens';
import { AppText } from '../ui/AppText';
import { Icon, type IconName } from '../ui/Icon';

const navItems: Array<{ label: string; icon: IconName; href: '/' | '/history' | '/summary' | '/settings'; active?: boolean; hint: string }> = [
  { label: 'Home', icon: 'home', href: '/', active: true, hint: 'Shows the dashboard overview.' },
  { label: 'Check-ins', icon: 'clipboard', href: '/history', hint: 'Opens check-in history.' },
  { label: 'Handover', icon: 'people', href: '/summary', hint: 'Opens the seven day handover summary.' },
  { label: 'More', icon: 'more-horizontal', href: '/settings', hint: 'Opens settings and local data controls.' },
];

export function DashboardBottomNav() {
  const router = useRouter();

  return (
    <View accessibilityRole="tablist" style={styles.wrap}>
      {navItems.map((item) => (
        <Pressable
          key={item.label}
          accessibilityRole="tab"
          accessibilityLabel={item.active ? `${item.label}, selected` : item.label}
          accessibilityHint={item.hint}
          accessibilityState={{ selected: Boolean(item.active) }}
          onPress={() => router.push(item.href)}
          style={({ pressed }) => [styles.item, item.active && styles.itemActive, pressed && styles.pressed]}
        >
          <Icon name={item.icon} size={26} color={item.active ? palette.navy900 : '#64748b'} />
          <AppText
            variant="captionBold"
            color={item.active ? palette.navy900 : '#64748b'}
            style={styles.label}
          >
            {item.label}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#e4e9f0',
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'space-between',
    marginTop: 18,
    padding: 8,
    shadowColor: palette.navy900,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  item: {
    alignItems: 'center',
    borderRadius: 18,
    flex: 1,
    gap: 4,
    minHeight: 64,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  itemActive: {
    backgroundColor: '#eef3f8',
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.75,
  },
});
