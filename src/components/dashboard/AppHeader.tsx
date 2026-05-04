import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { palette } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';
import { DeliriumBuddyLogo } from '../brand/DeliriumBuddyLogo';
import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';

interface AppHeaderProps {
  userName?: string | undefined;
  style?: StyleProp<ViewStyle>;
}

/**
 * Premium dashboard header using the Delirium Buddy brand mark and greeting.
 */
export function AppHeader({ userName, style }: AppHeaderProps) {
  const { colors } = useTheme();
  const greetingName = userName?.trim() || 'there';

  return (
    <View style={[styles.container, style]}>
      <DeliriumBuddyLogo size="sm" centered style={styles.logo} />

      <View style={styles.greetingRow}>
        <View style={styles.greetingCopy}>
          <AppText variant="h1" color={colors.textPrimary} style={styles.greeting}>
            Good afternoon,{`\n${greetingName}`}
          </AppText>
          <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
            Here’s what’s happening today.
          </AppText>
        </View>

        <View style={styles.profileCircle} accessibilityElementsHidden>
          <Icon name="person" size={26} color={palette.navy900} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 22,
    paddingBottom: 8,
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  greetingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'space-between',
  },
  greetingCopy: {
    flex: 1,
    minWidth: 0,
  },
  greeting: {
    fontSize: 31,
    fontWeight: '900',
    letterSpacing: -0.8,
    lineHeight: 36,
  },
  subtitle: {
    color: '#486385',
    fontSize: 16,
    lineHeight: 23,
    marginTop: 10,
  },
  profileCircle: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#d7dee8',
    borderRadius: 34,
    borderWidth: 1,
    height: 68,
    justifyContent: 'center',
    shadowColor: palette.navy900,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    width: 68,
  },
});
