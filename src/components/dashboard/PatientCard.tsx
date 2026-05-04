import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { PersonProfile } from '../../domain/logs/log.types';
import { useTheme } from '../../theme/useTheme';
import { AppText } from '../ui/AppText';
import { Avatar } from '../ui/Avatar';
import { Card } from '../ui/Card';
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
 * Displays the current patient profile with avatar, name, meta, care role and relationship.
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

  const roleLabel = profile.careRole?.trim() || 'Primary carer';
  const relationshipLabel = profile.relationship?.trim() || 'Not specified';

  return (
    <Card {...(onPress ? { onPress } : {})} style={style} accessibilityLabel={`Patient: ${profile.displayName}`}>
      <View style={styles.row}>
        <Avatar
          source={profile.avatarUri ?? null}
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

          <View style={[styles.detailPanel, { backgroundColor: colors.chipBg }]}>
            <View style={styles.detailIcon}>
              <Icon name="people" size={16} color={colors.chipIcon} />
            </View>
            <View style={styles.detailCopy}>
              <AppText variant="label" color={colors.textPrimary} style={styles.detailLine}>
                <AppText variant="label" color={colors.textSecondary} style={styles.detailLabel}>Role: </AppText>
                {roleLabel}
              </AppText>
              <AppText variant="label" color={colors.textPrimary} style={styles.detailLine}>
                <AppText variant="label" color={colors.textSecondary} style={styles.detailLabel}>Relationship: </AppText>
                {relationshipLabel}
              </AppText>
            </View>
          </View>
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
    fontSize: 19,
    fontWeight: '700',
    lineHeight: 23,
    marginBottom: 2,
  },
  meta: {
    fontSize: 14,
    lineHeight: 19,
    marginBottom: 9,
  },
  detailPanel: {
    alignSelf: 'flex-start',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  detailIcon: {
    paddingTop: 1,
  },
  detailCopy: {
    gap: 2,
  },
  detailLine: {
    fontWeight: '600',
  },
  detailLabel: {
    fontWeight: '500',
  },
});
