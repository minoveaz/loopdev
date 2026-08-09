export const semanticColors = {
  canvas: '#0d121b',
  surface: '#181b21',
  surfaceElevated: '#242a33',
  text: '#f8fafc',
  textMuted: '#94a3b8',
  primary: '#135BEC',
  primaryPressed: '#0B46BE',
  energy: '#FFD025',
  success: '#10B981',
  warning: '#FFD025',
  danger: '#EF4444',
  border: '#2d3442',
  inverse: '#ffffff',
} as const;

export const semanticThemes = {
  light: {
    canvas: '#f6f7f9',
    surface: '#ffffff',
    surfaceElevated: '#ffffff',
    text: '#17202a',
    textMuted: '#68737d',
    primary: semanticColors.primary,
    primaryPressed: semanticColors.primaryPressed,
    energy: semanticColors.energy,
    success: semanticColors.success,
    warning: semanticColors.warning,
    danger: semanticColors.danger,
    border: '#d8dee5',
    inverse: '#ffffff',
  },
  dark: semanticColors,
} as const;

export type ThemeMode = keyof typeof semanticThemes;
export type SemanticThemeColors = (typeof semanticThemes)[ThemeMode];

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radii = {
  sm: 4,
  md: 8,
  lg: 12,
  pill: 999,
} as const;

export const typography = {
  sans: 'Inter',
  mono: 'JetBrains Mono',
  technical: 10,
  micro: 9,
  nano: 8,
} as const;

export const touchTargets = {
  minimum: 44,
  comfortable: 48,
} as const;

export type SemanticColorRole = keyof typeof semanticColors;
export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radii;
