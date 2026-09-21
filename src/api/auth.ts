import axios, { AxiosError } from 'axios';
import type { ApiResponse, User } from '../types';

const API_URL = import.meta.env.VITE_API_AUTH_URL || 'http://localhost:3334';

export const authAxios = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

export async function loginApi(email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> {
  try {
    const res = await authAxios.post('/api/auth/login', { email, password });
    return res.data;
  } catch (err) {
    const axiosErr = err as AxiosError<ApiResponse<never>>;
    return (
      axiosErr.response?.data || {
        ok: false,
        error: 'Erro ao conectar ao servidor de autenticacao',
      }
    );
  }
}

export async function getMeApi(token: string): Promise<ApiResponse<User>> {
  try {
    const res = await authAxios.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    const axiosErr = err as AxiosError<ApiResponse<never>>;
    return axiosErr.response?.data || { ok: false, error: 'Token invalido' };
  }
}
