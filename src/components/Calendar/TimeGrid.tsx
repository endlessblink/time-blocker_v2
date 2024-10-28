import React, { useCallback, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useTimeBlock } from '../../context/TimeBlockContext';
import { ResizableBlock } from './ResizableBlock';
import { useTimeSlotClick } from '../../hooks/useTimeSlotClick';

export const TimeGrid: React.FC = () => {
  const { state, dispatch } = useTimeBlock();
  const { handleTimeSlotClick } = useTimeSlotClick();
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const timelinePosition = (currentTime.getHours() + currentTime.getMinutes() / 60) * 80; // 80px per hour

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, hour: number) => {
    e.preventDefault();
    const blockId = e.dataTransfer.getData('blockId');
    const block = state.blocks.find(b => b.id === blockId);
    
    if (block) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const offsetY = e.clientY - rect.top;
      const minutes = Math.floor((offsetY / rect.height) * 60);
      const snappedMinutes = Math.round(minutes / 30) * 30;
      
      const newStartTime = new Date();
      newStartTime.setHours(hour, snappedMinutes, 0, 0);
      const duration = block.endTime.getTime() - block.startTime.getTime();
      const newEndTime = new Date(newStartTime.getTime() + duration);

      dispatch({
        type: 'UPDATE_BLOCK',
        payload: { ...block, startTime: newStartTime, endTime: newEndTime },
      });
    }
  }, [state.blocks, dispatch]);

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="grid grid-cols-[60px_1fr] gap-0 h-[calc(100vh-12rem)] overflow-y-auto relative">
        {/* Time markers */}
        <div className="col-start-1 col-span-1 border-r border-border bg-muted/30 sticky left-0">
          {hours.map(hour => (
            <div key={hour} className="h-20 border-b border-border">
              <div className="px-2 py-1 text-sm font-medium text-muted-foreground sticky top-0">
                {format(new Date().setHours(hour), 'ha')}
              </div>
              <div className="h-1/2 border-b border-border/30" />
            </div>
          ))}
        </div>
        
        {/* Time grid */}
        <div className="col-start-2 col-span-1 relative">
          {/* Current time indicator */}
          <div 
            className="absolute left-0 right-4 border-t-2 border-primary z-10 pointer-events-none transition-all duration-300"
            style={{ top: `${timelinePosition}px` }}
          >
            <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-primary" />
            <div className="absolute -right-4 -top-3 bg-primary text-primary-foreground text-xs px-1 py-0.5 rounded">
              {format(currentTime, 'HH:mm')}
            </div>
          </div>

          {/* Hour slots */}
          {hours.map(hour => (
            <div
              key={hour}
              className={`h-20 border-b border-border transition-colors ${
                hoveredHour === hour ? 'bg-muted/30' : 'hover:bg-muted/20'
              }`}
              onMouseEnter={() => setHoveredHour(hour)}
              onMouseLeave={() => setHoveredHour(null)}
              onClick={(e) => handleTimeSlotClick(e, hour)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, hour)}
            >
              {/* 30-minute marker */}
              <div className="h-1/2 border-b border-border/50" />
            </div>
          ))}
          
          {/* Time blocks */}
          {state.blocks.map(block => (
            <ResizableBlock
              key={block.id}
              block={block}
              onUpdate={(updatedBlock) => 
                dispatch({ type: 'UPDATE_BLOCK', payload: updatedBlock })
              }
              onDelete={(id) => 
                dispatch({ type: 'DELETE_BLOCK', payload: id })
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};