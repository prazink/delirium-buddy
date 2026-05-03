import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { PersonProfile } from '../../domain/logs/log.types';
import { useTheme } from '../../theme/useTheme';
import { AppText } from '../ui/AppText';
import { Avatar } from '../ui/Avatar';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Icon } from '../ui/Icon';

interface PatientCardProps {
  profile: PersonProfile;
  lastCheckInLabel?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Appends "years old" when ageRange is a bare number string (e.g. "87" → "87 years old"). */
function formatAge(raw?: string): string | null {
  if (!raw) return null;
  const t = raw.trim();
  return /^\d+$/.test(t) ? `${t} years old` : t;
}

/**
 * Displays the current patient profile with avatar, name, meta, and carer chip.
 * @example <PatientCard profile={profile} lastCheckInLabel="Today, 9:20 am" onPress={...} />
 */
export function PatientCard({
  profile,
  lastCheckInLabel,
  onPress,
  style,
}: PatientCardProps) {
  const { colors } = useTheme();

  const metaParts = [
    formatAge(profile.ageRange),
    lastCheckInLabel ?? null,
  ].filter(Boolean);

  const initials = profile.displayName
    .split(' ')
    .map((w) => w[0] ?? '')
    .join('')
    .slice(0, 2);

  return (
    <Card {...(onPress ? { onPress } : {})} style={style} accessibilityLabel={`Patient: ${profile.displayName}`}>
      <View style={styles.row}>
        <Avatar
          source={null}
          size={64}
          fallback={initials}
        />

        <View style={styles.body}>
          <AppText variant="h2" color={colors.textPrimary} style={styles.name}>
            {profile.displayName}
          </AppText>
          {metaParts.length > 0 && (
            <AppText variant="bodyMd" color={colors.textSecondary} style={styles.meta}>
              {metaParts.join('  ·  ')}
            </AppText>
          )}
          <Chip
            icon={<Icon name="people" size={14} color={colors.chipIcon} />}
            label={`You're the ${profile.relationship ?? 'primary carer'}`}
            style={styles.chip}
          />
        </View>

        <View accessibilityElementsHidden>
          <Icon name="chevron-right" size={22} color={colors.textChevron} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    marginBottom: 2,
  },
  meta: {
    marginBottom: 8,
  },
  chip: {
    marginTop: 0,
  },
});
