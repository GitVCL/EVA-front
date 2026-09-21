import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, Calendar, Clock, User, Phone, Mail, Loader2 } from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import { useBooking } from '../../contexts/BookingContext';
import { createAppointmentApi } from '../../api/backend';
import { formatDateBR, formatWeekday } from '../../utils/date';
import { formatPhone } from '../../utils/phone';
import { useToast } from '../../components/Toast';

const Row: React.FC<{ icon: React.ReactNode; label: string; value: string; tone?: 'default' | 'primary' }> = ({
  icon, label, value, tone = 'default',
}) => (
  <div className="flex items-center gap-3 py-2.5 first:pt-1 last:pb-1">
    <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center
      ${tone === 'primary' ? 'bg-primary text-bg' : 'bg-bg-elev text-primary'}`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[11px] text-text-muted uppercase tracking-wider font-semibold">{label}</p>
      <p className={`text-sm font-medium truncate ${tone === 'primary' ? 'text-text' : ''}`}>{value}</p>
    </div>
  </div>
);

const BookingConfirmStep: React.FC = () => {
  const { state, reset, setStep } = useBooking();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const nav = useNavigate();

  const confirmar = async () => {
    if (!state.scheduleId) return;
    setLoading(true);
    const res = await createAppointmentApi({
      scheduleId: state.scheduleId,
      student: {
        name: state.student.name,
        phone: state.student.phone,
        email: state.student.email || null,
      },
    });
    setLoading(false);

    if (!res.ok || !res.data) {
      showToast(res.error || 'Não foi possível confirmar. Tente novamente.', 'error');
      return;
    }
    reset();
    nav('/agendar/confirmacao', {
      state: { appointment: res.data },
      replace: true,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-xl font-bold">Confirmar agendamento</h2>
        <p className="text-text-dim text-sm mt-0.5">Confira todos os dados antes de finalizar</p>
      </div>

      <Card variant="elevated" padding="md">
        <div className="flex items-center justify-between mb-1">
          <Badge variant="primary"><Check className="w-3.5 h-3.5" /> Quase lá</Badge>
        </div>
        <div className="divide-y divide-border/60 -my-1">
          <Row
            tone="primary"
            icon={<Calendar className="w-4 h-4" />}
            label="Aula"
            value={state.className || '—'}
          />
          <Row
            icon={<Calendar className="w-4 h-4" />}
            label="Data"
            value={state.date ? `${formatWeekday(state.date).replace(/^\w/, c => c.toUpperCase())}, ${formatDateBR(state.date)}` : '—'}
          />
          <Row
            icon={<Clock className="w-4 h-4" />}
            label="Horário"
            value={state.startTime ? `${state.startTime} às ${state.endTime} (${state.durationMinutes || 60} min)` : '—'}
          />
          <Row
            icon={<User className="w-4 h-4" />}
            label="Nome"
            value={state.student.name || '—'}
          />
          <Row
            icon={<Phone className="w-4 h-4" />}
            label="WhatsApp"
            value={formatPhone(state.student.phone)}
          />
          {state.student.email && (
            <Row
              icon={<Mail className="w-4 h-4" />}
              label="E-mail"
              value={state.student.email}
            />
          )}
        </div>
      </Card>

      <p className="text-xs text-text-muted px-1 leading-relaxed">
        Ao confirmar, seus dados serão enviados e o horário ficará reservado para você.
      </p>

      <div className="flex flex-col gap-2 pt-1">
        <div className="flex gap-2">
          <Button variant="ghost" size="lg" iconLeft={<ChevronLeft className="w-5 h-5" />} onClick={() => setStep('info')}>
            Voltar
          </Button>
          <Button size="xl" fullWidth loading={loading} iconRight={!loading ? <Check className="w-5 h-5" /> : undefined} onClick={confirmar}>
            Confirmar agendamento
          </Button>
        </div>
        <Button variant="ghost" size="md" onClick={() => { reset(); nav('/agendar', { replace: true }); }}>
          Cancelar e recomeçar
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmStep;
