import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../components/ui/Button';
import { useTheme } from '../../../theme/ThemeProvider';

export function ProfileScreen({ displayName, themeMode, onToggleTheme, onSignOut }: { displayName: string; themeMode: 'light' | 'dark'; onToggleTheme: () => void; onSignOut: () => void }) {
  const { colors } = useTheme();
  return <View><Text style={[styles.title, { color: colors.ink }]}>Perfil</Text><Text style={[styles.description, { color: colors.muted }]}>{displayName} · Administrador global</Text><Pressable accessibilityRole="switch" accessibilityState={{ checked: themeMode === 'dark' }} onPress={onToggleTheme} style={[styles.themeToggle, { backgroundColor: colors.surface, borderColor: colors.line }]}><Text style={{ color: colors.ink }}>{themeMode === 'dark' ? 'Modo oscuro' : 'Modo claro'}</Text><Text style={{ color: colors.accent, fontWeight: '700' }}>Activado</Text></Pressable><Button label="Cerrar sesión" onPress={onSignOut} /></View>;
}

const styles = StyleSheet.create({ title: { fontSize: 28, fontWeight: '700' }, description: { fontSize: 16, lineHeight: 24, marginBottom: 24, marginTop: 12 }, themeToggle: { alignItems: 'center', borderRadius: 8, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, padding: 16 } });