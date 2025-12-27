import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import '../src/tailwind.css';
import '../src/themes.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        'Default (Base)': '',
        'Estar Protegidos': 'theme-estar-protegidos',
        'App B (Naranja)': 'theme-client-b',
      },
      defaultTheme: 'Default (Base)',
    }),
  ],
};

export default preview;