import React, { createContext, useContext, useReducer } from 'react';
import { ViewState, ViewAction, CalendarView } from '../types';

const initialState: ViewState = {
  currentView: 'day',
  currentDate: new Date(),
  selectedDate: new Date(),
};

function viewReducer(state: ViewState, action: ViewAction): ViewState {
  switch (action.type) {
    case 'SET_VIEW':
      return {
        ...state,
        currentView: action.payload as CalendarView,
      };
    case 'SET_DATE':
      return {
        ...state,
        currentDate: action.payload as Date,
      };
    case 'SET_SELECTED_DATE':
      return {
        ...state,
        selectedDate: action.payload as Date,
      };
    default:
      return state;
  }
}

const ViewContext = createContext<{
  state: ViewState;
  dispatch: React.Dispatch<ViewAction>;
} | undefined>(undefined);

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(viewReducer, initialState);

  return (
    <ViewContext.Provider value={{ state, dispatch }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
}