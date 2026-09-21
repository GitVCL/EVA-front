import React, { useEffect, useState, useMemo } from 'react';
import AppLayout from '../../components/AppLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge, { statusBadgeVariant, statusLabel } from '../../components/Badge';
import { useToast } from '../../components/Toast';
import { Calendar, Clock, Phone, Filter, XCircle, CheckCircle2, CalendarX, CalendarCheck, Loader2, ChevronDown } from 'lucide-react';
import { listAppointmentsApi, updateAppointmentStatusApi } from '../../api/backend';
import type { Appointment } from '../../types';
import { formatDateBR, formatWeekday } from '../../utils/date';
import { formatPhone } from '../../utils/phone';

type StatusFilter = 'all' | Appointment['status'];

const AppointmentsPage: React.FC = () => {
  const [all, setAll] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [openFilter, setOpenFilter] = useState(false);
  const { showToast } = useToast();

  const load = async () => {
    setLoading(true);
    const res = await listAppointmentsApi();
    if (res.ok && res.data) setAll(res.data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => filter === 'all' ? all : all.filter((a) => a.status === filter), [all, filter]);

  const grouped = useMemo(() => {
    const g: Record<string, Appointment[]> = {};
    for (const a of filtered) {
      const k = a.schedule?.date?.slice(0, 10) || 'sem-data';
      if (!g[k]) g[k] = [];
      g[k].push(a);
    }
    return { keys: Object.keys(g).sort(), g };
  }, [filtered]);

  const changeStatus = async (a: Appointment, status: Appointment['status']) => {
    const res = await updateAppointmentStatusApi(a.id, status);
    if (res.ok) {
      setAll((prev) => prev.map((x) => x.id === a.id ? { ...x, status } : x));
      showToast(`Status: ${statusLabel[status]}`, 'success');
    } else {
      showToast(res.error || 'Erro', 'error');
    }
  };

  const filterOptions: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'confirmed', label: 'Confirmados' },
    { key: 'attended', label: 'Presentes' },
    { key: 'missed', label: 'Faltas' },
    { key: 'cancelled', label: 'Cancelados' },
  ];

  return (
    <AppLayout variant="admin" title="Agendamentos" showLogout>
      <div className="w-full px-4 pt-4 pb-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold">Agenda</h2>
            <p className="text-xs text-text-dim mt-0.5">{filtered.length} agendamentos</p>
          </div>
          <div className="relative shrink-0">
            <Button
              variant="secondary"
              size="lg"
              iconLeft={<Filter className="w-5 h-5" />}
              iconRight={<ChevronDown className={`w-4 h-4 transition ${openFilter ? 'rotate-180' : ''}`} />}
              onClick={() => setOpenFilter((o) => !o)}
            >
              Filtrar
            </Button>
            {openFilter && (
              <div className="absolute right-0 top-[calc(100%+8px)] z-20 w-56 rounded-2xl border border-border bg-bg-elev shadow-2xl shadow-black/50 overflow-hidden">
                {filterOptions.map((o) => (
                  <button
                    key={o.key}
                    onClick={() => { setFilter(o.key); setOpenFilter(false); }}
                    className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-bg-hover transition ${
                      filter === o.key ? 'bg-bg-hover text-primary' : 'text-text'
                    }`}
                  >
                    {o.label}
                    {filter === o.key && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="py-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <Card padding="lg" className="text-center">
            <Calendar className="w-10 h-10 mx-auto text-text-muted mb-2" />
            <h3 className="font-semibold">Nenhum agendamento</h3>
            <p className="text-sm text-text-dim mt-1">Aguarde os alunos agendarem suas aulas.</p>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {grouped.keys.map((date) => (
              <div key={date}>
                {date !== 'sem-data' && (
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <Calendar className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs uppercase tracking-wider font-bold text-primary">{formatWeekday(date)}</p>
                      <p className="text-sm font-semibold -mt-0.5">{formatDateBR(date)}</p>
                    </div>
                    <div className="flex-1 h-px bg-border mx-2" />
                    <Badge variant="primary">{grouped.g[date]!.length}</Badge>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  {grouped.g[date]!.map((a) => (
                    <Card key={a.id} variant="default" padding="md">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-bold truncate">{a.student?.name}</p>
                          </div>
                          <p className="text-xs text-text-dim truncate">{a.schedule?.class?.name || `Aula #${a.schedule?.classId}`}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-text-muted">
                            {a.schedule?.startTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> {a.schedule.startTime} – {a.schedule.endTime}
                              </span>
                            )}
                            {a.student?.phone && (
                              <a
                                href={`https://wa.me/55${formatPhone(a.student.phone).replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 hover:text-primary transition text-text-dim"
                              >
                                <Phone className="w-3.5 h-3.5" /> {formatPhone(a.student.phone)}
                              </a>
                            )}
                          </div>
                        </div>
                        <Badge variant={statusBadgeVariant[a.status] || 'neutral'}>
                          {statusLabel[a.status] || a.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-border/60">
                        {a.status !== 'attended' && (
                          <button
                            onClick={() => changeStatus(a, 'attended')}
                            className="h-10 rounded-xl flex items-center justify-center gap-1 text-xs font-semibold bg-success/10 text-success hover:bg-success/20 active:scale-95 transition"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Presente
                          </button>
                        )}
                        {a.status !== 'missed' && (
                          <button
                            onClick={() => changeStatus(a, 'missed')}
                            className="h-10 rounded-xl flex items-center justify-center gap-1 text-xs font-semibold bg-warning/10 text-warning hover:bg-warning/20 active:scale-95 transition"
                          >
                            <CalendarX className="w-4 h-4" /> Falta
                          </button>
                        )}
                        {a.status !== 'cancelled' && (
                          <button
                            onClick={() => changeStatus(a, 'cancelled')}
                            className="h-10 rounded-xl flex items-center justify-center gap-1 text-xs font-semibold bg-danger/10 text-danger hover:bg-danger/20 active:scale-95 transition"
                          >
                            <XCircle className="w-4 h-4" /> Cancelar
                          </button>
                        )}
                        {a.status !== 'confirmed' && (
                          <button
                            onClick={() => changeStatus(a, 'confirmed')}
                            className="h-10 rounded-xl flex items-center justify-center gap-1 text-xs font-semibold col-span-full bg-primary/10 text-primary hover:bg-primary/20 active:scale-95 transition"
                          >
                            <CalendarCheck className="w-4 h-4" /> Reconfirmar
                          </button>
                        )}
                      </div>

                      {a.notes && (
                        <p className="mt-2 pt-2 border-t border-border/60 text-xs text-text-dim italic">
                          Obs: {a.notes}
                        </p>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default AppointmentsPage;
