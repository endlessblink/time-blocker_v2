import { useCallback, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'system';
  });

  const [isDark, setIsDark] = useState(false);

  const applyTheme = useCallback((newTheme: Theme) => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const systemDark = mediaQuery.matches;
    
    const isDarkMode = newTheme === 'system' ? systemDark : newTheme === 'dark';
    setIsDark(isDarkMode);
    
    root.classList.remove('light', 'dark');
    root.classList.add(isDarkMode ? 'dark' : 'light');
    
    localStorage.setItem('theme', newTheme);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    applyTheme(theme);
    
    const listener = () => applyTheme(theme);
    mediaQuery.addEventListener('change', listener);
    
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme, applyTheme]);

  return { theme, setTheme, isDark };
}