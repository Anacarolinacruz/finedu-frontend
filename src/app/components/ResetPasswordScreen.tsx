import { useState } from 'react';
import type { FormEvent } from 'react';
import { resetPassword } from '../services/api';

interface ResetPasswordScreenProps {
  token: string;
  onBackToLogin: () => void;
}

export default function ResetPasswordScreen({
  token,
  onBackToLogin,
}: ResetPasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const validToken = /^[a-f0-9]{64}$/.test(token);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading || !validToken) return;

    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword({
        token,
        password,
        confirmPassword,
      });

      sessionStorage.removeItem('finedu_token');

      setPassword('');
      setConfirmPassword('');
      setMessage(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível redefinir sua senha.',
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClassName =
    'w-full bg-[#1E1E1E] border border-white/10 rounded-2xl px-4 py-4 focus:border-[#4ADE80] focus:outline-none';

  return (
    <div className="min-h-screen bg-[#0F0F0F] p-6 text-white">
      <main className="max-w-md mx-auto pt-12">
        <h1 className="text-3xl font-bold mb-3">
          Redefinir senha
        </h1>

        {message ? (
          <div className="space-y-6 mt-6">
            <p role="status" className="text-[#4ADE80]">
              {message}
            </p>

            <button
              type="button"
              onClick={onBackToLogin}
              className="w-full bg-[#4ADE80] text-[#0F0F0F] py-4 rounded-2xl font-semibold"
            >
              Ir para o login
            </button>
          </div>
        ) : !validToken ? (
          <div className="space-y-6 mt-6">
            <p role="alert" className="text-red-400">
              Link de recuperação inválido. Volte ao login e
              solicite um novo link.
            </p>

            <button
              type="button"
              onClick={onBackToLogin}
              className="text-[#4ADE80]"
            >
              Voltar ao login
            </button>
          </div>
        ) : (
          <>
            <p className="text-[#B3B3B3] mb-8">
              Use de 8 a 72 caracteres, incluindo uma letra
              maiúscula, uma minúscula e um número.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="new-password" className="block mb-2">
                  Nova senha
                </label>

                <input
                  id="new-password"
                  type="password"
                  required
                  minLength={8}
                  maxLength={72}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={inputClassName}
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-new-password"
                  className="block mb-2"
                >
                  Confirme a nova senha
                </label>

                <input
                  id="confirm-new-password"
                  type="password"
                  required
                  minLength={8}
                  maxLength={72}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  className={inputClassName}
                />
              </div>

              {error && (
                <p role="alert" className="text-red-400 text-sm">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4ADE80] text-[#0F0F0F] py-4 rounded-2xl font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Salvando…' : 'Salvar nova senha'}
              </button>

              <button
                type="button"
                onClick={onBackToLogin}
                disabled={loading}
                className="w-full text-[#B3B3B3] py-2 disabled:opacity-60"
              >
                Voltar ao login
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}