import { useState } from 'react';
import { ArrowLeft, Play, FileText, CheckCircle, Circle, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface LessonScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

export default function LessonScreen({ onBack, onNavigate }: LessonScreenProps) {
  const [activeTab, setActiveTab] = useState<'video' | 'materials' | 'quiz'>('video');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const lessons = [
    { id: 1, title: 'Introdução à Educação Financeira', duration: '12:30', completed: true },
    { id: 2, title: 'A Importância de Poupar', duration: '15:45', completed: true },
    { id: 3, title: 'Planejamento Financeiro Pessoal', duration: '18:20', completed: false },
    { id: 4, title: 'Como Definir Metas Financeiras', duration: '14:10', completed: false },
  ];

  const materials = [
    { id: 1, title: 'Planilha de Orçamento Pessoal', type: 'PDF', size: '245 KB' },
    { id: 2, title: 'Guia Completo de Educação Financeira', type: 'PDF', size: '1.2 MB' },
    { id: 3, title: 'Exercícios Práticos', type: 'PDF', size: '340 KB' },
  ];

  const quizQuestions = [
    {
      id: 1,
      question: 'Qual é o primeiro passo para ter controle financeiro?',
      options: [
        'Investir em ações',
        'Fazer um orçamento mensal',
        'Comprar um carro',
        'Pedir empréstimo'
      ],
      correct: 'Fazer um orçamento mensal'
    },
    {
      id: 2,
      question: 'Qual porcentagem da renda é recomendada para reserva de emergência?',
      options: [
        '5% a 10%',
        '10% a 20%',
        '20% a 30%',
        '50% ou mais'
      ],
      correct: '10% a 20%'
    },
    {
      id: 3,
      question: 'O que é educação financeira?',
      options: [
        'Apenas aprender a investir',
        'Saber economizar dinheiro',
        'Conhecimento para gerir finanças de forma consciente',
        'Ter muito dinheiro'
      ],
      correct: 'Conhecimento para gerir finanças de forma consciente'
    }
  ];

  const handleQuizSubmit = () => {
    setShowResults(true);
  };

  const correctAnswers = quizQuestions.filter(q => quizAnswers[q.id] === q.correct).length;

  return (
    <div className="min-h-screen bg-[#0F0F0F] pb-8">
      <div className="bg-[#1E1E1E] px-6 pt-8 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="text-[#B3B3B3] hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">Educação Financeira Básica</h1>
            <p className="text-sm text-[#B3B3B3]">Aula 3 de 12</p>
          </div>
        </div>

        <div className="flex gap-2 border-b border-white/10">
          {[
            { id: 'video', label: 'Vídeo', icon: Play },
            { id: 'materials', label: 'Material', icon: FileText },
            { id: 'quiz', label: 'Quiz', icon: Award }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                activeTab === id
                  ? 'text-[#4ADE80] border-b-2 border-[#4ADE80]'
                  : 'text-[#B3B3B3] hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pt-6">
        {activeTab === 'video' && (
          <div className="space-y-6">
            <div className="bg-[#1E1E1E] rounded-2xl overflow-hidden aspect-video flex items-center justify-center border border-white/10">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#4ADE80] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-10 h-10 text-[#0F0F0F]" />
                </div>
                <p className="text-white font-medium">Planejamento Financeiro Pessoal</p>
                <p className="text-[#B3B3B3] text-sm">18:20</p>
              </div>
            </div>

            <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-3">Sobre esta aula</h3>
              <p className="text-[#B3B3B3] text-sm leading-relaxed mb-4">
                Nesta aula você aprenderá os fundamentos do planejamento financeiro pessoal,
                incluindo como organizar suas finanças, definir prioridades e criar um plano
                de ação para alcançar seus objetivos.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[#4ADE80]/10 border border-[#4ADE80] rounded-full text-[#4ADE80] text-xs">
                  Iniciante
                </span>
                <span className="px-3 py-1 bg-[#0F0F0F] rounded-full text-[#B3B3B3] text-xs">
                  18 minutos
                </span>
                <span className="px-3 py-1 bg-[#0F0F0F] rounded-full text-[#B3B3B3] text-xs">
                  +50 XP
                </span>
              </div>
            </div>

            <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-4">Próximas aulas</h3>
              <div className="space-y-3">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#0F0F0F] hover:bg-[#0F0F0F]/50 transition-colors cursor-pointer"
                  >
                    {lesson.completed ? (
                      <CheckCircle className="w-5 h-5 text-[#4ADE80] flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#B3B3B3] flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${lesson.completed ? 'text-[#B3B3B3]' : 'text-white'}`}>
                        {lesson.title}
                      </p>
                    </div>
                    <span className="text-xs text-[#B3B3B3] flex-shrink-0">{lesson.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full bg-[#4ADE80] text-[#0F0F0F] px-8 py-4 rounded-2xl font-semibold hover:bg-[#22C55E] transition-colors">
              Concluir Aula
            </button>
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="space-y-3">
            {materials.map((material) => (
              <div
                key={material.id}
                className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-4 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-[#4ADE80]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-[#4ADE80]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium mb-1">{material.title}</p>
                  <p className="text-sm text-[#B3B3B3]">{material.type} • {material.size}</p>
                </div>
                <button className="px-4 py-2 bg-[#4ADE80]/10 border border-[#4ADE80] rounded-xl text-[#4ADE80] text-sm font-medium hover:bg-[#4ADE80]/20 transition-colors">
                  Baixar
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'quiz' && !showResults && (
          <div className="space-y-6">
            <div className="bg-[#4ADE80]/10 border border-[#4ADE80] rounded-2xl p-4">
              <p className="text-[#4ADE80] text-sm">
                Teste seus conhecimentos e ganhe <strong>+100 XP</strong>
              </p>
            </div>

            {quizQuestions.map((question, index) => (
              <div key={question.id} className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-5">
                <p className="text-white font-medium mb-4">
                  {index + 1}. {question.question}
                </p>
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => setQuizAnswers({ ...quizAnswers, [question.id]: option })}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        quizAnswers[question.id] === option
                          ? 'bg-[#4ADE80]/10 border-[#4ADE80] text-white'
                          : 'bg-[#0F0F0F] border-white/10 text-[#B3B3B3] hover:border-[#4ADE80]/50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={handleQuizSubmit}
              disabled={Object.keys(quizAnswers).length < quizQuestions.length}
              className="w-full bg-[#4ADE80] text-[#0F0F0F] px-8 py-4 rounded-2xl font-semibold hover:bg-[#22C55E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enviar Respostas
            </button>
          </div>
        )}

        {activeTab === 'quiz' && showResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-8 text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                correctAnswers >= 2 ? 'bg-[#4ADE80]/10' : 'bg-yellow-500/10'
              }`}>
                <Award className={`w-10 h-10 ${correctAnswers >= 2 ? 'text-[#4ADE80]' : 'text-yellow-500'}`} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {correctAnswers >= 2 ? 'Parabéns!' : 'Continue tentando!'}
              </h2>
              <p className="text-[#B3B3B3] mb-6">
                Você acertou {correctAnswers} de {quizQuestions.length} questões
              </p>
              <div className="inline-block bg-[#4ADE80]/10 border border-[#4ADE80] px-6 py-3 rounded-2xl">
                <span className="text-[#4ADE80] font-semibold text-lg">+{correctAnswers * 30} XP</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowResults(false);
                setQuizAnswers({});
              }}
              className="w-full bg-[#4ADE80] text-[#0F0F0F] px-8 py-4 rounded-2xl font-semibold hover:bg-[#22C55E] transition-colors"
            >
              Tentar Novamente
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
