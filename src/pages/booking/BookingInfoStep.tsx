import React, { useMemo, useState } from 'react';
import { ChevronLeft, User, Phone, Mail } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import { useBooking } from '../../contexts/BookingContext';
import { formatPhone, validatePhone } from '../../utils/phone';
import { formatDateBR, formatWeekday } from '../../utils/date';

const BookingInfoStep: React.FC = () => {
  const { state, setStudent, setStep } = useBooking();
  const [form, setForm] = useState({
    name: state.student.name,
    phone: state.student.phone,
    email: state.student.email || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const summary = useMemo(() => {
    if (!state.date || !state.startTime) return null;
    return `${formatWeekday(state.date)}, ${formatDateBR(state.date)} às ${state.startTime}`;
  }, [state.date, state.startTime]);

  const handleChange = (field: keyof typeof form, raw: string) => {
    let value = raw;
    if (field === 'phone') value = formatPhone(raw);
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const submit = () => {
    const e: Record<string, string> = {};
    const name = form.name.trim();
    if (name.length < 2) e.name = 'Informe seu nome';
    if (!validatePhone(form.phone)) e.phone = 'Telefone inválido';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'E-mail inválido';

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setStudent({
      name,
      phone: form.phone,
      email: form.email.trim() || null,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-xl font-bold">Seus dados</h2>
        <p className="text-text-dim text-sm mt-0.5">Para entrarmos em contato e confirmar</p>
      </div>

      {summary && (
        <Card variant="outlined" padding="sm">
          <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-1">Resumo</p>
          <p className="font-semibold">{state.className}</p>
          <p className="text-sm text-text-dim capitalize">{summary}</p>
        </Card>
      )}

      <Card padding="md">
        <div className="flex flex-col gap-3.5">
          <Input
            label="Nome completo"
            name="name"
            placeholder="Como devemos te chamar?"
            iconLeft={<User className="w-5 h-5" />}
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            autoComplete="name"
          />
          <Input
            label="WhatsApp *"
            name="phone"
            inputMode="tel"
            placeholder="(00) 00000-0000"
            iconLeft={<Phone className="w-5 h-5" />}
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            error={errors.phone}
            autoComplete="tel"
          />
          <Input
            label="E-mail (opcional)"
            name="email"
            type="email"
            inputMode="email"
            placeholder="voce@email.com"
            iconLeft={<Mail className="w-5 h-5" />}
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            autoComplete="email"
          />
        </div>
      </Card>

      <div className="flex gap-2 pt-2">
        <Button variant="ghost" size="lg" iconLeft={<ChevronLeft className="w-5 h-5" />} onClick={() => setStep('time')}>
          Voltar
        </Button>
        <Button size="lg" fullWidth onClick={submit}>
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default BookingInfoStep;
