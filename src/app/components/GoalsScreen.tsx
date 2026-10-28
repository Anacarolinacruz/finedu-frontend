import { getGoalDeadlineInfo } from '../utils/goalDeadline';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';

import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Home,
  BookOpen,
  TrendingUp,
  Target,
  User,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';

import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from '../services/api';
import type { Goal, CreateGoalInput } from '../services/api';

interface GoalsScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  onSimulateGoal: (goal: Goal) => void;
}

interface GoalForm {
  id: string | null;
  title: string;
  emoji: string;
  targetAmount: string;
  currentAmount: string;
  monthlyAmount: string;
  deadline: string;
}

const emptyForm: GoalForm = {
  id: null,
  title: '',
  emoji: '🎯',
  targetAmount: '',
  currentAmount: '0',
  monthlyAmount: '',
  deadline: '',
};

const emojis = [
  '🎯',
  '💻',
  '✈️',
  '🚗',
  '🏠',
  '🎓',
  '💼',
  '🎮',
  '📱',
  '⌚',
];

const moneyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const inputClass =
  'w-full bg-[#101E35] border border-white/10 rounded-xl ' +
  'px-4 py-3 text-white focus:border-[#E6BB66] focus:outline-none';

function formatMoney(value: number) {
  return moneyFormatter.format(value);
}

function progressOf(goal: Goal) {
  if (goal.targetAmount <= 0) return 0;

  return Math.max(
    0,
    Math.min(
      (goal.currentAmount / goal.targetAmount) * 100,
      100,
    ),
  );
}

function localDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'Não foi possível concluir a operação.';
}

