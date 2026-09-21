import React from 'react';
import { Check } from 'lucide-react';
import type { BookingStep } from '../types';

const steps: { key: BookingStep; label: string; num: number }[] = [
  { key: 'class', label: 'Aula', num: 1 },
  { key: 'date', label: 'Data', num: 2 },
  { key: 'time', label: 'Hora', num: 3 },
  { key: 'info', label: 'Dados', num: 4 },
  { key: 'confirm', label: 'Final', num: 5 },
];

const BookingStepper: React.FC<{ current: BookingStep }> = ({ current }) => {
  const currentIdx = steps.findIndex((s) => s.key === current);
  return (
    <div className="w-full">
      <ol className="flex items-center justify-between gap-1.5 px-1">
        {steps.map((s, i) => {
          const done = i < currentIdx;
          const active = i === currentIdx;
          return (
            <li key={s.key} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                  transition-all duration-200 shrink-0
                  ${done
                    ? 'bg-primary text-bg'
                    : active
                    ? 'bg-primary/15 text-primary border-2 border-primary'
                    : 'bg-bg-elev text-text-muted border border-border'}
                `}
              >
                {done ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span
                className={`text-[10.5px] font-medium leading-tight text-center ${
                  done || active ? 'text-text' : 'text-text-muted'
                }`}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="mt-3 h-1 w-full bg-bg-elev rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${((currentIdx + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default BookingStepper;
