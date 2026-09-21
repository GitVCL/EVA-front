import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { Palette, CalendarPlus, Sparkles, ArrowRight, Clock, Users, Star } from 'lucide-react';
import { listClassesApi, listAvailableSchedulesApi } from '../api/backend';
import type { Class, Schedule } from '../types';

const Feature: React.FC<{ icon: React.ReactNode; title: string; desc: string; tone?: 'primary' | 'neutral' }> = ({
  icon, title, desc, tone = 'neutral',
}) => (
  <div className="flex gap-3 p-3 rounded-2xl bg-bg-elev/40 border border-border/50">
    <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${
      tone === 'primary' ? 'bg-primary text-bg' : 'bg-primary/10 text-primary'
    }`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-sm">{title}</p>
      <p className="text-xs text-text-dim mt-0.5 leading-snug">{desc}</p>
    </div>
  </div>
);

const HomePage: React.FC = () => {
  const nav = useNavigate();
  const [classes, setClasses] = useState<Class[]>([]);
  const [nextCount, setNextCount] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const [c, s] = await Promise.all([
        listClassesApi(false),
        listAvailableSchedulesApi(),
      ]);
      if (c.ok && c.data) setClasses(c.data);
      if (s.ok && s.data) setNextCount(s.data.length);
    })();
  }, []);

  return (
    <AppLayout variant="public">
      <div className="w-full px-4 pt-4 pb-4 flex flex-col gap-5">
        {/* Hero */}
        <Card variant="elevated" padding="lg" className="overflow-hidden relative">
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-primary/10 rounded-full blur-3xl" />
          <div className="relative">
            <Badge variant="primary"><Sparkles className="w-3.5 h-3.5" /> Novos horários toda semana</Badge>
            <h1 className="mt-3 text-3xl font-black tracking-tight leading-[1.1]">
              Transforme seu traço em <span className="text-primary">arte</span>.
            </h1>
            <p className="mt-2 text-sm text-text-dim leading-relaxed">
              Aulas particulares e workshops de desenho com horários flexíveis. Agende em 1 minuto.
            </p>
            <div className="flex items-center gap-3 mt-4 text-xs text-text-muted">
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-primary fill-primary/10" /> <b className="text-text">4.9</b> (120+ aulas)</span>
              <span className="w-1 h-1 rounded-full bg-text-muted" />
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> 300+ alunos</span>
            </div>
            <Button
              size="xl"
              fullWidth
              className="mt-5"
              iconRight={<ArrowRight className="w-5 h-5" />}
              onClick={() => nav('/agendar')}
            >
              Agendar minha aula
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5">
          <Card variant="default" padding="sm">
            <CalendarPlus className="w-5 h-5 text-primary mb-1.5" />
            <p className="text-2xl font-extrabold tracking-tight">{nextCount}</p>
            <p className="text-[10.5px] text-text-muted font-semibold uppercase tracking-wider">Vagas hoje</p>
          </Card>
          <Card variant="default" padding="sm">
            <Palette className="w-5 h-5 text-primary mb-1.5" />
            <p className="text-2xl font-extrabold tracking-tight">{classes.length}</p>
            <p className="text-[10.5px] text-text-muted font-semibold uppercase tracking-wider">Aulas</p>
          </Card>
          <Card variant="default" padding="sm">
            <Clock className="w-5 h-5 text-primary mb-1.5" />
            <p className="text-2xl font-extrabold tracking-tight">1:1</p>
            <p className="text-[10.5px] text-text-muted font-semibold uppercase tracking-wider">Particular</p>
          </Card>
        </div>

        {/* Como funciona */}
        <div>
          <h2 className="font-bold text-lg mb-2.5">Como funciona?</h2>
          <div className="flex flex-col gap-2">
            <Feature icon={<Palette className="w-5 h-5" />} tone="primary" title="1. Escolha a aula" desc="Individual, workshop, perspectiva ou personagem." />
            <Feature icon={<CalendarPlus className="w-5 h-5" />} title="2. Data & hora" desc="Selecione o melhor horário para você." />
            <Feature icon={<Sparkles className="w-5 h-5" />} title="3. Vamos criar arte!" desc="É só comparecer. Nós cuidamos do resto." />
          </div>
        </div>

        {/* Destaque aulas */}
        {classes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="font-bold text-lg">Aulas em destaque</h2>
              <button onClick={() => nav('/agendar')} className="text-xs font-semibold text-primary flex items-center gap-1">
                Ver todas <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
              {classes.slice(0, 4).map((c) => (
                <Card key={c.id} variant="interactive" padding="md" className="shrink-0 w-[75%]" onClick={() => nav('/agendar')}>
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <Palette className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold">{c.name}</h3>
                  {c.description && <p className="text-xs text-text-dim mt-1 line-clamp-2">{c.description}</p>}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/60">
                    <span className="text-xs text-text-muted">{c.durationMinutes} min</span>
                    <span className="text-xs font-bold text-primary">Agendar →</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* CTA Final */}
        <Card variant="elevated" padding="md" className="bg-gradient-to-br from-primary/10 via-bg-elev to-bg-elev border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary text-bg shrink-0 flex items-center justify-center">
              <CalendarPlus className="w-5.5 h-5.5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base">Pronto pra começar?</h3>
              <p className="text-xs text-text-dim mt-0.5">
                Agende sua primeira aula agora mesmo.
              </p>
              <Button
                size="lg"
                fullWidth
                className="mt-3"
                onClick={() => nav('/agendar')}
                iconRight={<ArrowRight className="w-4.5 h-4.5" />}
              >
                Quero agendar
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default HomePage;
