import React, { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Card from '../../components/Card';
import Badge, { statusBadgeVariant, statusLabel } from '../../components/Badge';
import { CalendarCheck, Users, BookOpen, TrendingUp, ChevronRight, Clock, Calendar } from 'lucide-react';
import { listAppointmentsApi, listAvailableSchedulesApi, listClassesApi } from '../../api/backend';
import type { Appointment, Schedule, Class as ClassT } from '../../types';
import { formatDateBR, formatWeekday } from '../../utils/date';
import { useAuth } from '../../contexts/AuthContext';

const Stat: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode; tone?: 'primary' | 'success' | 'neutral' }> = ({
  icon, label, value, tone = 'neutral',
}) => {
  const tones: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    neutral: 'bg-bg-elev text-primary',
  };
  return (
    <Card variant="default" padding="md">
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${tones[tone]}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-text-muted uppercase tracking-wider font-semibold leading-none">{label}</p>
          <p className="text-2xl font-extrabold mt-1 tracking-tight">{value}</p>
        </div>
      </div>
    </Card>
  );
};

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    todayAppointments: 0,
    nextWeek: 0,
    confirmed: 0,
    activeClasses: 0,
  });
  const [nextSchedules, setNextSchedules] = useState<Schedule[]>([]);
  const [recent, setRecent] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [apt, sched, cls] = await Promise.all([
          listAppointmentsApi(),
          listAvailableSchedulesApi(),
          listClassesApi(true),
        ]);

        const today = new Date().toISOString().slice(0, 10);
        const in7 = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 10);

        if (!cancelled) {
          setStats({
            todayAppointments: apt.ok && apt.data ? apt.data.filter((a) => a.schedule?.date?.slice(0, 10) === today).length : 0,
            nextWeek: apt.ok && apt.data ? apt.data.filter((a) => {
              const d = a.schedule?.date?.slice(0, 10);
              return !!d && d >= today && d <= in7 && a.status === 'confirmed';
            }).length : 0,
            confirmed: apt.ok && apt.data ? apt.data.filter((a) => a.status === 'confirmed').length : 0,
            activeClasses: cls.ok && cls.data ? cls.data.filter((c) => c.active).length : 0,
          });
          setNextSchedules(sched.ok && sched.data ? sched.data.slice(0, 5) : []);
          setRecent(apt.ok && apt.data ? apt.data.slice(0, 5) : []);
        }
      } catch (err) {
        console.error('Dashboard load failed', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppLayout variant="admin" showLogout>
      <div className="w-full px-4 pt-4 pb-4 flex flex-col gap-4">
        <div>
          <p className="text-text-muted text-sm">Olá,</p>
          <h2 className="text-2xl font-extrabold tracking-tight -mt-0.5">
            {user?.name?.split(' ')[0] || 'Admin'} 👋
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Stat icon={<CalendarCheck className="w-5 h-5" />} label="Hoje" value={stats.todayAppointments} tone="primary" />
          <Stat icon={<TrendingUp className="w-5 h-5" />} label="Próximos 7 dias" value={stats.nextWeek} tone="success" />
          <Stat icon={<Users className="w-5 h-5" />} label="Confirmados" value={stats.confirmed} />
          <Stat icon={<BookOpen className="w-5 h-5" />} label="Aulas ativas" value={stats.activeClasses} tone="success" />
        </div>

        <Card variant="elevated" padding="md">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold">Próximos horários</h3>
              <p className="text-xs text-text-muted">Disponíveis para agendamento</p>
            </div>
            <ChevronRight className="w-5 h-5 text-text-muted" />
          </div>
          {loading ? (
            <p className="text-sm text-text-dim">Carregando...</p>
          ) : nextSchedules.length === 0 ? (
            <p className="text-sm text-text-muted">Nenhum horário cadastrado.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {nextSchedules.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-bg border border-border"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{s.class?.name}</p>
                      <p className="text-xs text-text-dim capitalize">{formatWeekday(s.date)}, {formatDateBR(s.date)}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-primary">{s.startTime}</p>
                    <p className="text-[10.5px] text-text-muted">{s.capacity - (s.booked || 0)} vaga(s)</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card variant="default" padding="md">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold">Agendamentos recentes</h3>
              <p className="text-xs text-text-muted">Últimos cadastrados</p>
            </div>
            <ChevronRight className="w-5 h-5 text-text-muted" />
          </div>
          {loading ? (
            <p className="text-sm text-text-dim">Carregando...</p>
          ) : recent.length === 0 ? (
            <p className="text-sm text-text-muted">Ainda sem agendamentos.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {recent.map((a) => (
                <div key={a.id} className="p-3 rounded-xl bg-bg-elev border border-border/70">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{a.student?.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-text-muted">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {a.schedule?.date ? formatDateBR(a.schedule.date) : '—'} • {a.schedule?.startTime || '—'}
                        </span>
                      </div>
                    </div>
                    <Badge variant={statusBadgeVariant[a.status] || 'neutral'}>
                      {statusLabel[a.status] || a.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
