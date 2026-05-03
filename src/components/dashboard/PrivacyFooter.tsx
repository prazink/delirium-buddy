import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Ellipse, Path, Rect } from 'react-native-svg';

import { useTheme } from '../../theme/useTheme';
import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';

interface PrivacyFooterProps {
  style?: StyleProp<ViewStyle>;
}

/**
 * Footer: lock icon + privacy text on the left, decorative shield+leaves art on the right.
 * Art is an inline flex element (NOT absolutely positioned) so it renders on Android too.
 * @example <PrivacyFooter />
 */
export function PrivacyFooter({ style }: PrivacyFooterProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {/* Lock + text */}
      <View style={styles.left}>
        <Icon name="lock" size={20} color={colors.textSecondary} />
        <AppText variant="label" color={colors.textSecondary} style={styles.text}>
          {'All data stays on this device.\nPrivate. Secure. Yours.'}
        </AppText>
      </View>

      {/* Decorative shield + leaves — hangs off right edge */}
      <View
        style={styles.artWrapper}
        accessibilityElementsHidden
        pointerEvents="none"
      >
        <Svg width={110} height={90} viewBox="0 0 110 90" fill="none">
          {/* Vine stem */}
          <Path
            d="M10 70 q15 -25 35 -10"
            stroke="#9fb8e6"
            strokeWidth={1.5}
            fill="none"
          />
          {/* Three leaves */}
          <Ellipse
            cx={20} cy={60} rx={6} ry={3}
            fill="#bfd1ee"
            transform="rotate(-30 20 60)"
          />
          <Ellipse
            cx={32} cy={55} rx={7} ry={3.5}
            fill="#bfd1ee"
            transform="rotate(-15 32 55)"
          />
          <Ellipse
            cx={44} cy={58} rx={6} ry={3}
            fill="#bfd1ee"
            transform="rotate(10 44 58)"
          />
          {/* Shield body */}
          <Path
            d="M82 25 l16 6 v18 c0 12 -8 22 -16 26 c-8 -4 -16 -14 -16 -26 v-18 z"
            fill="#5d7cee"
          />
          {/* Lock body */}
          <Rect x={76} y={48} width={12} height={10} rx={1.5} fill="#fff" />
          {/* Lock shackle */}
          <Path
            d="M78 48 v-3 a4 4 0 0 1 8 0 v3"
            stroke="#fff"
            strokeWidth={1.6}
            fill="none"
          />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 22,
    paddingTop: 12,
    paddingBottom: 8,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingLeft: 4,
  },
  text: {
    flex: 1,
    lineHeight: 19,
  },
  artWrapper: {
    width: 110,
    height: 90,
    flexShrink: 0,
    marginRight: -16,  // let the art bleed into the right screen padding
    overflow: 'visible',
  },
});
