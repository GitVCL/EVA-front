import React, { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastCtx {
  showToast: (message: string, type?: ToastType) => void;
}

const Ctx = createContext<ToastCtx | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const Icon = (t: ToastType) => {
    if (t === 'success') return <CheckCircle2 className="w-5 h-5 text-success shrink-0" />;
    if (t === 'error') return <AlertCircle className="w-5 h-5 text-danger shrink-0" />;
    return <Info className="w-5 h-5 text-primary shrink-0" />;
  };

  const border = (t: ToastType) => {
    if (t === 'success') return 'border-success/30';
    if (t === 'error') return 'border-danger/30';
    return 'border-primary/30';
  };

  return (
    <Ctx.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-[calc(env(safe-area-inset-top,0)+12px)] left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-24px)] max-w-[440px] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
              pointer-events-auto
              flex items-start gap-3 px-4 py-3 rounded-2xl
              bg-bg-elev/95 backdrop-blur border ${border(t.type)}
              shadow-2xl shadow-black/50 animate-in
            `}
          >
            {Icon(t.type)}
            <p className="text-sm flex-1 text-text leading-snug">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="text-text-muted hover:text-text -mr-1 mt-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
};

export function useToast(): ToastCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useToast dentro de ToastProvider');
  return ctx;
}
