import React from 'react';
import { LucideIcon } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

interface DistributionChartProps {
  title: string;
  icon: LucideIcon;
  data: Array<{
    label: string;
    count: number;
    color?: string;
  }>;
  total: number;
}

export const DistributionChart: React.FC<DistributionChartProps> = ({
  title,
  icon: Icon,
  data,
  total,
}) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-medium text-foreground">{title}</h3>
      </div>
      <div className="space-y-3">
        {data.map((item) => (
          <ProgressBar
            key={item.label}
            label={item.label}
            value={item.count}
            max={total}
            color={item.color}
            count={item.count}
          />
        ))}
      </div>
    </div>
  );
};