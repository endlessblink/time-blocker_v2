import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, addWeeks, addMonths } from 'date-fns';
import { useView } from '../../context/ViewContext';

export const DateNavigator: React.FC = () => {
  const { state, dispatch } = useView();
  const { currentView, currentDate } = state;

  const navigate = (direction: 'prev' | 'next') => {
    const multiplier = direction === 'prev' ? -1 : 1;
    let newDate = currentDate;

    switch (currentView) {
      case 'day':
        newDate = addDays(currentDate, 1 * multiplier);
        break;
      case 'week':
        newDate = addWeeks(currentDate, 1 * multiplier);
        break;
      case 'month':
        newDate = addMonths(currentDate, 1 * multiplier);
        break;
    }

    dispatch({ type: 'SET_DATE', payload: newDate });
  };

  const getDateLabel = () => {
    switch (currentView) {
      case 'day':
        return format(currentDate, 'MMMM d, yyyy');
      case 'week':
        const weekEnd = addDays(currentDate, 6);
        return `${format(currentDate, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center justify-between w-full lg:w-auto lg:justify-start lg:space-x-4">
      <button
        onClick={() => navigate('prev')}
        className="p-1 rounded-full hover:bg-muted/50 text-foreground"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button
        onClick={() => dispatch({ type: 'SET_DATE', payload: new Date() })}
        className="px-3 py-1 text-sm font-medium text-primary hover:bg-primary/10 rounded-md mx-2"
      >
        Today
      </button>
      
      <span className="text-base lg:text-lg font-semibold text-foreground min-w-[180px] text-center">
        {getDateLabel()}
      </span>
      
      <button
        onClick={() => navigate('next')}
        className="p-1 rounded-full hover:bg-muted/50 text-foreground"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};