export default function GoalsScreen({
  onBack,
  onNavigate,
  onSimulateGoal,
}: GoalsScreenProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [retry, setRetry] = useState(0);

  const [form, setForm] = useState<GoalForm | null>(null);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const saveInFlight = useRef(false);
  const deleteInFlight = useRef(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadGoals() {
      setLoading(true);
      setLoadError('');

      try {
        const result = await getGoals(controller.signal);

        if (!controller.signal.aborted) {
          setGoals(result);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoadError(errorMessage(error));
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadGoals();

    return () => controller.abort();
  }, [retry]);

  const isFormOpen = form !== null;

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (isFormOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isFormOpen && dialog.open) {
      dialog.close();
    }
  }, [isFormOpen]);

  function openCreate() {
    setFormError('');
    setForm({ ...emptyForm });
  }

  function openEdit(goal: Goal) {
    setFormError('');

    setForm({
      id: goal.id,
      title: goal.title,
      emoji: goal.emoji,
      targetAmount: String(goal.targetAmount),
      currentAmount: String(goal.currentAmount),
      monthlyAmount: String(goal.monthlyAmount),
      deadline: goal.deadline,
    });
  }

  function closeForm() {
    if (saveInFlight.current) return;

    setForm(null);
    setFormError('');
  }

  function changeField(
    field: Exclude<keyof GoalForm, 'id'>,
    value: string,
  ) {
    setForm((current) =>
      current ? { ...current, [field]: value } : current,
    );
  }

  async function handleSave(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!form || saveInFlight.current) return;

    setFormError('');

    const input: CreateGoalInput = {
      title: form.title.trim(),
      emoji: form.emoji,
      targetAmount: Number(form.targetAmount),
      currentAmount: Number(form.currentAmount),
      monthlyAmount: Number(form.monthlyAmount),
      deadline: form.deadline,
    };

    const amounts = [
      input.targetAmount,
      input.currentAmount,
      input.monthlyAmount,
    ];

    if (
      input.title.length < 2 ||
      !input.deadline ||
      !form.targetAmount.trim() ||
      !form.currentAmount.trim() ||
      !form.monthlyAmount.trim() ||
      amounts.some((value) => !Number.isFinite(value)) ||
      input.targetAmount <= 0 ||
      input.currentAmount < 0 ||
      input.monthlyAmount < 0
    ) {
      setFormError(
        'Confira o nome, os valores e o prazo da meta.',
      );
      return;
    }

    if (
      form.id === null &&
      input.deadline < localDateValue(new Date())
    ) {
      setFormError(
        'Escolha hoje ou uma data futura para a nova meta.',
      );
      return;
    }

    saveInFlight.current = true;
    setSaving(true);

    try {
      const savedGoal = form.id
        ? await updateGoal(form.id, input)
        : await createGoal(input);

      setGoals((current) => {
        const others = current.filter(
          (goal) => goal.id !== savedGoal.id,
        );

        return [...others, savedGoal].sort(
          (a, b) =>
            a.deadline.localeCompare(b.deadline) ||
            a.id.localeCompare(b.id),
        );
      });

      setActionError('');
      setForm(null);
    } catch (error) {
      setFormError(errorMessage(error));
    } finally {
      saveInFlight.current = false;
      setSaving(false);
    }
  }

  async function handleDelete(goal: Goal) {
    if (deleteInFlight.current) return;

    const confirmed = window.confirm(
      `Excluir a meta "${goal.title}"? Esta ação não pode ser desfeita.`,
    );

    if (!confirmed) return;

    deleteInFlight.current = true;
    setDeletingId(goal.id);
    setActionError('');

    try {
      await deleteGoal(goal.id);

      setGoals((current) =>
        current.filter((item) => item.id !== goal.id),
      );
    } catch (error) {
      setActionError(errorMessage(error));
    } finally {
      deleteInFlight.current = false;
      setDeletingId(null);
    }
  }

  const totalSaved = goals.reduce(
    (sum, goal) => sum + goal.currentAmount,
    0,
  );

  const activeGoals = goals.filter(
    (goal) => goal.currentAmount < goal.targetAmount,
  ).length;

  const averageProgress =
    goals.length > 0
      ? goals.reduce(
          (sum, goal) => sum + progressOf(goal),
          0,
        ) / goals.length
      : 0;

  const navigation = [
    { screen: 'dashboard', label: 'Home', icon: Home },
    { screen: 'courses', label: 'Cursos', icon: BookOpen },
    {
      screen: 'simulator',
      label: 'Investir',
      icon: TrendingUp,
    },
    { screen: 'goals', label: 'Metas', icon: Target },
    { screen: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#101E35] text-white pb-28">
      <header className="bg-[#172B43] px-6 pt-8 pb-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onBack}
                aria-label="Voltar"
                className="text-[#ADBFCC] hover:text-white"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>

              <h1 className="text-2xl font-bold">
                Minhas Metas
              </h1>
            </div>

            <button
              type="button"
              onClick={openCreate}
              disabled={loading || Boolean(loadError)}
              aria-label="Criar meta"
              className="w-11 h-11 bg-[#E6BB66] rounded-full flex items-center justify-center text-[#101E35] disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                label: 'Metas em aberto',
                value: String(activeGoals),
              },
              {
                label: 'Total guardado informado',
                value: formatMoney(totalSaved),
              },
              {
                label: 'Progresso médio',
                value: `${Math.round(averageProgress)}%`,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-[#101E35] rounded-xl p-4 text-center"
              >
                <p className="text-xl font-bold text-[#E6BB66] break-words">
                  {loading || loadError
                    ? '—'
                    : item.value}
                </p>

                <p className="text-xs text-[#ADBFCC] mt-1">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-6 space-y-4">
        {actionError && (
          <p
            role="alert"
            className="rounded-xl border border-red-400/30 p-4 text-red-300"
          >
            {actionError}
          </p>
        )}

        {loading ? (
          <div
            role="status"
            className="flex justify-center items-center gap-3 py-16 text-[#ADBFCC]"
          >
            <Loader2 className="w-6 h-6 animate-spin text-[#E6BB66]" />
            Carregando metas…
          </div>
        ) : loadError ? (
          <section
            role="alert"
            className="bg-[#172B43] rounded-2xl p-6"
          >
            <p className="text-red-300 mb-4">
              {loadError}
            </p>

            <button
              type="button"
              onClick={() =>
                setRetry((value) => value + 1)
              }
              className="bg-[#E6BB66] text-black px-5 py-3 rounded-xl font-semibold"
            >
              Tentar novamente
            </button>
          </section>
        ) : goals.length === 0 ? (
          <section className="bg-[#172B43] border border-white/10 rounded-2xl p-8 text-center">
            <Target className="w-12 h-12 text-[#E6BB66] mx-auto mb-4" />

            <h2 className="text-xl font-bold mb-2">
              Crie sua primeira meta
            </h2>

            <p className="text-[#ADBFCC] mb-5">
              Defina um objetivo e acompanhe quanto já
              guardou.
            </p>

            <button
              type="button"
              onClick={openCreate}
              className="bg-[#E6BB66] text-black px-6 py-3 rounded-xl font-semibold"
            >
              Criar meta
            </button>
          </section>
        ) : (
          goals.map((goal) => {
            const progress = progressOf(goal);

            const remaining = Math.max(
              goal.targetAmount - goal.currentAmount,
              0,
            );

            const completed = remaining === 0;
            const deadline = getGoalDeadlineInfo(goal.deadline);

            const neededPerMonth =
              deadline.months > 0
                ? remaining / deadline.months
                : null;

            const onTrack =
              completed ||
              (neededPerMonth !== null &&
                goal.monthlyAmount >= neededPerMonth);

            const status = completed
              ? 'Concluída'
              : !deadline.valid
                ? 'Revisar prazo'
                : deadline.expired
                ? 'Prazo vencido'
                : deadline.dueToday
                  ? 'Vence hoje'
                  : deadline.months === 0
                    ? 'Menos de um mês'
                    : onTrack
                    ? 'No caminho'
                    : 'Rever aporte';

            return (
              <section
                key={goal.id}
                className="bg-[#172B43] border border-white/10 rounded-2xl p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 shrink-0 bg-[#E6BB66]/10 rounded-xl flex items-center justify-center text-2xl">
                      {goal.emoji}
                    </div>

                    <div className="min-w-0">
                      <h2 className="font-semibold break-words">
                        {goal.title}
                      </h2>

                      <p className="text-sm text-[#ADBFCC]">
                        Prazo:{' '}
                        {new Date(
                          `${goal.deadline}T00:00:00`,
                        ).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      onTrack
                        ? 'bg-[#E6BB66]/10 text-[#E6BB66]'
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <div className="flex flex-wrap justify-between gap-2 mb-2 text-sm">
                  <span className="text-[#ADBFCC]">
                    Valor guardado
                  </span>

                  <span>
                    {formatMoney(goal.currentAmount)}
                    {' / '}
                    {formatMoney(goal.targetAmount)}
                  </span>
                </div>

                <div
                  role="progressbar"
                  aria-label={`Progresso de ${goal.title}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Number(
                    progress.toFixed(1),
                  )}
                  className="h-3 bg-[#101E35] rounded-full overflow-hidden"
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${progress}%`,
                    }}
                    className="h-full bg-[#E6BB66] rounded-full"
                  />
                </div>

                <div className="flex flex-wrap justify-between gap-2 mt-2 text-xs">
                  <span className="text-[#ADBFCC]">
                    {progress.toFixed(1)}% concluído
                  </span>

                  <span className="text-[#E6BB66]">
                    {completed
                      ? 'Objetivo alcançado'
                      : `Faltam ${formatMoney(remaining)}`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                  <div className="bg-[#101E35] rounded-xl p-3">
                    <p className="text-xs text-[#ADBFCC] mb-1">
                      Aporte mensal planejado
                    </p>

                    <p className="font-semibold">
                      {formatMoney(goal.monthlyAmount)}
                    </p>
                  </div>

                  <div className="bg-[#101E35] rounded-xl p-3">
                    <p className="text-xs text-[#ADBFCC] mb-1">
                      Necessário por mês, sem rendimentos
                    </p>

                    <p className="font-semibold">
                      {completed
                        ? formatMoney(0)
                        : neededPerMonth === null
                          ? 'Revisar prazo'
                          : formatMoney(
                              Math.ceil(
                                neededPerMonth * 100,
                              ) / 100,
                            )}
                    </p>
                  </div>
                </div>

                {!completed && deadline.months > 0 && (
                  <p className="text-xs text-[#ADBFCC] mt-3">
                    Planejamento com{' '}
                    {deadline.months}{' '}
                    {deadline.months === 1
                      ? 'mês completo'
                      : 'meses completos'}
                    .
                  </p>
                )}

                {!completed && deadline.valid && !deadline.expired && !deadline.dueToday && deadline.months === 0 && (
                  <p className="text-xs text-yellow-300 mt-3">
                    Falta menos de um mês completo. Revise o prazo ou planeje uma contribuição antes do vencimento.
                  </p>
                )}

                <div className="flex flex-wrap gap-3 mt-5">
                  <button
                    type="button"
                    onClick={() => onSimulateGoal(goal)}
                    disabled={deletingId !== null}
                    className="flex items-center gap-2 bg-[#E6BB66] text-black rounded-xl px-4 py-2 text-sm font-semibold hover:bg-[#2BAAA0] disabled:opacity-50"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Simular esta meta
                  </button>

                  <button
                    type="button"
                    onClick={() => openEdit(goal)}
                    disabled={deletingId !== null}
                    className="flex items-center gap-2 border border-white/10 rounded-xl px-4 py-2 text-sm hover:border-[#E6BB66] disabled:opacity-50"
                  >
                    <Pencil className="w-4 h-4" />
                    Editar / atualizar saldo
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      void handleDelete(goal)
                    }
                    disabled={deletingId !== null}
                    className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-red-300 disabled:opacity-50"
                  >
                    {deletingId === goal.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}

                    {deletingId === goal.id
                      ? 'Excluindo…'
                      : 'Excluir'}
                  </button>
                </div>
              </section>
            );
          })
        )}
      </main>

      <dialog
        ref={dialogRef}
        aria-labelledby="goal-form-title"
        onCancel={(event) => {
          event.preventDefault();
          closeForm();
        }}
        onClose={() => {
          if (!saveInFlight.current) {
            setForm(null);
          }
        }}
        className="m-auto w-[calc(100%_-_2rem)] max-w-lg max-h-[90dvh] overflow-y-auto rounded-3xl border border-white/10 bg-[#172B43] p-6 text-white backdrop:bg-black/80"
      >
        {form && (
          <form onSubmit={handleSave}>
            <div className="flex justify-between items-center gap-3 mb-6">
              <h2
                id="goal-form-title"
                className="text-2xl font-bold"
              >
                {form.id ? 'Editar meta' : 'Nova meta'}
              </h2>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                aria-label="Fechar formulário"
                className="p-2 disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <fieldset
              disabled={saving}
              className="space-y-4"
            >
              <div>
                <p className="text-sm text-[#ADBFCC] mb-2">
                  Escolha um ícone
                </p>

                <div className="flex flex-wrap gap-2">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      aria-label={`Selecionar ícone ${emoji}`}
                      aria-pressed={
                        form.emoji === emoji
                      }
                      onClick={() =>
                        changeField('emoji', emoji)
                      }
                      className={`w-11 h-11 rounded-xl border text-2xl ${
                        form.emoji === emoji
                          ? 'border-[#E6BB66] bg-[#E6BB66]/10'
                          : 'border-white/10 bg-[#101E35]'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="goal-title"
                  className="block text-sm text-[#ADBFCC] mb-2"
                >
                  Nome da meta
                </label>

                <input
                  id="goal-title"
                  type="text"
                  required
                  minLength={2}
                  maxLength={100}
                  autoFocus
                  value={form.title}
                  onChange={(event) =>
                    changeField(
                      'title',
                      event.target.value,
                    )
                  }
                  placeholder="Ex.: Comprar notebook"
                  className={inputClass}
                />
              </div>

              {[
                {
                  field: 'targetAmount' as const,
                  label: 'Valor desejado (R$)',
                  min: '0.01',
                },
                {
                  field: 'currentAmount' as const,
                  label: 'Valor já guardado (R$)',
                  min: '0',
                },
                {
                  field: 'monthlyAmount' as const,
                  label:
                    'Quanto pretende guardar por mês? (R$)',
                  min: '0',
                },
              ].map(({ field, label, min }) => (
                <div key={field}>
                  <label
                    htmlFor={`goal-${field}`}
                    className="block text-sm text-[#ADBFCC] mb-2"
                  >
                    {label}
                  </label>

                  <input
                    id={`goal-${field}`}
                    type="number"
                    inputMode="decimal"
                    required
                    min={min}
                    max="9999999999.99"
                    step="0.01"
                    value={form[field]}
                    onChange={(event) =>
                      changeField(
                        field,
                        event.target.value,
                      )
                    }
                    className={inputClass}
                  />
                </div>
              ))}

              <div>
                <label
                  htmlFor="goal-deadline"
                  className="block text-sm text-[#ADBFCC] mb-2"
                >
                  Prazo
                </label>

                <input
                  id="goal-deadline"
                  type="date"
                  required
                  min={
                    form.id
                      ? undefined
                      : localDateValue(new Date())
                  }
                  value={form.deadline}
                  onChange={(event) =>
                    changeField(
                      'deadline',
                      event.target.value,
                    )
                  }
                  className={inputClass}
                />
              </div>

              <p className="text-xs text-[#ADBFCC]">
                O aporte mensal é um planejamento.
                Atualize o valor guardado conforme suas
                contribuições reais.
              </p>
            </fieldset>

            {formError && (
              <p
                role="alert"
                className="text-red-300 text-sm mt-4"
              >
                {formError}
              </p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="flex-1 border border-white/10 rounded-xl py-3 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-[#E6BB66] text-black rounded-xl py-3 font-semibold disabled:opacity-50"
              >
                {saving && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}

                {saving
                  ? 'Salvando…'
                  : form.id
                    ? 'Salvar'
                    : 'Criar meta'}
              </button>
            </div>
          </form>
        )}
      </dialog>

      <nav
        aria-label="Navegação principal"
        className="fixed bottom-0 left-0 right-0 bg-[#172B43] border-t border-white/10"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-5 px-3 py-3">
          {navigation.map(
            ({ screen, label, icon: Icon }) => (
              <button
                key={screen}
                type="button"
                aria-current={
                  screen === 'goals'
                    ? 'page'
                    : undefined
                }
                onClick={() => onNavigate(screen)}
                className={`flex flex-col items-center gap-1 ${
                  screen === 'goals'
                    ? 'text-[#E6BB66]'
                    : 'text-[#ADBFCC]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">
                  {label}
                </span>
              </button>
            ),
          )}
        </div>
      </nav>
    </div>
  );
}