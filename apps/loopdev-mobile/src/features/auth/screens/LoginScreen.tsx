import { StyleSheet, Text } from 'react-native';
import { Button } from '../../../components/ui/Button';
import { Screen } from '../../../components/layout/Screen';
import { colors } from '../../../theme/colors';

export function LoginScreen({ expired, onSignIn }: { expired: boolean; onSignIn: () => void }) {
  return <Screen><Text style={styles.title}>Acceso de supervisión</Text><Text style={styles.description}>{expired ? 'Tu sesión ha expirado. Vuelve a iniciar sesión para continuar.' : 'Inicia sesión para abrir el shell global de superdev.'}</Text><Button label="Iniciar sesión como superdev" onPress={onSignIn} /></Screen>;
}

const styles = StyleSheet.create({ title: { color: colors.ink, fontSize: 28, fontWeight: '700', textAlign: 'center' }, description: { color: colors.muted, fontSize: 16, lineHeight: 24, marginBottom: 24, marginTop: 12, textAlign: 'center' } });