import { fireEvent, render } from '@testing-library/react-native';
import type { OrganizationSummary } from '@loopdev/contracts';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import type { HomeDataState } from '../src/data/home-data';
import { HomeScreen } from '../src/features/home/screens/HomeScreen';

const organizations: OrganizationSummary[] = [
  { id: 'loopdev', name: 'LoopDev', slug: 'loopdev', role: 'owner', status: 'active', memberCount: 1 },
  { id: 'estar-protegidos', name: 'Estar Protegidos', slug: 'estar-protegidos', role: 'viewer', status: 'active', memberCount: 1 },
];

function createData(suites: HomeDataState['suites']): HomeDataState {
  return {
    status: 'success',
    organizations,
    suites,
    activity: [],
    notifications: [],
    overview: { activeOrganizations: 2, activeUsers: 1, pendingNotifications: 0, systemStatus: 'operational' },
    error: null,
  };
}

describe('HomeScreen', () => {
  it('renders organization suites and keeps disabled platform suites unavailable', async () => {
    const onNavigate = jest.fn();
    const { getByText, queryByText } = await render(
      <ThemeProvider>
        <HomeScreen
          data={createData([{ id: 'workspace-crm', suiteKey: 'crm', name: 'Sales CRM', slug: 'sales-crm', status: 'active' }])}
          activeOrganizationId="estar-protegidos"
          isPlatformAdministrator={false}
          onNavigate={onNavigate}
        />
      </ThemeProvider>,
    );

    expect(getByText('Sales & CRM')).toBeTruthy();
    expect(queryByText('Financial Ops')).toBeNull();
    expect(queryByText('Health OS')).toBeNull();
    fireEvent.press(getByText('Sales & CRM'));
    expect(onNavigate).toHaveBeenCalledWith('organizations');
  });

  it('adds the LoopDev platform catalog only for the LoopDev owner scope', async () => {
    const onNavigate = jest.fn();
    const { getByText, getAllByLabelText } = await render(
      <ThemeProvider>
        <HomeScreen
          data={createData([])}
          activeOrganizationId="loopdev"
          isPlatformAdministrator={false}
          onNavigate={onNavigate}
        />
      </ThemeProvider>,
    );

    expect(getByText('Quant Ops')).toBeTruthy();
    expect(getByText('Financial Ops')).toBeTruthy();
    expect(getAllByLabelText('disabled: neutral')).toHaveLength(2);
    fireEvent.press(getByText('Financial Ops'));
    expect(onNavigate).not.toHaveBeenCalled();
  });
});