import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNotificationSound } from '../hooks/useNotificationSound';
import type { NotificationSettings } from '@/types/notification';

interface NotificationContextType {
  settings: NotificationSettings;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  hasPermission: boolean | null;
  requestPermission: () => Promise<void>;
  playSound: (type: 'warning' | 'start') => Promise<void>;
}

const defaultSettings: NotificationSettings = {
  enabled: true,
  volume: 0.7,
  warningTime: 5,
  sounds: {
    warning: true,
    start: true,
  },
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { playSound } = useNotificationSound({ settings });

  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if ('Notification' in window) {
      setHasPermission(Notification.permission === 'granted');
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setHasPermission(permission === 'granted');
      } catch (error) {
        console.error('Failed to request notification permission:', error);
        setHasPermission(false);
      }
    }
  };

  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        settings,
        updateSettings,
        hasPermission,
        requestPermission,
        playSound,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

export type { NotificationSettings };