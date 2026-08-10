import React from 'react';
import {
  Pressable,
  Modal,
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

export type NativeOrganizationOption = { id: string; name: string; role?: string };

export function NativeOrganizationSwitcher({ organizations, activeOrganizationId, onSelect, canSwitch = false, colors = nativeColors }: { organizations: NativeOrganizationOption[]; activeOrganizationId: string | null; onSelect: (organizationId: string) => void; canSwitch?: boolean; colors?: NativeThemeColors }) {
  const [isOpen, setIsOpen] = React.useState(false);
  if (organizations.length === 0) return <View style={styles.organizationContext}><Text style={[styles.organizationLabel, { color: colors.muted }]}>ORGANIZACIÓN ACTIVA</Text><Text style={[styles.organizationEmpty, { color: colors.muted }]}>No tienes organizaciones disponibles.</Text></View>;
  const activeOrganization = organizations.find(({ id }) => id === activeOrganizationId) ?? organizations[0];
  const context = <View style={[styles.organizationContext, canSwitch && styles.organizationInteractive, { borderColor: colors.line }]}><Text style={[styles.organizationLabel, { color: colors.muted }]}>ORGANIZACIÓN ACTIVA</Text><Text style={[styles.organizationName, { color: colors.ink }]}>{activeOrganization.name}</Text>{canSwitch && <Text style={[styles.organizationChevron, { color: colors.accent }]}>{isOpen ? '^' : 'v'}</Text>}</View>;
  return <>
    {canSwitch ? <Pressable accessibilityRole="button" accessibilityLabel="Cambiar organización" onPress={() => setIsOpen(true)}>{context}</Pressable> : context}
    <Modal animationType="slide" transparent visible={isOpen} onRequestClose={() => setIsOpen(false)}>
      <View style={styles.organizationModal}><Pressable accessibilityRole="button" accessibilityLabel="Cerrar selector de organización" onPress={() => setIsOpen(false)} style={styles.organizationBackdrop} /><View style={[styles.organizationSheet, { backgroundColor: colors.surface, borderColor: colors.line }]}><Text style={[styles.organizationSheetTitle, { color: colors.ink }]}>Selecciona una organización</Text>{organizations.map((organization) => <Pressable key={organization.id} accessibilityRole="radio" accessibilityState={{ selected: organization.id === activeOrganizationId }} onPress={() => { onSelect(organization.id); setIsOpen(false); }} style={[styles.organizationOption, { borderColor: colors.line }, organization.id === activeOrganizationId && { borderColor: colors.accent }]}><View style={styles.organizationCopy}><Text style={[styles.organizationName, { color: colors.ink }]}>{organization.name}</Text><Text style={[styles.organizationRole, { color: colors.muted }]}>{organization.role ?? 'Miembro'}</Text></View><Text style={[styles.organizationState, { color: colors.accent }]}>{organization.id === activeOrganizationId ? 'Activa' : 'Usar'}</Text></Pressable>)}</View></View>
    </Modal>
  </>;
}

export function NativeAppHeader({ organizations, activeOrganizationId, canSwitchOrganization, onSelectOrganization, onProfile, colors = nativeColors }: { organizations: NativeOrganizationOption[]; activeOrganizationId: string | null; canSwitchOrganization: boolean; onSelectOrganization: (organizationId: string) => void; onProfile: () => void; colors?: NativeThemeColors }) {
  return <View style={[styles.appHeader, { borderBottomColor: colors.line }]}><NativeBrandMark colors={colors} /><NativeOrganizationSwitcher colors={colors} organizations={organizations} activeOrganizationId={activeOrganizationId} canSwitch={canSwitchOrganization} onSelect={onSelectOrganization} /><Pressable accessibilityRole="button" accessibilityLabel="Perfil" onPress={onProfile} style={styles.profileButton}><Text style={[styles.profileLabel, { color: colors.accent }]}>PERFIL</Text></Pressable></View>;
}

export function NativeBrandMark({ variant = 'full', label = 'loop.dev', colors = nativeColors, style }: NativeBrandMarkProps) {
  const isotype = <View style={[styles.brandBox, { backgroundColor: colors.accent }]}><Text style={styles.brandSymbol}>∞</Text></View>;
  const logotype = <Text style={[styles.brand, { color: colors.ink }, style]}>{label}</Text>;
  return <View accessibilityRole="image" accessibilityLabel={label} style={[styles.brandContainer, variant === 'full' && styles.brandFull]}>
    {(variant === 'full' || variant === 'isotype') && isotype}
    {(variant === 'full' || variant === 'logotype') && logotype}
  </View>;
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
  brandContainer: { alignItems: 'center', flexDirection: 'row' },
  brandFull: { gap: spacing.md },
  brandBox: { alignItems: 'center', borderRadius: radii.md, height: 40, justifyContent: 'center', overflow: 'hidden', width: 40 },
  brandSymbol: { color: '#FFFFFF', fontFamily: typography.sans, fontSize: 28, fontWeight: '800', lineHeight: 32 },
  appHeader: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between', marginBottom: spacing.xl, paddingBottom: spacing.md },
  profileButton: { minHeight: touchTargets.minimum, justifyContent: 'center', paddingHorizontal: spacing.xs },
  profileLabel: { fontFamily: typography.mono, fontSize: typography.technical, fontWeight: '700', letterSpacing: 1.2 },
  organizationContext: { minWidth: 150, paddingVertical: spacing.xs },
  organizationInteractive: { borderBottomWidth: StyleSheet.hairlineWidth, borderRadius: radii.md, borderWidth: 1, paddingHorizontal: spacing.md },
  organizationLabel: { fontFamily: typography.mono, fontSize: typography.nano, fontWeight: '700', letterSpacing: 1.2 },
  organizationName: { fontFamily: typography.sans, fontSize: 15, fontWeight: '700', marginTop: spacing.xs },
  organizationEmpty: { fontFamily: typography.sans, fontSize: 14, lineHeight: 20 },
  organizationChevron: { fontFamily: typography.mono, fontSize: 16, fontWeight: '700', position: 'absolute', right: spacing.md, top: spacing.lg },
  organizationModal: { flex: 1, justifyContent: 'flex-end' },
  organizationBackdrop: { backgroundColor: 'rgba(15, 23, 42, 0.36)', flex: 1 },
  organizationSheet: { borderTopLeftRadius: radii.lg, borderTopRightRadius: radii.lg, borderTopWidth: 1, padding: spacing.xl },
  organizationSheetTitle: { fontFamily: typography.sans, fontSize: 20, fontWeight: '700', marginBottom: spacing.md },
  organizationOption: { alignItems: 'center', borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm, padding: spacing.md },
  organizationCopy: { flex: 1 },
  organizationRole: { fontFamily: typography.sans, fontSize: 12, marginTop: 3, textTransform: 'capitalize' },
  organizationState: { fontFamily: typography.mono, fontSize: 12, fontWeight: '700' },
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
