import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';

interface Props {
  children: React.ReactNode;
  variant?: 'public' | 'admin' | 'full';
  title?: string;
  showBack?: boolean;
  showLogout?: boolean;
}

const PUBLIC_PATHS_NO_NAV = ['/login'];

const AppLayout: React.FC<Props> = ({ children, variant = 'public', title, showBack, showLogout }) => {
  const loc = useLocation();
  const showNav = variant !== 'full' && !PUBLIC_PATHS_NO_NAV.includes(loc.pathname);

  return (
    <div className="min-h-[100dvh] w-full bg-bg flex flex-col text-text">
      <Header title={title} showBack={showBack} showLogout={showLogout} />

      <main className="flex-1 w-full max-w-[520px] mx-auto safe-bottom">
        {children}
      </main>

      {showNav && <BottomNav variant={variant} />}
    </div>
  );
};

export default AppLayout;
