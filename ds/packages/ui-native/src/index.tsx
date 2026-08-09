import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { type BrandLogoVariant, type SuiteCardContract, type SystemStatus } from '@loopdev/design-contracts';
import { semanticColors, radii, spacing, typography, touchTargets } from '@loopdev/tokens/semantic';

export interface NativeThemeColors {
  canvas: string;
  surface: string;
  surfaceElevated: string;
  ink: string;
  muted: string;
  line: string;
  accent: string;
  inverse: string;
  success: string;
  warning: string;
  energy: string;
  danger: string;
}

export interface NativeSurfaceProps {
  children: React.ReactNode;
  elevated?: boolean;
  colors?: NativeThemeColors;
  style?: StyleProp<ViewStyle>;
}

export interface NativeScreenProps {
  children: React.ReactNode;
  eyebrow?: string;
  colors?: NativeThemeColors;
  style?: StyleProp<ViewStyle>;
}

export function NativeScreen({ children, eyebrow = 'LOOPDEV MOBILE', colors = nativeColors, style }: NativeScreenProps) {
  return (
    <View style={[styles.screen, { backgroundColor: colors.canvas }, style]}>
      <Text style={[styles.eyebrow, { color: colors.accent }]}>{eyebrow}</Text>
      {children}
    </View>
  );
}

export interface NativeButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  colors?: NativeThemeColors;
  style?: StyleProp<ViewStyle>;
}

export function NativeButton({ label, colors = nativeColors, style, ...pressableProps }: NativeButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.button, { backgroundColor: colors.accent }, pressed && styles.pressed, style]}
      {...pressableProps}
    >
      <Text style={[styles.buttonLabel, { color: colors.inverse }]}>{label}</Text>
    </Pressable>
  );
}

export function NativeSurface({ children, elevated = false, colors = nativeColors, style }: NativeSurfaceProps) {
  return <View style={[styles.surface, { backgroundColor: elevated ? colors.surfaceElevated : colors.surface, borderColor: colors.line }, style]}>{children}</View>;
}

const nativeColors: NativeThemeColors = {
  canvas: semanticColors.canvas,
  surface: semanticColors.surface,
  surfaceElevated: semanticColors.surfaceElevated,
  ink: semanticColors.text,
  muted: semanticColors.textMuted,
  line: semanticColors.border,
  accent: semanticColors.primary,
  inverse: semanticColors.inverse,
  success: semanticColors.success,
  warning: semanticColors.warning,
  energy: semanticColors.energy,
  danger: semanticColors.danger,
};

export interface NativeBrandMarkProps {
  variant?: BrandLogoVariant;
  label?: string;
  colors?: NativeThemeColors;
  style?: StyleProp<TextStyle>;
}

export function NativeBrandMark({ variant = 'full', label = 'loop.dev', colors = nativeColors, style }: NativeBrandMarkProps) {
  const mark = variant === 'isotype' ? '{ }' : label;
  return <Text accessibilityRole="image" accessibilityLabel={label} style={[styles.brand, { color: colors.ink }, style]}>{mark}</Text>;
}

export interface NativeStatusProps {
  status: SystemStatus;
  label: string;
  colors?: NativeThemeColors;
  style?: StyleProp<TextStyle>;
}

export function NativeStatus({ status, label, colors = nativeColors, style }: NativeStatusProps) {
  return <Text accessibilityLabel={`${label}: ${status}`} style={[styles.status, { color: statusColor(status, colors) }, style]}>{label}</Text>;
}

export interface NativeSuiteCardProps extends Omit<PressableProps, 'style'> {
  suite: SuiteCardContract;
  colors?: NativeThemeColors;
  style?: StyleProp<ViewStyle>;
}

export function NativeSuiteCard({ suite, colors = nativeColors, style, ...pressableProps }: NativeSuiteCardProps) {
  const unavailable = suite.availability !== 'enabled';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: unavailable }}
      disabled={unavailable}
      style={({ pressed }) => [styles.card, { backgroundColor: colors.surface, borderColor: colors.line }, pressed && { borderColor: colors.accent, opacity: 0.88 }, unavailable && styles.unavailable, style]}
      {...pressableProps}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: colors.ink }]}>{suite.title}</Text>
        <NativeStatus colors={colors} status={unavailable ? 'neutral' : 'energy'} label={unavailable ? suite.availability : 'ready'} />
      </View>
      <Text style={[styles.cardDescription, { color: colors.muted }]}>{suite.description}</Text>
    </Pressable>
  );
}

function statusColor(status: SystemStatus, colors: NativeThemeColors) {
  if (status === 'success') return colors.success;
  if (status === 'warning') return colors.warning;
  if (status === 'energy') return colors.energy;
  if (status === 'danger' || status === 'error') return colors.danger;
  return colors.muted;
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: semanticColors.canvas,
    flex: 1,
    padding: spacing.xl,
    paddingTop: spacing.xxl,
  },
  eyebrow: {
    color: semanticColors.primary,
    fontFamily: typography.mono,
    fontSize: typography.technical,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: spacing.md,
  },
  surface: {
    backgroundColor: semanticColors.surface,
    borderColor: semanticColors.border,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.lg,
  },
  elevated: { backgroundColor: semanticColors.surfaceElevated },
  brand: {
    color: semanticColors.text,
    fontFamily: typography.sans,
    fontSize: 24,
    fontWeight: '800',
  },
  status: {
    fontFamily: typography.mono,
    fontSize: typography.micro,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: semanticColors.surface,
    borderColor: semanticColors.border,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
    minHeight: touchTargets.minimum,
    padding: spacing.lg,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  cardTitle: {
    color: semanticColors.text,
    flex: 1,
    fontFamily: typography.sans,
    fontSize: 16,
    fontWeight: '700',
  },
  cardDescription: {
    color: semanticColors.textMuted,
    fontFamily: typography.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  pressed: { borderColor: semanticColors.primary, opacity: 0.88 },
  unavailable: { opacity: 0.56 },
  button: {
    alignItems: 'center',
    backgroundColor: semanticColors.primary,
    borderRadius: radii.md,
    justifyContent: 'center',
    minHeight: touchTargets.comfortable,
    paddingHorizontal: spacing.xl,
  },
  buttonLabel: {
    color: semanticColors.inverse,
    fontFamily: typography.sans,
    fontSize: 15,
    fontWeight: '700',
  },
});

export type { BrandLogoVariant, SuiteCardContract, SystemStatus } from '@loopdev/design-contracts';
export { semanticColors, radii, spacing, typography, touchTargets } from '@loopdev/tokens/semantic';
