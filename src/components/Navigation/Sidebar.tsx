import React, { useState } from 'react';
import { Calendar, BarChart2, Settings, X } from 'lucide-react';
import { SettingsDialog } from '@components/Settings/SettingsDialog';

interface SidebarProps {
  activeView: 'calendar' | 'analytics';
  onViewChange: (view: 'calendar' | 'analytics') => void;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, onClose }) => {
  const [showSettings, setShowSettings] = useState(false);

  const menuItems = [
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings', onClick: () => setShowSettings(true) },
  ] as const;

  return (
    <div className="w-[340px] lg:w-[360px] bg-card border-r border-border h-[100dvh] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Calendar className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold text-foreground">TimeBlock</span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 hover:bg-muted rounded-lg"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map(({ id, label, icon: Icon, onClick }) => (
          <button
            key={id}
            onClick={() => {
              if (onClick) {
                onClick();
                onClose();
              } else if (id === 'calendar' || id === 'analytics') {
                onViewChange(id);
                onClose();
              }
            }}
            className={`flex w-full items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              id !== 'settings' && activeView === id
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="ml-3">{label}</span>
          </button>
        ))}
      </nav>

      <SettingsDialog 
        open={showSettings} 
        onOpenChange={setShowSettings} 
      />
    </div>
  );
}