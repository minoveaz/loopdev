import { render } from '@testing-library/react-native';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import { NativeOrganizationSwitcher as OrganizationSwitcher } from '@loopdev/ui-native';

describe('OrganizationSwitcher', () => {
  it('explains when the user has no organization memberships', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <OrganizationSwitcher organizations={[]} activeOrganizationId={null} onSelect={jest.fn()} />
      </ThemeProvider>,
    );

    expect(getByText('No tienes organizaciones disponibles.')).toBeTruthy();
  });
});