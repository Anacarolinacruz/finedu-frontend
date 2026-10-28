import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Loader2,
} from 'lucide-react';

import {
  completeLesson,
  getLesson,
} from '../services/api';

import type {
  LessonDetail,
  UserProgress,
} from '../services/api';

interface LessonScreenProps {
  lessonId: string;
  onBack: () => void;
  onNavigate: (screen: string) => void;
  onOpenLesson: (lessonId: string) => void;
  onUserProgressUpdate: (user: UserProgress) => void;
}

export default function LessonScreen({
  lessonId,
  onBack,
  onOpenLesson,
  onUserProgressUpdate,
}: LessonScreenProps) {
  const [lesson, setLesson] =
    useState<LessonDetail | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  const [completing, setCompleting] = useState(false);

  const [completionError, setCompletionError] =
    useState<string | null>(null);

  const [completionMessage, setCompletionMessage] =
    useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadLesson() {
      setLoading(true);
      setError(null);
      setLesson(null);
      setCompletionError(null);
      setCompletionMessage(null);

      try {
        const result = await getLesson(
          lessonId,
          controller.signal,
        );

        if (!controller.signal.aborted) {
          setLesson(result);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Não foi possível carregar a aula.',
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadLesson();

    return () => controller.abort();
  }, [lessonId, retry]);

  async function handleCompleteLesson() {
    if (!lesson || lesson.completed || completing) {
      return;
    }

    const currentLessonId = lesson.id;

    setCompleting(true);
    setCompletionError(null);
    setCompletionMessage(null);

    try {
      const result = await completeLesson(currentLessonId);

      if (!result.completed) {
        setCompletionError(
          'A conclusão não foi confirmada. Tente novamente.',
        );
        return;
      }

      setLesson((current) => {
        if (!current || current.id !== currentLessonId) {
          return current;
        }

        return {
          ...current,
          completed: result.completed,
          completedAt: result.completedAt,
        };
      });

      // Atualiza o saldo global com o valor retornado pelo backend.
      onUserProgressUpdate(result.user);

      const message = result.alreadyCompleted
        ? 'Esta aula já estava concluída.'
        : 'Aula concluída! Seu progresso foi salvo.';

      const xpMessage =
        result.xpAwarded > 0
          ? ` +${result.xpAwarded} XP recebidos nesta atualização.`
          : '';

      const quizMessage =
        result.course.hasFinalQuiz &&
        result.course.quizUnlocked &&
        result.course.status !== 'COMPLETED'
          ? ' O questionário final está disponível na tela da trilha.'
          : '';

      setCompletionMessage(
        `${message}${xpMessage}${quizMessage}`,
      );
    } catch (err) {
      setCompletionError(
        err instanceof Error
          ? err.message
          : 'Não foi possível concluir a aula.',
      );
    } finally {
      setCompleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#101E35] text-white pb-10">
      <header className="bg-[#172B43] border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 pt-8 pb-6 flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            disabled={completing}
            aria-label="Voltar para os cursos"
            className="w-11 h-11 shrink-0 rounded-full bg-[#101E35] flex items-center justify-center text-[#ADBFCC] hover:text-white transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-sm text-[#E6BB66] mb-1">
              {lesson?.courseTitle ?? 'Trilha de aprendizagem'}
            </p>

            <h1 className="text-xl font-bold">
              {lesson?.title ?? 'Sua aula'}
            </h1>
          </div>

          <BookOpen className="w-6 h-6 shrink-0 text-[#E6BB66]" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-6">
        {loading ? (
          <div
            role="status"
            className="flex items-center justify-center gap-3 py-16 text-[#ADBFCC]"
          >
            <Loader2 className="w-6 h-6 animate-spin text-[#E6BB66]" />
            Carregando aula…
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
        ) : lesson ? (
          <div className="space-y-6">
            <section className="bg-[#172B43] border border-white/10 rounded-2xl p-5">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-2 text-[#ADBFCC]">
                  <Clock className="w-4 h-4" />
                  {Math.ceil(lesson.durationSeconds / 60)}
                  {' min de leitura'}
                </span>

                {lesson.completed && (
                  <span className="flex items-center gap-2 text-[#E6BB66]">
                    <CheckCircle2 className="w-4 h-4" />
                    Aula concluída
                  </span>
                )}
              </div>
            </section>

            <article className="bg-[#172B43] border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-5">
                Conteúdo da aula
              </h2>

              {lesson.content.trim() ? (
                <div className="break-words text-[#D1D5DB] leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold text-white mt-6 mb-4">
                          {children}
                        </h1>
                      ),

                      h2: ({ children }) => (
                        <h2 className="text-xl font-semibold text-white mt-8 mb-4">
                          {children}
                        </h2>
                      ),

                      h3: ({ children }) => (
                        <h3 className="text-lg font-semibold text-[#E6BB66] mt-6 mb-3">
                          {children}
                        </h3>
                      ),

                      p: ({ children }) => (
                        <p className="mb-4 leading-7">
                          {children}
                        </p>
                      ),

                      ul: ({ children }) => (
                        <ul className="list-disc pl-6 mb-5 space-y-2">
                          {children}
                        </ul>
                      ),

                      ol: ({ children }) => (
                        <ol className="list-decimal pl-6 mb-5 space-y-2">
                          {children}
                        </ol>
                      ),

                      strong: ({ children }) => (
                        <strong className="font-semibold text-white">
                          {children}
                        </strong>
                      ),

                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-[#E6BB66] bg-[#E6BB66]/10 rounded-r-xl pl-4 pr-4 pt-4 pb-1 my-6">
                          {children}
                        </blockquote>
                      ),

                      table: ({ children }) => (
                        <div className="overflow-x-auto my-6 rounded-xl border border-white/10">
                          <table className="w-full border-collapse text-sm">
                            {children}
                          </table>
                        </div>
                      ),

                      thead: ({ children }) => (
                        <thead className="bg-[#E6BB66]/10 text-white">
                          {children}
                        </thead>
                      ),

                      th: ({ children, style }) => (
                        <th
                          style={style}
                          className="px-4 py-3 border-b border-white/10 text-left font-semibold"
                        >
                          {children}
                        </th>
                      ),

                      td: ({ children, style }) => (
                        <td
                          style={style}
                          className="px-4 py-3 border-b border-white/10"
                        >
                          {children}
                        </td>
                      ),
                    }}
                  >
                    {lesson.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-[#ADBFCC]">
                  Esta aula ainda não possui conteúdo disponível.
                </p>
              )}
            </article>

            {completionError && (
              <p
                role="alert"
                className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-red-300"
              >
                {completionError}
              </p>
            )}

            {completionMessage && (
              <p
                role="status"
                className="rounded-xl border border-[#E6BB66]/30 bg-[#E6BB66]/10 p-4 text-[#E6BB66]"
              >
                {completionMessage}
              </p>
            )}

            <button
              type="button"
              onClick={() => void handleCompleteLesson()}
              disabled={completing || lesson.completed}
              className="w-full bg-[#E6BB66] text-[#101E35] px-6 py-4 rounded-2xl font-semibold hover:bg-[#2BAAA0] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {completing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Salvando progresso…
                </>
              ) : lesson.completed ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Aula concluída
                </>
              ) : (
                'Concluir aula'
              )}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={
                  !lesson.previousLessonId || completing
                }
                onClick={() => {
                  if (lesson.previousLessonId) {
                    onOpenLesson(lesson.previousLessonId);
                  }
                }}
                className="border border-white/10 bg-[#172B43] rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Aula anterior
              </button>

              <button
                type="button"
                disabled={!lesson.nextLessonId || completing}
                onClick={() => {
                  if (lesson.nextLessonId) {
                    onOpenLesson(lesson.nextLessonId);
                  }
                }}
                className="border border-white/10 bg-[#172B43] rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Próxima aula
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={onBack}
              disabled={completing}
              className="w-full py-3 text-[#E6BB66] font-medium disabled:opacity-50"
            >
              Voltar para os cursos
            </button>
          </div>
        ) : null}
      </main>
    </div>
  );
}