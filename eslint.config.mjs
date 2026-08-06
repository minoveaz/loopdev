import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import tailwindcss from 'eslint-plugin-tailwindcss';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/storybook-static/**',
      '**/coverage/**',
      '**/.turbo/**',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/no-contradicting-classname': 'warn',
    },
    plugins: {
      tailwindcss,
    },
  },
);
