import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

import { darkTheme, lightTheme, type Theme } from './tokens';

const ThemeContext = createContext<Theme>(lightTheme);

/**
 * Wraps the app in light/dark theme context derived from system preference.
 * @example <ThemeProvider><App /></ThemeProvider>
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

/** Returns the active theme. Must be used inside ThemeProvider. */
export function useTheme(): Theme {
  return useContext(ThemeContext);
}
