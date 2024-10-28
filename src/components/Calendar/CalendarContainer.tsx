import React from 'react';
import { useView } from '@context/ViewContext';
import { DayView } from './DayView';
import { WeekView } from './WeekView';
import { MonthView } from './MonthView';
import { ViewSwitcher } from '../Navigation/ViewSwitcher';
import { DateNavigator } from '../Navigation/DateNavigator';

export const CalendarContainer: React.FC = () => {
  const { state } = useView();

  const renderView = () => {
    switch (state.currentView) {
      case 'day':
        return <DayView />;
      case 'week':
        return <WeekView />;
      case 'month':
        return <MonthView />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6 px-4 py-2 bg-card rounded-lg border border-border">
        <DateNavigator />
        <ViewSwitcher />
      </div>
      <div className="flex-1 overflow-hidden">
        {renderView()}
      </div>
    </div>
  );
};