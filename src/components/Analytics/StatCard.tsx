import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subtext: string;
  iconColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  subtext,
  iconColor = 'text-primary'
}) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground mt-1">{subtext}</p>
        </div>
        <div className={`p-2 bg-primary/10 rounded-lg ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};