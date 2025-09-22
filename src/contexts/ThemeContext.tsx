import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  isManual: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Always start with 'auto' on app restart
    return 'auto';
  });

  const [isManual, setIsManual] = useState(() => {
    // Check if user has manually set a theme
    return localStorage.getItem('theme-manual') === 'true';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    // If manual, use stored theme, otherwise follow system
    if (localStorage.getItem('theme-manual') === 'true') {
      const storedTheme = localStorage.getItem('theme') as 'light' | 'dark';
      return storedTheme || 'light';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    setResolvedTheme(newTheme);
    setIsManual(true);
    localStorage.setItem('theme', newTheme);
    localStorage.setItem('theme-manual', 'true');
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateResolvedTheme = () => {
      if (!isManual) {
        // Only follow system preference if not manually set
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };

    // Set initial resolved theme
    updateResolvedTheme();

    // Listen for system theme changes (only when not manual)
    if (!isManual) {
      mediaQuery.addEventListener('change', updateResolvedTheme);
      return () => mediaQuery.removeEventListener('change', updateResolvedTheme);
    }
  }, [isManual]);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme]);

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    isManual,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};