import type { Config } from "tailwindcss";
import sharedConfig from "@myco/tailwind-config";

const config: Config = {
  ...sharedConfig,
  content: [
    "./stories/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}", // Importante: Escanear la librería UI
  ],
};

export default config;
