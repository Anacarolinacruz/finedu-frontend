import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Home,
  Loader2,
  TrendingUp,
  User,
} from 'lucide-react';

import CourseQuiz from './CourseQuiz';

import { getTrails, getTrail } from '../services/api';
import type {
  Trail,
  TrailDetail,
  UserProgress,
} from '../services/api';

interface CoursesScreenProps {
  userData: {
    xp: number;
    level: number;
    streak: number;
  };
  onNavigate: (screen: string) => void;
  onBack: () => void;
  onOpenLesson?: (lessonId: string) => void;
  onUserProgressUpdate?: (user: UserProgress) => void;
}

const levelLabels = {
  INICIANTE: 'Iniciante',
  INTERMEDIARIO: 'Intermediário',
  AVANCADO: 'Avançado',
};

export default function CoursesScreen({
  userData,
  onNavigate,
  onBack,
  onOpenLesson,
  onUserProgressUpdate,
}: CoursesScreenProps) {
  const [trails, setTrails] = useState<Trail[]>([]);

  const [selectedTrailId, setSelectedTrailId] =
    useState<string | null>(null);

  const [selectedTrail, setSelectedTrail] =
    useState<TrailDetail | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  const [displayedUserProgress, setDisplayedUserProgress] =
    useState<UserProgress>({
      xp: userData.xp,
      level: userData.level,
    });

  useEffect(() => {
    setDisplayedUserProgress({
      xp: userData.xp,
      level: userData.level,
    });
  }, [userData.xp, userData.level]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadContent() {
      setLoading(true);
      setError(null);
      setSelectedTrail(null);

      try {
        if (selectedTrailId) {
          const trail = await getTrail(
            selectedTrailId,
            controller.signal,
          );

          if (!controller.signal.aborted) {
            setSelectedTrail(trail);

            setTrails((current) =>
              current.map((item) =>
                item.id === trail.id ? trail : item,
              ),
            );
          }
        } else {
          const result = await getTrails(controller.signal);

          if (!controller.signal.aborted) {
            setTrails(result);
          }
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Não foi possível carregar os cursos.',
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadContent();

    return () => controller.abort();
  }, [selectedTrailId, retry]);

  const totalLessons = trails.reduce(
    (total, trail) => total + trail.totalLessons,
    0,
  );

  const completedLessons = trails.reduce(
    (total, trail) => total + trail.completedLessons,
    0,
  );

  // Considera o progresso completo de cada trilha,
  // incluindo questionário e bônus de conclusão.
  const overallProgress =
    trails.length > 0
      ? Math.floor(
          trails.reduce(
            (total, trail) => total + trail.progressPercent,
            0,
          ) / trails.length,
        )
      : 0;

  const progress =
    selectedTrail?.progressPercent ?? overallProgress;

  function handleBack() {
    if (selectedTrailId) {
      setSelectedTrailId(null);
    } else {
      onBack();
    }
  }

  function handleTrailUpdate(updatedTrail: TrailDetail) {
    setSelectedTrail(updatedTrail);

    setTrails((current) =>
      current.map((trail) =>
        trail.id === updatedTrail.id
          ? updatedTrail
          : trail,
      ),
    );
  }

  function handleUserProgressUpdate(user: UserProgress) {
    setDisplayedUserProgress(user);
    onUserProgressUpdate?.(user);
  }

  return (
    <div className="min-h-screen bg-[#101E35] text-white pb-28">
      <main className="max-w-5xl mx-auto px-5 pt-6">
        <header className="flex items-center justify-between gap-3 mb-8">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Voltar"
            className="w-11 h-11 shrink-0 rounded-full bg-[#172B43] border border-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h1 className="text-xl font-bold">
              {selectedTrailId ? 'Sua trilha' : 'Cursos'}
            </h1>

            <p className="text-sm text-[#ADBFCC]">
              Aprenda no seu ritmo
            </p>
          </div>

          <BookOpen className="w-6 h-6 shrink-0 text-[#E6BB66]" />
        </header>

        {loading ? (
          <div
            role="status"
            className="flex items-center justify-center gap-3 py-16 text-[#ADBFCC]"
          >
            <Loader2 className="w-6 h-6 animate-spin text-[#E6BB66]" />
            Carregando…
          </div>
        ) : error ? (
          <section
            role="alert"
            className="bg-[#172B43] border border-red-400/30 rounded-2xl p-6"
          >
            <p className="mb-4">{error}</p>

            <button
              type="button"
              onClick={() => setRetry((value) => value + 1)}
              className="bg-[#E6BB66] text-[#101E35] rounded-xl px-5 py-3 font-semibold"
            >
              Tentar novamente
            </button>
          </section>
        ) : (
          <>
            <section className="bg-gradient-to-br from-[#193A2B] to-[#14251D] border border-[#E6BB66]/25 rounded-3xl p-6 mb-6">
              <p className="text-sm text-[#ADBFCC] mb-2">
                {selectedTrail
                  ? 'Progresso da trilha'
                  : 'Seu aprendizado'}
              </p>

              <h2 className="text-2xl font-bold mb-2">
                {selectedTrail?.title ??
                  'Cada aula é um novo passo'}
              </h2>

              <p className="text-sm text-[#ADBFCC] mb-5">
                {selectedTrail?.description ??
                  'Explore as trilhas e pratique os conceitos de educação financeira.'}
              </p>

              <div
                role="progressbar"
                aria-label="Progresso de aprendizagem"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                className="h-3 bg-black/30 rounded-full overflow-hidden"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-[#E6BB66] rounded-full"
                />
              </div>

              <div className="flex justify-between gap-3 mt-2 text-sm text-[#ADBFCC]">
                <span>
                  {selectedTrail?.completedLessons ??
                    completedLessons}
                  {' de '}
                  {selectedTrail?.totalLessons ?? totalLessons}
                  {' aulas concluídas'}
                </span>

                <span>{progress}%</span>
              </div>

              {selectedTrail?.hasFinalQuiz && (
                <div className="mt-3 text-sm text-[#ADBFCC] space-y-2">
                  <p>
                    {selectedTrail.answeredQuestions} de{' '}
                    {selectedTrail.totalQuestions}
                    {' perguntas respondidas · '}
                    {selectedTrail.correctQuestions} acertos
                  </p>

                  <p>
                    Aulas: 60% · Questionário: 30% · Aprovação:
                    10%
                  </p>

                  <p className="text-[#E6BB66]">
                    Até 100 XP nesta trilha
                  </p>
                </div>
              )}

              <p className="text-xs text-[#ADBFCC] mt-4">
                Nível {displayedUserProgress.level} ·{' '}
                {displayedUserProgress.xp} XP acumulados
              </p>
            </section>

            {selectedTrail ? (
              <section>
                <h2 className="text-xl font-bold mb-4">
                  Aulas desta trilha
                </h2>

                {selectedTrail.lessons.length === 0 ? (
                  <p className="text-[#ADBFCC]">
                    Esta trilha ainda não possui aulas
                    disponíveis.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedTrail.lessons.map(
                      (lesson, index) => (
                        <button
                          key={lesson.id}
                          type="button"
                          disabled={!onOpenLesson}
                          onClick={() =>
                            onOpenLesson?.(lesson.id)
                          }
                          className="w-full bg-[#172B43] border border-white/10 rounded-2xl p-4 flex items-center gap-4 text-left hover:border-[#E6BB66]/40 transition-colors disabled:cursor-default"
                        >
                          <div className="w-11 h-11 shrink-0 rounded-full bg-[#E6BB66]/10 text-[#E6BB66] flex items-center justify-center">
                            {lesson.completed ? (
                              <CheckCircle2 className="w-6 h-6" />
                            ) : (
                              <span className="font-bold">
                                {index + 1}
                              </span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold mb-1">
                              {lesson.title}
                            </h3>

                            <p className="text-sm text-[#ADBFCC]">
                              {Math.ceil(
                                lesson.durationSeconds / 60,
                              )}
                              {' min de leitura · '}
                              {lesson.completed
                                ? 'Concluída'
                                : 'Disponível'}
                            </p>

                            {selectedTrail.hasFinalQuiz && (
                              <p className="text-xs text-[#E6BB66] mt-1">
                                20% da trilha · 20 XP na primeira
                                conclusão
                              </p>
                            )}
                          </div>

                          <ChevronRight className="w-5 h-5 shrink-0 text-[#ADBFCC]" />
                        </button>
                      ),
                    )}
                  </div>
                )}

                <CourseQuiz
                  key={selectedTrail.id}
                  trail={selectedTrail}
                  onTrailUpdate={handleTrailUpdate}
                  onUserProgressUpdate={
                    handleUserProgressUpdate
                  }
                />
              </section>
            ) : (
              <section>
                <h2 className="text-xl font-bold mb-4">
                  Trilhas de aprendizagem
                </h2>

                {trails.length === 0 ? (
                  <p className="text-[#ADBFCC]">
                    Nenhuma trilha disponível no momento.
                  </p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {trails.map((trail) => (
                      <motion.button
                        key={trail.id}
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          setSelectedTrailId(trail.id)
                        }
                        className="bg-[#172B43] border border-white/10 rounded-3xl p-5 text-left hover:border-[#E6BB66]/40 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <BookOpen className="w-7 h-7 text-[#E6BB66]" />

                          <span className="text-xs rounded-full px-3 py-1 bg-[#E6BB66]/10 text-[#E6BB66]">
                            {levelLabels[trail.level]}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold mb-2">
                          {trail.title}
                        </h3>

                        <p className="text-sm text-[#ADBFCC] mb-4">
                          {trail.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-[#ADBFCC] mb-4">
                          <span>
                            {trail.totalLessons} aulas
                          </span>

                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {trail.durationMinutes} min
                          </span>

                          {trail.hasFinalQuiz && (
                            <span className="text-[#E6BB66]">
                              Até 100 XP
                            </span>
                          )}
                        </div>

                        <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-2">
                          <div
                            className="h-full bg-[#E6BB66]"
                            style={{
                              width: `${trail.progressPercent}%`,
                            }}
                          />
                        </div>

                        <p className="text-xs text-[#ADBFCC] mb-2">
                          {trail.completedLessons} de{' '}
                          {trail.totalLessons}
                          {' aulas concluídas · '}
                          {trail.progressPercent}%
                        </p>

                        {trail.hasFinalQuiz && (
                          <p className="text-xs text-[#ADBFCC] mb-4">
                            {trail.answeredQuestions} de{' '}
                            {trail.totalQuestions}
                            {' perguntas respondidas'}
                          </p>
                        )}

                        <div className="flex justify-between items-center text-[#E6BB66] font-semibold mt-4">
                          <span>
                            {trail.status === 'COMPLETED'
                              ? 'Revisar trilha'
                              : trail.status === 'IN_PROGRESS'
                                ? 'Continuar trilha'
                                : 'Começar trilha'}
                          </span>

                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>

      <nav
        aria-label="Navegação principal"
        className="fixed bottom-0 left-0 right-0 bg-[#172B43] border-t border-white/10"
      >
        <div className="max-w-5xl mx-auto px-5 py-3 grid grid-cols-5">
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
              icon: Award,
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
              aria-current={
                screen === 'courses' ? 'page' : undefined
              }
              onClick={() => {
                if (screen === 'courses') {
                  setSelectedTrailId(null);
                } else {
                  onNavigate(screen);
                }
              }}
              className={`flex flex-col items-center gap-1 ${
                screen === 'courses'
                  ? 'text-[#E6BB66]'
                  : 'text-[#ADBFCC]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}