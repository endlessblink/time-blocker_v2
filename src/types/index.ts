// Previous types remain the same, adding new types for views
import { ReactNode } from 'react';

// Existing types remain...

export type CalendarView = 'day' | 'week' | 'month';

export interface ViewState {
  currentView: CalendarView;
  currentDate: Date;
  selectedDate: Date;
}

export interface ViewAction {
  type: 'SET_VIEW' | 'SET_DATE' | 'SET_SELECTED_DATE';
  payload: CalendarView | Date;
}

export interface UserPreferences {
  timeZone: string;
  startOfWeek: 0 | 1 | 6; // Sunday: 0, Monday: 1, Saturday: 6
  dayStartHour: number;
  dayEndHour: number;
  defaultView: CalendarView;
  theme: 'light' | 'dark' | 'system';
  showWeekends: boolean;
}