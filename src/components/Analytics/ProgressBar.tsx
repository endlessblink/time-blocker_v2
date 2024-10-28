import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  label: string;
  count: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  color = 'bg-primary',
  label,
  count,
}) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="flex items-center gap-4">
      <div className="w-32 text-sm text-muted-foreground">{label}</div>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-500 ease-in-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="w-12 text-sm text-muted-foreground text-right">{count}</div>
    </div>
  );
};