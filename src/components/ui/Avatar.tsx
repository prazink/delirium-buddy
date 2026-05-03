import React, { useState } from 'react';
import { Image, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/useTheme';

interface AvatarProps {
  source?: string | null;
  size?: number;
  fallback: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Circular avatar that shows an image when available, falling back to initials.
 * @example <Avatar source={profile.photoUri} size={64} fallback="MS" />
 */
export function Avatar({ source, size = 48, fallback, style }: AvatarProps) {
  const { colors } = useTheme();
  const [errored, setErrored] = useState(false);

  const showImage = source && !errored;

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
