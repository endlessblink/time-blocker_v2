import { ReactNode } from 'react';

export interface NotificationSoundConfig {
  volume: number;
  enabled: boolean;
  warningTime: number;
  sounds: {
    warning: boolean;
    start: boolean;
  };
}

export interface NotificationContextType {
  settings: NotificationSoundConfig;
  updateSettings: (settings: Partial<NotificationSoundConfig>) => void;
  hasPermission: boolean | null;
  requestPermission: () => Promise<void>;
  playSound: (type: 'warning' | 'start') => void;
}

export interface NotificationProviderProps {
  children: ReactNode;
}