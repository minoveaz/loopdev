import { fireEvent, render } from '@testing-library/react-native';

jest.mock('../src/data/adapters/supabase/client', () => ({
  createSupabaseMobileClient: () => ({
    auth: { getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }) },
  }),
}));

jest.mock('../src/data/adapters/supabase/home', () => ({
  signInWithSupabase: jest.fn().mockResolvedValue({
    id: 'user-superdev',
    email: 'superdev@example.com',
    user_metadata: { display_name: 'SuperDev' },
  }),
  signOutFromSupabase: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../src/data/data-source', () => ({
  createHomeDataSource: () => ({
    getOrganizations: jest.fn().mockResolvedValue([]),
    getSuites: jest.fn().mockResolvedValue([]),
    getActivity: jest.fn().mockResolvedValue([]),
    getNotifications: jest.fn().mockResolvedValue([]),
    getPlatformOverview: jest.fn().mockResolvedValue({
      activeOrganizations: 1,
      activeUsers: 1,
      pendingNotifications: 0,
      systemStatus: 'operational',
    }),
  }),
}));

import App from '../App';

describe('App', () => {
  it('renders the public access entry point', async () => {
    const { getByText } = await render(<App />);

    expect(getByText('LOOPDEV MOBILE')).toBeTruthy();
    expect(getByText('Acceso de supervisión')).toBeTruthy();
    expect(getByText('Iniciar sesión')).toBeTruthy();
  });

  it('opens the authenticated shell for superdev and supports logout', async () => {
    const { getByLabelText, getByText, queryByText } = await render(<App />);

    const inputs = getByText('Acceso de supervisión');
    expect(inputs).toBeTruthy();
    await fireEvent.press(getByText('Iniciar sesión'));

    expect(getByText('CORE_SUITES_AVAILABLE')).toBeTruthy();
    expect(getByText('Inicializa tu contexto de trabajo.')).toBeTruthy();
    expect(getByText('Todo operativo')).toBeTruthy();

    await fireEvent.press(getByLabelText('Perfil'));
    await fireEvent.press(getByLabelText('Cerrar sesión'));

    expect(getByText('Acceso de supervisión')).toBeTruthy();
    expect(queryByText('CORE_SUITES_AVAILABLE')).toBeNull();
  });
});
