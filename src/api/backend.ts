import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import type { ApiResponse, Class, Schedule, Appointment } from '../types';

const API_URL = import.meta.env.VITE_API_BACKEND_URL || 'http://localhost:3333';

const backendAxios = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

backendAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('eva_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function handleError<T>(err: unknown, fallback = 'Erro no servidor'): ApiResponse<T> {
  const axiosErr = err as AxiosError<ApiResponse<never>>;
  return axiosErr.response?.data || { ok: false, error: fallback };
}

// ======= CLASSES =======
export async function listClassesApi(admin = false): Promise<ApiResponse<Class[]>> {
  try {
    const res = await backendAxios.get('/api/classes');
    return res.data;
  } catch (err) {
    return handleError<Class[]>(err, 'Erro ao carregar aulas');
  }
}

export async function createClassApi(data: Partial<Class>): Promise<ApiResponse<Class>> {
  try {
    const res = await backendAxios.post('/api/classes', data);
    return res.data;
  } catch (err) {
    return handleError<Class>(err, 'Erro ao criar aula');
  }
}

export async function updateClassApi(id: number, data: Partial<Class>): Promise<ApiResponse<Class>> {
  try {
    const res = await backendAxios.patch(`/api/classes/${id}`, data);
    return res.data;
  } catch (err) {
    return handleError<Class>(err, 'Erro ao atualizar aula');
  }
}

// ======= SCHEDULES =======
export async function listAvailableSchedulesApi(params?: {
  from?: string;
  to?: string;
  classId?: number;
}): Promise<ApiResponse<Schedule[]>> {
  try {
    const res = await backendAxios.get('/api/schedules/available', { params });
    return res.data;
  } catch (err) {
    return handleError<Schedule[]>(err, 'Erro ao carregar horarios');
  }
}

export async function listAllSchedulesApi(): Promise<ApiResponse<Schedule[]>> {
  try {
    const res = await backendAxios.get('/api/schedules');
    return res.data;
  } catch (err) {
    return handleError<Schedule[]>(err, 'Erro ao carregar horarios');
  }
}

export async function createScheduleApi(data: any): Promise<ApiResponse<Schedule>> {
  try {
    const res = await backendAxios.post('/api/schedules', data);
    return res.data;
  } catch (err) {
    return handleError<Schedule>(err, 'Erro ao criar horario');
  }
}

export async function updateScheduleApi(id: number, data: any): Promise<ApiResponse<Schedule>> {
  try {
    const res = await backendAxios.patch(`/api/schedules/${id}`, data);
    return res.data;
  } catch (err) {
    return handleError<Schedule>(err, 'Erro ao atualizar horario');
  }
}

// ======= APPOINTMENTS =======
export async function listAppointmentsApi(params?: {
  status?: string;
  from?: string;
  to?: string;
}): Promise<ApiResponse<Appointment[]>> {
  try {
    const res = await backendAxios.get('/api/appointments', { params });
    return res.data;
  } catch (err) {
    return handleError<Appointment[]>(err, 'Erro ao carregar agendamentos');
  }
}

export async function createAppointmentApi(data: {
  scheduleId: number;
  student: { name: string; phone: string; email?: string | null };
  notes?: string | null;
}): Promise<ApiResponse<Appointment>> {
  try {
    const res = await backendAxios.post('/api/appointments', data);
    return res.data;
  } catch (err) {
    return handleError<Appointment>(err, 'Erro ao criar agendamento');
  }
}

export async function updateAppointmentStatusApi(
  id: number,
  status: Appointment['status']
): Promise<ApiResponse<Appointment>> {
  try {
    const res = await backendAxios.patch(`/api/appointments/${id}/status`, { status });
    return res.data;
  } catch (err) {
    return handleError<Appointment>(err, 'Erro ao atualizar status');
  }
}
