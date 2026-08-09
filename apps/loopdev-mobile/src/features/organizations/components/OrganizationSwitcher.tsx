import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { MobileOrganization } from '../../../data/contracts/home';
import { colors } from '../../../theme/colors';

export function OrganizationSwitcher({ organizations, activeOrganizationId, onSelect }: { organizations: MobileOrganization[]; activeOrganizationId: string | null; onSelect: (organizationId: string) => void }) {
  if (organizations.length === 0) return null;
  return <View style={styles.container}>
    <Text style={styles.label}>ORGANIZACIÓN ACTIVA</Text>
    {organizations.map((organization) => <Pressable key={organization.id} accessibilityRole="radio" accessibilityState={{ selected: organization.id === activeOrganizationId }} onPress={() => onSelect(organization.id)} style={[styles.option, organization.id === activeOrganizationId && styles.selected]}>
      <View style={styles.copy}>
        <Text style={styles.name}>{organization.name}</Text>
        <Text style={styles.role}>{organization.role ?? 'Miembro'}</Text>
      </View>
      <Text style={styles.state}>{organization.id === activeOrganizationId ? 'Activa' : 'Usar'}</Text>
    </Pressable>)}
  </View>;
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  label: { color: colors.muted, fontSize: 11, fontWeight: '700', letterSpacing: 1.2, marginBottom: 8 },
  option: { alignItems: 'center', backgroundColor: colors.white, borderColor: colors.line, borderRadius: 8, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, padding: 14 },
  selected: { borderColor: colors.accent, borderWidth: 2 },
  copy: { flex: 1 },
  name: { color: colors.ink, fontSize: 15, fontWeight: '700' },
  role: { color: colors.muted, fontSize: 12, marginTop: 3, textTransform: 'capitalize' },
  state: { color: colors.accent, fontSize: 12, fontWeight: '700' },
});
