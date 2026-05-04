import React, { useState } from 'react';
import { Image, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import type { PersonGender } from '../../domain/logs/log.types';
import { useTheme } from '../../theme/useTheme';

interface AvatarProps {
  source?: string | null;
  size?: number;
  fallback: string;
  gender?: PersonGender | null;
  style?: StyleProp<ViewStyle>;
}

/**
 * Circular avatar that shows an image when available, falling back to a default person avatar or initials.
 * @example <Avatar source={profile.avatarUri} size={64} fallback="MS" gender={profile.gender} />
 */
export function Avatar({ source, size = 48, fallback, gender = 'not_specified', style }: AvatarProps) {
  const { colors } = useTheme();
  const [errored, setErrored] = useState(false);

  const showImage = source && !errored;
  const showDefaultPerson = gender === 'male' || gender === 'female' || gender === 'not_specified';

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.chipBg,
        },
        style,
      ]}
    >
      {showImage ? (
        <Image
          source={{ uri: source }}
          style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
          onError={() => setErrored(true)}
          accessibilityIgnoresInvertColors
        />
      ) : showDefaultPerson ? (
        <DefaultPersonAvatar size={size} gender={gender ?? 'not_specified'} />
      ) : (
        <Text
          style={[
            styles.initials,
            { fontSize: size * 0.33, color: colors.chipIcon },
          ]}
          accessibilityLabel={`Avatar for ${fallback}`}
        >
          {fallback.slice(0, 2).toUpperCase()}
        </Text>
      )}
    </View>
  );
}

type DefaultPersonAvatarProps = {
  size: number;
  gender: PersonGender;
};

function DefaultPersonAvatar({ size, gender }: DefaultPersonAvatarProps) {
  const isFemale = gender === 'female';
  const isMale = gender === 'male';
  const skin = '#F2C9A0';
  const hair = isFemale ? '#4B3428' : isMale ? '#2F3A4A' : '#64748B';
  const shirt = isFemale ? '#8B7CF6' : isMale ? '#4D6CF0' : '#94A3B8';

  return (
    <Svg width={size} height={size} viewBox="0 0 96 96" accessibilityRole="image" accessibilityLabel="Default profile avatar">
      <Circle cx="48" cy="48" r="48" fill="#EEF2FF" />
      {isFemale ? (
        <Path d="M27 45c0-16 8-27 21-27s21 11 21 27c0 13-8 22-21 22s-21-9-21-22z" fill={hair} opacity={0.96} />
      ) : (
        <Path d="M28 38c2-13 11-21 24-19 10 2 16 9 16 20v7H28v-8z" fill={hair} opacity={0.96} />
      )}
      <Circle cx="48" cy="43" r="18" fill={skin} />
      <Path d="M29 86c3-17 11-27 19-27s16 10 19 27H29z" fill={shirt} />
      <Path d="M39 48c5 5 13 5 18 0" stroke="#8A5F3E" strokeWidth="3" strokeLinecap="round" fill="none" opacity={0.55} />
      <Circle cx="41" cy="39" r="2.3" fill="#334155" />
      <Circle cx="55" cy="39" r="2.3" fill="#334155" />
      {isFemale ? <Path d="M30 38c7-12 21-17 36-5-5-12-15-17-25-14-8 2-13 8-11 19z" fill={hair} /> : null}
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    fontWeight: '700',
  },
});
