import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import { useBooking } from '../../contexts/BookingContext';
import { listAvailableSchedulesApi } from '../../api/backend';
import { getNextNDays, dateToISO, formatShortDate, formatWeekdayShort, isPastDate } from '../../utils/date';

const BookingDateStep: React.FC = () => {
  const { selectDate, setStep, state } = useBooking();
  const days = useMemo(() => getNextNDays(21), []);
  const rangeStart = useMemo(() => dateToISO(days[0]), [days]);
  const rangeEnd = useMemo(() => dateToISO(days[days.length - 1]), [days]);

  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state.classId) return;
    let canceled = false;
    (async () => {
      setLoading(true);
      const res = await listAvailableSchedulesApi({
        from: rangeStart,
        to: rangeEnd,
        classId: state.classId ?? undefined,
      });
      if (canceled) return;
      const set = new Set<string>();
      if (res.ok && res.data) {
        for (const s of res.data) {
          const key = (s.date as unknown as string).slice(0, 10);
          set.add(key);
        }
      }
      setAvailableDates(set);
      setLoading(false);
    })();
    return () => { canceled = true; };
  }, [state.classId, rangeStart, rangeEnd]);

  const hasAvailable = availableDates.size > 0;

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-xl font-bold">Escolha a data</h2>
        <p className="text-text-dim text-sm mt-0.5">
          {state.className || 'Aula'} —
          {loading
            ? ' carregando horários...'
            : hasAvailable
              ? ` ${availableDates.size} dias com horário disponível`
              : ' nenhum horário encontrado para esta aula.'}
        </p>
      </div>

      <Card variant="default" padding="md">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">
            Próximas 3 semanas
          </p>
          <Badge variant="primary" size="sm">
            <Clock className="w-3 h-3 inline mr-1 -mt-0.5" />
            {loading ? '...' : `${availableDates.size} disponíveis`}
          </Badge>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((d) => {
            const iso = dateToISO(d);
            const selected = state.date === iso;
            const past = isPastDate(d);
            const hasSchedule = availableDates.has(iso);
            const disabled = past || loading || !hasSchedule;
            return (
              <button
                key={iso}
                disabled={disabled}
                onClick={() => !disabled && selectDate(iso)}
                title={
                  disabled
                    ? past
                      ? 'Data passada'
                      : !hasSchedule
                        ? 'Sem horários nesta data'
                        : ''
                    : iso
                }
                className={`
                  flex flex-col items-center justify-center gap-0.5 relative
                  py-2.5 rounded-2xl aspect-[3/4] transition-all duration-150
                  ${selected
                    ? 'bg-primary text-bg shadow-lg shadow-primary/20 scale-[1.03]'
                    : disabled
                    ? past
                      ? 'bg-bg-elev/40 text-text-muted opacity-50 cursor-not-allowed'
                      : 'bg-bg-elev/30 text-text-muted/70 border border-dashed border-border cursor-not-allowed'
                    : hasSchedule
                      ? 'bg-bg-card border border-primary/40 text-text active:scale-95 hover:border-primary shadow-sm shadow-primary/10'
                      : 'bg-bg-elev text-text active:scale-95 hover:bg-bg-hover border border-border'}
                `}
              >
                <span className={`text-[10.5px] font-semibold ${selected ? 'opacity-90' : 'text-text-muted'}`}>
                  {formatWeekdayShort(d)}
                </span>
                <span className="text-lg font-bold leading-none">{d.getDate()}</span>
                <span className={`text-[10px] ${selected ? 'opacity-90' : 'text-text-muted'}`}>
                  {formatShortDate(d).slice(3)}
                </span>
                {!selected && !past && hasSchedule && (
                  <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-primary shadow shadow-primary/50" />
                )}
              </button>
            );
          })}
        </div>
        {!loading && !hasAvailable && state.classId && (
          <div className="mt-4 rounded-2xl border border-warning/30 bg-warning/10 p-3 text-center">
            <p className="text-sm font-semibold text-warning/90">
              Sem horários cadastrados para "{state.className}" nas próximas 3 semanas.
            </p>
            <p className="text-xs text-text-dim mt-0.5">
              Volte e escolha outra aula, ou contate o ateliê.
            </p>
          </div>
        )}
      </Card>

      <div className="flex gap-2 pt-2">
        <Button variant="ghost" size="lg" iconLeft={<ChevronLeft className="w-5 h-5" />} onClick={() => setStep('class')}>
          Voltar
        </Button>
        <Button
          size="lg"
          fullWidth
          iconRight={<ChevronRight className="w-5 h-5" />}
          disabled={!state.date}
          onClick={() => state.date && setStep('time')}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default BookingDateStep;
