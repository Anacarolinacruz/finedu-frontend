import { useState } from 'react';
import { ArrowLeft, Plus, Target as TargetIcon, Calendar, DollarSign, Home, BookOpen, TrendingUp, Target, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GoalsScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

export default function GoalsScreen({ onBack, onNavigate }: GoalsScreenProps) {
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: '',
    deadline: '',
    monthly: '',
    emoji: '🎯',
  });

  const goals = [
    {
      id: 1,
      title: 'Comprar Notebook',
      current: 1200,
      target: 3000,
      deadline: '2026-12-31',
      monthly: 200,
      emoji: '💻',
    },
    {
      id: 2,
      title: 'Fazer Intercâmbio',
      current: 5000,
      target: 15000,
      deadline: '2027-06-30',
      monthly: 500,
      emoji: '✈️',
    },
    {
      id: 3,
      title: 'Comprar Carro',
      current: 8000,
      target: 30000,
      deadline: '2028-12-31',
      monthly: 800,
      emoji: '🚗',
    },
  ];

  const emojis = ['🎯', '💻', '✈️', '🚗', '🏠', '🎓', '💼', '🎮', '📱', '⌚'];

  const calculateMonthsRemaining = (deadline: string) => {
    const today = new Date();
    const end = new Date(deadline);
    const months = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return months;
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] pb-24">
      <div className="bg-[#1E1E1E] px-6 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-[#B3B3B3] hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-white">Minhas Metas</h1>
          </div>
          <button
            onClick={() => setShowNewGoal(true)}
            className="w-10 h-10 bg-[#4ADE80] rounded-full flex items-center justify-center hover:bg-[#22C55E] transition-colors"
          >
            <Plus className="w-5 h-5 text-[#0F0F0F]" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#0F0F0F] rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-white">{goals.length}</p>
            <p className="text-xs text-[#B3B3B3]">Metas Ativas</p>
          </div>
          <div className="bg-[#0F0F0F] rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-[#4ADE80]">
              R$ {goals.reduce((sum, g) => sum + g.current, 0).toLocaleString()}
            </p>
            <p className="text-xs text-[#B3B3B3]">Total Economizado</p>
          </div>
          <div className="bg-[#0F0F0F] rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-white">
              {Math.round(goals.reduce((sum, g) => sum + calculateProgress(g.current, g.target), 0) / goals.length)}%
            </p>
            <p className="text-xs text-[#B3B3B3]">Progresso Médio</p>
          </div>
        </div>
      </div>

      <div className="px-6 pt-6 space-y-4">
        {goals.map((goal) => {
          const progress = calculateProgress(goal.current, goal.target);
          const monthsLeft = calculateMonthsRemaining(goal.deadline);
          const neededPerMonth = (goal.target - goal.current) / monthsLeft;
          const isOnTrack = goal.monthly >= neededPerMonth;

          return (
            <div key={goal.id} className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#4ADE80]/10 rounded-xl flex items-center justify-center text-2xl">
                    {goal.emoji}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{goal.title}</h3>
                    <p className="text-sm text-[#B3B3B3]">{monthsLeft} meses restantes</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isOnTrack
                    ? 'bg-[#4ADE80]/10 text-[#4ADE80]'
                    : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {isOnTrack ? 'No caminho' : 'Atenção'}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#B3B3B3]">Progresso</span>
                    <span className="text-sm font-medium text-white">
                      R$ {goal.current.toLocaleString()} / R$ {goal.target.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-3 bg-[#0F0F0F] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-[#4ADE80] rounded-full"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-[#B3B3B3]">{progress.toFixed(1)}% concluído</span>
                    <span className="text-xs text-[#4ADE80]">
                      Faltam R$ {(goal.target - goal.current).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#0F0F0F] rounded-xl p-3">
                    <p className="text-xs text-[#B3B3B3] mb-1">Aporte Atual</p>
                    <p className="text-white font-semibold">R$ {goal.monthly}/mês</p>
                  </div>
                  <div className="bg-[#0F0F0F] rounded-xl p-3">
                    <p className="text-xs text-[#B3B3B3] mb-1">Necessário</p>
                    <p className="text-white font-semibold">R$ {Math.ceil(neededPerMonth)}/mês</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {showNewGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-end"
            onClick={() => setShowNewGoal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="bg-[#1E1E1E] w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-[#B3B3B3] rounded-full mx-auto mb-6" />

              <h2 className="text-2xl font-bold text-white mb-6">Nova Meta</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-[#B3B3B3] text-sm mb-2 block">Escolha um ícone</label>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setNewGoal({ ...newGoal, emoji })}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-all ${
                          newGoal.emoji === emoji
                            ? 'bg-[#4ADE80]/20 border-2 border-[#4ADE80]'
                            : 'bg-[#0F0F0F] border-2 border-transparent'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[#B3B3B3] text-sm mb-2 block">Nome da Meta</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="Ex: Comprar notebook"
                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-[#B3B3B3] focus:border-[#4ADE80] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[#B3B3B3] text-sm mb-2 block">Valor Desejado (R$)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B3B3B3]" />
                    <input
                      type="number"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                      placeholder="0"
                      className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-12 py-3 text-white placeholder:text-[#B3B3B3] focus:border-[#4ADE80] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#B3B3B3] text-sm mb-2 block">Prazo</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B3B3B3]" />
                    <input
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                      className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-12 py-3 text-white focus:border-[#4ADE80] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#B3B3B3] text-sm mb-2 block">Quanto pode economizar por mês? (R$)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B3B3B3]" />
                    <input
                      type="number"
                      value={newGoal.monthly}
                      onChange={(e) => setNewGoal({ ...newGoal, monthly: e.target.value })}
                      placeholder="0"
                      className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-12 py-3 text-white placeholder:text-[#B3B3B3] focus:border-[#4ADE80] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowNewGoal(false)}
                  className="flex-1 bg-[#0F0F0F] border border-white/10 text-white px-6 py-4 rounded-2xl font-semibold hover:border-[#4ADE80]/50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setShowNewGoal(false);
                  }}
                  className="flex-1 bg-[#4ADE80] text-[#0F0F0F] px-6 py-4 rounded-2xl font-semibold hover:bg-[#22C55E] transition-colors"
                >
                  Criar Meta
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
          <button onClick={() => onNavigate('simulator')} className="flex flex-col items-center gap-1 text-[#B3B3B3] hover:text-white transition-colors">
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs">Investir</span>
          </button>
          <button onClick={() => onNavigate('goals')} className="flex flex-col items-center gap-1 text-[#4ADE80]">
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
