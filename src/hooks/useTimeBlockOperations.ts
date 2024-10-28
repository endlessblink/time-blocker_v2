import { useCallback } from 'react';
import { TimeBlock, TimeSlot } from '../types';
import { useTimeBlock } from '../context/TimeBlockContext';

export function useTimeBlockOperations() {
  const { state, dispatch } = useTimeBlock();

  const createBlock = useCallback((blockData: Omit<TimeBlock, 'id'>) => {
    const newBlock: TimeBlock = {
      ...blockData,
      id: crypto.randomUUID(),
    };
    dispatch({ type: 'ADD_BLOCK', payload: newBlock });
  }, [dispatch]);

  const updateBlock = useCallback((block: TimeBlock) => {
    dispatch({ type: 'UPDATE_BLOCK', payload: block });
  }, [dispatch]);

  const deleteBlock = useCallback((blockId: string) => {
    dispatch({ type: 'DELETE_BLOCK', payload: blockId });
  }, [dispatch]);

  const moveBlock = useCallback((block: TimeBlock, slot: TimeSlot) => {
    const duration = block.endTime.getTime() - block.startTime.getTime();
    const updatedBlock: TimeBlock = {
      ...block,
      startTime: slot.startTime,
      endTime: new Date(slot.startTime.getTime() + duration),
    };
    dispatch({ type: 'UPDATE_BLOCK', payload: updatedBlock });
  }, [dispatch]);

  const getAvailableSlots = useCallback((date: Date): TimeSlot[] => {
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));
    const blocksForDay = state.blocks.filter(block => 
      block.startTime >= dayStart && block.endTime <= dayEnd
    );

    // Calculate available slots
    const slots: TimeSlot[] = [];
    let currentTime = dayStart;

    while (currentTime < dayEnd) {
      const slotEnd = new Date(currentTime.getTime() + 30 * 60000); // 30-minute slots
      const isAvailable = !blocksForDay.some(block => 
        block.startTime < slotEnd && block.endTime > currentTime
      );

      slots.push({
        startTime: new Date(currentTime),
        endTime: new Date(slotEnd),
        isAvailable,
      });

      currentTime = slotEnd;
    }

    return slots;
  }, [state.blocks]);

  return {
    createBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
    getAvailableSlots,
  };
}