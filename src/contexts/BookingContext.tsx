import React, { createContext, useContext, useReducer } from 'react';
import type { BookingData, BookingStep, Student, Schedule, Class } from '../types';

type Action =
  | { type: 'SET_STEP'; step: BookingStep }
  | { type: 'SELECT_CLASS'; cls: Class }
  | { type: 'SELECT_DATE'; date: string }
  | { type: 'SELECT_SCHEDULE'; schedule: Schedule }
  | { type: 'SET_STUDENT'; student: Student }
  | { type: 'RESET' };

const initial: BookingData = {
  step: 'class',
  classId: null,
  date: null,
  scheduleId: null,
  student: { name: '', phone: '', email: null },
};

function reducer(state: BookingData, action: Action): BookingData {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.step };
    case 'SELECT_CLASS':
      return {
        ...state,
        step: 'date',
        classId: action.cls.id,
        className: action.cls.name,
        durationMinutes: action.cls.durationMinutes,
      };
    case 'SELECT_DATE':
      return { ...state, step: 'time', date: action.date };
    case 'SELECT_SCHEDULE':
      return {
        ...state,
        step: 'info',
        scheduleId: action.schedule.id,
        startTime: action.schedule.startTime,
        endTime: action.schedule.endTime,
      };
    case 'SET_STUDENT':
      return { ...state, step: 'confirm', student: action.student };
    case 'RESET':
      return { ...initial };
    default:
      return state;
  }
}

type BookingContextState = {
  state: BookingData;
  setStep: (s: BookingStep) => void;
  selectClass: (c: Class) => void;
  selectDate: (d: string) => void;
  selectSchedule: (s: Schedule) => void;
  setStudent: (s: Student) => void;
  reset: () => void;
};

const BookingContext = createContext<BookingContextState | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  const setStep = (s: BookingStep) => dispatch({ type: 'SET_STEP', step: s });
  const selectClass = (c: Class) => dispatch({ type: 'SELECT_CLASS', cls: c });
  const selectDate = (d: string) => dispatch({ type: 'SELECT_DATE', date: d });
  const selectSchedule = (s: Schedule) => dispatch({ type: 'SELECT_SCHEDULE', schedule: s });
  const setStudent = (s: Student) => dispatch({ type: 'SET_STUDENT', student: s });
  const reset = () => dispatch({ type: 'RESET' });

  return (
    <BookingContext.Provider value={{ state, setStep, selectClass, selectDate, selectSchedule, setStudent, reset }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking(): BookingContextState {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}
