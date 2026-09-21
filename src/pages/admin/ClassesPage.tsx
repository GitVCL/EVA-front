import React, { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Badge from '../../components/Badge';
import { useToast } from '../../components/Toast';
import { Plus, Clock, ToggleLeft, ToggleRight, Edit3, X, Check, Loader2 } from 'lucide-react';
import { listClassesApi, createClassApi, updateClassApi } from '../../api/backend';
import type { Class } from '../../types';

const ClassesPage: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Class | null>(null);
  const [form, setForm] = useState({ name: '', description: '', durationMinutes: 60, active: true });
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const load = async () => {
    setLoading(true);
    const res = await listClassesApi(true);
    if (res.ok && res.data) setClasses(res.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const startEdit = (c: Class) => {
    setEditing(c);
    setForm({
      name: c.name,
      description: c.description || '',
      durationMinutes: c.durationMinutes,
      active: c.active,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ name: '', description: '', durationMinutes: 60, active: true });
    setEditing(null);
    setShowForm(false);
  };

  const submit = async () => {
    if (!form.name.trim()) {
      showToast('Nome da aula obrigatório', 'error');
      return;
    }
    setSubmitting(true);
    const res = editing
      ? await updateClassApi(editing.id, {
          name: form.name.trim(),
          description: form.description.trim() || null,
          durationMinutes: form.durationMinutes,
          active: form.active,
        })
      : await createClassApi({
          name: form.name.trim(),
          description: form.description.trim() || null,
          durationMinutes: form.durationMinutes,
          active: form.active,
        });

    setSubmitting(false);
    if (!res.ok) {
      showToast(res.error || 'Erro ao salvar aula', 'error');
      return;
    }
    showToast(editing ? 'Aula atualizada' : 'Aula criada', 'success');
    resetForm();
    await load();
  };

  const toggleActive = async (c: Class) => {
    const res = await updateClassApi(c.id, { active: !c.active });
    if (res.ok) {
      setClasses((prev) => prev.map((x) => x.id === c.id ? { ...x, active: !x.active } : x));
      showToast(c.active ? 'Aula desativada' : 'Aula ativada', 'info');
    } else {
      showToast(res.error || 'Erro', 'error');
    }
  };

  return (
    <AppLayout variant="admin" title="Aulas" showLogout>
      <div className="w-full px-4 pt-4 pb-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold">Minhas aulas</h2>
            <p className="text-xs text-text-dim mt-0.5">{classes.length} cadastradas</p>
          </div>
          <Button size="lg" iconLeft={<Plus className="w-5 h-5" />} onClick={() => { resetForm(); setShowForm(true); }}>
            Nova
          </Button>
        </div>

        {showForm && (
          <Card variant="elevated" padding="md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">{editing ? 'Editar aula' : 'Nova aula'}</h3>
              <button onClick={resetForm} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-bg-hover text-text-dim">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <Input label="Nome" placeholder="Aula de desenho individual" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input label="Descrição (opcional)" placeholder="Sobre a aula..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Duração (min)"
                  type="number"
                  min={15}
                  step={15}
                  value={String(form.durationMinutes)}
                  onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) || 60 })}
                  iconLeft={<Clock className="w-5 h-5" />}
                />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, active: !form.active })}
                  className="h-12 mt-6 rounded-2xl flex items-center justify-between px-3.5 bg-bg-card border border-border"
                >
                  <span className="text-sm font-medium">Status</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${form.active ? 'text-success' : 'text-text-muted'}`}>
                      {form.active ? 'ATIVO' : 'INATIVO'}
                    </span>
                    {form.active ? (
                      <ToggleRight className="w-8 h-8 text-success" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-text-muted" />
                    )}
                  </div>
                </button>
              </div>
              <div className="flex gap-2 pt-1">
                <Button variant="ghost" size="lg" onClick={resetForm}>Cancelar</Button>
                <Button size="lg" fullWidth loading={submitting} iconRight={<Check className="w-5 h-5" />} onClick={submit}>
                  {editing ? 'Salvar' : 'Criar aula'}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {loading ? (
          <div className="py-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : classes.length === 0 ? (
          <Card padding="lg" className="text-center">
            <Clock className="w-10 h-10 mx-auto text-text-muted mb-2" />
            <h3 className="font-semibold">Nenhuma aula cadastrada</h3>
            <p className="text-sm text-text-dim mt-1">Clique em "Nova" para criar a primeira.</p>
          </Card>
        ) : (
          <div className="flex flex-col gap-2.5">
            {classes.map((c) => (
              <Card key={c.id} variant="default" padding="md">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold truncate">{c.name}</h3>
                      <Badge variant={c.active ? 'success' : 'neutral'}>{c.active ? 'Ativa' : 'Inativa'}</Badge>
                    </div>
                    {c.description && (
                      <p className="text-sm text-text-dim line-clamp-2">{c.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{c.durationMinutes} min</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => startEdit(c)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center bg-bg-hover text-primary active:scale-95 transition"
                      title="Editar"
                    >
                      <Edit3 className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => toggleActive(c)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition active:scale-95 ${c.active ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}
                      title={c.active ? 'Desativar' : 'Ativar'}
                    >
                      {c.active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ClassesPage;
