import { useState } from 'react';
import {
  User,
  Mail,
  Calendar,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  register,
  type User as AuthenticatedUser,
} from '../services/api';

interface SignupScreenProps {
  onSignup: (user: AuthenticatedUser) => void;
  onBack: () => void;
}

export default function SignupScreen({
  onSignup,
  onBack,
}: SignupScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !age ||
      !password ||
      !confirmPassword
    ) {
      setError('Preencha todos os campos');
      return;
    }

    const parsedAge = Number(age);

    if (!Number.isInteger(parsedAge)) {
      setError('Informe uma idade válida');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const user = await register({
        name,
        email,
        age: parsedAge,
        password,
        confirmPassword,
      });

      onSignup(user);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Não foi possível criar a conta',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101E35] p-6">
      <div className="max-w-md mx-auto pt-8">
        <button
          onClick={onBack}
          className="mb-8 text-[#ADBFCC] hover:text-white transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Criar conta
          </h1>

          <p className="text-[#ADBFCC]">
            Comece sua jornada financeira
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ADBFCC]" />

            <input
              type="text"
              placeholder="Nome completo"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              className="w-full bg-[#172B43] border border-white/10 rounded-2xl px-12 py-4 text-white placeholder:text-[#ADBFCC] focus:border-[#E6BB66] focus:outline-none transition-colors"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ADBFCC]" />

            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              className="w-full bg-[#172B43] border border-white/10 rounded-2xl px-12 py-4 text-white placeholder:text-[#ADBFCC] focus:border-[#E6BB66] focus:outline-none transition-colors"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ADBFCC]" />

            <input
              type="number"
              placeholder="Idade"
              value={age}
              onChange={(event) => setAge(event.target.value)}
              min={13}
              max={120}
              className="w-full bg-[#172B43] border border-white/10 rounded-2xl px-12 py-4 text-white placeholder:text-[#ADBFCC] focus:border-[#E6BB66] focus:outline-none transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ADBFCC]" />

            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              className="w-full bg-[#172B43] border border-white/10 rounded-2xl px-12 py-4 text-white placeholder:text-[#ADBFCC] focus:border-[#E6BB66] focus:outline-none transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ADBFCC]" />

            <input
              type="password"
              placeholder="Confirmar senha"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              autoComplete="new-password"
              className="w-full bg-[#172B43] border border-white/10 rounded-2xl px-12 py-4 text-white placeholder:text-[#ADBFCC] focus:border-[#E6BB66] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-4">
            {error}
          </p>
        )}

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-[#E6BB66] text-[#101E35] px-8 py-4 rounded-2xl font-semibold hover:bg-[#2BAAA0] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Criando conta...' : 'Criar conta'}
        </motion.button>

        <p className="text-xs text-[#ADBFCC] text-center mt-6">
          Ao criar uma conta, você concorda com nossos{' '}
          <span className="text-[#E6BB66]">
            Termos de Uso
          </span>{' '}
          e{' '}
          <span className="text-[#E6BB66]">
            Política de Privacidade
          </span>
        </p>
      </div>
    </div>
  );
}