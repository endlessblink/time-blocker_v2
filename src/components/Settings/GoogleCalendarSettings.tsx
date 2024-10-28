import React from 'react';
import { Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { useGoogleCalendar } from '@/context/GoogleCalendarContext';

export const GoogleCalendarSettings: React.FC = () => {
  const {
    isInitialized,
    isAuthorized,
    isLoading,
    error,
    initialize,
    authorize,
  } = useGoogleCalendar();

  const handleConnect = async () => {
    try {
      if (!isInitialized) {
        await initialize();
      }
      await authorize();
    } catch (err) {
      // Error is handled by context
    }
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center space-x-2">
        <Calendar className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-medium text-foreground">Google Calendar</h3>
      </header>

      <div className="p-4 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-foreground">
              {isAuthorized ? 'Connected' : 'Connect Google Calendar'}
            </h4>
            <p className="text-sm text-muted-foreground">
              {isAuthorized
                ? 'Your time blocks will sync with Google Calendar'
                : 'Sync your time blocks with Google Calendar'}
            </p>
          </div>

          <button
            onClick={handleConnect}
            disabled={isLoading || isAuthorized}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isAuthorized
                ? 'bg-primary/10 text-primary cursor-default'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                Connecting...
              </>
            ) : isAuthorized ? (
              'Connected'
            ) : (
              'Connect'
            )}
          </button>
        </div>

        {error && (
          <div className="mt-3 flex items-center space-x-2 text-xs text-destructive bg-destructive/10 p-2 rounded-md">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};