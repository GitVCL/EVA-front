import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showLogout?: boolean;
  showLogin?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, showBack, showLogout, showLogin, onBack, right }) => {
  const nav = useNavigate();
  const loc = useLocation();
  const { logout, user } = useAuth();

  const goBack = () => {
    if (onBack) onBack();
    else if (window.history.length > 1) nav(-1);
    else nav('/');
  };

  const handleLogout = () => {
    logout();
    nav('/login', { replace: true });
  };

  const showLogo = !title;

  return (
    <header
      className="
        sticky top-0 z-30 w-full
        px-4 pt-[calc(env(safe-area-inset-top,0)+10px)] pb-3
        bg-bg/90 backdrop-blur-xl border-b border-border/60
      "
    >
      <div className="w-full max-w-[520px] mx-auto flex items-center justify-between gap-2 min-h-[44px]">
        {/* Lado esquerdo */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {showBack && (
            <button
              onClick={goBack}
              className="-ml-1.5 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-bg-card active:scale-95 transition text-text"
              aria-label="Voltar"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.2px]" />
            </button>
          )}
          {showLogo ? (
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center font-black text-bg text-lg shadow-lg shadow-primary/20">
                E
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-base tracking-tight">EVA ATELIÊ</span>
                <span className="text-[11px] text-text-muted -mt-0.5">Aulas de desenho</span>
              </div>
            </div>
          ) : (
            <h1 className="font-semibold text-lg truncate">{title}</h1>
          )}
        </div>

        {/* Lado direito */}
        <div className="flex items-center gap-1 shrink-0">
          {right}
          {showLogin && !user && (
            <button
              onClick={() => nav('/login')}
              className="h-10 px-3.5 rounded-xl flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/25 hover:bg-primary/15 active:scale-[0.97] transition text-sm font-semibold"
              aria-label="Entrar como administrador"
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
          )}
          {showLogout && (
            <button
              onClick={handleLogout}
              className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-bg-card active:scale-95 transition text-text-dim hover:text-danger"
              aria-label="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
