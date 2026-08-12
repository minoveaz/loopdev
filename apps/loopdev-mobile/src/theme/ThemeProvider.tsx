import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { semanticThemes, type SemanticThemeColors } from '@loopdev/tokens/semantic';

export type ThemeMode = 'light' | 'dark';

const storageKey = 'loopdev-theme-mode';
export type ThemeColors = SemanticThemeColors & {
  ink: string;
  muted: string;
  line: string;
  accent: string;
  inverse: string;
};
interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

async function readStoredMode(): Promise<ThemeMode | null> {
  try {
    const value = Platform.OS === 'web' ? globalThis.localStorage?.getItem(storageKey) : await SecureStore.getItemAsync(storageKey);
    return value === 'dark' || value === 'light' ? value : null;
  } catch {
    return null;
  }
}

async function storeMode(mode: ThemeMode) {
  try {
    if (Platform.OS === 'web') globalThis.localStorage?.setItem(storageKey, mode);
    else await SecureStore.setItemAsync(storageKey, mode);
  } catch {
    // Theme remains available for the current session when storage is unavailable.
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('light');
  useEffect(() => { void readStoredMode().then((storedMode) => { if (storedMode) setModeState(storedMode); }); }, []);
  const setMode = (nextMode: ThemeMode) => { setModeState(nextMode); void storeMode(nextMode); };
  const value = useMemo(() => {
    const semantic = semanticThemes[mode];
    const colors: ThemeColors = {
      ...semantic,
      ink: semantic.text,
      muted: semantic.textMuted,
      line: semantic.border,
      accent: semantic.primary,
      inverse: semantic.inverse,
    };
    return { mode, colors, setMode, toggleMode: () => setMode(mode === 'light' ? 'dark' : 'light') };
  }, [mode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used inside ThemeProvider');
  return value;
}
