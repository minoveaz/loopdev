import { StyleSheet, Text } from 'react-native';
import { Button } from '../../../components/ui/Button';
import { colors } from '../../../theme/colors';

export function ProfileScreen({ displayName, onSignOut }: { displayName: string; onSignOut: () => void }) {
  return <><Text style={styles.title}>Perfil</Text><Text style={styles.description}>{displayName} · Administrador global</Text><Button label="Cerrar sesión" onPress={onSignOut} /></>;
}

const styles = StyleSheet.create({ title: { color: colors.ink, fontSize: 28, fontWeight: '700' }, description: { color: colors.muted, fontSize: 16, lineHeight: 24, marginBottom: 24, marginTop: 12 } });