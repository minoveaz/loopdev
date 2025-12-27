import type { Preview } from '@storybook/react';
import '../../../packages/ui/src/styles/globals.css'; // Importa Tailwind y estilos base de la UI

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
};

export default preview;
