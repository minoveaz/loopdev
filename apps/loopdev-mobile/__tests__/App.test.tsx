import { fireEvent, render } from '@testing-library/react-native';

import App from '../App';

describe('App', () => {
  it('renders the public access entry point', async () => {
    const { getByText } = await render(<App />);

    expect(getByText('LOOPDEV MOBILE')).toBeTruthy();
    expect(getByText('Acceso de supervisión')).toBeTruthy();
    expect(getByText('Iniciar sesión como superdev')).toBeTruthy();
  });

  it('opens the authenticated shell for superdev and supports logout', async () => {
    const { getByLabelText, getByText, queryByText } = await render(<App />);

    await fireEvent.press(getByLabelText('Iniciar sesión como superdev'));

    expect(getByText('Resumen de plataforma')).toBeTruthy();
    expect(getByText('Todo operativo')).toBeTruthy();

    await fireEvent.press(getByLabelText('Perfil'));
    await fireEvent.press(getByLabelText('Cerrar sesión'));

    expect(getByText('Acceso de supervisión')).toBeTruthy();
    expect(queryByText('Resumen de plataforma')).toBeNull();
  });
});