const API_URL = (
  import.meta.env.VITE_API_URL ??
  'http://localhost:3333/api/v1'
).replace(/\/+$/, '');

// =========================================
// Tipos gerais
// =========================================

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  investorProfile:
    | 'CONSERVADOR'
    | 'MODERADO'
    | 'ARROJADO'
    | null;
  xp: number;
  level: number;
  streak: number;
  onboardingCompletedAt: string | null;
  createdAt: string;
}

interface AuthData {
  user: User;
  accessToken: string;
  expiresAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}

export interface RegisterInput {
  name: string;
  email: string;
  age: number;
  password: string;
  confirmPassword: string;
}

// Retorno parcial usado nas ações que concedem XP.
export interface UserProgress {
  xp: number;
  level: number;
}

function getErrorMessage<T>(
  result: ApiResponse<T>,
): string {
  if (result.errors) {
    const firstError = Object.values(result.errors)
      .flat()
      .find(Boolean);

    if (firstError) {
      return firstError;
    }
  }

  return result.message || 'Não foi possível concluir a operação';
}

// =========================================
// Requisições
// =========================================

async function request<T>(
  path: string,
  options: RequestInit = {},
  authenticated = false,
): Promise<ApiResponse<T>> {
  const headers = new Headers(options.headers);

  headers.set('Accept', 'application/json');

  if (
    options.body != null &&
    !headers.has('Content-Type') &&
    typeof options.body === 'string'
  ) {
    headers.set('Content-Type', 'application/json');
  }

  if (authenticated) {
    const token = sessionStorage.getItem('finedu_token');

    if (!token) {
      throw new Error(
        'Faça login para acessar as trilhas de aprendizagem.',
      );
    }

    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });
  } catch (error) {
    if (
      options.signal?.aborted ||
      (error instanceof Error && error.name === 'AbortError')
    ) {
      throw error;
    }

    throw new Error(
      'Não foi possível conectar ao servidor. Confira se o backend está funcionando.',
    );
  }

  if (authenticated && response.status === 401) {
    throw new Error(
      'Sua sessão expirou ou é inválida. Faça login novamente.',
    );
  }

  let result: ApiResponse<T>;

  try {
    result = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new Error(
      'O servidor retornou uma resposta inesperada.',
    );
  }

  if (!response.ok || !result.success) {
    throw new Error(getErrorMessage(result));
  }

  return result;
}

async function authenticatedRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const result = await request<T>(path, options, true);
  return result.data;
}

// =========================================
// Autenticação
// =========================================

export async function login(
  email: string,
  password: string,
): Promise<User> {
  const result = await request<AuthData>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  });

  sessionStorage.setItem(
    'finedu_token',
    result.data.accessToken,
  );

  return result.data.user;
}

export async function register(
  input: RegisterInput,
): Promise<User> {
  const result = await request<AuthData>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });

  sessionStorage.setItem(
    'finedu_token',
    result.data.accessToken,
  );

  return result.data.user;
}

export async function getMe(
  signal?: AbortSignal,
): Promise<User> {
  const data = await authenticatedRequest<{
    user: User;
  }>('/auth/me', { signal });

  return data.user;
}

// =========================================
// Trilhas e aulas
// =========================================

export type CourseLevel =
  | 'INICIANTE'
  | 'INTERMEDIARIO'
  | 'AVANCADO';

export type TrailStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED';

export interface Trail {
  id: string;
  title: string;
  description: string;
  level: CourseLevel;
  durationMinutes: number;
  colorHex: string | null;
  order: number;
  isPublished: boolean;

  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  status: TrailStatus;
  nextLessonId: string | null;

  hasFinalQuiz: boolean;
  totalQuestions: number;
  answeredQuestions: number;
  correctQuestions: number;
  quizUnlocked: boolean;
  quizPassed: boolean;
}

export interface TrailLesson {
  id: string;
  title: string;
  order: number;
  durationSeconds: number;
  completed: boolean;
  completedAt: string | null;
}

export interface TrailDetail extends Trail {
  lessons: TrailLesson[];
}

export interface LessonDetail extends TrailLesson {
  courseId: string;
  courseTitle: string;
  content: string;
  contentFormat: 'markdown';
  previousLessonId: string | null;
  nextLessonId: string | null;
}

// As ações retornam também o XP efetivamente registrado da trilha.
export interface RewardedTrailDetail extends TrailDetail {
  xpEarned: number;
  maxXp: number | null;
}

export interface CompleteLessonResult {
  lessonId: string;
  completed: boolean;
  completedAt: string | null;
  alreadyCompleted: boolean;
  course: RewardedTrailDetail;
  xpAwarded: number;
  user: UserProgress;
}

// GET /api/v1/trails
export async function getTrails(
  signal?: AbortSignal,
): Promise<Trail[]> {
  const data = await authenticatedRequest<{
    trails: Trail[];
  }>('/trails', { signal });

  return data.trails;
}

// GET /api/v1/trails/:courseId
export async function getTrail(
  trailId: string,
  signal?: AbortSignal,
): Promise<TrailDetail> {
  const data = await authenticatedRequest<{
    trail: TrailDetail;
  }>(
    `/trails/${encodeURIComponent(trailId)}`,
    { signal },
  );

  return data.trail;
}

