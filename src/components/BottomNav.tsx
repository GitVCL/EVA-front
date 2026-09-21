import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { CalendarPlus, LayoutDashboard, BookOpen, Clock, CalendarCheck } from 'lucide-react';

const publicItems = [
  { to: '/agendar', label: 'Agendar', Icon: CalendarPlus },
];

const adminItems = [
  { to: '/dashboard', label: 'Início', Icon: LayoutDashboard },
  { to: '/aulas', label: 'Aulas', Icon: BookOpen },
  { to: '/horarios', label: 'Horários', Icon: Clock },
  { to: '/agendamentos', label: 'Agenda', Icon: CalendarCheck },
];

const BottomNav: React.FC<{ variant?: 'public' | 'admin' }> = ({ variant = 'public' }) => {
  const items = variant === 'admin' ? adminItems : publicItems;
  const loc = useLocation();

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-40
        px-2.5 pb-[calc(env(safe-area-inset-bottom,0)+10px)] pt-2.5
        bg-bg-card/95 backdrop-blur-lg border-t border-border
        supports-[backdrop-filter]:bg-bg/80
      "
    >
      <ul className="grid gap-1" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0,1fr))` }}>
        {items.map(({ to, label, Icon }) => {
          const active = loc.pathname.startsWith(to);
          return (
            <li key={to}>
              <NavLink
                to={to}
                className={`
                  flex flex-col items-center justify-center gap-1 py-2 rounded-xl
                  transition-colors duration-150 min-h-[54px]
                  ${active ? 'text-primary' : 'text-text-muted hover:text-text-dim'}
                `}
              >
                <Icon className={`w-6 h-6 ${active ? 'stroke-[2.2px]' : ''}`} />
                <span className={`text-[11px] font-medium leading-none ${active ? 'font-semibold' : ''}`}>
                  {label}
                </span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
