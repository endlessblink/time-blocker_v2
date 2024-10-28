import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@context/ThemeContext';

export const ThemeSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ] as const;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">Theme</h3>
      <div className="grid grid-cols-3 gap-2">
        {themes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTheme(id)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
              theme === id
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-muted-foreground/25 hover:bg-accent'
            }`}
          >
            <Icon className={`w-5 h-5 mb-1 transition-colors ${
              theme === id ? 'text-primary' : 'text-muted-foreground'
            }`} />
            <span className={`text-xs font-medium transition-colors ${
              theme === id ? 'text-primary' : 'text-muted-foreground'
            }`}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}