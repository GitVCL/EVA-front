import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Loader2, Palette, Calendar } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { listClassesApi, listAvailableSchedulesApi } from '../../api/backend';
import { useBooking } from '../../contexts/BookingContext';
import type { Class } from '../../types';
import { addDays, formatISO } from 'date-fns';

const BookingClassStep: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [scheduleCounts, setScheduleCounts] = useState<Record<number, number>>({});
  const { selectClass, state } = useBooking();
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await listClassesApi(false);
      let active: Class[] = [];
      if (res.ok && res.data) {
        active = res.data.filter((c) => c.active);
        setClasses(active);
      }

      if (active.length > 0) {
        const from = formatISO(new Date(), { representation: 'date' });
        const to = formatISO(addDays(new Date(), 60), { representation: 'date' });
        const counts: Record<number, number> = {};
        for (const c of active) {
          try {
            const s = await listAvailableSchedulesApi({ from, to, classId: c.id });
            counts[c.id] = s.ok && s.data ? s.data.length : 0;
          } catch {
            counts[c.id] = 0;
          }
        }
        setScheduleCounts(counts);
      }

      setLoading(false);
    })();
  }, []);

  const totalAvailable = useMemo(() => {
    if (state.classId == null) return 0;
    return scheduleCounts[state.classId] ?? 0;
  }, [state.classId, scheduleCounts]);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-xl font-bold">Escolha a aula</h2>
        <p className="text-text-dim text-sm mt-0.5">
          Selecione qual tipo de aula deseja agendar
        </p>
      </div>

      {loading ? (
        <div className="py-10 flex flex-col items-center justify-center gap-2 text-text-dim">
          <Loader2 className="w-7 h-7 animate-spin text-primary" />
          <p className="text-sm">Carregando aulas disponíveis...</p>
        </div>
      ) : classes.length === 0 ? (
        <Card padding="lg" className="text-center">
          <Palette className="w-10 h-10 mx-auto text-text-muted mb-2" />
          <h3 className="font-semibold">Nenhuma aula ativa no momento</h3>
          <p className="text-text-dim text-sm mt-1">Tente novamente mais tarde.</p>
          <Button variant="outline" size="md" className="mt-4" onClick={() => nav('/')}>
            Voltar ao início
          </Button>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {classes.map((cls) => {
            const count = scheduleCounts[cls.id] ?? 0;
            return (
              <Card
                key={cls.id}
                variant="interactive"
                padding="md"
                onClick={() => count > 0 && selectClass(cls)}
                disabled={count === 0}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center
                    ${state.classId === cls.id ? 'bg-primary text-bg' : count === 0 ? 'bg-bg-elev text-text-muted' : 'bg-primary/10 text-primary'}`}>
                    <Palette className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="font-semibold text-base leading-tight">{cls.name}</h3>
                      {count > 0 ? (
                        <Badge variant="primary" size="sm">
                          <Calendar className="w-3 h-3 inline mr-1 -mt-0.5" />
                          {count} horário{count === 1 ? '' : 's'}
                        </Badge>
                      ) : (
                        <Badge variant="neutral" size="sm">
                          Sem vagas
                        </Badge>
                      )}
                    </div>
                    {cls.description && (
                      <p className="text-sm text-text-dim mt-1 line-clamp-2">{cls.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-text-muted flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {cls.durationMinutes} min de duração
                      </span>
                      {cls.level && (
                        <span className="flex items-center gap-1">
                          <Palette className="w-3.5 h-3.5" />
                          {cls.level}
                        </span>
                      )}
                      {cls.maxCapacity && cls.maxCapacity > 0 && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          até {cls.maxCapacity} vagas
                        </span>
                      )}
                    </div>
                    {count === 0 && (
                      <p className="mt-2 text-[11px] text-warning/90">
                        Ainda não há horários abertos para esta aula. Escolha outra aula para agendar agora.
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingClassStep;
