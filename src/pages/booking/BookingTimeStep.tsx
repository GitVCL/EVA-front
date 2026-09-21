import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, Clock, Loader2 } from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { useBooking } from '../../contexts/BookingContext';
import { listAvailableSchedulesApi } from '../../api/backend';
import type { Schedule } from '../../types';
import { formatDateBR, formatWeekday } from '../../utils/date';

const BookingTimeStep: React.FC = () => {
  const { state, selectSchedule, setStep } = useBooking();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state.date || !state.classId) return;
    (async () => {
      setLoading(true);
      const res = await listAvailableSchedulesApi({
        from: state.date!,
        to: state.date!,
        classId: state.classId!,
      });
      if (res.ok && res.data) setSchedules(res.data);
      else setSchedules([]);
      setLoading(false);
    })();
  }, [state.date, state.classId]);

  const dateLabel = useMemo(() => {
    if (!state.date) return '';
    return `${formatWeekday(state.date)}, ${formatDateBR(state.date)}`;
  }, [state.date]);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-xl font-bold">Escolha o horário</h2>
        <p className="text-text-dim text-sm mt-0.5 capitalize">{dateLabel}</p>
      </div>

      {loading ? (
        <div className="py-10 flex flex-col items-center justify-center gap-2 text-text-dim">
          <Loader2 className="w-7 h-7 animate-spin text-primary" />
          <p className="text-sm">Buscando horários disponíveis...</p>
        </div>
      ) : schedules.length === 0 ? (
        <Card padding="lg" className="text-center">
          <Clock className="w-10 h-10 mx-auto text-text-muted mb-2" />
          <h3 className="font-semibold">Sem horários nesta data</h3>
          <p className="text-text-dim text-sm mt-1">
            Tente outra data ou volte para alterar a aula.
          </p>
          <Button variant="outline" size="md" className="mt-4" onClick={() => setStep('date')}>
            Mudar data
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-3 gap-2.5">
          {schedules.map((s) => {
            const selected = state.scheduleId === s.id;
            const full = !s.available;
            return (
              <button
                key={s.id}
                disabled={full}
                onClick={() => !full && selectSchedule(s)}
                className={`
                  flex flex-col items-center justify-center gap-1
                  h-20 rounded-2xl font-semibold transition-all duration-150
                  ${selected
                    ? 'bg-primary text-bg shadow-lg shadow-primary/20 scale-[1.03]'
                    : full
                    ? 'bg-bg-elev/40 text-text-muted border border-border opacity-50 cursor-not-allowed'
                    : 'bg-bg-card border border-border text-text active:scale-95 hover:border-border-light'}
                `}
              >
                <span className="text-xl leading-none">{s.startTime}</span>
                <span className={`text-[11px] ${selected ? 'opacity-90' : 'text-text-muted'}`}>
                  até {s.endTime}
                </span>
                <span className={`text-[10px] ${full ? 'text-danger' : selected ? 'opacity-90' : 'text-text-muted'}`}>
                  {full ? 'Lotado' : `${s.capacity - (s.booked || 0)} vaga${s.capacity - (s.booked || 0) === 1 ? '' : 's'}`}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button variant="ghost" size="lg" iconLeft={<ChevronLeft className="w-5 h-5" />} onClick={() => setStep('date')}>
          Voltar
        </Button>
        <Button
          size="lg"
          fullWidth
          disabled={!state.scheduleId}
          onClick={() => state.scheduleId && setStep('info')}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default BookingTimeStep;
