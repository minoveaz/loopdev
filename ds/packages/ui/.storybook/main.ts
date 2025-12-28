import type { StorybookConfig } from "@storybook/react-vite";
import tsconfigPaths from "vite-tsconfig-paths";

const config: StorybookConfig = {
  // Hard-refreshing the indexer to use the new Atomic Design structure
  stories: [
    "../src/components/atoms/**/*.stories.@(js|jsx|ts|tsx)",
    "../src/components/molecules/**/*.stories.@(js|jsx|ts|tsx)",
    "../src/components/organisms/**/*.stories.@(js|jsx|ts|tsx)",
    "../src/components/templates/**/*.stories.@(js|jsx|ts|tsx)",
    "../src/components/snippets/**/*.stories.@(js|jsx|ts|tsx)",
    "../src/components/layout/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    config.plugins?.push(tsconfigPaths());
    return config;
  },
};
export default config;
