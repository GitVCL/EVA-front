import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Calendar, Clock, User, Phone, CalendarPlus, Share2, MessageCircle } from 'lucide-react';
import AppLayout from '../../components/AppLayout';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import type { Appointment } from '../../types';
import { formatDateBR, formatWeekday } from '../../utils/date';
import { formatPhone } from '../../utils/phone';
import { useToast } from '../../components/Toast';

const Row: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 py-2.5 first:pt-1 last:pb-1">
    <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center bg-bg-elev text-primary">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[11px] text-text-muted uppercase tracking-wider font-semibold">{label}</p>
      <p className="text-sm font-medium truncate">{value}</p>
    </div>
  </div>
);

const BookingConfirmationPage: React.FC = () => {
  const loc = useLocation();
  const nav = useNavigate();
  const { showToast } = useToast();
  const appointment = (loc.state as any)?.appointment as Appointment | undefined;

  const className = appointment?.schedule?.class?.name || appointment?.schedule?.classId || 'Aula';
  const date = appointment?.schedule?.date;
  const startTime = appointment?.schedule?.startTime;
  const endTime = appointment?.schedule?.endTime;

  const agendarNovamente = () => nav('/agendar', { replace: true });

  const sendWhatsApp = () => {
    if (!appointment || !appointment.student?.phone) {
      showToast('Telefone não encontrado', 'error');
      return;
    }
    const phone = formatPhone(appointment.student.phone).replace(/\D/g, '');
    const text = encodeURIComponent(
      `Olá! É ${appointment.student?.name}. Acabei de agendar a aula de ${className} para ${date ? formatDateBR(date) : ''} às ${startTime}.`
    );
    window.open(`https://wa.me/55${phone}?text=${text}`, '_blank');
  };

  return (
    <AppLayout variant="full" title="Agendamento confirmado">
      <div className="w-full max-w-[520px] mx-auto px-4 pt-6 pb-10 flex flex-col items-center">
        <div className="relative mt-2 mb-5">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-125" />
          <div className="relative w-20 h-20 rounded-full bg-primary text-bg flex items-center justify-center shadow-2xl shadow-primary/30">
            <CheckCircle2 className="w-11 h-11 stroke-[2.2px]" />
          </div>
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-center">Agendamento confirmado!</h1>
        <p className="text-text-dim text-center mt-1.5 max-w-[85%]">
          Seu horário foi reservado. Qualquer atualização entraremos em contato por WhatsApp.
        </p>

        <Badge variant="success" className="mt-4">
          <CheckCircle2 className="w-3.5 h-3.5" /> Confirmado
        </Badge>

        <Card variant="elevated" padding="md" className="mt-5 w-full">
          <div className="divide-y divide-border/60 -my-1">
            <Row icon={<Calendar className="w-4 h-4" />} label="Aula" value={String(className)} />
            <Row
              icon={<Calendar className="w-4 h-4" />}
              label="Data"
              value={date ? `${formatWeekday(date).replace(/^\w/, c => c.toUpperCase())}, ${formatDateBR(date)}` : '—'}
            />
            <Row
              icon={<Clock className="w-4 h-4" />}
              label="Horário"
              value={startTime ? `${startTime}${endTime ? ` às ${endTime}` : ''}` : '—'}
            />
            <Row icon={<User className="w-4 h-4" />} label="Aluno" value={appointment?.student?.name || '—'} />
            <Row
              icon={<Phone className="w-4 h-4" />}
              label="WhatsApp"
              value={appointment?.student?.phone ? formatPhone(appointment.student.phone) : '—'}
            />
          </div>
        </Card>

        <div className="w-full flex flex-col gap-2.5 mt-6">
          <Button size="xl" fullWidth iconLeft={<CalendarPlus className="w-5 h-5" />} onClick={agendarNovamente}>
            Agendar outra aula
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" size="lg" iconLeft={<MessageCircle className="w-5 h-5" />} onClick={sendWhatsApp}>
              WhatsApp
            </Button>
            <Button
              variant="secondary"
              size="lg"
              iconLeft={<Share2 className="w-5 h-5" />}
              onClick={() => showToast('Link copiado!', 'success')}
            >
              Compartilhar
            </Button>
          </div>
          <Button variant="ghost" onClick={() => nav('/')}>
            Voltar para o início
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default BookingConfirmationPage;
