import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { ThemeSettings } from './ThemeSettings';
import { NotificationSettings } from './NotificationSettings';

export const SettingsPanel: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card rounded-lg shadow-lg border border-border animate-fade-in">
        <div className="p-8 space-y-8">
          <header className="flex items-center space-x-3 pb-6 border-b border-border">
            <SettingsIcon className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Settings</h2>
          </header>

          <div className="space-y-12">
            <section className="space-y-6">
              <ThemeSettings />
            </section>

            <section className="space-y-6">
              <NotificationSettings />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};