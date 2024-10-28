import { useCallback } from 'react';
import { useTimeBlock } from '../context/TimeBlockContext';
import { TimeBlock } from '../types';

export function useTimeSlotClick() {
  const { dispatch } = useTimeBlock();

  const handleTimeSlotClick = useCallback((e: React.MouseEvent, hour: number) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const minutes = Math.floor((offsetY / rect.height) * 60);
    
    // Snap to nearest 30-minute interval
    const snappedMinutes = Math.round(minutes / 30) * 30;
    
    const startTime = new Date();
    startTime.setHours(hour, snappedMinutes, 0, 0);
    const endTime = new Date(startTime.getTime() + 60 * 60000); // 1 hour duration by default

    const newBlock: TimeBlock = {
      id: crypto.randomUUID(),
      title: 'New Block',
      startTime,
      endTime,
      category: '1',
      color: '#4f46e5',
      status: 'pending',
      priority: 'medium',
    };

    dispatch({ type: 'ADD_BLOCK', payload: newBlock });
  }, [dispatch]);

  return { handleTimeSlotClick };
}