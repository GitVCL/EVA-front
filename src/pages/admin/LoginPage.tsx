import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, Palette } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/Toast';

const LoginPage: React.FC = () => {
  const { login, loginError, user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const { showToast } = useToast();
  const from = (loc.state as any)?.from || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) nav(from, { replace: true });
  }, [user, nav, from]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Preencha e-mail e senha', 'error');
      return;
    }
    setSubmitting(true);
    const ok = await login(email.trim().toLowerCase(), password);
    setSubmitting(false);
    if (ok) {
      showToast('Login realizado com sucesso', 'success');
      setTimeout(() => nav(from, { replace: true }), 300);
    }
  };

  const loading = submitting || authLoading;

  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-bg">
      <div className="safe-top w-full px-5 pt-8 pb-6 flex flex-col items-center text-center">
        <div className="relative mt-2 mb-4">
          <div className="absolute inset-0 bg-primary/15 blur-2xl rounded-full scale-150" />
          <div className="relative w-16 h-16 rounded-[20px] bg-primary text-bg flex items-center justify-center shadow-2xl shadow-primary/30">
            <Palette className="w-8 h-8" strokeWidth={2.3} />
          </div>
        </div>
        <h1 className="text-3xl font-black tracking-tight">EVA ATELIÊ</h1>
        <p className="text-text-dim text-sm mt-1">Painel administrativo</p>
      </div>

      <form
        onSubmit={submit}
        className="w-full max-w-[480px] mx-auto px-5 flex flex-col gap-4 pb-10"
      >
        <div className="flex flex-col gap-1.5 mb-1">
          <h2 className="text-lg font-bold">Entrar</h2>
          <p className="text-sm text-text-dim">Acesse com suas credenciais de administrador</p>
        </div>

        <Input
          label="E-mail"
          name="email"
          type="email"
          placeholder="voce@evaatelie.com.br"
          inputMode="email"
          iconLeft={<Mail className="w-5 h-5" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
        />
        <Input
          label="Senha"
          name="password"
          type={showPass ? 'text' : 'password'}
          placeholder="••••••••"
          iconLeft={<Lock className="w-5 h-5" />}
          iconRight={
            <button
              type="button"
              onClick={() => setShowPass((p) => !p)}
              className="-mr-1 w-9 h-9 flex items-center justify-center text-text-muted hover:text-text-dim"
              tabIndex={-1}
            >
              {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {loginError && (
          <div className="rounded-2xl px-4 py-3 text-sm bg-danger/10 border border-danger/25 text-danger">
            {loginError}
          </div>
        )}

        <Button size="xl" fullWidth type="submit" loading={loading} className="mt-2">
          Entrar no painel
        </Button>

        <p className="text-xs text-text-muted text-center pt-2 leading-relaxed">
          Problemas para acessar? Entre em contato com o suporte.
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
