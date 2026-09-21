import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-[100dvh] w-full bg-bg flex items-center justify-center px-5">
        <div className="w-full max-w-[420px] rounded-3xl p-6 border border-warning/30 bg-warning/5 shadow-2xl shadow-warning/5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-warning/15 text-warning flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">Ops! Algo deu errado.</h2>
              <p className="text-xs text-text-muted mt-0.5">O app encontrou um erro inesperado.</p>
            </div>
          </div>

          <div className="rounded-2xl bg-bg-elev/60 border border-border p-3 mb-5">
            <p className="text-[11px] uppercase tracking-wider font-bold text-text-muted mb-1">Detalhe do erro</p>
            <p className="text-sm font-mono text-danger break-words whitespace-pre-wrap">
              {this.state.error?.message ||
                (typeof (this.state.error as unknown as Record<string, unknown>)?.message === 'string'
                  ? ((this.state.error as unknown as Record<string, unknown>).message as string)
                  : 'Erro desconhecido (objeto não tratado)')}
            </p>
            <p className="text-[10.5px] text-text-muted mt-2 leading-relaxed">
              Causas comuns:
              <br />• Serviços backend/auth ainda não subiram na Railway
              <br />• Variáveis VITE_API_* não definidas no build
              <br />• Conexão com a internet
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={this.handleReset}
              className="h-11 rounded-xl flex items-center justify-center gap-1.5 font-semibold text-sm bg-primary text-bg hover:bg-primary/90 active:scale-[0.97] transition"
            >
              <RotateCcw className="w-4 h-4" /> Reiniciar app
            </button>
            <a
              href="/"
              className="h-11 rounded-xl flex items-center justify-center gap-1.5 font-semibold text-sm bg-bg-elev border border-border hover:bg-bg-card transition"
            >
              <Home className="w-4 h-4" /> Voltar ao início
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;