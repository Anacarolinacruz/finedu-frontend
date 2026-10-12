const API_URL =
  import.meta.env.VITE_API_URL ??
  'http://localhost:3333/api/v1';

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  investorProfile: 'CONSERVADOR' | 'MODERADO' | 'ARROJADO' | null;
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

function getErrorMessage<T>(result: ApiResponse<T>): string {
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

export async function login(
  email: string,
  password: string,
): Promise<User> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const result = (await response.json()) as ApiResponse<AuthData>;

  if (!response.ok) {
    throw new Error(getErrorMessage(result));
  }

  sessionStorage.setItem(
    'finedu_token',
    result.data.accessToken,
  );

  return result.data.user;
}

export async function register(
  input: RegisterInput,
): Promise<User> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const result = (await response.json()) as ApiResponse<AuthData>;

  if (!response.ok) {
    throw new Error(getErrorMessage(result));
  }

  sessionStorage.setItem(
    'finedu_token',
    result.data.accessToken,
  );

  return result.data.user;
}