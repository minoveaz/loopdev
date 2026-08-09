import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { OrganizationSummary } from '@loopdev/contracts';
import { useTheme } from '../../../theme/ThemeProvider';
import { radii, spacing, typography } from '@loopdev/tokens/semantic';

export function OrganizationSwitcher({ organizations, activeOrganizationId, onSelect }: { organizations: OrganizationSummary[]; activeOrganizationId: string | null; onSelect: (organizationId: string) => void }) {
  const { colors: themeColors } = useTheme();
  if (organizations.length === 0) return null;
  return <View style={styles.container}>
    <Text style={[styles.label, { color: themeColors.muted }]}>ORGANIZACIÓN ACTIVA</Text>
    {organizations.map((organization) => <Pressable key={organization.id} accessibilityRole="radio" accessibilityState={{ selected: organization.id === activeOrganizationId }} onPress={() => onSelect(organization.id)} style={[styles.option, { backgroundColor: themeColors.surface, borderColor: themeColors.line }, organization.id === activeOrganizationId && { borderColor: themeColors.accent }]}>
      <View style={styles.copy}>
        <Text style={[styles.name, { color: themeColors.ink }]}>{organization.name}</Text>
        <Text style={[styles.role, { color: themeColors.muted }]}>{organization.role ?? 'Miembro'}</Text>
      </View>
      <Text style={[styles.state, { color: themeColors.accent }]}>{organization.id === activeOrganizationId ? 'Activa' : 'Usar'}</Text>
    </Pressable>)}
  </View>;
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.xl },
  label: { fontFamily: typography.mono, fontSize: 11, fontWeight: '700', letterSpacing: 1.2, marginBottom: spacing.sm },
  option: { alignItems: 'center', borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm, padding: 14 },
  copy: { flex: 1 },
  name: { fontFamily: typography.sans, fontSize: 15, fontWeight: '700' },
  role: { fontFamily: typography.sans, fontSize: 12, marginTop: 3, textTransform: 'capitalize' },
  state: { fontFamily: typography.mono, fontSize: 12, fontWeight: '700' },
});
