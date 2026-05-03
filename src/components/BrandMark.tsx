import { StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '../theme/tokens';

type BrandMarkProps = {
  size?: number;
};

export function BrandMark({ size = 48 }: BrandMarkProps) {
  const iconSize = size;
  const brainSize = Math.round(size * 0.48);
  const heartSize = Math.round(size * 0.24);

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="Delirium Buddy logo"
      style={[styles.mark, { width: iconSize, height: iconSize, borderRadius: Math.round(size * 0.24) }]}
    >
      <View style={[styles.orbit, { width: iconSize * 0.72, height: iconSize * 0.72, borderRadius: iconSize }]} />
      <View style={[styles.dot, { width: size * 0.16, height: size * 0.16, borderRadius: size * 0.08 }]} />
      <Text style={[styles.brain, { fontSize: brainSize, lineHeight: brainSize + 4 }]}>☁</Text>
      <Text style={[styles.heart, { fontSize: heartSize, lineHeight: heartSize + 2 }]}>♥</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mark: {
    alignItems: 'center',
    backgroundColor: colors.navy,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  orbit: {
    borderColor: colors.teal,
    borderLeftColor: colors.sky,
    borderRadius: radius.pill,
    borderWidth: 3,
    opacity: 0.95,
    position: 'absolute',
    transform: [{ rotate: '-18deg' }],
  },
  dot: {
    backgroundColor: colors.tealSoft,
    position: 'absolute',
    right: '17%',
    top: '18%',
  },
  brain: {
    color: '#EAF6FF',
    marginTop: 2,
  },
  heart: {
    color: colors.coral,
    fontWeight: '900',
    position: 'absolute',
  },
});