// GET /api/v1/lessons/:lessonId
export async function getLesson(
  lessonId: string,
  signal?: AbortSignal,
): Promise<LessonDetail> {
  const data = await authenticatedRequest<{
    lesson: LessonDetail;
  }>(
    `/lessons/${encodeURIComponent(lessonId)}`,
    { signal },
  );

  return data.lesson;
}

// POST /api/v1/lessons/:lessonId/complete
export async function completeLesson(
  lessonId: string,
): Promise<CompleteLessonResult> {
  return authenticatedRequest<CompleteLessonResult>(
    `/lessons/${encodeURIComponent(lessonId)}/complete`,
    {
      method: 'POST',
    },
  );
}

// =========================================
// Questionários
// =========================================

export interface QuizOption {
  id: string;
  text: string;
  order: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  order: number;
  options: QuizOption[];

  // Situação do usuário, sem expor o gabarito das alternativas.
  answered: boolean;
  correct: boolean;
}

export interface CourseQuiz {
  courseId: string;
  courseTitle: string;
  questions: QuizQuestion[];
}

export interface QuizAnswerResult {
  questionId: string;
  correct: boolean;
  alreadyCorrect: boolean;
  explanation: string;
  course: RewardedTrailDetail;
  xpAwarded: number;
  user: UserProgress;
}

// GET /api/v1/trails/:courseId/quiz
export async function getCourseQuiz(
  courseId: string,
  signal?: AbortSignal,
): Promise<CourseQuiz> {
  const data = await authenticatedRequest<{
    quiz: CourseQuiz;
  }>(
    `/trails/${encodeURIComponent(courseId)}/quiz`,
    { signal },
  );

  return data.quiz;
}

// POST /api/v1/trails/:courseId/quiz/:questionId/answer
export async function answerCourseQuestion(
  courseId: string,
  questionId: string,
  selectedOptionId: string,
): Promise<QuizAnswerResult> {
  return authenticatedRequest<QuizAnswerResult>(
    `/trails/${encodeURIComponent(courseId)}/quiz/${encodeURIComponent(questionId)}/answer`,
    {
      method: 'POST',
      body: JSON.stringify({
        selectedOptionId,
      }),
    },
  );
}

// =========================================
// Recuperação de senha
// =========================================

export interface ResetPasswordInput {
  token: string;
  password: string;
  confirmPassword: string;
}

async function passwordRecoveryRequest(
  path: string,
  input: object,
): Promise<string> {
  const result = await request<unknown>(path, {
    method: 'POST',
    body: JSON.stringify(input),
  });

  return result.message;
}

export function forgotPassword(
  email: string,
): Promise<string> {
  return passwordRecoveryRequest('/auth/forgot-password', {
    email,
  });
}

export function resetPassword(
  input: ResetPasswordInput,
): Promise<string> {
  return passwordRecoveryRequest('/auth/reset-password', input);
}
// =========================================
// Metas
// =========================================

export interface Goal {
  id: string;
  title: string;
  emoji: string;
  targetAmount: number;
  currentAmount: number;
  monthlyAmount: number;
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalInput {
  title: string;
  emoji: string;
  targetAmount: number;
  currentAmount: number;
  monthlyAmount: number;

  // Formato AAAA-MM-DD.
  deadline: string;
}

export type UpdateGoalInput = Partial<CreateGoalInput>;

export async function getGoals(
  signal?: AbortSignal,
): Promise<Goal[]> {
  const data = await authenticatedRequest<{
    goals: Goal[];
  }>('/goals', { signal });

  return data.goals;
}

export async function createGoal(
  input: CreateGoalInput,
): Promise<Goal> {
  const data = await authenticatedRequest<{
    goal: Goal;
  }>('/goals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return data.goal;
}

export async function updateGoal(
  goalId: string,
  input: UpdateGoalInput,
): Promise<Goal> {
  const data = await authenticatedRequest<{
    goal: Goal;
  }>(`/goals/${encodeURIComponent(goalId)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return data.goal;
}

export async function deleteGoal(
  goalId: string,
): Promise<void> {
  await authenticatedRequest<{ id: string }>(
    `/goals/${encodeURIComponent(goalId)}`,
    {
      method: 'DELETE',
    },
  );
}
// =========================================
// Referências de mercado
// =========================================

export interface MarketRate {
  name: string;
  benchmark: string;
  available: boolean;
  monthlyPercent: number | null;
  referenceDate: string | null;
  fetchedAt: string | null;
  stale: boolean;
  source: string;
  note: string;
}

export interface MarketRates {
  cdb: MarketRate;
  lci: MarketRate;
  poupanca: MarketRate;
}

export async function getMarketRates(
  signal?: AbortSignal,
): Promise<MarketRates> {
  const data = await authenticatedRequest<{
    rates: MarketRates;
  }>('/market/rates', { signal });

  return data.rates;
}
// =========================================
// Alteração de senha do usuário autenticado
// =========================================

export interface ChangePasswordInput {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

export async function changePassword(
  input: ChangePasswordInput,
): Promise<string> {
  const result = await request<unknown>(
    '/auth/change-password',
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
    true,
  );

  return result.message;
}