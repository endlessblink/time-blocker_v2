import React from 'react';
import { X } from 'lucide-react';
import { ThemeSettings } from './ThemeSettings';
import { NotificationSettings } from './NotificationSettings';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  onOpenChange,
}) => {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog */}
      <div className="fixed inset-y-0 right-0 w-full max-w-[1000px] bg-card shadow-lg z-50 border-l border-border animate-in slide-in-from-right">
        <div className="h-full flex flex-col">
          <header className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Settings</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-lg p-2 hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-8">
              <section className="space-y-4">
                <ThemeSettings />
              </section>

              <section className="space-y-4">
                <NotificationSettings />
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}