import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { loadReminderSettings, type ReminderSettings } from '../../storage/localReminderRepository';
import { palette } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';
import { AppText } from '../ui/AppText';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';

interface DashboardReminderCardProps {
  style?: StyleProp<ViewStyle>;
}

export function DashboardReminderCard({ style }: DashboardReminderCardProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const [settings, setSettings] = useState<ReminderSettings | null>(null);

  useFocusEffect(
    useCallback(() => {
      void loadReminderSettings().then(setSettings);
    }, []),
  );

  const enabled = Boolean(settings?.enabled);
  const timeLabel = formatTime(settings?.hour ?? 18, settings?.minute ?? 0);

  return (
    <Card style={[styles.card, style]}>
      <AppText variant="sectionTitle" color={colors.textPrimary} style={styles.title}>
        Daily reminder
      </AppText>

      <View style={styles.bodyRow}>
        <View style={styles.iconBubble} accessibilityElementsHidden>
          <Icon name="bell" size={24} color={palette.navy900} />
        </View>
        <View style={styles.copy}>
          <AppText variant="bodyMd" color="#486385">
            {enabled ? 'Your daily reminder is set for' : 'No daily reminder is set yet'}
          </AppText>
          <AppText variant="h1" color={palette.navy900} style={styles.time}>
            {enabled ? timeLabel : 'Off'}
          </AppText>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Edit daily reminder"
        onPress={() => router.push('/settings')}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <AppText variant="bodyMd" color={palette.navy900} style={styles.buttonText}>
          Edit reminder
        </AppText>
      </Pressable>
    </Card>
  );
}

function formatTime(hour: number, minute: number): string {
  const hour12 = hour % 12 || 12;
  const suffix = hour >= 12 ? 'PM' : 'AM';
  return `${hour12}:${String(minute).padStart(2, '0')} ${suffix}`;
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontWeight: '900',
    marginBottom: 14,
  },
  bodyRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  iconBubble: {
    alignItems: 'center',
    backgroundColor: '#eef3f8',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  time: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.8,
    lineHeight: 36,
    marginTop: 4,
  },
  button: {
    alignItems: 'center',
    borderColor: palette.navy900,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 11,
  },
  buttonText: {
    fontWeight: '900',
  },
  pressed: {
    backgroundColor: '#eef3f8',
  },
});
