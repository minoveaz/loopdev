import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./stories/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    extend: {
      colors: {
        // Soporte para variables Shadcn
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        // Soporte para variables Shared Config (Local)
        brand: {
          primary: "var(--brand-primary)",
          secondary: "var(--brand-secondary)",
          surface: "var(--brand-surface)",
          outline: "var(--brand-outline)",
        },
        state: {
          success: "var(--state-success)",
          error: "var(--state-error)",
        }
      },
    },
  },
  plugins: [],
};

export default config;