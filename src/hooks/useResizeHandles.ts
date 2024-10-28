import { useState, useCallback, useEffect } from 'react';
import { TimeBlock } from '../types';

type ResizeType = 'start' | 'end';

export function useResizeHandles(
  block: TimeBlock,
  onUpdate: (block: TimeBlock) => void,
  setIsResizing: (isResizing: boolean) => void
) {
  const [resizeType, setResizeType] = useState<ResizeType | null>(null);
  const [initialY, setInitialY] = useState(0);
  const [initialTime, setInitialTime] = useState<Date | null>(null);

  const snapToGrid = (date: Date): Date => {
    const minutes = date.getMinutes();
    const snappedMinutes = Math.round(minutes / 30) * 30;
    const newDate = new Date(date);
    newDate.setMinutes(snappedMinutes, 0, 0);
    return newDate;
  };

  const handleResizeStart = useCallback((e: React.MouseEvent, type: ResizeType) => {
    e.stopPropagation();
    setResizeType(type);
    setInitialY(e.clientY);
    setInitialTime(type === 'start' ? block.startTime : block.endTime);
    setIsResizing(true);
  }, [block, setIsResizing]);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!resizeType || !initialTime) return;

    const deltaY = e.clientY - initialY;
    const deltaHours = deltaY / 80; // 80px per hour
    
    const newTime = new Date(initialTime.getTime() + deltaHours * 60 * 60 * 1000);
    const snappedTime = snapToGrid(newTime);

    // Ensure minimum block duration (15 minutes)
    const minDuration = 15 * 60 * 1000;
    if (resizeType === 'start') {
      if (block.endTime.getTime() - snappedTime.getTime() < minDuration) return;
      onUpdate({ ...block, startTime: snappedTime });
    } else {
      if (snappedTime.getTime() - block.startTime.getTime() < minDuration) return;
      onUpdate({ ...block, endTime: snappedTime });
    }
  }, [resizeType, initialTime, initialY, block, onUpdate]);

  const handleResizeEnd = useCallback(() => {
    setResizeType(null);
    setInitialTime(null);
    setIsResizing(false);
  }, [setIsResizing]);

  useEffect(() => {
    if (resizeType) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
      
      return () => {
        window.removeEventListener('mousemove', handleResizeMove);
        window.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [resizeType, handleResizeMove, handleResizeEnd]);

  return {
    handleResizeStart,
    handleResizeEnd,
  };
}