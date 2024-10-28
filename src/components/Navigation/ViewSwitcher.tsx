import React from 'react';
import { Calendar, Clock, CalendarDays } from 'lucide-react';
import { useView } from '../../context/ViewContext';
import { CalendarView } from '../../types';

export const ViewSwitcher: React.FC = () => {
  const { state, dispatch } = useView();

  const views: { id: CalendarView; label: string; icon: React.ReactNode }[] = [
    { id: 'day', label: 'Day', icon: <Clock className="w-4 h-4" /> },
    { id: 'week', label: 'Week', icon: <Calendar className="w-4 h-4" /> },
    { id: 'month', label: 'Month', icon: <CalendarDays className="w-4 h-4" /> },
  ];

  return (
    <div className="flex space-x-1 bg-muted/30 rounded-lg p-1 w-full lg:w-auto">
      {views.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => dispatch({ type: 'SET_VIEW', payload: id })}
          className={`flex items-center justify-center flex-1 lg:flex-none px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            state.currentView === id
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
          }`}
        >
          {icon}
          <span className="ml-2">{label}</span>
        </button>
      ))}
    </div>
  );
};