import { motion } from 'motion/react';
import {
  ArrowLeft,
  Award,
  ChevronRight,
  Coins,
  Flame,
  Home,
  LockKeyhole,
  PiggyBank,
  Target,
  TrendingUp,
  Trophy,
  User,
  WalletCards,
} from 'lucide-react';

interface ChallengeUserData {
  xp: number;
  level: number;
  streak: number;
}

interface CoursesScreenProps {
  userData: ChallengeUserData;
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

const challenges = [
  {
    id: 'orcamento',
    title: 'Organizando o orçamento',
    description: 'Aprenda a controlar receitas e despesas.',
    xp: 30,
    category: 'Orçamento',
    completed: false,
    locked: false,
    icon: WalletCards,
  },
  {
    id: 'necessidades',
    title: 'Necessidades x desejos',
    description: 'Descubra como tomar decisões mais conscientes.',
    xp: 30,
    category: 'Consumo consciente',
    completed: false,
    locked: false,
    icon: Target,
  },
  {
    id: 'investimentos',
    title: 'Primeiros investimentos',
    description: 'Conheça conceitos básicos sobre investimentos.',
    xp: 50,
    category: 'Investimentos',
    completed: false,
    locked: true,
    icon: TrendingUp,
  },
];

export default function CoursesScreen({
  userData,
  onNavigate,
  onBack,
}: CoursesScreenProps) {
  const completedChallenges = challenges.filter(
    (challenge) => challenge.completed,
  ).length;

  const totalChallenges = challenges.length;

  const progress =
    totalChallenges === 0
      ? 0
      : Math.round(
          (completedChallenges / totalChallenges) * 100,
        );

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white pb-28">
      <main className="max-w-5xl mx-auto px-5 pt-6">
        {/* Cabeçalho */}
        <header className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={onBack}
            className="w-11 h-11 rounded-full bg-[#1E1E1E] border border-white/10 flex items-center justify-center hover:border-[#4ADE80]/50 transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h1 className="text-xl font-bold">
              Aprenda na prática
            </h1>

            <p className="text-sm text-[#B3B3B3]">
              Desafios financeiros
            </p>
          </div>

          <div className="flex items-center gap-2 text-[#4ADE80]">
            <Flame className="w-5 h-5" />

            <span className="font-semibold">
              {userData.streak} dias
            </span>
          </div>
        </header>

        {/* Evolução do usuário */}
        <section className="bg-gradient-to-br from-[#193A2B] to-[#14251D] border border-[#4ADE80]/25 rounded-3xl p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <p className="text-sm text-[#B3B3B3] mb-1">
                Sua evolução
              </p>

              <h2 className="text-2xl font-bold">
                Nível {userData.level}
              </h2>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-[#4ADE80]">
                {userData.xp} XP
              </p>

              <p className="text-sm text-[#B3B3B3]">
                XP acumulado
              </p>
            </div>
          </div>

          <div className="h-3 bg-black/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.7 }}
              className="h-full bg-[#4ADE80] rounded-full"
            />
          </div>

          <div className="flex justify-between mt-2 text-sm text-[#B3B3B3]">
            <span>
              {completedChallenges} de {totalChallenges} desafios
            </span>

            <span>{progress}%</span>
          </div>
        </section>

        {/* Desafio do dia */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#4ADE80] to-[#22C55E] text-[#0F0F0F] rounded-3xl p-6 mb-8">
          <div className="absolute -right-8 -bottom-10 opacity-20">
            <PiggyBank className="w-52 h-52" />
          </div>

          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-black/10 rounded-full px-3 py-1 mb-4">
              <Coins className="w-4 h-4" />

              <span className="text-sm font-semibold">
                Desafio do dia
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-2">
              Reserva de emergência
            </h2>

            <p className="text-black/70 mb-5">
              Você recebeu R$ 1.000. Qual seria a decisão
              mais adequada para começar uma reserva?
            </p>

            <div className="flex items-center gap-3">
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate('lesson')}
                className="bg-[#0F0F0F] text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2"
              >
                Responder desafio

                <ChevronRight className="w-5 h-5" />
              </motion.button>

              <span className="font-bold">
                +20 XP
              </span>
            </div>
          </div>
        </section>

        {/* Outros desafios */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">
                Outros desafios
              </h2>

              <p className="text-sm text-[#B3B3B3]">
                Continue aprendendo e acumulando XP
              </p>
            </div>

            <Target className="w-6 h-6 text-[#4ADE80]" />
          </div>

          <div className="space-y-3">
            {challenges.map((challenge, index) => {
              const Icon = challenge.icon;

              return (
                <motion.button
                  type="button"
                  key={challenge.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.08,
                  }}
                  disabled={challenge.locked}
                  onClick={() => onNavigate('lesson')}
                  className="w-full bg-[#1E1E1E] border border-white/10 rounded-2xl p-4 flex items-center gap-4 text-left hover:border-[#4ADE80]/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#4ADE80]/10 flex items-center justify-center shrink-0">
                    {challenge.locked ? (
                      <LockKeyhole className="w-6 h-6 text-[#B3B3B3]" />
                    ) : (
                      <Icon className="w-6 h-6 text-[#4ADE80]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#4ADE80] mb-1">
                      {challenge.category}
                    </p>

                    <h3 className="font-semibold mb-1">
                      {challenge.title}
                    </h3>

                    <p className="text-sm text-[#B3B3B3]">
                      {challenge.description}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-bold text-[#4ADE80]">
                      +{challenge.xp} XP
                    </p>

                    {!challenge.locked && (
                      <ChevronRight className="w-5 h-5 ml-auto mt-2 text-[#B3B3B3]" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Conquistas */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-[#4ADE80]" />

            <h2 className="text-xl font-bold">
              Conquistas
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-4 text-center">
              <div className="w-11 h-11 mx-auto rounded-full bg-[#4ADE80]/10 flex items-center justify-center mb-3">
                <Target className="w-5 h-5 text-[#4ADE80]" />
              </div>

              <p className="text-sm font-semibold">
                Primeiro passo
              </p>

              <p className="text-xs text-[#B3B3B3] mt-1">
                1 desafio
              </p>
            </div>

            <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-4 text-center opacity-60">
              <div className="w-11 h-11 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-3">
                <Award className="w-5 h-5 text-[#B3B3B3]" />
              </div>

              <p className="text-sm font-semibold">
                Aprendiz
              </p>

              <p className="text-xs text-[#B3B3B3] mt-1">
                3 desafios
              </p>
            </div>

            <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-4 text-center opacity-60">
              <div className="w-11 h-11 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-3">
                <Trophy className="w-5 h-5 text-[#B3B3B3]" />
              </div>

              <p className="text-sm font-semibold">
                Evoluindo
              </p>

              <p className="text-xs text-[#B3B3B3] mt-1">
                100 XP
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Navegação inferior */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1E1E1E] border-t border-white/10">
        <div className="max-w-5xl mx-auto px-5 py-3 grid grid-cols-5">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="flex flex-col items-center gap-1 text-[#B3B3B3]"
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </button>

          <button
            type="button"
            className="flex flex-col items-center gap-1 text-[#4ADE80]"
          >
            <Target className="w-5 h-5" />
            <span className="text-xs">Desafios</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('simulator')}
            className="flex flex-col items-center gap-1 text-[#B3B3B3]"
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs">Investir</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('goals')}
            className="flex flex-col items-center gap-1 text-[#B3B3B3]"
          >
            <Award className="w-5 h-5" />
            <span className="text-xs">Metas</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="flex flex-col items-center gap-1 text-[#B3B3B3]"
          >
            <User className="w-5 h-5" />
            <span className="text-xs">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}