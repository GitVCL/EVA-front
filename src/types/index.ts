export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'super';
}

export interface Class {
  id: number;
  name: string;
  description: string | null;
  durationMinutes: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Schedule {
  id: number;
  classId: number;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  active: boolean;
  class?: { id: number; name: string; durationMinutes: number };
  booked?: number;
  available?: boolean;
}

export interface Student {
  id?: number;
  name: string;
  phone: string;
  email?: string | null;
}

export interface Appointment {
  id: number;
  studentId: number;
  scheduleId: number;
  status: 'confirmed' | 'cancelled' | 'attended' | 'missed';
  notes?: string | null;
  createdAt?: string;
  student?: Student;
  schedule?: Schedule & { class?: Class };
}

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
  details?: Record<string, string[]>;
  token?: string;
  user?: User;
}

export type BookingStep = 'class' | 'date' | 'time' | 'info' | 'confirm';

export interface BookingData {
  step: BookingStep;
  classId: number | null;
  className?: string;
  date: string | null;
  scheduleId: number | null;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  student: Student;
}
