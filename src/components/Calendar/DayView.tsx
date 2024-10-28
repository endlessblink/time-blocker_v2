import React from 'react';
import { TimeGrid } from './TimeGrid';
import { BlockCreator } from '../TimeBlock/BlockCreator';

export const DayView: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <BlockCreator />
      </div>
      <div className="flex-1">
        <TimeGrid />
      </div>
    </div>
  );
};