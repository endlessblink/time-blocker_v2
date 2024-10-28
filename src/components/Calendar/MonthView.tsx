import React from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { useView } from '@context/ViewContext';
import { useTimeBlock } from '@context/TimeBlockContext';

export const MonthView: React.FC = () => {
  const { state: viewState, dispatch } = useView();
  const { state: timeBlockState } = useTimeBlock();
  
  const monthStart = startOfMonth(viewState.currentDate);
  const monthEnd = endOfMonth(viewState.currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getBlocksForDay = (date: Date) => {
    return timeBlockState.blocks.filter(block => 
      isSameDay(block.startTime, date)
    );
  };

  return (
    <div className="h-full overflow-auto bg-card rounded-lg border border-border">
      <div className="grid grid-cols-7 border-b border-border">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            className="bg-muted/30 p-2 text-center text-sm font-medium text-foreground"
          >
            {day}
          </div>
        ))}
        
        {days.map(day => {
          const dayBlocks = getBlocksForDay(day);
          const isCurrentMonth = isSameMonth(day, viewState.currentDate);
          
          return (
            <div
              key={day.toISOString()}
              onClick={() => {
                dispatch({ type: 'SET_SELECTED_DATE', payload: day });
                dispatch({ type: 'SET_VIEW', payload: 'day' });
              }}
              className={`min-h-[120px] p-2 border-b border-r border-border hover:bg-muted/20 transition-colors cursor-pointer ${
                !isCurrentMonth ? 'text-muted-foreground bg-muted/5' : ''
              } ${isToday(day) ? 'bg-primary/5' : ''}`}
            >
              <div className={`font-medium text-sm mb-1 ${
                isToday(day) ? 'text-primary' : 'text-foreground'
              }`}>
                {format(day, 'd')}
              </div>
              
              <div className="space-y-1">
                {dayBlocks.slice(0, 3).map(block => (
                  <div
                    key={block.id}
                    className="text-xs px-2 py-1 rounded truncate"
                    style={{ 
                      backgroundColor: `${block.color}20`,
                      color: block.color,
                      border: `1px solid ${block.color}40`
                    }}
                  >
                    {block.title}
                  </div>
                ))}
                {dayBlocks.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{dayBlocks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};