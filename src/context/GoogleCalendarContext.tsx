import React, { createContext, useContext, useState, useCallback } from 'react';
import { GoogleCalendarService } from '@/lib/google-calendar';
import { TimeBlock } from '@/types';

interface GoogleCalendarContextType {
  isInitialized: boolean;
  isAuthorized: boolean;
  isLoading: boolean;
  error: Error | null;
  initialize: () => Promise<void>;
  authorize: () => Promise<void>;
  syncTimeBlock: (block: TimeBlock) => Promise<void>;
}

const GoogleCalendarContext = createContext<GoogleCalendarContextType | undefined>(undefined);

// Replace these with your actual Google API credentials
const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID';
const GOOGLE_API_KEY = 'YOUR_API_KEY';

export function GoogleCalendarProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const calendarService = GoogleCalendarService.getInstance();

  const initialize = useCallback(async () => {
    if (isInitialized) return;

    setIsLoading(true);
    setError(null);

    try {
      await calendarService.initialize(GOOGLE_CLIENT_ID, GOOGLE_API_KEY);
      setIsInitialized(true);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  const authorize = useCallback(async () => {
    if (!isInitialized) {
      throw new Error('Google Calendar not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      await calendarService.authorize();
      setIsAuthorized(true);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  const syncTimeBlock = useCallback(async (block: TimeBlock) => {
    if (!isAuthorized) {
      throw new Error('Not authorized');
    }

    setIsLoading(true);
    setError(null);

    try {
      await calendarService.syncTimeBlockToCalendar(block);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthorized]);

  return (
    <GoogleCalendarContext.Provider
      value={{
        isInitialized,
        isAuthorized,
        isLoading,
        error,
        initialize,
        authorize,
        syncTimeBlock,
      }}
    >
      {children}
    </GoogleCalendarContext.Provider>
  );
}

export function useGoogleCalendar() {
  const context = useContext(GoogleCalendarContext);
  if (context === undefined) {
    throw new Error('useGoogleCalendar must be used within a GoogleCalendarProvider');
  }
  return context;
}