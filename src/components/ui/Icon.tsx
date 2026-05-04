import React from 'react';
import Svg, {
  Circle,
  Ellipse,
  Line,
  Path,
  Polyline,
  Rect,
} from 'react-native-svg';

export type IconName =
  | 'heart-leaf'
  | 'shield-check'
  | 'plus'
  | 'people'
  | 'moon'
  | 'sun'
  | 'water'
  | 'lock'
  | 'person'
  | 'history'
  | 'bar-chart'
  | 'settings'
  | 'info'
  | 'chevron-right'
  | 'shield'
  | 'home'
  | 'clipboard'
  | 'bell'
  | 'checklist'
  | 'more-horizontal';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

/**
 * Centralised SVG icon set backed by react-native-svg. Every path is traced
 * directly from the HTML mockup so icons are pixel-identical.
 * @example <Icon name="shield-check" size={22} color="#1f9d57" />
 */
export function Icon({ name, size = 24, color = 'currentColor' }: IconProps) {
  const s = size;

  switch (name) {
    case 'heart-leaf':
      return (
        <Svg width={s} height={s} viewBox="0 0 44 44" fill="none">
          <Path
            d="M14 8c-3.3 0-6 2.7-6 6 0 5.5 7 10 11 13 4-3 11-7.5 11-13 0-3.3-2.7-6-6-6-2 0-3.8 1-5 2.5C17.8 9 16 8 14 8z"
            fill="#7a8ff5"
            opacity="0.85"
          />
          <Path
            d="M19 18c-2 0-3.6 1.6-3.6 3.6 0 3.3 4.2 6 6.6 7.8 2.4-1.8 6.6-4.5 6.6-7.8 0-2-1.6-3.6-3.6-3.6-1.2 0-2.3.6-3 1.5-.7-.9-1.8-1.5-3-1.5z"
            fill="#4d6cf0"
          />
        </Svg>
      );

    case 'shield-check':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3z" />
          <Path d="M9 12l2 2 4-4" />
        </Svg>
      );

    case 'plus':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round">
          <Line x1="12" y1="5" x2="12" y2="19" />
          <Line x1="5" y1="12" x2="19" y2="12" />
        </Svg>
      );

    case 'home':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M3 10.8 12 3l9 7.8" />
          <Path d="M5.5 10.2V21h13V10.2" />
          <Path d="M9.5 21v-6h5v6" />
        </Svg>
      );

    case 'clipboard':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round">
          <Rect x="5" y="4" width="14" height="17" rx="2" />
          <Path d="M9 4.5A3 3 0 0 1 12 2a3 3 0 0 1 3 2.5" />
          <Path d="M9 9h6" />
          <Path d="M9 13h6" />
          <Path d="M9 17h4" />
        </Svg>
      );

    case 'bell':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <Path d="M10 21a2.5 2.5 0 0 0 4 0" />
        </Svg>
      );

    case 'checklist':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round">
          <Path d="m5 7 1.5 1.5L9 5.5" />
          <Path d="M12 7h7" />
          <Path d="m5 13 1.5 1.5L9 11.5" />
          <Path d="M12 13h7" />
          <Path d="m5 19 1.5 1.5L9 17.5" />
          <Path d="M12 19h7" />
        </Svg>
      );

    case 'more-horizontal':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <Circle cx="5" cy="12" r="2" fill={color} />
          <Circle cx="12" cy="12" r="2" fill={color} />
          <Circle cx="19" cy="12" r="2" fill={color} />
        </Svg>
      );

    case 'people':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="7.6" r="2.8" fill={color} />
          <Path
            d="M7.1 18.6c.45-3.25 2.35-5.2 4.9-5.2s4.45 1.95 4.9 5.2"
            fill={color}
          />
          <Circle cx="5.9" cy="9.6" r="2.25" fill={color} opacity={0.92} />
          <Path
            d="M2.2 18.2c.35-2.7 1.95-4.3 4.15-4.3.85 0 1.6.25 2.25.7-1.25.95-2.1 2.35-2.45 4.1H2.8c-.35 0-.65-.25-.6-.5z"
            fill={color}
            opacity={0.92}
          />
          <Circle cx="18.1" cy="9.6" r="2.25" fill={color} opacity={0.92} />
          <Path
            d="M21.8 18.2c-.35-2.7-1.95-4.3-4.15-4.3-.85 0-1.6.25-2.25.7 1.25.95 2.1 2.35 2.45 4.1h3.35c.35 0 .65-.25.6-.5z"
            fill={color}
            opacity={0.92}
          />
        </Svg>
      );

    case 'moon':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill={color}>
          <Path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
        </Svg>
      );

    case 'sun':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill={color}>
          <Circle cx="12" cy="12" r="4.5" />
          <Line x1="12" y1="2" x2="12" y2="5" stroke={color} strokeWidth={2} strokeLinecap="round" />
          <Line x1="12" y1="19" x2="12" y2="22" stroke={color} strokeWidth={2} strokeLinecap="round" />
          <Line x1="2" y1="12" x2="5" y2="12" stroke={color} strokeWidth={2} strokeLinecap="round" />
          <Line x1="19" y1="12" x2="22" y2="12" stroke={color} strokeWidth={2} strokeLinecap="round" />
          <Line x1="4.6" y1="4.6" x2="6.7" y2="6.7" stroke={color} strokeWidth={2} strokeLinecap="round" />
          <Line x1="17.3" y1="17.3" x2="19.4" y2="19.4" stroke={color} strokeWidth={2} strokeLinecap="round" />
          <Line x1="4.6" y1="19.4" x2="6.7" y2="17.3" stroke={color} strokeWidth={2} strokeLinecap="round" />
          <Line x1="17.3" y1="6.7" x2="19.4" y2="4.6" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </Svg>
      );

    case 'water':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round">
          <Path d="M6 4h12l-1.5 16a2 2 0 01-2 1.8h-5a2 2 0 01-2-1.8z" />
          <Path d="M7 10c2 1 4-1 6 0s3-1 5 0" />
        </Svg>
      );

    case 'lock':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Rect x="4" y="11" width="16" height="10" rx="2" />
          <Path d="M8 11V8a4 4 0 018 0v3" />
        </Svg>
      );

    case 'person':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Circle cx="12" cy="8" r="4" />
          <Path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
        </Svg>
      );

    case 'history':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M3 12a9 9 0 109-9 9.7 9.7 0 00-7 3" />
          <Polyline points="3 4 3 9 8 9" />
          <Polyline points="12 7 12 12 16 14" />
        </Svg>
      );

    case 'bar-chart':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Line x1="6" y1="20" x2="6" y2="12" />
          <Line x1="12" y1="20" x2="12" y2="6" />
          <Line x1="18" y1="20" x2="18" y2="9" />
        </Svg>
      );

    case 'settings':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Circle cx="12" cy="12" r="3" />
          <Path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1A2 2 0 113.3 17l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H2a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1A2 2 0 117 4.3l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
        </Svg>
      );

    case 'info':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Circle cx="12" cy="12" r="9" />
          <Line x1="12" y1="11" x2="12" y2="17" />
          <Circle cx="12" cy="8" r="0.8" fill={color} />
        </Svg>
      );

    case 'chevron-right':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M9 18l6-6-6-6" />
        </Svg>
      );

    case 'shield':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3z" />
        </Svg>
      );

    default:
      return null;
  }
}
