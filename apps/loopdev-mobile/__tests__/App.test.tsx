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
    app_metadata: { is_global_admin: true },
  }),
  signOutFromSupabase: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../src/data/data-source', () => ({
  createHomeDataSource: () => ({
    getOrganizations: jest.fn().mockResolvedValue([
      { id: 'loopdev', name: 'LoopDev', slug: 'loopdev', role: 'owner', status: 'active', memberCount: 1 },
      { id: 'estar-protegidos', name: 'Estar Protegidos', slug: 'estar-protegidos', role: 'member', status: 'active', memberCount: 1 },
    ]),
    getSuites: jest.fn().mockImplementation(async (organizationId?: string) => organizationId === 'loopdev'
      ? [{ id: 'workspace-quant', suiteKey: 'quant', name: 'Quant Ops', slug: 'quant-ops', status: 'active' }]
      : [{ id: 'workspace-crm', suiteKey: 'crm', name: 'Sales CRM', slug: 'sales-crm', status: 'active' }]),
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
    const { getByLabelText, getByRole, getByText, queryByText } = await render(<App />);

    const inputs = getByText('Acceso de supervisión');
    expect(inputs).toBeTruthy();
    await fireEvent.press(getByText('Iniciar sesión'));

    expect(getByText('CORE_SUITES_AVAILABLE')).toBeTruthy();
    expect(getByText('Inicializa tu contexto de trabajo.')).toBeTruthy();
    expect(getByText('Todo operativo')).toBeTruthy();

    await fireEvent.press(getByRole('button', { name: 'Perfil' }));
    await fireEvent.press(getByLabelText('Cerrar sesión'));

    expect(getByText('Acceso de supervisión')).toBeTruthy();
    expect(queryByText('CORE_SUITES_AVAILABLE')).toBeNull();
  });

  it('refreshes suites when the active organization changes', async () => {
    const { getByLabelText, getByRole, getByText, queryByText } = await render(<App />);

    await fireEvent.press(getByText('Iniciar sesión'));
    await fireEvent.press(getByLabelText('Cambiar organización'));
    await fireEvent.press(getByRole('radio', { name: /Estar Protegidos/ }));
    expect(getByText('Sales & CRM')).toBeTruthy();
    expect(queryByText('Quant Ops')).toBeNull();

    await fireEvent.press(getByLabelText('Cambiar organización'));
    await fireEvent.press(getByRole('radio', { name: /LoopDev/ }));

    expect(getByText('Quant Ops')).toBeTruthy();
    expect(queryByText('Sales CRM')).toBeNull();
  });
});
