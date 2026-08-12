import { useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { Button } from '../../../components/ui/Button';
import { Screen } from '../../../components/layout/Screen';
import { useTheme } from '../../../theme/ThemeProvider';
import { spacing, radii, typography } from '@loopdev/tokens/semantic';

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
  const { colors: themeColors } = useTheme();
  return (
    <Screen>
      <Text style={[styles.title, { color: themeColors.ink }]}>Acceso de supervisión</Text>
      <Text style={[styles.description, { color: themeColors.muted }]}>
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
        style={[styles.input, { borderColor: themeColors.line, color: themeColors.ink }]}
        value={email}
      />
      <TextInput
        autoCapitalize="none"
        autoComplete="password"
        onChangeText={setPassword}
        placeholder="Contraseña"
        secureTextEntry
        style={[styles.input, { borderColor: themeColors.line, color: themeColors.ink }]}
        value={password}
      />
      {error && <Text style={[styles.error, { color: themeColors.danger }]}>{error.message}</Text>}
      <Button label="Iniciar sesión" onPress={() => onSignIn(email, password)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: typography.sans, fontSize: 28, fontWeight: '700', textAlign: 'center' },
  description: {
    fontFamily: typography.sans,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.xl,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  input: {
    borderRadius: radii.md,
    borderWidth: 1,
    marginBottom: spacing.md,
    padding: 14,
  },
  error: { fontFamily: typography.sans, marginBottom: spacing.md, textAlign: 'center' },
});
