import React from 'react';
import { Bell } from 'lucide-react';
import { useNotification } from '@context/NotificationContext';
import { VolumeSlider } from './VolumeSlider';
import { ToggleSwitch } from './ToggleSwitch';
import { SoundTestButton } from './SoundTestButton';

export const NotificationSettings: React.FC = () => {
  const { settings, updateSettings, hasPermission, requestPermission, playSound } = useNotification();

  const handlePermissionRequest = async () => {
    if (!hasPermission) {
      await requestPermission();
    }
    updateSettings({ enabled: !settings.enabled });
  };

  const handleTestSound = async (type: 'warning' | 'start') => {
    try {
      await playSound(type);
    } catch (error) {
      console.error(`Error playing ${type} sound:`, error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Bell className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-medium text-foreground">Notifications</h3>
      </div>

      <div className="space-y-5">
        <div className="p-5 bg-muted/50 rounded-lg border border-border">
          <ToggleSwitch
            checked={settings.enabled}
            onChange={handlePermissionRequest}
            label="Enable Notifications"
            description={
              !hasPermission
                ? 'Browser permissions required'
                : 'Receive notifications for upcoming time blocks'
            }
          />
        </div>

        {!hasPermission && settings.enabled && (
          <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md">
            <span>Please allow notifications in your browser settings</span>
          </div>
        )}

        <div className="p-5 bg-muted/50 rounded-lg border border-border">
          <VolumeSlider
            volume={settings.volume}
            onChange={(volume) => updateSettings({ volume })}
          />
        </div>

        {[
          { id: 'warning' as const, label: 'Warning Sound' },
          { id: 'start' as const, label: 'Start Sound' },
        ].map(({ id, label }) => (
          <div 
            key={id} 
            className="p-5 bg-muted/50 rounded-lg border border-border"
          >
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-4 min-w-0 flex-shrink">
                <span className="text-base text-foreground whitespace-nowrap">
                  {label}
                </span>
                <SoundTestButton
                  onClick={() => handleTestSound(id)}
                  label={label}
                  disabled={!settings.enabled || !settings.sounds[id]}
                />
              </div>
              <ToggleSwitch
                checked={settings.sounds[id]}
                onChange={() =>
                  updateSettings({
                    sounds: {
                      ...settings.sounds,
                      [id]: !settings.sounds[id],
                    },
                  })
                }
                label={label}
              />
            </div>
          </div>
        ))}

        <div className="p-5 bg-muted/50 rounded-lg border border-border">
          <label className="block text-base text-foreground mb-3">
            Warning Time
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max="30"
              value={settings.warningTime}
              onChange={(e) =>
                updateSettings({ warningTime: Math.max(1, parseInt(e.target.value, 10)) })
              }
              className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            />
            <span className="text-sm text-muted-foreground">minutes before start</span>
          </div>
        </div>
      </div>
    </div>
  );
}