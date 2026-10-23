import { useEffect, useState } from 'react';
import {
  Award,
  CheckCircle2,
  Loader2,
  Lock,
} from 'lucide-react';

import {
  answerCourseQuestion,
  getCourseQuiz,
} from '../services/api';

import type {
  CourseQuiz as CourseQuizData,
  QuizAnswerResult,
  TrailDetail,
  UserProgress,
} from '../services/api';

interface CourseQuizProps {
  trail: TrailDetail;
  onTrailUpdate: (trail: TrailDetail) => void;
  onUserProgressUpdate?: (user: UserProgress) => void;
}

export default function CourseQuiz({
  trail,
  onTrailUpdate,
  onUserProgressUpdate,
}: CourseQuizProps) {
  const [quiz, setQuiz] = useState<CourseQuizData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [retry, setRetry] = useState(0);

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  const [feedback, setFeedback] = useState<
    Record<string, QuizAnswerResult>
  >({});

  const [answerErrors, setAnswerErrors] = useState<
    Record<string, string>
  >({});

  const [submittingId, setSubmittingId] =
    useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    setQuiz(null);
    setLoadError('');
    setSelectedOptions({});
    setFeedback({});
    setAnswerErrors({});
    setSubmittingId(null);

    if (!trail.hasFinalQuiz || !trail.quizUnlocked) {
      setLoading(false);
      return () => controller.abort();
    }

    async function loadQuiz() {
      setLoading(true);

      try {
        const result = await getCourseQuiz(
          trail.id,
          controller.signal,
        );

        if (!controller.signal.aborted) {
          setQuiz(result);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setLoadError(
            err instanceof Error
              ? err.message
              : 'Não foi possível carregar o questionário.',
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadQuiz();

    return () => controller.abort();
  }, [
    trail.id,
    trail.hasFinalQuiz,
    trail.quizUnlocked,
    retry,
  ]);

  async function handleAnswer(questionId: string) {
    const selectedOptionId = selectedOptions[questionId];

    if (!selectedOptionId || submittingId) return;

    setSubmittingId(questionId);

    setAnswerErrors((current) => ({
      ...current,
      [questionId]: '',
    }));

    let result: QuizAnswerResult;

    try {
      result = await answerCourseQuestion(
        trail.id,
        questionId,
        selectedOptionId,
      );
    } catch (err) {
      setAnswerErrors((current) => ({
        ...current,
        [questionId]:
          err instanceof Error
            ? err.message
            : 'Não foi possível enviar sua resposta.',
      }));

      setSubmittingId(null);
      return;
    }

    setFeedback((current) => ({
      ...current,
      [questionId]: result,
    }));

    setQuiz((current) => {
      if (!current) return current;

      return {
        ...current,
        questions: current.questions.map((question) =>
          question.id === questionId
            ? {
                ...question,
                answered: true,
                correct: result.correct,
              }
            : question,
        ),
      };
    });

    setSubmittingId(null);

    onTrailUpdate(result.course);
    onUserProgressUpdate?.(result.user);
  }

  if (!trail.hasFinalQuiz) {
    return null;
  }

  const completed = trail.status === 'COMPLETED';

  return (
    <section className="mt-8 rounded-3xl border border-white/10 bg-[#1E1E1E] p-5 md:p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-11 h-11 shrink-0 rounded-xl bg-[#4ADE80]/10 flex items-center justify-center">
          <Award className="w-6 h-6 text-[#4ADE80]" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">
            Questionário final
          </h2>

          <p className="text-sm text-[#B3B3B3] mt-1">
            Responda às três perguntas e acerte pelo menos duas
            para concluir a trilha.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-[#0F0F0F] p-4 mb-6">
        <p className="text-sm text-[#D1D5DB] leading-relaxed">
          Cada pergunta respondida representa 10% de progresso.
          O primeiro acerto de cada pergunta vale 10 XP.
          Concluir as três aulas, responder às três perguntas e
          acertar pelo menos duas libera os 10% finais e um
          bônus de 10 XP.
        </p>

        <p className="text-sm text-[#4ADE80] mt-3">
          {trail.answeredQuestions} de {trail.totalQuestions}
          {' perguntas respondidas · '}
          {trail.correctQuestions} acertos
        </p>
      </div>

      {completed && (
        <div
          role="status"
          className="rounded-2xl border border-[#4ADE80]/30 bg-[#4ADE80]/10 p-4 mb-6"
        >
          <div className="flex items-center gap-2 text-[#4ADE80] font-semibold">
            <CheckCircle2 className="w-5 h-5" />
            Trilha concluída!
          </div>

          <p className="text-sm text-[#D1D5DB] mt-2">
            {trail.correctQuestions === trail.totalQuestions
              ? 'Você acertou todas as perguntas. Revisar não concede XP novamente.'
              : 'Você pode refazer as perguntas incorretas para conquistar o XP restante.'}
          </p>
        </div>
      )}

      {!trail.quizUnlocked ? (
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 p-4 text-[#B3B3B3]">
          <Lock className="w-5 h-5 shrink-0" />

          <p className="text-sm">
            Conclua as três aulas para liberar o questionário.
            Você concluiu {trail.completedLessons} de{' '}
            {trail.totalLessons} aulas.
          </p>
        </div>
      ) : loading ? (
        <div
          role="status"
          className="flex items-center justify-center gap-3 py-8 text-[#B3B3B3]"
        >
          <Loader2 className="w-5 h-5 animate-spin text-[#4ADE80]" />
          Carregando questionário…
        </div>
      ) : loadError ? (
        <div role="alert">
          <p className="text-red-400 text-sm mb-4">
            {loadError}
          </p>

          <button
            type="button"
            onClick={() => setRetry((current) => current + 1)}
            className="rounded-xl bg-[#4ADE80] px-4 py-3 text-[#0F0F0F] font-semibold"
          >
            Tentar novamente
          </button>
        </div>
      ) : quiz ? (
        <div className="space-y-5">
          {quiz.questions.length === 0 && (
            <p className="text-sm text-[#B3B3B3]">
              Nenhuma pergunta disponível no momento.
            </p>
          )}

          {quiz.questions.map((question, index) => {
            const result = feedback[question.id];
            const correct = question.correct;
            const sending = submittingId === question.id;
            const hasSelection =
              Boolean(selectedOptions[question.id]);

            return (
              <form
                key={question.id}
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleAnswer(question.id);
                }}
                className="rounded-2xl border border-white/10 bg-[#0F0F0F] p-4 md:p-5"
              >
                <fieldset
                  disabled={correct || submittingId !== null}
                >
                  <legend className="text-white font-semibold mb-4 leading-relaxed">
                    {index + 1}. {question.question}
                  </legend>

                  {correct && (
                    <p className="flex items-center gap-2 text-sm text-[#4ADE80] mb-4">
                      <CheckCircle2 className="w-4 h-4" />
                      Pergunta já acertada
                    </p>
                  )}

                  <div className="space-y-2">
                    {question.options.map((option) => {
                      const selected =
                        selectedOptions[question.id] ===
                        option.id;

                      return (
                        <label
                          key={option.id}
                          className={`flex items-start gap-3 rounded-xl border p-4 text-sm transition-colors ${
                            selected
                              ? 'border-[#4ADE80] bg-[#4ADE80]/10 text-white'
                              : 'border-white/10 text-[#D1D5DB]'
                          } ${
                            correct || submittingId !== null
                              ? 'cursor-default'
                              : 'cursor-pointer hover:border-[#4ADE80]/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option.id}
                            checked={selected}
                            onChange={() =>
                              setSelectedOptions((current) => ({
                                ...current,
                                [question.id]: option.id,
                              }))
                            }
                            className="mt-0.5 accent-[#4ADE80]"
                          />

                          <span>{option.text}</span>
                        </label>
                      );
                    })}
                  </div>

                  {!correct && (
                    <button
                      type="submit"
                      disabled={
                        !hasSelection || submittingId !== null
                      }
                      className="mt-4 w-full rounded-xl bg-[#4ADE80] px-4 py-3 font-semibold text-[#0F0F0F] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Enviando…
                        </span>
                      ) : question.answered ? (
                        'Enviar nova tentativa'
                      ) : (
                        'Confirmar resposta'
                      )}
                    </button>
                  )}
                </fieldset>

                {answerErrors[question.id] && (
                  <p
                    role="alert"
                    className="text-red-400 text-sm mt-4"
                  >
                    {answerErrors[question.id]}
                  </p>
                )}

                {result && (
                  <div
                    role="status"
                    className={`mt-4 rounded-xl border p-4 ${
                      result.correct
                        ? 'border-[#4ADE80]/30 bg-[#4ADE80]/10'
                        : 'border-amber-400/30 bg-amber-400/10'
                    }`}
                  >
                    <p
                      className={`font-semibold text-sm ${
                        result.correct
                          ? 'text-[#4ADE80]'
                          : 'text-amber-300'
                      }`}
                    >
                      {result.correct
                        ? 'Resposta correta!'
                        : 'Ainda não foi desta vez.'}
                    </p>

                    <p className="text-sm text-[#D1D5DB] mt-2 leading-relaxed">
                      {result.explanation}
                    </p>

                    {result.xpAwarded > 0 && (
                      <p className="text-sm font-semibold text-[#4ADE80] mt-3">
                        +{result.xpAwarded} XP recebidos nesta
                        atualização
                      </p>
                    )}
                  </div>
                )}
              </form>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}