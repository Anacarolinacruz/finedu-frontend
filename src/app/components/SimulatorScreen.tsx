import { getGoalDeadlineInfo } from '../utils/goalDeadline';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Loader2,
  Home,
  BookOpen,
  TrendingUp,
  Target,
  User,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from 'recharts';

import { getMarketRates } from '../services/api';
import type { Goal, MarketRates } from '../services/api';

interface SimulatorScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  goal?: Goal | null;
}

type InvestmentType = keyof MarketRates;

const investmentTypes: InvestmentType[] = [
  'poupanca',
  'cdb',
  'lci',
];

const money = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const inputClass =
  'w-full bg-[#0F0F0F] border border-white/10 rounded-xl ' +
  'px-4 py-3 text-white focus:border-[#4ADE80] focus:outline-none';

function formatPercent(value: number) {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatReferenceDate(value: string | null) {
  if (!value) return 'Não disponível';

  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

export default function SimulatorScreen({
  onBack,
  onNavigate,
  goal = null,
}: SimulatorScreenProps) {
  const [initialValue, setInitialValue] = useState(() =>
    String(goal?.currentAmount ?? 1000),
  );

  const [monthlyContribution, setMonthlyContribution] =
    useState(() => String(goal?.monthlyAmount ?? 200));

  const [period, setPeriod] = useState(() => {
    if (!goal) return '12';

    const months = getGoalDeadlineInfo(goal.deadline).months;

    return months > 0 ? String(months) : '';
  });

  const [investmentType, setInvestmentType] =
    useState<InvestmentType>('cdb');

  const [rates, setRates] =
    useState<MarketRates | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadRates() {
      setLoading(true);
      setError('');
      setRates(null);

      try {
        const result = await getMarketRates(
          controller.signal,
        );

        if (!controller.signal.aborted) {
          setRates(result);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar as taxas.',
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadRates();

    return () => controller.abort();
  }, [retry]);

  const selectedRate = rates?.[investmentType];
  const monthlyPercent = selectedRate?.monthlyPercent;

  const initial = Number(initialValue);
  const monthly = Number(monthlyContribution);
  const months = Number(period);

  const validInputs =
    initialValue.trim() !== '' &&
    monthlyContribution.trim() !== '' &&
    period.trim() !== '' &&
    Number.isFinite(initial) &&
    Number.isFinite(monthly) &&
    Number.isInteger(months) &&
    initial >= 0 &&
    initial <= 9999999999.99 &&
    monthly >= 0 &&
    monthly <= 9999999999.99 &&
    months >= 1 &&
    months <= 600;

  const canSimulate =
    !loading &&
    !error &&
    validInputs &&
    selectedRate?.available === true &&
    monthlyPercent !== null &&
    monthlyPercent !== undefined &&
    Number.isFinite(monthlyPercent);

  const result = (() => {
    if (!canSimulate || monthlyPercent == null) {
      return null;
    }

    const rate = monthlyPercent / 100;

    let accumulated = initial;
    let contributed = initial;

    const data = [
      {
        month: 0,
        value: accumulated,
        contributed,
      },
    ];

    for (let month = 1; month <= months; month++) {
      // Aportes realizados no final de cada mês.
      accumulated = accumulated * (1 + rate) + monthly;
      contributed += monthly;

      data.push({
        month,
        value: accumulated,
        contributed,
      });
    }

    if (!Number.isFinite(accumulated)) {
      return null;
    }

    return {
      data,
      finalValue: accumulated,
      totalContributed: contributed,
      earnings: accumulated - contributed,
    };
  })();

  const originalGoalMonths = goal
    ? getGoalDeadlineInfo(goal.deadline).months
    : null;

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
    <div className="min-h-screen bg-[#0F0F0F] text-white pb-28">
      <header className="bg-[#1E1E1E] px-6 pt-8 pb-6">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            aria-label="Voltar"
            className="text-[#B3B3B3] hover:text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <h1 className="text-2xl font-bold">
            Simulador de Investimentos
          </h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-6 space-y-6">
        {goal && (
          <section className="bg-[#4ADE80]/10 border border-[#4ADE80]/30 rounded-2xl p-5">
            <p className="text-sm text-[#B3B3B3] mb-1">
              Simulação da meta
            </p>

            <h2 className="text-xl font-bold">
              {goal.emoji} {goal.title}
            </h2>

            <p className="text-sm text-[#B3B3B3] mt-2">
              Objetivo: {money.format(goal.targetAmount)}
              {' · '}
              Prazo cadastrado:{' '}
              {formatReferenceDate(goal.deadline)}
            </p>

            <p className="text-xs text-[#B3B3B3] mt-3">
              Os campos foram preenchidos com os dados da
              meta. Alterações nesta simulação não modificam
              o cadastro. O período considera meses completos.
            </p>

            {originalGoalMonths === 0 && (
              <p className="text-sm text-yellow-300 mt-3">
                O prazo está vencido ou não permite um mês
                completo. Informe um novo período abaixo para
                explorar outro cenário.
              </p>
            )}

            {originalGoalMonths !== null &&
              originalGoalMonths > 600 && (
                <p className="text-sm text-yellow-300 mt-3">
                  O prazo ultrapassa o limite de 600 meses.
                  Informe um período entre 1 e 600 meses.
                </p>
              )}
          </section>
        )}

        <section className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-5">
          <h2 className="font-semibold mb-4">
            Dados da simulação
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="initial-value"
                className="block text-sm text-[#B3B3B3] mb-2"
              >
                Valor inicial (R$)
              </label>

              <input
                id="initial-value"
                type="number"
                inputMode="decimal"
                min="0"
                max="9999999999.99"
                step="0.01"
                value={initialValue}
                onChange={(event) =>
                  setInitialValue(event.target.value)
                }
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="monthly-contribution"
                className="block text-sm text-[#B3B3B3] mb-2"
              >
                Aporte mensal (R$)
              </label>

              <input
                id="monthly-contribution"
                type="number"
                inputMode="decimal"
                min="0"
                max="9999999999.99"
                step="0.01"
                value={monthlyContribution}
                onChange={(event) =>
                  setMonthlyContribution(
                    event.target.value,
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="simulation-period"
                className="block text-sm text-[#B3B3B3] mb-2"
              >
                Período em meses
              </label>

              <input
                id="simulation-period"
                type="number"
                min="1"
                max="600"
                step="1"
                value={period}
                onChange={(event) =>
                  setPeriod(event.target.value)
                }
                placeholder="Informe o período"
                className={inputClass}
              />
            </div>
          </div>

          {!validInputs && (
            <p
              role="alert"
              className="text-yellow-300 text-sm mt-4"
            >
              Informe valores entre zero e
              R$ 9.999.999.999,99 e um prazo inteiro entre
              1 e 600 meses.
            </p>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <h2 className="font-semibold">
              Referências para simulação
            </h2>

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                setRetry((value) => value + 1)
              }
              className="text-sm text-[#4ADE80] disabled:opacity-50"
            >
              Consultar novamente
            </button>
          </div>

          {loading ? (
            <div
              role="status"
              className="flex items-center gap-3 py-8 text-[#B3B3B3]"
            >
              <Loader2 className="w-5 h-5 animate-spin text-[#4ADE80]" />
              Consultando referências de mercado…
            </div>
          ) : error ? (
            <p
              role="alert"
              className="bg-[#1E1E1E] border border-red-400/30 rounded-xl p-4 text-red-300"
            >
              {error}
            </p>
          ) : rates ? (
            <div className="grid gap-3 md:grid-cols-3">
              {investmentTypes.map((id) => {
                const item = rates[id];

                const available =
                  item.available &&
                  item.monthlyPercent !== null &&
                  Number.isFinite(
                    item.monthlyPercent,
                  );

                return (
                  <button
                    key={id}
                    type="button"
                    disabled={!available}
                    aria-pressed={
                      investmentType === id
                    }
                    onClick={() =>
                      setInvestmentType(id)
                    }
                    className={`text-left rounded-2xl border p-5 transition-colors disabled:opacity-60 ${
                      investmentType === id
                        ? 'bg-[#4ADE80]/10 border-[#4ADE80]'
                        : 'bg-[#1E1E1E] border-white/10'
                    }`}
                  >
                    <h3 className="font-bold text-lg">
                      {item.name}
                    </h3>

                    <p className="text-sm text-[#B3B3B3] mt-1">
                      {item.benchmark}
                    </p>

                    <p className="text-xl font-bold text-[#4ADE80] mt-4">
                      {available &&
                      item.monthlyPercent !== null
                        ? `≈ ${formatPercent(
                            item.monthlyPercent,
                          )}% a.m.*`
                        : 'Indisponível'}
                    </p>

                    <p className="text-xs text-[#B3B3B3] mt-3">
                      Referência:{' '}
                      {formatReferenceDate(
                        item.referenceDate,
                      )}
                    </p>

                    <p className="text-xs text-[#B3B3B3] mt-1">
                      {item.source}
                    </p>

                    {item.fetchedAt && (
                      <p className="text-xs text-[#B3B3B3] mt-1">
                        Consulta:{' '}
                        {new Date(
                          item.fetchedAt,
                        ).toLocaleString('pt-BR')}
                      </p>
                    )}

                    {item.stale && (
                      <p className="text-xs text-yellow-300 mt-2">
                        Atualização indisponível.
                        Exibindo a última referência
                        consultada.
                      </p>
                    )}

                    <p className="text-xs text-[#B3B3B3] mt-3">
                      *{item.note}
                    </p>
                  </button>
                );
              })}
            </div>
          ) : null}
        </section>

        <section className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-5">
          <h2 className="font-semibold mb-4">
            Resultado da simulação
          </h2>

          {result ? (
            <>
              <p className="text-sm text-[#B3B3B3] mb-5">
                {selectedRate?.name} · taxa de referência
                mantida constante durante os {months}{' '}
                meses.
              </p>

              <div className="grid gap-3 sm:grid-cols-3 mb-6">
                {[
                  {
                    label: 'Saldo bruto projetado',
                    value: result.finalValue,
                  },
                  {
                    label:
                      'Total de recursos aplicados',
                    value: result.totalContributed,
                  },
                  {
                    label:
                      'Rendimento bruto estimado',
                    value: result.earnings,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-[#0F0F0F] rounded-xl p-4"
                  >
                    <p className="text-xs text-[#B3B3B3] mb-2">
                      {item.label}
                    </p>

                    <p className="font-bold text-lg text-[#4ADE80] break-words">
                      {money.format(item.value)}
                    </p>
                  </div>
                ))}
              </div>

              {goal && (
                <div className="bg-[#0F0F0F] rounded-xl p-4 mb-6">
                  <p className="text-sm text-[#B3B3B3]">
                    Comparação com o objetivo de{' '}
                    {money.format(
                      goal.targetAmount,
                    )}
                  </p>

                  <p className="text-sm text-[#B3B3B3] mt-1">
                    Período simulado: {months}{' '}
                    {months === 1 ? 'mês' : 'meses'}.
                  </p>

                  <p
                    className={`font-semibold mt-2 ${
                      result.finalValue >=
                      goal.targetAmount
                        ? 'text-[#4ADE80]'
                        : 'text-yellow-300'
                    }`}
                  >
                    {result.finalValue >=
                    goal.targetAmount
                      ? `A projeção alcança o objetivo, com excedente de ${money.format(
                          result.finalValue -
                            goal.targetAmount,
                        )}.`
                      : `Na projeção, ainda faltariam ${money.format(
                          goal.targetAmount -
                            result.finalValue,
                        )}.`}
                  </p>

                  <p className="text-xs text-[#B3B3B3] mt-2">
                    Comparação baseada nos valores e
                    no período informados. O resultado
                    futuro pode variar.
                  </p>
                </div>
              )}

              <ResponsiveContainer
                width="100%"
                height={240}
              >
                <LineChart
                  data={result.data}
                  margin={{
                    top: 10,
                    right: 10,
                    bottom: 10,
                    left: 10,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#333"
                  />

                  <XAxis
                    dataKey="month"
                    stroke="#B3B3B3"
                    fontSize={12}
                  />

                  <YAxis
                    stroke="#B3B3B3"
                    fontSize={12}
                    width={75}
                    tickFormatter={(
                      value: number,
                    ) =>
                      value.toLocaleString(
                        'pt-BR',
                        {
                          notation: 'compact',
                          maximumFractionDigits: 1,
                        },
                      )
                    }
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E1E1E',
                      border: '1px solid #444',
                      borderRadius: 12,
                      color: '#fff',
                    }}
                    labelFormatter={(label) =>
                      `Mês ${label}`
                    }
                    formatter={(value) =>
                      money.format(Number(value))
                    }
                  />

                  <Line
                    name="Saldo bruto projetado"
                    type="monotone"
                    dataKey="value"
                    stroke="#4ADE80"
                    strokeWidth={3}
                    dot={false}
                  />

                  <Line
                    name="Recursos aplicados"
                    type="monotone"
                    dataKey="contributed"
                    stroke="#B3B3B3"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>

              <p className="text-xs text-[#B3B3B3] mt-4">
                Verde: saldo projetado. Cinza:
                valor inicial mais aportes.
              </p>
            </>
          ) : (
            <p className="text-sm text-[#B3B3B3]">
              Preencha valores válidos e selecione uma
              referência disponível para visualizar
              a projeção.
            </p>
          )}
        </section>

        <section className="bg-[#4ADE80]/10 border border-[#4ADE80]/30 rounded-2xl p-4">
          <h2 className="text-[#4ADE80] font-semibold mb-2">
            Como interpretar
          </h2>

          <p className="text-sm text-[#B3B3B3]">
            Projeção educacional com aportes no final de
            cada mês e taxa constante. Os valores são
            brutos, sem descontar impostos, tarifas ou
            inflação. As taxas futuras podem mudar.
            Na poupança, esta projeção mensal simplifica
            as regras de aniversário dos depósitos.
          </p>

          {goal && (
            <p className="text-sm text-[#B3B3B3] mt-3">
              Esta simulação não atualiza o saldo
              guardado nem o progresso da sua meta.
            </p>
          )}
        </section>


      </main>

      <nav
        aria-label="Navegação principal"
        className="fixed bottom-0 left-0 right-0 bg-[#1E1E1E] border-t border-white/10"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-5 px-3 py-3">
          {navigation.map(
            ({ screen, label, icon: Icon }) => (
              <button
                key={screen}
                type="button"
                aria-current={
                  screen === 'simulator'
                    ? 'page'
                    : undefined
                }
                onClick={() =>
                  onNavigate(screen)
                }
                className={`flex flex-col items-center gap-1 ${
                  screen === 'simulator'
                    ? 'text-[#4ADE80]'
                    : 'text-[#B3B3B3]'
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