import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { forgotPassword } from '../services/api';

interface ForgotPasswordScreenProps {
  onBack: () => void;
}

export default function ForgotPasswordScreen({
  onBack,
}: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setError('');
    setMessage('');
    setLoading(true);

    try {
      const result = await forgotPassword(email.trim());
      setMessage(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível solicitar a recuperação.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#101E35] p-6 text-white">
      <main className="max-w-md mx-auto pt-12">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-[#ADBFCC] mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar ao login
        </button>

        <h1 className="text-3xl font-bold mb-3">
          Esqueceu sua senha?
        </h1>

        <p className="text-[#ADBFCC] mb-8">
          Informe o e-mail da sua conta para receber um link de
          recuperação.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="recovery-email" className="block mb-2">
              E-mail
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ADBFCC]" />

              <input
                id="recovery-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Seu e-mail cadastrado"
                className="w-full bg-[#172B43] border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:border-[#E6BB66] focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="text-red-400 text-sm">
              {error}
            </p>
          )}

          {message && (
            <p role="status" className="text-[#E6BB66] text-sm">
              {message} Confira também a pasta de spam.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E6BB66] text-[#101E35] py-4 rounded-2xl font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Enviando…' : 'Enviar link de recuperação'}
          </button>
        </form>
      </main>
    </div>
  );
}