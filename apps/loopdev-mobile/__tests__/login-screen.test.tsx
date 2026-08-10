import { render } from '@testing-library/react-native';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import { LoginScreen } from '../src/features/auth/screens/LoginScreen';

describe('LoginScreen', () => {
  it('explains when the previous session has expired', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <LoginScreen expired error={null} onSignIn={jest.fn()} />
      </ThemeProvider>,
    );

    expect(getByText('Tu sesión ha expirado. Vuelve a iniciar sesión para continuar.')).toBeTruthy();
  });
});