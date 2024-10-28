import React from 'react';
import { Volume2 } from 'lucide-react';

interface VolumeSliderProps {
  volume: number;
  onChange: (volume: number) => void;
}

export const VolumeSlider: React.FC<VolumeSliderProps> = ({ volume, onChange }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Volume2 className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Volume</span>
      </div>
      <div className="space-y-1.5">
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          aria-label="Notification volume"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span>{Math.round(volume * 100)}%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}