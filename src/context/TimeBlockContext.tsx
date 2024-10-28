import React, { createContext, useContext, useReducer } from 'react';
import { TimeBlockState, TimeBlockAction, TimeBlockContext as ITimeBlockContext } from '../types';

const initialState: TimeBlockState = {
  blocks: [],
  selectedBlock: null,
  draggedBlock: null,
  filter: {
    categories: [],
    dateRange: [new Date(), new Date()],
    status: ['pending', 'in-progress'],
    tags: [],
  },
};

function timeBlockReducer(state: TimeBlockState, action: TimeBlockAction): TimeBlockState {
  switch (action.type) {
    case 'ADD_BLOCK':
      return {
        ...state,
        blocks: [...state.blocks, action.payload],
      };
    case 'UPDATE_BLOCK':
      return {
        ...state,
        blocks: state.blocks.map(block => 
          block.id === action.payload.id ? action.payload : block
        ),
      };
    case 'DELETE_BLOCK':
      return {
        ...state,
        blocks: state.blocks.filter(block => block.id !== action.payload),
      };
    case 'SET_SELECTED_BLOCK':
      return {
        ...state,
        selectedBlock: action.payload,
      };
    case 'SET_DRAGGED_BLOCK':
      return {
        ...state,
        draggedBlock: action.payload,
      };
    case 'UPDATE_FILTER':
      return {
        ...state,
        filter: { ...state.filter, ...action.payload },
      };
    default:
      return state;
  }
}

const TimeBlockContext = createContext<ITimeBlockContext | undefined>(undefined);

export function TimeBlockProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(timeBlockReducer, initialState);

  return (
    <TimeBlockContext.Provider value={{ state, dispatch }}>
      {children}
    </TimeBlockContext.Provider>
  );
}

export function useTimeBlock() {
  const context = useContext(TimeBlockContext);
  if (context === undefined) {
    throw new Error('useTimeBlock must be used within a TimeBlockProvider');
  }
  return context;
}