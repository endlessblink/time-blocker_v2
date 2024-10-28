import React from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { useView } from '@context/ViewContext';
import { useTimeBlock } from '@context/TimeBlockContext';
import { ResizableBlock } from './ResizableBlock';

export const WeekView: React.FC = () => {
  const { state: viewState } = useView();
  const { state: timeBlockState, dispatch } = useTimeBlock();
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = Array.from({ length: 7 }, (_, i) => addDays(viewState.currentDate, i));

  return (
    <div className="h-full overflow-auto bg-card rounded-lg border border-border">
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border">
        <div className="sticky top-0 z-10 bg-card" />
        {days.map(day => (
          <div
            key={day.toISOString()}
            className={`sticky top-0 z-10 bg-card p-2 text-center border-l border-border ${
              isSameDay(day, new Date()) ? 'bg-primary/5' : ''
            }`}
          >
            <div className="text-sm font-medium text-foreground">
              {format(day, 'EEE')}
            </div>
            <div className="text-sm text-muted-foreground">
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[60px_repeat(7,1fr)]">
        <div className="col-start-1">
          {hours.map(hour => (
            <div
              key={hour}
              className="h-20 border-b border-border text-sm text-muted-foreground px-2 py-1 bg-muted/30"
            >
              {format(new Date().setHours(hour), 'ha')}
            </div>
          ))}
        </div>

        {days.map(day => (
          <div key={day.toISOString()} className="relative border-l border-border">
            {hours.map(hour => (
              <div
                key={hour}
                className="h-20 border-b border-border hover:bg-muted/20 transition-colors"
              />
            ))}
            
            {timeBlockState.blocks
              .filter(block => isSameDay(block.startTime, day))
              .map(block => (
                <ResizableBlock
                  key={block.id}
                  block={block}
                  onUpdate={(updatedBlock) => {
                    dispatch({ type: 'UPDATE_BLOCK', payload: updatedBlock });
                  }}
                  onDelete={(id) => {
                    dispatch({ type: 'DELETE_BLOCK', payload: id });
                  }}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};