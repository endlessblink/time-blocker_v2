import React, { useMemo } from 'react';
import { useTimeBlock } from '@context/TimeBlockContext';
import { 
  Clock, 
  TrendingUp, 
  CheckCircle,
  Target,
  PieChart,
  BarChart2,
  AlertCircle
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { StatCard } from './StatCard';
import { DistributionChart } from './DistributionChart';

export const Analytics: React.FC = () => {
  const { state } = useTimeBlock();
  const blocks = state.blocks;

  const stats = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    const today = startOfDay(now);
    const todayEnd = endOfDay(now);

    const weeklyBlocks = blocks.filter(block => 
      isWithinInterval(block.startTime, { start: weekStart, end: weekEnd })
    );

    const todayBlocks = blocks.filter(block => 
      isWithinInterval(block.startTime, { start: today, end: todayEnd })
    );

    const completedBlocks = blocks.filter(block => block.status === 'completed');
    const totalDuration = blocks.reduce((acc, block) => 
      acc + (block.endTime.getTime() - block.startTime.getTime()), 0
    );

    return [
      {
        icon: Clock,
        label: 'Total Hours',
        value: `${Math.round(totalDuration / (1000 * 60 * 60))}h`,
        subtext: 'Time blocked this week',
        iconColor: 'text-blue-500',
      },
      {
        icon: TrendingUp,
        label: 'Daily Average',
        value: `${Math.round(todayBlocks.length)}`,
        subtext: 'Blocks per day',
        iconColor: 'text-green-500',
      },
      {
        icon: CheckCircle,
        label: 'Completion Rate',
        value: `${Math.round((completedBlocks.length / blocks.length) * 100 || 0)}%`,
        subtext: 'Tasks completed',
        iconColor: 'text-purple-500',
      },
      {
        icon: Target,
        label: 'Weekly Goal',
        value: `${weeklyBlocks.length}`,
        subtext: 'Blocks this week',
        iconColor: 'text-orange-500',
      },
    ];
  }, [blocks]);

  const distributions = useMemo(() => [
    {
      title: 'Status Distribution',
      icon: PieChart,
      data: [
        { label: 'Completed', count: blocks.filter(b => b.status === 'completed').length, color: 'bg-green-500' },
        { label: 'In Progress', count: blocks.filter(b => b.status === 'in-progress').length, color: 'bg-blue-500' },
        { label: 'Pending', count: blocks.filter(b => b.status === 'pending').length, color: 'bg-orange-500' },
      ],
      total: blocks.length,
    },
    {
      title: 'Priority Distribution',
      icon: BarChart2,
      data: [
        { label: 'High', count: blocks.filter(b => b.priority === 'high').length, color: 'bg-red-500' },
        { label: 'Medium', count: blocks.filter(b => b.priority === 'medium').length, color: 'bg-yellow-500' },
        { label: 'Low', count: blocks.filter(b => b.priority === 'low').length, color: 'bg-green-500' },
      ],
      total: blocks.length,
    },
  ], [blocks]);

  if (blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 text-center px-4">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Time Blocks Yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Create some time blocks to see your productivity analytics and insights here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
        <h2 className="text-2xl font-semibold text-foreground">Analytics</h2>
        <div className="text-sm text-muted-foreground">
          Last updated: {format(new Date(), 'MMM d, yyyy HH:mm')}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {distributions.map((dist, index) => (
          <DistributionChart key={index} {...dist} />
        ))}
      </div>
    </div>
  );
};