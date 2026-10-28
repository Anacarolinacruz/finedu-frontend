import { useState } from 'react';
import { ChevronRight, Target, DollarSign, TrendingUp, Shield } from 'lucide-react';
import { motion } from 'motion/react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    goal: '',
    savings: '',
    experience: '',
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const getProfile = () => {
    if (answers.experience === 'nenhuma') return 'Conservador';
    if (answers.experience === 'basica') return 'Moderado';
    return 'Arrojado';
  };

  return (
    <div className="min-h-screen bg-[#101E35] p-6">
      <div className="max-w-md mx-auto pt-8">
        <div className="mb-8">
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= step ? 'bg-[#E6BB66]' : 'bg-[#172B43]'
                }`}
              />
            ))}
          </div>
          <p className="text-[#ADBFCC] text-sm">Etapa {step} de 4</p>
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Qual é o seu principal objetivo financeiro?</h2>
              <p className="text-[#ADBFCC]">Vamos personalizar sua experiência</p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'emergencia', label: 'Criar reserva de emergência', icon: Shield },
                { id: 'investir', label: 'Começar a investir', icon: TrendingUp },
                { id: 'poupar', label: 'Economizar mais dinheiro', icon: DollarSign },
                { id: 'meta', label: 'Conquistar uma meta específica', icon: Target },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setAnswers({ ...answers, goal: id })}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    answers.goal === id
                      ? 'bg-[#E6BB66]/10 border-[#E6BB66]'
                      : 'bg-[#172B43] border-white/10 hover:border-[#E6BB66]/50'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${answers.goal === id ? 'text-[#E6BB66]' : 'text-[#ADBFCC]'}`} />
                  <span className="text-white">{label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Quanto você consegue economizar por mês?</h2>
              <p className="text-[#ADBFCC]">Seja honesto, não há resposta certa ou errada</p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'ate100', label: 'Até R$ 100' },
                { id: 'ate500', label: 'R$ 100 - R$ 500' },
                { id: 'ate1000', label: 'R$ 500 - R$ 1.000' },
                { id: 'mais1000', label: 'Mais de R$ 1.000' },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setAnswers({ ...answers, savings: id })}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    answers.savings === id
                      ? 'bg-[#E6BB66]/10 border-[#E6BB66]'
                      : 'bg-[#172B43] border-white/10 hover:border-[#E6BB66]/50'
                  }`}
                >
                  <span className="text-white">{label}</span>
                  {answers.savings === id && (
                    <div className="w-6 h-6 rounded-full bg-[#E6BB66] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#101E35]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Qual sua experiência com investimentos?</h2>
              <p className="text-[#ADBFCC]">Isso nos ajuda a recomendar conteúdo adequado</p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'nenhuma', label: 'Nenhuma experiência' },
                { id: 'basica', label: 'Conhecimento básico' },
                { id: 'intermediaria', label: 'Já invisto regularmente' },
                { id: 'avancada', label: 'Investidor experiente' },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setAnswers({ ...answers, experience: id })}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    answers.experience === id
                      ? 'bg-[#E6BB66]/10 border-[#E6BB66]'
                      : 'bg-[#172B43] border-white/10 hover:border-[#E6BB66]/50'
                  }`}
                >
                  <span className="text-white">{label}</span>
                  {answers.experience === id && (
                    <div className="w-6 h-6 rounded-full bg-[#E6BB66] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#101E35]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center"
          >
            <div className="bg-[#172B43] p-8 rounded-3xl border border-[#E6BB66]/20">
              <div className="w-20 h-20 bg-[#E6BB66]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-10 h-10 text-[#E6BB66]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Seu perfil de investidor</h2>
              <div className="inline-block bg-[#E6BB66]/10 border border-[#E6BB66] px-6 py-2 rounded-full mb-4">
                <span className="text-[#E6BB66] font-semibold text-lg">{getProfile()}</span>
              </div>
              <p className="text-[#ADBFCC]">
                {answers.experience === 'nenhuma' && 'Você prefere investimentos mais seguros e está começando agora.'}
                {answers.experience === 'basica' && 'Você busca equilibrar segurança com oportunidades de crescimento.'}
                {(answers.experience === 'intermediaria' || answers.experience === 'avancada') && 'Você está confortável com riscos maiores em busca de melhores retornos.'}
              </p>
            </div>

            <div className="bg-[#172B43] p-6 rounded-2xl">
              <p className="text-sm text-[#ADBFCC] mb-4">Conteúdo recomendado para você:</p>
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#E6BB66] rounded-full" />
                  <span className="text-white text-sm">Educação financeira básica</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#E6BB66] rounded-full" />
                  <span className="text-white text-sm">Como criar sua reserva de emergência</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#E6BB66] rounded-full" />
                  <span className="text-white text-sm">Primeiros passos nos investimentos</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          disabled={
            (step === 1 && !answers.goal) ||
            (step === 2 && !answers.savings) ||
            (step === 3 && !answers.experience)
          }
          className="w-full bg-[#E6BB66] text-[#101E35] px-8 py-4 rounded-2xl font-semibold hover:bg-[#2BAAA0] transition-colors mt-8 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {step === 4 ? 'Começar jornada' : 'Continuar'}
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
