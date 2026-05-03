/**
 * Design tokens — mirrors CSS custom properties in docs/design/delirium-buddy.html exactly.
 * Components must reference semantic aliases via useTheme(), never raw palette values.
 *
 * Decisions to revisit (see README):
 *  - Font: system fonts used; add @expo-google-fonts/inter for exact Inter match
 *  - Card shadow: RN supports one shadow layer; CSS 2-layer is approximated
 *  - Dark mode: logical inverse with no dark mockup provided
 */

// ─── Palette ──────────────────────────────────────────────────────────────────

export const palette = {
  white:          '#ffffff',
  pageBg:         '#f7f8fb',

  navy900:        '#0f2c4a',
  slate500:       '#6b7a8f',
  slate400:       '#94a0b3',
  chevron:        '#c1c8d4',

  blue400:        '#7a96f7',
  blue500:        '#6c8cf5',
  blue600:        '#5d7cee',
  blue700:        '#4f6fe0',
  blueBg:         '#e6efff',
  chipBg:         '#e9eefb',
  chipIcon:       '#4458b3',
  blueDark:       '#2c5cc5',

  green600:       '#1f9d57',
  green500:       '#5fa765',
  green400:       '#7ab87a',
  greenBg:        '#e9f7ef',
  greenBgLight:   '#eef7ef',

  purple500:      '#7e6fe6',
  purple400:      '#6855d4',
  purpleBg:       '#ece9fb',

  amber400:       '#f0a93b',
  yellowBg:       '#fef6e0',
  yellowTitle:    '#2f7a3a',

  surface:        '#ffffff',
  divider:        '#eef0f5',
  actionBg:       '#f2f4f9',
  quickBorder:    '#eef1f6',
  avatarSkin:     '#f3e6d8',
} as const;

// ─── Spacing ──────────────────────────────────────────────────────────────────

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
} as const;

// ─── Border radii ─────────────────────────────────────────────────────────────

export const radii = {
  sm:      10,
  md:      16,
  lg:      20,
  xl:      24,
  pill:    999,
  badge:   12,
  insight: 14,
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────

export const typography = {
  h1:          { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.5, lineHeight: 32 },
  h2:          { fontSize: 20, fontWeight: '700' as const, lineHeight: 24 },
  sectionTitle:{ fontSize: 17, fontWeight: '700' as const, lineHeight: 22 },
  ctaTitle:    { fontSize: 19, fontWeight: '700' as const, lineHeight: 24 },
  body:        { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodyMd:      { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  label:       { fontSize: 13, fontWeight: '500' as const, lineHeight: 18 },
  caption:     { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  captionBold: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16 },
  chipText:    { fontSize: 13, fontWeight: '500' as const, lineHeight: 18 },
} as const;

// ─── Shadows ──────────────────────────────────────────────────────────────────

export const shadows = {
  card: {
    shadowColor: palette.navy900,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  cta: {
    shadowColor: palette.blue700,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;

// ─── Gradients ────────────────────────────────────────────────────────────────

export const gradients = {
  ctaButton: [palette.blue400, palette.blue600] as [string, string],
} as const;

// ─── Semantic light theme ─────────────────────────────────────────────────────

export const lightTheme = {
  colors: {
    pageBg:         palette.pageBg,
    surface:        palette.surface,

    textPrimary:    palette.navy900,
    textSecondary:  palette.slate500,
    textMuted:      palette.slate400,
    textChevron:    palette.chevron,

    primary:        palette.blue500,
    primaryStrong:  palette.blue700,
    onPrimary:      palette.white,

    success:        palette.green600,
    successBg:      palette.greenBg,
    warning:        palette.amber400,

    purple:         palette.purple500,
    purpleBg:       palette.purpleBg,
    purpleTitle:    palette.purple400,
    yellowBg:       palette.yellowBg,
    yellowTitle:    palette.yellowTitle,
    blueBg:         palette.blueBg,
    blueTitle:      palette.blueDark,
    chipBg:         palette.chipBg,
    chipIcon:       palette.chipIcon,

    divider:        palette.divider,
    actionBg:       palette.actionBg,
    quickBorder:    palette.quickBorder,
    trendLineFill:  palette.greenBgLight,
    trendLine:      palette.green500,
    trendDotLow:    palette.amber400,
    trendAreaStart: palette.green400,
  },
  spacing,
  radii,
  typography,
  shadows,
  gradients,
} as const;

// Theme is defined as a structural interface so dark/light values can differ.
export type ThemeColors = {
  [K in keyof typeof lightTheme.colors]: string;
};

export type Theme = {
  colors: ThemeColors;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: typeof typography;
  shadows: typeof shadows;
  gradients: typeof gradients;
};

export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    pageBg:         '#0d1b2a',
    surface:        '#1a2d42',
    textPrimary:    '#e8f0f8',
    textSecondary:  '#8a9bb0',
    textMuted:      '#5a6a7e',
    divider:        '#243649',
    actionBg:       '#1e3248',
    quickBorder:    '#1e3248',
    chipBg:         '#1e3655',
    trendLineFill:  '#1a3a28',
  },
};
