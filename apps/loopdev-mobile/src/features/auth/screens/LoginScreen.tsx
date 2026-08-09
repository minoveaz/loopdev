import { useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { Button } from '../../../components/ui/Button';
import { Screen } from '../../../components/layout/Screen';
import { colors } from '../../../theme/colors';

export function LoginScreen({
  expired,
  error,
  onSignIn,
}: {
  expired: boolean;
  error: Error | null;
  onSignIn: (email: string, password: string) => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <Screen>
      <Text style={styles.title}>Acceso de supervisión</Text>
      <Text style={styles.description}>
        {expired
          ? 'Tu sesión ha expirado. Vuelve a iniciar sesión para continuar.'
          : 'Inicia sesión para abrir LoopDev Mobile.'}
      </Text>
      <TextInput
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
        value={email}
      />
      <TextInput
        autoCapitalize="none"
        autoComplete="password"
        onChangeText={setPassword}
        placeholder="Contraseña"
        secureTextEntry
        style={styles.input}
        value={password}
      />
      {error && <Text style={styles.error}>{error.message}</Text>}
      <Button label="Iniciar sesión" onPress={() => onSignIn(email, password)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.ink, fontSize: 28, fontWeight: '700', textAlign: 'center' },
  description: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    marginTop: 12,
    textAlign: 'center',
  },
  input: {
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.ink,
    marginBottom: 12,
    padding: 14,
  },
  error: { color: '#b42318', marginBottom: 12, textAlign: 'center' },
});
