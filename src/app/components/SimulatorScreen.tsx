import { useState } from 'react';
import { ArrowLeft, DollarSign, Calendar, TrendingUp, Home, BookOpen, Target, User } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';

interface SimulatorScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

export default function SimulatorScreen({ onBack, onNavigate }: SimulatorScreenProps) {
  const [initialValue, setInitialValue] = useState('1000');
  const [monthlyContribution, setMonthlyContribution] = useState('200');
  const [period, setPeriod] = useState('12');
  const [investmentType, setInvestmentType] = useState('cdb');

  const rates = {
    poupanca: 0.5,
    cdb: 0.9,
    lci: 0.8,
    tesouro: 1.0,
    acoes: 1.5,
  };

  const investmentTypes = [
    { id: 'poupanca', name: 'Poupança', rate: '0,5% a.m.', risk: 'Baixo' },
    { id: 'cdb', name: 'CDB', rate: '0,9% a.m.', risk: 'Baixo' },
    { id: 'lci', name: 'LCI/LCA', rate: '0,8% a.m.', risk: 'Baixo' },
    { id: 'tesouro', name: 'Tesouro Direto', rate: '1,0% a.m.', risk: 'Médio' },
    { id: 'acoes', name: 'Ações', rate: '1,5% a.m.', risk: 'Alto' },
  ];

  const calculateInvestment = () => {
    const initial = parseFloat(initialValue) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const months = parseInt(period) || 1;
    const rate = rates[investmentType as keyof typeof rates] / 100;

    const data = [];
    let accumulated = initial;
    let totalContributed = initial;

    for (let i = 0; i <= months; i++) {
      if (i > 0) {
        accumulated = accumulated * (1 + rate) + monthly;
        totalContributed += monthly;
      }

      data.push({
        month: i,
        value: accumulated,
        contributed: totalContributed,
      });
    }

    return {
      data,
      finalValue: accumulated,
      totalContributed,
      earnings: accumulated - totalContributed,
    };
  };

  const result = calculateInvestment();

  return (
    <div className="min-h-screen bg-[#0F0F0F] pb-24">
      <div className="bg-[#1E1E1E] px-6 pt-8 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="text-[#B3B3B3] hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-white">Simulador de Investimentos</h1>
        </div>
      </div>

      <div className="px-6 pt-6 space-y-6">
        <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4">Dados do Investimento</h3>

          <div className="space-y-4">
            <div>
              <label className="text-[#B3B3B3] text-sm mb-2 block">Valor Inicial (R$)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B3B3B3]" />
                <input
                  type="number"
                  value={initialValue}
                  onChange={(e) => setInitialValue(e.target.value)}
                  className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-12 py-3 text-white focus:border-[#4ADE80] focus:outline-none transition-colors"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="text-[#B3B3B3] text-sm mb-2 block">Aporte Mensal (R$)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B3B3B3]" />
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-12 py-3 text-white focus:border-[#4ADE80] focus:outline-none transition-colors"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="text-[#B3B3B3] text-sm mb-2 block">Período (meses)</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B3B3B3]" />
                <input
                  type="number"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-12 py-3 text-white focus:border-[#4ADE80] focus:outline-none transition-colors"
                  placeholder="12"
                />
              </div>
            </div>

            <div>
              <label className="text-[#B3B3B3] text-sm mb-2 block">Tipo de Investimento</label>
              <div className="space-y-2">
                {investmentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setInvestmentType(type.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                      investmentType === type.id
                        ? 'bg-[#4ADE80]/10 border-[#4ADE80]'
                        : 'bg-[#0F0F0F] border-white/10 hover:border-[#4ADE80]/50'
                    }`}
                  >
                    <div className="text-left">
                      <p className="text-white font-medium">{type.name}</p>
                      <p className="text-xs text-[#B3B3B3]">Risco {type.risk}</p>
                    </div>
                    <span className={`text-sm font-medium ${
                      investmentType === type.id ? 'text-[#4ADE80]' : 'text-[#B3B3B3]'
                    }`}>
                      {type.rate}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4">Resultado da Simulação</h3>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-[#0F0F0F] rounded-xl p-4">
              <p className="text-[#B3B3B3] text-xs mb-1">Valor Final</p>
              <p className="text-[#4ADE80] text-xl font-bold">
                R$ {result.finalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-[#0F0F0F] rounded-xl p-4">
              <p className="text-[#B3B3B3] text-xs mb-1">Rentabilidade</p>
              <p className="text-white text-xl font-bold">
                R$ {result.earnings.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="bg-[#0F0F0F] rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[#B3B3B3] text-sm">Total Investido</p>
              <p className="text-white font-semibold">
                R$ {result.totalContributed.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[#B3B3B3] text-sm">Rendimento</p>
              <p className="text-[#4ADE80] font-semibold">
                {((result.earnings / result.totalContributed) * 100).toFixed(2)}%
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={result.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" />
              <XAxis
                dataKey="month"
                stroke="#B3B3B3"
                fontSize={12}
                label={{ value: 'Meses', position: 'insideBottom', offset: -5, fill: '#B3B3B3' }}
              />
              <YAxis
                stroke="#B3B3B3"
                fontSize={12}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E1E1E',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff'
                }}
                formatter={(value: any) => [`R$ ${parseFloat(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Valor']}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4ADE80"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="contributed"
                stroke="#B3B3B3"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="flex items-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#4ADE80]" />
              <span className="text-[#B3B3B3]">Com rendimento</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[#B3B3B3]" />
              <span className="text-[#B3B3B3]">Sem rendimento</span>
            </div>
          </div>
        </div>

        <div className="bg-[#4ADE80]/10 border border-[#4ADE80] rounded-2xl p-4">
          <div className="flex gap-3">
            <TrendingUp className="w-5 h-5 text-[#4ADE80] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[#4ADE80] font-medium mb-1">Dica de Investimento</p>
              <p className="text-[#4ADE80]/80 text-sm">
                {investmentType === 'poupanca' && 'A poupança é segura, mas considere opções com melhor rentabilidade como CDB ou Tesouro Direto.'}
                {investmentType === 'cdb' && 'CDB é uma ótima opção para iniciantes. Escolha bancos com boa reputação e rendimento acima de 100% do CDI.'}
                {investmentType === 'lci' && 'LCI/LCA são isentos de IR! Ótima opção para aumentar sua rentabilidade líquida.'}
                {investmentType === 'tesouro' && 'Tesouro Direto é seguro e acessível. Diversifique entre Selic, IPCA e Prefixado.'}
                {investmentType === 'acoes' && 'Ações têm maior potencial de retorno, mas também mais risco. Estude antes de investir e diversifique.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#1E1E1E] border-t border-white/10 px-6 py-3">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button onClick={() => onNavigate('dashboard')} className="flex flex-col items-center gap-1 text-[#B3B3B3] hover:text-white transition-colors">
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button onClick={() => onNavigate('courses')} className="flex flex-col items-center gap-1 text-[#B3B3B3] hover:text-white transition-colors">
            <BookOpen className="w-6 h-6" />
            <span className="text-xs">Cursos</span>
          </button>
          <button onClick={() => onNavigate('simulator')} className="flex flex-col items-center gap-1 text-[#4ADE80]">
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs">Investir</span>
          </button>
          <button onClick={() => onNavigate('goals')} className="flex flex-col items-center gap-1 text-[#B3B3B3] hover:text-white transition-colors">
            <Target className="w-6 h-6" />
            <span className="text-xs">Metas</span>
          </button>
          <button onClick={() => onNavigate('profile')} className="flex flex-col items-center gap-1 text-[#B3B3B3] hover:text-white transition-colors">
            <User className="w-6 h-6" />
            <span className="text-xs">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
