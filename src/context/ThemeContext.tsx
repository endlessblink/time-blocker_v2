import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme;
    return saved || defaultTheme;
  });
  
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const applyTheme = () => {
      const systemDark = mediaQuery.matches;
      const isDarkMode = theme === 'system' ? systemDark : theme === 'dark';
      setIsDark(isDarkMode);
      
      if ('startViewTransition' in document) {
        // @ts-ignore - Experimental API
        document.startViewTransition(() => {
          root.classList.remove('light', 'dark');
          root.classList.add(isDarkMode ? 'dark' : 'light');
        });
      } else {
        root.classList.remove('light', 'dark');
        root.classList.add(isDarkMode ? 'dark' : 'light');
      }
    };

    applyTheme();
    localStorage.setItem('theme', theme);

    const listener = () => applyTheme();
    mediaQuery.addEventListener('change', listener);
    
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  const value = {
    theme,
    setTheme,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}