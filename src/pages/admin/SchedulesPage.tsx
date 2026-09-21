import React, { useEffect, useMemo, useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Badge from '../../components/Badge';
import { useToast } from '../../components/Toast';
import { Plus, Calendar, Clock, Users, ToggleLeft, ToggleRight, X, Check, Loader2, BookOpen } from 'lucide-react';
import { listAllSchedulesApi, createScheduleApi, updateScheduleApi, listClassesApi } from '../../api/backend';
import type { Schedule, Class } from '../../types';
import { formatDateBR, formatWeekday, todayISO } from '../../utils/date';

const SchedulesPage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    classId: 0,
    date: todayISO(),
    startTime: '09:00',
    endTime: '10:30',
    capacity: 6,
    active: true,
  });
  const { showToast } = useToast();

  const load = async () => {
    setLoading(true);
    const [s, c] = await Promise.all([listAllSchedulesApi(), listClassesApi(true)]);
    if (s.ok && s.data) setSchedules(s.data);
    if (c.ok && c.data) setClasses(c.data.filter((x) => x.active));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ classId: classes[0]?.id || 0, date: todayISO(), startTime: '09:00', endTime: '10:00', capacity: 1, active: true });
    setShowForm(false);
  };

  const submit = async () => {
    if (!form.classId) { showToast('Selecione uma aula', 'error'); return; }
    if (!form.date || !form.startTime || !form.endTime) { showToast('Preencha data e horário', 'error'); return; }
    if (form.startTime >= form.endTime) { showToast('Hora final deve ser maior que inicial', 'error'); return; }
    const selectedClass = classes.find((c) => c.id === form.classId);
    if (!selectedClass) { showToast('Aula não encontrada', 'error'); return; }
    setSubmitting(true);
    const res = await createScheduleApi(form);
    setSubmitting(false);
    if (!res.ok) {
      showToast(res.error || 'Erro ao criar horário', 'error');
      return;
    }
    showToast(
      `Horário ${form.startTime}-${form.endTime} criado para "${selectedClass.name}" em ${formatDateBR(form.date)}`,
      'success',
    );
    resetForm();
    await load();
  };

  const toggleActive = async (s: Schedule) => {
    const res = await updateScheduleApi(s.id, { active: !s.active });
    if (res.ok) {
      setSchedules((prev) => prev.map((x) => x.id === s.id ? { ...x, active: !x.active } : x));
      showToast(s.active ? 'Horário desativado' : 'Horário ativado', 'info');
    } else {
      showToast(res.error || 'Erro', 'error');
    }
  };

  const grouped = useMemo(() => {
    const g: Record<string, Schedule[]> = {};
    for (const s of schedules) {
      const k = s.date.slice(0, 10);
      if (!g[k]) g[k] = [];
      g[k].push(s);
    }
    const keys = Object.keys(g).sort();
    return { keys, g };
  }, [schedules]);

  return (
    <AppLayout variant="admin" title="Horários" showLogout>
      <div className="w-full px-4 pt-4 pb-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold">Horários</h2>
            <p className="text-xs text-text-dim mt-0.5">{schedules.length} cadastrados</p>
          </div>
          <Button size="lg" iconLeft={<Plus className="w-5 h-5" />} onClick={() => { setForm((f) => ({ ...f, classId: classes[0]?.id || 0 })); setShowForm(true); }}>
            Novo
          </Button>
        </div>

        {showForm && (
          <Card variant="elevated" padding="md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">Novo horário</h3>
              <button onClick={resetForm} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-bg-hover text-text-dim">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <div className="w-full">
                <label className="text-sm font-medium text-text-dim ml-0.5 mb-1.5 block">
                  Aula <span className="text-primary">*</span>
                </label>
                <select
                  value={form.classId}
                  onChange={(e) => setForm({ ...form, classId: Number(e.target.value) })}
                  className={`w-full h-12 px-3.5 rounded-2xl border-2 outline-none text-base font-medium transition ${
                    form.classId
                      ? 'bg-primary/10 border-primary/50 text-text focus:border-primary'
                      : 'bg-bg-card border-border focus:border-primary/60'
                  }`}
                >
                  <option value={0} disabled> Selecione a aula...</option>
                  {classes.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.level})</option>)}
                </select>
                {form.classId && (
                  <p className="mt-1.5 text-[11px] text-primary font-semibold ml-1">
                    ⚠️ Horário será criado para: <u>{classes.find((c) => c.id === form.classId)?.name}</u>
                  </p>
                )}
              </div>
              <Input
                label="Data"
                type="date"
                value={form.date}
                min={todayISO()}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                iconLeft={<Calendar className="w-5 h-5" />}
              />
              <div className="grid grid-cols-3 gap-2.5">
                <Input
                  label="Início"
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  iconLeft={<Clock className="w-5 h-5" />}
                />
                <Input
                  label="Fim"
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  iconLeft={<Clock className="w-5 h-5" />}
                />
                <Input
                  label="Vagas"
                  type="number"
                  min={1}
                  value={String(form.capacity)}
                  onChange={(e) => setForm({ ...form, capacity: Math.max(1, Number(e.target.value) || 1) })}
                  iconLeft={<Users className="w-5 h-5" />}
                />
              </div>
              <div className="flex gap-2 pt-1">
                <Button variant="ghost" size="lg" onClick={resetForm}>Cancelar</Button>
                <Button size="lg" fullWidth loading={submitting} iconRight={<Check className="w-5 h-5" />} onClick={submit}>
                  Criar horário
                </Button>
              </div>
            </div>
          </Card>
        )}

        {loading ? (
          <div className="py-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : schedules.length === 0 ? (
          <Card padding="lg" className="text-center">
            <Calendar className="w-10 h-10 mx-auto text-text-muted mb-2" />
            <h3 className="font-semibold">Nenhum horário</h3>
            <p className="text-sm text-text-dim mt-1">Clique em "Novo" para cadastrar.</p>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {grouped.keys.map((date) => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-2 px-1">
                  <Calendar className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs uppercase tracking-wider font-bold text-primary">{formatWeekday(date)}</p>
                    <p className="text-sm font-semibold -mt-0.5">{formatDateBR(date)}</p>
                  </div>
                  <div className="flex-1 h-px bg-border mx-2" />
                  <Badge variant="primary">{grouped.g[date]!.length}</Badge>
                </div>
                <div className="flex flex-col gap-2">
                  {grouped.g[date]!.map((s) => (
                    <Card key={s.id} variant="default" padding="md">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="font-bold truncate">{s.class?.name || `Aula #${s.classId}`}</p>
                              <Badge variant={s.active ? 'success' : 'neutral'}>{s.active ? 'Ativo' : 'Inativo'}</Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
                              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{s.startTime} – {s.endTime}</span>
                              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{s.booked || 0}/{s.capacity}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleActive(s)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center active:scale-95 transition shrink-0 ${s.active ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}
                        >
                          {s.active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                        </button>
                      </div>
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

export default SchedulesPage;
