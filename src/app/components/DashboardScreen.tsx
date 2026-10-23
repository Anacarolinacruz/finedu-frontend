import { useUserOverview } from '../hooks/useUserOverview';
import OverviewNotice from './OverviewNotice';

import {
  Home,
  BookOpen,
  TrendingUp,
  Target,
  User,
  Flame,
  Trophy,
  Star,
  ChevronRight,
  Loader2,
} from 'lucide-react';

interface DashboardScreenProps {
  userData: {
    name: string;
    xp: number;
    level: number;
    completedCourses: number;
    streak: number;
  };
  onNavigate: (screen: string) => void;
}

const levelLabels = {
  INICIANTE: 'Iniciante',
  INTERMEDIARIO: 'Intermediário',
  AVANCADO: 'Avançado',
};

export default function DashboardScreen({
  userData,
  onNavigate,
}: DashboardScreenProps) {
  const overview = useUserOverview();
  const trails = overview.trails.data ?? [];
  const goals = overview.goals.data ?? [];
  const loading = overview.trails.loading;
  const error = overview.trails.error;
  const currentUser = overview.user.data ?? userData;
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const currency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const coursesInProgress = trails.filter(
    (trail) => trail.status === 'IN_PROGRESS',
  );

  const completedCourses = trails.filter(
    (trail) => trail.status === 'COMPLETED',
  ).length;

  const allCompleted =
    trails.length > 0 &&
    completedCourses === trails.length;

  const initial = currentUser.name.trim().charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#0F0F0F] pb-24">
      <div className="bg-gradient-to-b from-[#1E1E1E] to-[#0F0F0F] px-6 pt-8 pb-6">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 shrink-0 bg-[#4ADE80] rounded-full flex items-center justify-center text-[#0F0F0F] font-bold">
              {initial || 'F'}
            </div>

            <div>
              <p className="text-[#B3B3B3] text-sm">
                Olá,
              </p>

              <h2 className="text-white font-semibold">
                {currentUser.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#4ADE80]/10 border border-[#4ADE80] px-4 py-2 rounded-full">
            <Flame className="w-4 h-4 text-[#4ADE80]" />

            <span className="text-[#4ADE80] font-semibold">
              {currentUser.streak} dias
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-4">
            <Star className="w-5 h-5 text-[#4ADE80] mb-2" />

            <p className="text-2xl font-bold text-white">
              {currentUser.xp}
            </p>

            <p className="text-xs text-[#B3B3B3]">
              XP Total
            </p>
          </div>

          <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-4">
            <Trophy className="w-5 h-5 text-[#4ADE80] mb-2" />

            <p className="text-2xl font-bold text-white">
              Nível {currentUser.level}
            </p>

            <p className="text-xs text-[#B3B3B3]">
              Seu nível
            </p>
          </div>

          <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-4">
            <BookOpen className="w-5 h-5 text-[#4ADE80] mb-2" />

            <p className="text-2xl font-bold text-white">
              {loading || error ? '—' : completedCourses}
            </p>

            <p className="text-xs text-[#B3B3B3]">
              Cursos concluídos
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-6">
        <OverviewNotice loading={overview.user.loading} error={overview.user.error} onRetry={overview.reload} />
        <section className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-5">
          <h3 className="text-white font-semibold">Valores guardados nas metas</h3>
          <OverviewNotice loading={overview.goals.loading} error={overview.goals.error} onRetry={overview.reload} />
          {overview.goals.data !== null && (
            <>
              <p className="text-3xl font-bold text-[#4ADE80] mt-3">{currency(totalSaved)}</p>
              <p className="text-sm text-[#B3B3B3] mt-2">Soma dos saldos informados nas suas metas. Não inclui rendimentos simulados nem representa o patrimônio total.</p>
              <button type="button" onClick={() => onNavigate('goals')} className="text-[#4ADE80] text-sm mt-4">Gerenciar metas</button>
            </>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="text-white font-semibold">
              Cursos em progresso
            </h3>

            <button
              type="button"
              onClick={() => onNavigate('courses')}
              className="text-[#4ADE80] text-sm flex items-center gap-1"
            >
              Ver todos
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div
              role="status"
              className="flex items-center justify-center gap-3 py-8 text-[#B3B3B3]"
            >
              <Loader2 className="w-5 h-5 animate-spin text-[#4ADE80]" />
              Carregando trilhas…
            </div>
          ) : error ? (
            <div
              role="alert"
              className="bg-[#1E1E1E] border border-red-400/30 rounded-2xl p-5"
            >
              <p className="text-red-300 text-sm mb-4">
                {error}
              </p>

              <button
                type="button"
                onClick={() => overview.reload()}
                className="text-[#4ADE80] text-sm font-semibold"
              >
                Tentar novamente
              </button>
            </div>
          ) : coursesInProgress.length === 0 ? (
            <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-5">
              <p className="text-white font-medium mb-2">
                {allCompleted
                  ? 'Você concluiu todas as trilhas disponíveis!'
                  : 'Nenhuma trilha em andamento'}
              </p>

              <p className="text-[#B3B3B3] text-sm mb-4">
                {allCompleted
                  ? 'Você pode revisar as aulas e os questionários quando quiser.'
                  : 'Explore os cursos e comece sua próxima trilha de aprendizagem.'}
              </p>

              <button
                type="button"
                onClick={() => onNavigate('courses')}
                className="text-[#4ADE80] text-sm font-semibold"
              >
                {allCompleted
                  ? 'Revisar trilhas'
                  : 'Explorar cursos'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {coursesInProgress.map((course) => (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => onNavigate('courses')}
                  className="w-full bg-[#1E1E1E] border border-white/10 rounded-2xl p-4 text-left hover:border-[#4ADE80]/50 transition-colors"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-[#4ADE80]/10 rounded-xl flex items-center justify-center shrink-0">
                      <BookOpen className="w-6 h-6 text-[#4ADE80]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium mb-1">
                        {course.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#B3B3B3]">
                        <span>
                          {course.durationMinutes} min
                        </span>

                        <span>·</span>

                        <span>
                          {levelLabels[course.level]}
                        </span>

                        <span>·</span>

                        <span>
                          {course.completedLessons} de{' '}
                          {course.totalLessons} aulas
                        </span>
                      </div>

                      {course.hasFinalQuiz && (
                        <p className="text-xs text-[#B3B3B3] mt-2">
                          {course.answeredQuestions} de{' '}
                          {course.totalQuestions}
                          {' perguntas respondidas'}
                        </p>
                      )}
                    </div>

                    <ChevronRight className="w-5 h-5 shrink-0 text-[#4ADE80]" />
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      role="progressbar"
                      aria-label={`Progresso de ${course.title}`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={course.progressPercent}
                      className="flex-1 h-2 bg-[#0F0F0F] rounded-full overflow-hidden"
                    >
                      <div
                        className="h-full bg-[#4ADE80] rounded-full transition-all"
                        style={{
                          width: `${course.progressPercent}%`,
                        }}
                      />
                    </div>

                    <span className="text-sm text-[#4ADE80] font-medium">
                      {course.progressPercent}%
                    </span>
                  </div>

                  {course.quizUnlocked && (
                    <p className="text-xs text-[#4ADE80] mt-3">
                      Continue pelo questionário final
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-white font-semibold">
                Minhas Metas
              </h3>

              <p className="text-xs text-[#B3B3B3] mt-1">
                Saldos informados por você
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('goals')}
              className="text-[#4ADE80] text-sm flex items-center gap-1"
            >
              Ver todas
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <OverviewNotice loading={overview.goals.loading} error={overview.goals.error} onRetry={overview.reload} />
          {overview.goals.data?.length === 0 && (
            <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-5">
              <p className="text-[#B3B3B3]">Você ainda não cadastrou metas.</p>
              <button type="button" onClick={() => onNavigate('goals')} className="text-[#4ADE80] mt-3">Criar minha primeira meta</button>
            </div>
          )}
          <div className="space-y-3">
            {goals.slice(0, 3).map((goal) => (
              <div
                key={goal.id}
                className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">
                    {goal.emoji}
                  </span>

                  <div className="flex-1">
                    <h4 className="text-white font-medium">
                      {goal.title}
                    </h4>

                    <p className="text-sm text-[#B3B3B3]">
                      {currency(goal.currentAmount)}
                      {' / '}
                      {currency(goal.targetAmount)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-[#0F0F0F] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#4ADE80] rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (goal.currentAmount / Math.max(goal.targetAmount, 0.01)) * 100,
                        )}%`,
                      }}
                    />
                  </div>

                  <span className="text-sm text-[#4ADE80] font-medium">
                    {Math.min(100, Math.round(
                      (goal.currentAmount / Math.max(goal.targetAmount, 0.01)) * 100,
                    ))}
                    %
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <nav
        aria-label="Navegação principal"
        className="fixed bottom-0 left-0 right-0 bg-[#1E1E1E] border-t border-white/10 px-6 py-3"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {[
            {
              screen: 'dashboard',
              label: 'Home',
              icon: Home,
            },
            {
              screen: 'courses',
              label: 'Cursos',
              icon: BookOpen,
            },
            {
              screen: 'simulator',
              label: 'Investir',
              icon: TrendingUp,
            },
            {
              screen: 'goals',
              label: 'Metas',
              icon: Target,
            },
            {
              screen: 'profile',
              label: 'Perfil',
              icon: User,
            },
          ].map(({ screen, label, icon: Icon }) => (
            <button
              key={screen}
              type="button"
              onClick={() => onNavigate(screen)}
              aria-current={
                screen === 'dashboard' ? 'page' : undefined
              }
              className={`flex flex-col items-center gap-1 transition-colors ${
                screen === 'dashboard'
                  ? 'text-[#4ADE80]'
                  : 'text-[#B3B3B3] hover:text-white'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">
                {label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}