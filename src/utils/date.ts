import type { Schedule } from '../types';
import { format, parseISO, addDays, startOfDay, isBefore, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const TZ = 'America/Sao_Paulo';

export const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
export const MONTHS = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
];

export function formatDateBR(dateStr: string): string {
  const d = parseISO(dateStr);
  return format(d, 'dd/MM/yyyy');
}

export function formatWeekday(dateStr: string): string {
  const d = parseISO(dateStr);
  return format(d, 'EEEE', { locale: ptBR });
}

export function formatShortDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd MMM', { locale: ptBR });
}

export function formatWeekdayShort(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return WEEKDAYS[d.getDay()];
}

export function isPastDate(date: Date): boolean {
  return isBefore(startOfDay(date), startOfDay(new Date()));
}

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getNextNDays(n: number): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < n; i++) {
    days.push(addDays(startOfDay(new Date()), i));
  }
  return days;
}

export function dateToISO(d: Date): string {
  return format(d, 'yyyy-MM-dd');
}

export function formatDateTimeFull(dateStr: string, startTime: string): string {
  const d = parseISO(dateStr);
  const weekday = format(d, 'EEEE', { locale: ptBR });
  const dateFmt = format(d, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  return `${capitalize(weekday)}, ${dateFmt} às ${startTime}`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function groupSchedulesByDate(schedules: Schedule[]): Record<string, Schedule[]> {
  const groups: Record<string, Schedule[]> = {};
  for (const s of schedules) {
    const key = s.date.slice(0, 10);
    if (!groups[key]) groups[key] = [];
    groups[key].push(s);
  }
  return groups;
}
